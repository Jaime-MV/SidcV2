import { Controller, Get, Post, Put, Body, Param, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('devoluciones')
export class DevolucionesController {
    constructor(private prisma: PrismaService) { }

    @Get()
    async findAll() {
        return this.prisma.devolucion.findMany({
            include: { venta: { include: { cliente: true } } },
            orderBy: { fecha: 'desc' },
        });
    }

    @Get('pendientes')
    async pendientes() {
        return this.prisma.devolucion.findMany({
            where: { estado: 'PENDIENTE' },
            include: { venta: { include: { cliente: true } } },
        });
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const item = await this.prisma.devolucion.findUnique({
            where: { id },
            include: { venta: { include: { cliente: true, detalles: { include: { producto: true } } } } },
        });
        if (!item) return { error: 'Devolución no encontrada', id };
        return item;
    }

    @Post()
    async create(@Body() body: any) {
        const venta = await this.prisma.venta.findUnique({ where: { id: body.ventaId } });
        if (!venta) return { error: 'Venta no encontrada' };

        return this.prisma.devolucion.create({
            data: {
                motivo: body.motivo,
                ventaId: body.ventaId,
                estado: 'PENDIENTE',
            },
            include: { venta: { include: { cliente: true } } },
        });
    }

    @Put(':id/aprobar')
    async aprobar(@Param('id', ParseIntPipe) id: number) {
        const item = await this.prisma.devolucion.findUnique({ where: { id } });
        if (!item) return { error: 'Devolución no encontrada' };
        if (item.estado !== 'PENDIENTE') return { error: 'Solo se pueden aprobar devoluciones pendientes' };
        return this.prisma.devolucion.update({ where: { id }, data: { estado: 'APROBADA' } });
    }

    @Put(':id/rechazar')
    async rechazar(@Param('id', ParseIntPipe) id: number) {
        const item = await this.prisma.devolucion.findUnique({ where: { id } });
        if (!item) return { error: 'Devolución no encontrada' };
        if (item.estado !== 'PENDIENTE') return { error: 'Solo se pueden rechazar devoluciones pendientes' };
        return this.prisma.devolucion.update({ where: { id }, data: { estado: 'RECHAZADA' } });
    }
}
