import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('productos')
export class ProductosController {
    constructor(private prisma: PrismaService) { }

    @Get()
    async findAll(@Query('categoriaId') categoriaId?: string, @Query('activo') activo?: string) {
        const where: any = {};
        if (categoriaId) where.categoriaId = parseInt(categoriaId);
        if (activo !== undefined) where.activo = activo === 'true';
        return this.prisma.producto.findMany({ where, include: { categoria: true } });
    }

    @Get('bajo-stock')
    async bajoStock(@Query('minimo') minimo?: string) {
        const min = parseInt(minimo || '10');
        const productos = await this.prisma.producto.findMany({
            include: {
                lotes: true,
                categoria: true,
            }
        });
        return productos.filter(p => {
            const totalStock = p.lotes.reduce((s, l) => s + l.cantidad, 0);
            return totalStock <= min;
        }).map(p => ({
            ...p,
            stockTotal: p.lotes.reduce((s, l) => s + l.cantidad, 0),
        }));
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const item = await this.prisma.producto.findUnique({
            where: { id },
            include: { categoria: true, lotes: true }
        });
        if (!item) return { error: 'Producto no encontrado', id };
        return item;
    }

    @Post()
    async create(@Body() body: any) {
        return this.prisma.producto.create({
            data: {
                nombre: body.nombre,
                descripcion: body.descripcion,
                codigo: body.codigo,
                precio: body.precio,
                unidad: body.unidad,
                categoriaId: body.categoriaId,
            }
        });
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
        const item = await this.prisma.producto.findUnique({ where: { id } });
        if (!item) return { error: 'Producto no encontrado', id };
        return this.prisma.producto.update({ where: { id }, data: body });
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        const item = await this.prisma.producto.findUnique({ where: { id } });
        if (!item) return { error: 'Producto no encontrado', id };
        return this.prisma.producto.update({ where: { id }, data: { activo: false } });
    }
}

@Controller('lotes')
export class LotesController {
    constructor(private prisma: PrismaService) { }

    @Get()
    async findAll(@Query('productoId') productoId?: string) {
        const where: any = {};
        if (productoId) where.productoId = parseInt(productoId);
        return this.prisma.lote.findMany({ where, include: { producto: true } });
    }

    @Get('por-vencer')
    async porVencer(@Query('dias') dias?: string) {
        const d = parseInt(dias || '30');
        const limite = new Date();
        limite.setDate(limite.getDate() + d);
        return this.prisma.lote.findMany({
            where: {
                fechaVencimiento: { lte: limite },
                cantidad: { gt: 0 },
            },
            include: { producto: true },
            orderBy: { fechaVencimiento: 'asc' },
        });
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const item = await this.prisma.lote.findUnique({ where: { id }, include: { producto: true } });
        if (!item) return { error: 'Lote no encontrado', id };
        return item;
    }

    @Post()
    async create(@Body() body: any) {
        return this.prisma.lote.create({ data: body });
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
        const item = await this.prisma.lote.findUnique({ where: { id } });
        if (!item) return { error: 'Lote no encontrado', id };
        return this.prisma.lote.update({ where: { id }, data: body });
    }
}
