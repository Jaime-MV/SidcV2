import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromocionDto } from './dto/create-promocion.dto';

@Injectable()
export class PromotionsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreatePromocionDto) {
        const fechaInicio = new Date(dto.fechaInicio);
        const fechaFin = new Date(dto.fechaFin);

        if (fechaFin <= fechaInicio) {
            throw new BadRequestException('La fecha de fin debe ser posterior a la fecha de inicio');
        }

        // Validar que todos los productos existan
        const productos = await this.prisma.producto.findMany({
            where: { id: { in: dto.productoIds } },
        });
        if (productos.length !== dto.productoIds.length) {
            throw new NotFoundException('Uno o más productos no existen');
        }

        return this.prisma.promocion.create({
            data: {
                nombre: dto.nombre,
                descripcion: dto.descripcion,
                fechaInicio,
                fechaFin,
                porcentajeDesc: dto.porcentajeDesc,
                activa: dto.activa ?? true,
                productos: {
                    create: dto.productoIds.map((productoId) => ({ productoId })),
                },
            },
            include: { productos: { include: { producto: true } } },
        });
    }

    async findAll() {
        return this.prisma.promocion.findMany({
            include: { productos: { include: { producto: true } } },
            orderBy: { fechaInicio: 'desc' },
        });
    }

    async findVigentes() {
        const now = new Date();
        return this.prisma.promocion.findMany({
            where: {
                activa: true,
                fechaInicio: { lte: now },
                fechaFin: { gte: now },
            },
            include: { productos: { include: { producto: true } } },
        });
    }

    async findById(id: number) {
        const promo = await this.prisma.promocion.findUnique({
            where: { id },
            include: { productos: { include: { producto: true } } },
        });
        if (!promo) throw new NotFoundException(`Promoción con ID ${id} no encontrada`);
        return promo;
    }

    async toggleActiva(id: number) {
        const promo = await this.findById(id);
        return this.prisma.promocion.update({
            where: { id },
            data: { activa: !promo.activa },
            include: { productos: { include: { producto: true } } },
        });
    }

    /**
     * Busca la mejor promoción vigente para un producto dado.
     * Retorna el porcentaje de descuento o 0 si no hay promoción.
     */
    async getDescuentoVigente(productoId: number): Promise<number> {
        const now = new Date();
        const promos = await this.prisma.promocionProducto.findMany({
            where: {
                productoId,
                promocion: {
                    activa: true,
                    fechaInicio: { lte: now },
                    fechaFin: { gte: now },
                },
            },
            include: { promocion: true },
            orderBy: { promocion: { porcentajeDesc: 'desc' } },
        });

        if (promos.length === 0) return 0;
        return Number(promos[0].promocion.porcentajeDesc);
    }
}
