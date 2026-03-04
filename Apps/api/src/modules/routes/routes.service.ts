import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVendedorDto } from './dto/create-vendedor.dto';
import { CreateRutaDto } from './dto/create-ruta.dto';

@Injectable()
export class RoutesService {
    constructor(private readonly prisma: PrismaService) { }

    // ─── VENDEDORES ────────────────────────────────────────────────
    async createVendedor(dto: CreateVendedorDto) {
        return this.prisma.vendedor.create({ data: dto });
    }

    async findAllVendedores() {
        return this.prisma.vendedor.findMany({
            include: { rutas: { include: { clientes: true } } },
            orderBy: { id: 'desc' },
        });
    }

    async findVendedorById(id: number) {
        const vendedor = await this.prisma.vendedor.findUnique({
            where: { id },
            include: { rutas: { include: { clientes: true } }, ventas: { take: 10, orderBy: { fecha: 'desc' } } },
        });
        if (!vendedor) throw new NotFoundException(`Vendedor con ID ${id} no encontrado`);
        return vendedor;
    }

    async updateVendedor(id: number, dto: Partial<CreateVendedorDto>) {
        await this.findVendedorById(id);
        return this.prisma.vendedor.update({ where: { id }, data: dto });
    }

    // ─── RUTAS ─────────────────────────────────────────────────────
    async createRuta(dto: CreateRutaDto) {
        const vendedor = await this.prisma.vendedor.findUnique({ where: { id: dto.vendedorId } });
        if (!vendedor) throw new NotFoundException(`Vendedor con ID ${dto.vendedorId} no existe`);
        return this.prisma.ruta.create({ data: dto, include: { vendedor: true } });
    }

    async findAllRutas() {
        return this.prisma.ruta.findMany({
            include: { vendedor: true, clientes: true },
            orderBy: { id: 'desc' },
        });
    }

    async findRutaById(id: number) {
        const ruta = await this.prisma.ruta.findUnique({
            where: { id },
            include: { vendedor: true, clientes: true },
        });
        if (!ruta) throw new NotFoundException(`Ruta con ID ${id} no encontrada`);
        return ruta;
    }
}
