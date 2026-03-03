import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class VentasRepository {
    constructor(private prisma: PrismaService) { }

    async crearVentaTransaccion(data: {
        clienteId: number;
        vendedorId: number;
        productos: { productoId: number; cantidad: number }[];
    }) {
        return this.prisma.$transaction(async (tx) => {
            const cliente = await tx.cliente.findUnique({ where: { id: data.clienteId }, include: { ruta: true } });
            if (!cliente) throw new BadRequestException('Cliente no encontrado');

            if (cliente.ruta && cliente.ruta.vendedorId !== data.vendedorId) {
                throw new BadRequestException('Regla de negocio fallida: El cliente pertenece a una ruta gestionada por otro vendedor. Entrega solo en clientes de ruta permitidos.');
            }

            let subtotal = 0;
            let descuentoTotal = 0;
            const detallesVenta: { productoId: number; cantidad: number; precioUnitario: number; subtotal: number }[] = [];
            const movimientos: { loteId: number; cantidad: number }[] = [];
            const ahora = new Date();

            for (const reqProd of data.productos) {
                const producto = await tx.producto.findUnique({
                    where: { id: reqProd.productoId },
                    include: {
                        lotes: {
                            where: {
                                cantidadDisponible: { gt: 0 },
                                fechaVencimiento: { gt: ahora }
                            },
                            orderBy: { fechaVencimiento: 'asc' }
                        },
                        promociones: {
                            include: { promocion: true }
                        }
                    }
                });

                if (!producto) throw new BadRequestException(`Producto ${reqProd.productoId} no encontrado`);

                const totalDisponible = producto.lotes.reduce((sum, l) => sum + l.cantidadDisponible, 0);
                if (totalDisponible < reqProd.cantidad) {
                    throw new BadRequestException(`Inventario insuficiente para producto ${producto.nombre}. Disponible: ${totalDisponible}`);
                }

                const precioUnitario = Number(producto.precioBase);
                let pctDescuento = 0;

                const promoActiva = producto.promociones.find(p =>
                    p.promocion.activa &&
                    p.promocion.fechaInicio <= ahora &&
                    p.promocion.fechaFin >= ahora
                );

                if (promoActiva) {
                    pctDescuento = Number(promoActiva.promocion.porcentajeDesc);
                }

                const subtotalProducto = reqProd.cantidad * precioUnitario;
                const descProducto = subtotalProducto * (pctDescuento / 100);

                subtotal += subtotalProducto;
                descuentoTotal += descProducto;

                detallesVenta.push({
                    productoId: producto.id,
                    cantidad: reqProd.cantidad,
                    precioUnitario: precioUnitario,
                    subtotal: subtotalProducto - descProducto
                });

                let cantidadARestar = reqProd.cantidad;
                for (const lote of producto.lotes) {
                    if (cantidadARestar <= 0) break;
                    const aDescontar = Math.min(lote.cantidadDisponible, cantidadARestar);

                    await tx.lote.update({
                        where: { id: lote.id },
                        data: { cantidadDisponible: { decrement: aDescontar } }
                    });

                    movimientos.push({
                        loteId: lote.id,
                        cantidad: aDescontar,
                    });

                    cantidadARestar -= aDescontar;
                }
            }

            const total = subtotal - descuentoTotal;

            // Limite credito validation
            if (cliente.diasCredito > 0) {
                const nuevoSaldo = Number(cliente.saldoActual) + total;
                if (nuevoSaldo > Number(cliente.limiteCredito)) {
                    throw new BadRequestException('Límite de crédito excedido');
                }
                await tx.cliente.update({
                    where: { id: cliente.id },
                    data: { saldoActual: { increment: total } }
                });
            }

            const venta = await tx.venta.create({
                data: {
                    clienteId: data.clienteId,
                    vendedorId: data.vendedorId,
                    subtotal,
                    descuentoTotal,
                    total,
                    estado: 'COMPLETADA',
                    detalles: {
                        create: detallesVenta
                    },
                    factura: {
                        create: {
                            numeroFactura: `F-${Date.now()}`,
                            total: total,
                            estado: 'CREADA'
                        }
                    }
                },
                include: { factura: true, detalles: true }
            });

            for (const m of movimientos) {
                await tx.movimientoInventario.create({
                    data: {
                        loteId: m.loteId,
                        tipoMovimiento: 'SALIDA',
                        cantidad: m.cantidad,
                        referencia: `Venta ${venta.id}`
                    }
                });
            }

            return venta;
        });
    }
}
