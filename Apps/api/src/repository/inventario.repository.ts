import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class InventarioRepository {
    constructor(private prisma: PrismaService) { }

    async crearProducto(data: Prisma.ProductoUncheckedCreateInput) {
        return this.prisma.producto.create({ data });
    }

    async crearLote(data: Prisma.LoteUncheckedCreateInput) {
        if (new Date(data.fechaVencimiento) <= new Date(data.fechaFabricacion)) {
            throw new BadRequestException('Fecha de vencimiento debe ser mayor a fabricación');
        }
        return this.prisma.$transaction(async (tx) => {
            const lote = await tx.lote.create({ data });
            await tx.movimientoInventario.create({
                data: {
                    tipoMovimiento: 'ENTRADA',
                    cantidad: lote.cantidadInicial,
                    referencia: `Entrada inicial Lote ${lote.numeroLote}`,
                    loteId: lote.id
                }
            });
            return lote;
        });
    }

    async obtenerInventarioDisponible() {
        return this.prisma.producto.findMany({
            include: {
                lotes: {
                    where: {
                        cantidadDisponible: { gt: 0 }
                    }
                },
                categoria: true
            }
        });
    }
}
