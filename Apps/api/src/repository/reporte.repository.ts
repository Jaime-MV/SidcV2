import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReporteRepository {
    constructor(private prisma: PrismaService) { }

    async obtenerProductosMasVendidos(limit: number = 10) {
        const resultados = await this.prisma.detalleVenta.groupBy({
            by: ['productoId'],
            _sum: {
                cantidad: true,
                subtotal: true
            },
            orderBy: {
                _sum: {
                    cantidad: 'desc'
                }
            },
            take: limit
        });

        // Populate product details
        return Promise.all(resultados.map(async (r) => {
            const producto = await this.prisma.producto.findUnique({ where: { id: r.productoId } });
            return {
                producto,
                cantidadTotalVendida: r._sum.cantidad,
                ingresosTotales: r._sum.subtotal
            };
        }));
    }
}
