import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PromocionRepository {
    constructor(private prisma: PrismaService) { }

    async crearPromocion(data: {
        nombre: string;
        descripcion?: string;
        fechaInicio: string | Date;
        fechaFin: string | Date;
        porcentajeDesc: number;
        productosIds: number[];
    }) {
        return this.prisma.promocion.create({
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
                fechaInicio: new Date(data.fechaInicio),
                fechaFin: new Date(data.fechaFin),
                porcentajeDesc: data.porcentajeDesc,
                productos: {
                    create: data.productosIds.map(id => ({
                        producto: { connect: { id } }
                    }))
                }
            }
        });
    }
}
