import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('clientes')
export class ClientesController {
    constructor(private prisma: PrismaService) { }

    @Get()
    async findAll(@Query('activo') activo?: string, @Query('tipo') tipo?: string) {
        const where: any = {};
        if (activo !== undefined) where.activo = activo === 'true';
        if (tipo) where.tipo = tipo.toUpperCase();
        return this.prisma.cliente.findMany({ where, include: { ruta: true } });
    }

    @Get('con-credito-disponible')
    async conCreditoDisponible() {
        const clientes = await this.prisma.cliente.findMany({
            where: { tipo: 'CREDITO', activo: true }
        });
        return clientes.map(c => ({
            ...c,
            limiteCredito: Number(c.limiteCredito),
            saldoCredito: Number(c.saldoCredito),
            creditoDisponible: Number(c.limiteCredito) - Number(c.saldoCredito),
        }));
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const item = await this.prisma.cliente.findUnique({ where: { id }, include: { ruta: true } });
        if (!item) return { error: 'Cliente no encontrado', id };
        return {
            ...item,
            limiteCredito: Number(item.limiteCredito),
            saldoCredito: Number(item.saldoCredito),
            creditoDisponible: Number(item.limiteCredito) - Number(item.saldoCredito),
        };
    }

    @Post()
    async create(@Body() body: any) {
        return this.prisma.cliente.create({
            data: {
                nombre: body.nombre,
                identificacion: body.identificacion,
                tipo: body.tipo || 'CONTADO',
                direccion: body.direccion,
                telefono: body.telefono,
                email: body.email,
                limiteCredito: body.limiteCredito || 0,
                saldoCredito: body.saldoCredito || 0,
                diasCredito: body.diasCredito || 0,
                rutaId: body.rutaId,
            }
        });
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
        const item = await this.prisma.cliente.findUnique({ where: { id } });
        if (!item) return { error: 'Cliente no encontrado', id };
        return this.prisma.cliente.update({ where: { id }, data: body });
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        const item = await this.prisma.cliente.findUnique({ where: { id } });
        if (!item) return { error: 'Cliente no encontrado', id };
        return this.prisma.cliente.update({ where: { id }, data: { activo: false } });
    }
}
