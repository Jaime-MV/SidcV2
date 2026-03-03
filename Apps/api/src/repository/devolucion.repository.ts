import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DevolucionRepository {
    constructor(private prisma: PrismaService) { }

    async crearDevolucion(data: { ventaId: number; motivo: string }) {
        return this.prisma.$transaction(async (tx) => {
            // 1. Validar que la venta exista (Devolución solo de ventas previas)
            const venta = await tx.venta.findUnique({
                where: { id: data.ventaId },
                include: { detalles: true }
            });

            if (!venta) {
                throw new BadRequestException('La venta no existe. La devolución solo aplica a ventas previas válidas.');
            }

            // 2. Crear el registro de devolución
            const devolucion = await tx.devolucion.create({
                data: {
                    ventaId: data.ventaId,
                    motivo: data.motivo,
                    estado: 'PROCESADA'
                }
            });

            // 3. Regresar el inventario
            for (const detalle of venta.detalles) {
                // Buscamos un lote activo para este producto para devolver la mercancia
                const lote = await tx.lote.findFirst({
                    where: { productoId: detalle.productoId },
                    orderBy: { fechaVencimiento: 'desc' }
                });

                if (lote) {
                    await tx.lote.update({
                        where: { id: lote.id },
                        data: { cantidadDisponible: { increment: detalle.cantidad } }
                    });

                    await tx.movimientoInventario.create({
                        data: {
                            loteId: lote.id,
                            tipoMovimiento: 'ENTRADA',
                            cantidad: detalle.cantidad,
                            referencia: `Devolución de Venta ${venta.id} - ${devolucion.id}`
                        }
                    });
                }
            }

            // 4. Cambiar estado de la venta
            await tx.venta.update({
                where: { id: venta.id },
                data: { estado: 'ANULADA' }
            });

            return devolucion;
        });
    }
}
