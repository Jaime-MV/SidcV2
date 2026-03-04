"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const promotions_service_1 = require("../promotions/promotions.service");
let SalesService = class SalesService {
    prisma;
    promotionsService;
    constructor(prisma, promotionsService) {
        this.prisma = prisma;
        this.promotionsService = promotionsService;
    }
    async create(dto) {
        return this.prisma.$transaction(async (tx) => {
            const cliente = await tx.cliente.findUnique({ where: { id: dto.clienteId } });
            if (!cliente)
                throw new common_1.NotFoundException('Cliente no encontrado');
            const vendedor = await tx.vendedor.findUnique({
                where: { id: dto.vendedorId },
                include: { rutas: true },
            });
            if (!vendedor || !vendedor.activo)
                throw new common_1.BadRequestException('Vendedor no encontrado o inactivo');
            if (cliente.rutaId) {
                const rutaValida = vendedor.rutas.some((r) => r.id === cliente.rutaId);
                if (!rutaValida) {
                    throw new common_1.BadRequestException('El cliente no pertenece a ninguna ruta asignada al vendedor');
                }
            }
            let subtotalVenta = 0;
            let descuentoVenta = 0;
            const detallesCrear = [];
            const lotesActualizar = [];
            for (const detalle of dto.detalles) {
                const producto = await tx.producto.findUnique({
                    where: { id: detalle.productoId },
                    include: {
                        lotes: {
                            where: { cantidadDisponible: { gt: 0 } },
                            orderBy: { fechaVencimiento: 'asc' },
                        },
                    },
                });
                if (!producto)
                    throw new common_1.NotFoundException(`Producto con ID ${detalle.productoId} no encontrado`);
                const now = new Date();
                const lotesValidos = producto.lotes.filter((l) => l.fechaVencimiento > now);
                const stockTotal = lotesValidos.reduce((acc, l) => acc + l.cantidadDisponible, 0);
                if (stockTotal < detalle.cantidad) {
                    throw new common_1.NotAcceptableException(`Stock insuficiente para "${producto.nombre}". Disponible: ${stockTotal}, Solicitado: ${detalle.cantidad}`);
                }
                const precioUnit = Number(producto.precioBase);
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
                let cantidadRestante = detalle.cantidad;
                for (const lote of lotesValidos) {
                    if (cantidadRestante <= 0)
                        break;
                    const descontar = Math.min(lote.cantidadDisponible, cantidadRestante);
                    cantidadRestante -= descontar;
                    lotesActualizar.push({ id: lote.id, descontar });
                }
            }
            const totalVenta = subtotalVenta - descuentoVenta;
            if (cliente.diasCredito > 0) {
                const nuevoSaldo = Number(cliente.saldoActual) + totalVenta;
                if (nuevoSaldo > Number(cliente.limiteCredito)) {
                    throw new common_1.BadRequestException(`Límite de crédito excedido. Límite: $${cliente.limiteCredito}, Saldo actual: $${cliente.saldoActual}, Venta: $${totalVenta.toFixed(2)}`);
                }
                await tx.cliente.update({
                    where: { id: cliente.id },
                    data: { saldoActual: nuevoSaldo },
                });
            }
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
            const factura = await tx.factura.create({
                data: {
                    numeroFactura: `FAC-${String(venta.id).padStart(6, '0')}`,
                    total: totalVenta,
                    estado: cliente.diasCredito > 0 ? 'CREADA' : 'PAGADA',
                    ventaId: venta.id,
                },
            });
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
    async findAll(page = 1, pageSize = 20, estado) {
        const skip = (page - 1) * pageSize;
        const where = estado ? { estado: estado } : {};
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
    async findOne(id) {
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
        if (!venta)
            throw new common_1.NotFoundException(`Venta con ID ${id} no encontrada`);
        return venta;
    }
    async createDevolucion(dto) {
        return this.prisma.$transaction(async (tx) => {
            const venta = await tx.venta.findUnique({
                where: { id: dto.ventaId },
                include: { detalles: true },
            });
            if (!venta)
                throw new common_1.NotFoundException('Venta no encontrada');
            if (venta.estado === 'ANULADA')
                throw new common_1.BadRequestException('No se puede devolver una venta anulada');
            const devolucion = await tx.devolucion.create({
                data: {
                    ventaId: dto.ventaId,
                    motivo: dto.motivo,
                    estado: 'PROCESADA',
                },
                include: { venta: true },
            });
            return devolucion;
        });
    }
    async getProductosMasVendidos(limit = 10) {
        const result = await this.prisma.detalleVenta.groupBy({
            by: ['productoId'],
            _sum: { cantidad: true },
            orderBy: { _sum: { cantidad: 'desc' } },
            take: limit,
        });
        const productos = await Promise.all(result.map(async (item) => {
            const producto = await this.prisma.producto.findUnique({
                where: { id: item.productoId },
                include: { categoria: true },
            });
            return {
                producto,
                totalVendido: item._sum.cantidad,
            };
        }));
        return productos;
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        promotions_service_1.PromotionsService])
], SalesService);
//# sourceMappingURL=sales.service.js.map