import { Controller, Get, Post, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('cobros')
export class CobrosController {
    constructor(private prisma: PrismaService) { }

    @Get()
    async findAll() {
        return this.prisma.cobro.findMany({
            include: { cliente: true, factura: true },
            orderBy: { fecha: 'desc' },
        });
    }

    @Get('resumen')
    async resumen() {
        const cobros = await this.prisma.cobro.findMany();
        const resumen: Record<string, { cantidad: number; total: number }> = {};
        cobros.forEach(c => {
            if (!resumen[c.metodoPago]) resumen[c.metodoPago] = { cantidad: 0, total: 0 };
            resumen[c.metodoPago].cantidad++;
            resumen[c.metodoPago].total += Number(c.monto);
        });
        return Object.entries(resumen).map(([metodo, data]) => ({ metodo, ...data }));
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const item = await this.prisma.cobro.findUnique({
            where: { id },
            include: { cliente: true, factura: true },
        });
        if (!item) return { error: 'Cobro no encontrado', id };
        return item;
    }

    @Post()
    async create(@Body() body: any) {
        const cliente = await this.prisma.cliente.findUnique({ where: { id: body.clienteId } });
        if (!cliente) return { error: 'Cliente no encontrado' };

        return this.prisma.cobro.create({
            data: {
                monto: body.monto,
                metodoPago: body.metodoPago,
                referenciaPago: body.referenciaPago,
                facturaId: body.facturaId,
                clienteId: body.clienteId,
            },
            include: { cliente: true, factura: true },
        });
    }
}
