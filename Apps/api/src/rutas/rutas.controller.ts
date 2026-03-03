import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('vendedores')
export class VendedoresController {
    constructor(private prisma: PrismaService) { }

    @Get()
    async findAll() {
        return this.prisma.vendedor.findMany({ include: { rutas: true } });
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const item = await this.prisma.vendedor.findUnique({ where: { id }, include: { rutas: true } });
        if (!item) return { error: 'Vendedor no encontrado', id };
        return item;
    }

    @Get(':id/rutas')
    async rutasDeVendedor(@Param('id', ParseIntPipe) id: number) {
        return this.prisma.ruta.findMany({
            where: { vendedorId: id },
            include: { clientes: true },
        });
    }

    @Post()
    async create(@Body() body: any) {
        return this.prisma.vendedor.create({ data: body });
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
        const item = await this.prisma.vendedor.findUnique({ where: { id } });
        if (!item) return { error: 'Vendedor no encontrado', id };
        return this.prisma.vendedor.update({ where: { id }, data: body });
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.prisma.vendedor.update({ where: { id }, data: { activo: false } });
    }
}

@Controller('rutas')
export class RutasController {
    constructor(private prisma: PrismaService) { }

    @Get()
    async findAll() {
        return this.prisma.ruta.findMany({ include: { vendedor: true, clientes: true } });
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const item = await this.prisma.ruta.findUnique({
            where: { id },
            include: { vendedor: true, clientes: true }
        });
        if (!item) return { error: 'Ruta no encontrada', id };
        return item;
    }

    @Post()
    async create(@Body() body: any) {
        return this.prisma.ruta.create({ data: body });
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
        const item = await this.prisma.ruta.findUnique({ where: { id } });
        if (!item) return { error: 'Ruta no encontrada', id };
        return this.prisma.ruta.update({ where: { id }, data: body });
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.prisma.ruta.delete({ where: { id } });
    }
}
