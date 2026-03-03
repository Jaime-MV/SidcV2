import { Controller, Get, Post, Put, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('ventas')
export class VentasController {
    constructor(private prisma: PrismaService) { }

    @Get()
    async findAll(@Query('estado') estado?: string, @Query('clienteId') clienteId?: string) {
        const where: any = {};
        if (estado) where.estado = estado.toUpperCase();
        if (clienteId) where.clienteId = parseInt(clienteId);
        return this.prisma.venta.findMany({
            where,
            include: { cliente: true, vendedor: true, detalles: { include: { producto: true } } },
            orderBy: { fecha: 'desc' },
        });
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const venta = await this.prisma.venta.findUnique({
            where: { id },
            include: {
                cliente: true,
                vendedor: true,
                detalles: { include: { producto: true, lote: true } },
                factura: true,
            }
        });
        if (!venta) return { error: 'Venta no encontrada', id };
        return venta;
    }

    @Post()
    async create(@Body() body: any) {
        // Validar cliente
        const cliente = await this.prisma.cliente.findUnique({ where: { id: body.clienteId } });
        if (!cliente) return { error: 'Cliente no encontrado' };
        if (!cliente.activo) return { error: 'Cliente inactivo' };

        const total = body.detalles?.reduce((s: number, d: any) => s + (d.subtotal || 0), 0) || 0;

        // Validar crédito
        if (body.tipo === 'CREDITO') {
            const disponible = Number(cliente.limiteCredito) - Number(cliente.saldoCredito);
            if (total > disponible) {
                return { error: 'Límite de crédito excedido', disponible, total };
            }
        }

        const venta = await this.prisma.venta.create({
            data: {
                clienteId: body.clienteId,
                vendedorId: body.vendedorId,
                subtotal: total,
                total: total,
                estado: 'PENDIENTE',
                tipo: body.tipo || 'CONTADO',
                detalles: {
                    create: (body.detalles || []).map((d: any) => ({
                        productoId: d.productoId,
                        cantidad: d.cantidad,
                        precioUnitario: d.precioUnitario,
                        descuento: d.descuento || 0,
                        subtotal: d.subtotal,
                        loteId: d.loteId || null,
                    })),
                },
            },
            include: { detalles: true, cliente: true, vendedor: true },
        });

        return venta;
    }

    @Put(':id/facturar')
    async facturar(@Param('id', ParseIntPipe) id: number) {
        const venta = await this.prisma.venta.findUnique({ where: { id }, include: { factura: true } });
        if (!venta) return { error: 'Venta no encontrada' };
        if (venta.estado !== 'PENDIENTE') return { error: 'Solo se pueden facturar ventas pendientes' };

        const count = await this.prisma.factura.count();
        const numero = `FAC-2025-${String(count + 1).padStart(4, '0')}`;

        const [ventaActualizada, factura] = await this.prisma.$transaction([
            this.prisma.venta.update({ where: { id }, data: { estado: 'FACTURADA' } }),
            this.prisma.factura.create({
                data: {
                    ventaId: id,
                    numero,
                    total: venta.total,
                    estado: venta.tipo === 'CONTADO' ? 'PAGADA' : 'PENDIENTE',
                    tipo: venta.tipo,
                }
            }),
        ]);

        return { mensaje: 'Venta facturada', venta: ventaActualizada, factura };
    }

    @Put(':id/anular')
    async anular(@Param('id', ParseIntPipe) id: number) {
        const venta = await this.prisma.venta.findUnique({ where: { id } });
        if (!venta) return { error: 'Venta no encontrada' };
        if (venta.estado === 'ANULADA') return { error: 'Venta ya está anulada' };
        await this.prisma.venta.update({ where: { id }, data: { estado: 'ANULADA' } });
        return { mensaje: 'Venta anulada', id };
    }
}

@Controller('facturas')
export class FacturasController {
    constructor(private prisma: PrismaService) { }

    @Get()
    async findAll(@Query('estado') estado?: string) {
        const where: any = {};
        if (estado) where.estado = estado.toUpperCase();
        return this.prisma.factura.findMany({
            where,
            include: { venta: { include: { cliente: true } } },
            orderBy: { fecha: 'desc' },
        });
    }

    @Get('pendientes')
    async pendientes() {
        return this.prisma.factura.findMany({
            where: { estado: 'PENDIENTE' },
            include: { venta: { include: { cliente: true } } },
        });
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const factura = await this.prisma.factura.findUnique({
            where: { id },
            include: { venta: { include: { cliente: true, detalles: { include: { producto: true } } } }, cobros: true },
        });
        if (!factura) return { error: 'Factura no encontrada', id };
        return factura;
    }
}
