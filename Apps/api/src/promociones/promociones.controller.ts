import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('promociones')
export class PromocionesController {
    constructor(private prisma: PrismaService) { }

    @Get()
    async findAll(@Query('activa') activa?: string) {
        const where: any = {};
        if (activa !== undefined) where.activa = activa === 'true';
        return this.prisma.promocion.findMany({
            where,
            include: { productos: { include: { producto: true } } }
        });
    }

    @Get('vigentes')
    async vigentes() {
        const hoy = new Date();
        return this.prisma.promocion.findMany({
            where: {
                activa: true,
                fechaInicio: { lte: hoy },
                fechaFin: { gte: hoy },
            },
            include: { productos: { include: { producto: true } } }
        });
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const item = await this.prisma.promocion.findUnique({
            where: { id },
            include: { productos: { include: { producto: true } } }
        });
        if (!item) return { error: 'Promoción no encontrada', id };
        return item;
    }

    @Post()
    async create(@Body() body: any) {
        return this.prisma.promocion.create({ data: body });
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
        const item = await this.prisma.promocion.findUnique({ where: { id } });
        if (!item) return { error: 'Promoción no encontrada', id };
        return this.prisma.promocion.update({ where: { id }, data: body });
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.prisma.promocion.update({ where: { id }, data: { activa: false } });
    }
}
