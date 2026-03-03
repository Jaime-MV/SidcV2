import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('categorias')
export class CategoriasController {
    constructor(private prisma: PrismaService) { }

    @Get()
    async findAll(@Query('activa') activa?: string) {
        if (activa !== undefined) {
            return this.prisma.categoria.findMany({
                where: { activa: activa === 'true' }
            });
        }
        return this.prisma.categoria.findMany();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const item = await this.prisma.categoria.findUnique({ where: { id } });
        if (!item) return { error: 'Categoría no encontrada', id };
        return item;
    }

    @Post()
    async create(@Body() body: any) {
        return this.prisma.categoria.create({
            data: {
                nombre: body.nombre,
                descripcion: body.descripcion,
                activa: body.activa !== undefined ? body.activa : true,
            }
        });
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
        const item = await this.prisma.categoria.findUnique({ where: { id } });
        if (!item) return { error: 'Categoría no encontrada', id };

        return this.prisma.categoria.update({
            where: { id },
            data: body,
        });
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        const item = await this.prisma.categoria.findUnique({ where: { id } });
        if (!item) return { error: 'Categoría no encontrada', id };

        return this.prisma.categoria.update({
            where: { id },
            data: { activa: false },
        });
    }
}
