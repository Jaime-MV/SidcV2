import { Injectable, BadRequestException, NotFoundException, NotAcceptableException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PromotionsService } from '../promotions/promotions.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { CreateDevolucionDto } from './dto/create-devolucion.dto';

@Injectable()
export class SalesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly promotionsService: PromotionsService,
    ) { }

    // ─── CREAR VENTA (Transacción ACID) ────────────────────────────
    async create(dto: CreateVentaDto) {
        return this.prisma.$transaction(async (tx) => {
            // 1. Validar Cliente
            const cliente = await tx.cliente.findUnique({ where: { id: dto.clienteId } });
            if (!cliente) throw new NotFoundException('Cliente no encontrado');

            // 2. Validar Vendedor activo
            const vendedor = await tx.vendedor.findUnique({
                where: { id: dto.vendedorId },
                include: { rutas: true },
            });
            if (!vendedor || !vendedor.activo) throw new BadRequestException('Vendedor no encontrado o inactivo');

            // 3. Regla: Entrega solo en clientes de ruta del vendedor
            if (cliente.rutaId) {
                const rutaValida = vendedor.rutas.some((r) => r.id === cliente.rutaId);
                if (!rutaValida) {
                    throw new BadRequestException('El cliente no pertenece a ninguna ruta asignada al vendedor');
                }
            }

            // 4. Procesar cada detalle de venta
            let subtotalVenta = 0;
            let descuentoVenta = 0;
            const detallesCrear: any[] = [];
            const lotesActualizar: { id: number; descontar: number }[] = [];

            for (const detalle of dto.detalles) {
                // Obtener producto con lotes válidos (FIFO por vencimiento)
                const producto = await tx.producto.findUnique({
                    where: { id: detalle.productoId },
                    include: {
                        lotes: {
                            where: { cantidadDisponible: { gt: 0 } },
                            orderBy: { fechaVencimiento: 'asc' },
                        },
                    },
                });
                if (!producto) throw new NotFoundException(`Producto con ID ${detalle.productoId} no encontrado`);

                // Regla: No vender productos vencidos
                const now = new Date();
                const lotesValidos = producto.lotes.filter((l) => l.fechaVencimiento > now);

                // Regla: No vender sin inventario
                const stockTotal = lotesValidos.reduce((acc, l) => acc + l.cantidadDisponible, 0);
                if (stockTotal < detalle.cantidad) {
                    throw new NotAcceptableException(
                        `Stock insuficiente para "${producto.nombre}". Disponible: ${stockTotal}, Solicitado: ${detalle.cantidad}`,
                    );
                }

                // Calcular precio y descuento por promoción vigente
                const precioUnit = Number(producto.precioVenta);
                const pctDescuento = await this.promotionsService.getDescuentoVigente(producto.id);
                const descuentoLinea = precioUnit * detalle.cantidad * (pctDescuento / 100);
                const subtotalLinea = precioUnit * detalle.cantidad;

                subtotalVenta += subtotalLinea;
                descuentoVenta += descuentoLinea;

                detallesCrear.push({
                    productoId: producto.id,
                    cantidad: detalle.cantidad,
                    precioUnitario: precioUnit,
                    subtotal: subtotalLinea - descuentoLinea,
                });

                // Asignar lotes FIFO
                let cantidadRestante = detalle.cantidad;
                for (const lote of lotesValidos) {
                    if (cantidadRestante <= 0) break;
                    const descontar = Math.min(lote.cantidadDisponible, cantidadRestante);
                    cantidadRestante -= descontar;
                    lotesActualizar.push({ id: lote.id, descontar });
                }
            }

            const totalVenta = subtotalVenta - descuentoVenta;

            // 5. Regla: Cliente crédito no puede exceder límite
            if (cliente.diasCredito > 0) {
                const nuevoSaldo = Number(cliente.saldoActual) + totalVenta;
                if (nuevoSaldo > Number(cliente.limiteCredito)) {
                    throw new BadRequestException(
                        `Límite de crédito excedido. Límite: $${cliente.limiteCredito}, Saldo actual: $${cliente.saldoActual}, Venta: $${totalVenta.toFixed(2)}`,
                    );
                }
                // Incrementar saldo
                await tx.cliente.update({
                    where: { id: cliente.id },
                    data: { saldoActual: nuevoSaldo },
                });
            }

            // 6. Crear Venta con Detalles
            const venta = await tx.venta.create({
                data: {
                    clienteId: cliente.id,
                    vendedorId: vendedor.id,
                    subtotal: subtotalVenta,
                    descuentoTotal: descuentoVenta,
                    total: totalVenta,
                    estado: 'COMPLETADA',
                    detalles: { create: detallesCrear },
                },
                include: { detalles: { include: { producto: true } }, cliente: true, vendedor: true },
            });

            // 7. Generar Factura
            const factura = await tx.factura.create({
                data: {
                    numeroFactura: `FAC-${String(venta.id).padStart(6, '0')}`,
                    total: totalVenta,
                    estado: cliente.diasCredito > 0 ? 'CREADA' : 'PAGADA',
                    ventaId: venta.id,
                },
            });

            // 8. Descontar inventario y registrar movimientos
            for (const loteUpdate of lotesActualizar) {
                await tx.lote.update({
                    where: { id: loteUpdate.id },
                    data: { cantidadDisponible: { decrement: loteUpdate.descontar } },
                });
                await tx.movimientoInventario.create({
                    data: {
                        tipoMovimiento: 'SALIDA',
                        cantidad: loteUpdate.descontar,
                        loteId: loteUpdate.id,
                        referencia: `Venta #${venta.id}`,
                    },
                });
            }

            return { ...venta, factura };
        });
    }

    // ─── LISTAR VENTAS (paginado) ──────────────────────────────────
    async findAll(page = 1, pageSize = 20, estado?: string) {
        const skip = (page - 1) * pageSize;
        const where = estado ? { estado: estado as any } : {};

        const [items, total] = await Promise.all([
            this.prisma.venta.findMany({
                skip,
                take: pageSize,
                where,
                include: { cliente: true, vendedor: true, factura: true },
                orderBy: { fecha: 'desc' },
            }),
            this.prisma.venta.count({ where }),
        ]);

        return { items, total, page, pageSize, pages: Math.ceil(total / pageSize) };
    }

    // ─── DETALLE DE VENTA ──────────────────────────────────────────
    async findOne(id: number) {
        const venta = await this.prisma.venta.findUnique({
            where: { id },
            include: {
                cliente: true,
                vendedor: true,
                detalles: { include: { producto: true } },
                factura: { include: { cobros: true } },
                devoluciones: true,
            },
        });
        if (!venta) throw new NotFoundException(`Venta con ID ${id} no encontrada`);
        return venta;
    }

    // ─── DEVOLUCIÓN (solo de ventas previas) ───────────────────────
    async createDevolucion(dto: CreateDevolucionDto) {
        return this.prisma.$transaction(async (tx) => {
            const venta = await tx.venta.findUnique({
                where: { id: dto.ventaId },
                include: { detalles: true },
            });
            if (!venta) throw new NotFoundException('Venta no encontrada');
            if (venta.estado === 'ANULADA') throw new BadRequestException('No se puede devolver una venta anulada');

            const devolucion = await tx.devolucion.create({
                data: {
                    ventaId: dto.ventaId,
                    productoId: dto.productoId,
                    motivo: dto.motivo,
                    cantidad: dto.cantidad,
                    estado: 'PROCESADA',
                },
                include: { venta: true, producto: true },
            });

            return devolucion;
        });
    }

    // ─── REPORTE: Productos más vendidos ───────────────────────────
    async getProductosMasVendidos(limit = 10) {
        // 1. Priorizar EstadisticaProducto (datos precalculados del seed)
        const estadisticas = await this.prisma.estadisticaProducto.findMany({
            take: limit,
            orderBy: { totalVendido: 'desc' },
            include: { producto: { include: { categoria: true } } },
        });

        if (estadisticas.length > 0) {
            return estadisticas.map((e) => ({
                nombre: e.producto.nombre,
                producto: e.producto,
                totalVendido: Number(e.totalVendido),
                unidades: Number(e.totalVendido),
                ingresos: Number(e.ingresos ?? 0),
            }));
        }

        // 2. Fallback: agrupar desde DetalleVenta
        const result = await this.prisma.detalleVenta.groupBy({
            by: ['productoId'],
            _sum: { cantidad: true },
            orderBy: { _sum: { cantidad: 'desc' } },
            take: limit,
        });

        const productos = await Promise.all(
            result.map(async (item) => {
                const producto = await this.prisma.producto.findUnique({
                    where: { id: item.productoId },
                    include: { categoria: true },
                });
                return {
                    nombre: producto?.nombre ?? '',
                    producto,
                    totalVendido: item._sum.cantidad,
                    unidades: item._sum.cantidad,
                    ingresos: 0,
                };
            }),
        );
        return productos;
    }

    // ─── LISTADO GLOBAL DE FACTURAS ────────────────────────────────
    async findAllFacturas(page = 1, pageSize = 20, estado?: string) {
        const skip = (page - 1) * pageSize;
        const where = estado ? { estado: estado as any } : {};

        const [items, total] = await Promise.all([
            this.prisma.factura.findMany({
                skip,
                take: pageSize,
                where,
                include: {
                    venta: { include: { cliente: true, vendedor: true } },
                    cobros: { select: { monto: true } },
                },
                orderBy: { fechaEmision: 'desc' },
            }),
            this.prisma.factura.count({ where }),
        ]);

        return { items, total, page, pageSize, pages: Math.ceil(total / pageSize) };
    }

    // ─── LISTADO GLOBAL DE DEVOLUCIONES ───────────────────────────
    async findAllDevoluciones(page = 1, pageSize = 20) {
        const skip = (page - 1) * pageSize;

        const [items, total] = await Promise.all([
            this.prisma.devolucion.findMany({
                skip,
                take: pageSize,
                include: {
                    venta: { include: { cliente: true, vendedor: true, factura: true } },
                    producto: true,
                },
                orderBy: { fecha: 'desc' },
            }),
            this.prisma.devolucion.count(),
        ]);

        return { items, total, page, pageSize, pages: Math.ceil(total / pageSize) };
    }
}
