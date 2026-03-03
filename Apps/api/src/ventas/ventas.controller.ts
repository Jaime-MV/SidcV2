import { Controller, Get, Post, Put, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
    ventas, Venta, DetalleVenta,
    productos, lotes, clientes, vendedores, rutas,
    facturas, Factura
} from '../data/mock-data';

// In-memory mutable copies
const ventasData = [...ventas];
const facturasData = [...facturas];
const lotesData = [...lotes];
let nextVentaId = ventasData.length + 1;
let nextFacturaId = facturasData.length + 1;
let facturaNumero = facturasData.length + 1;

@Controller('ventas')
export class VentasController {

    @Get()
    findAll(@Query('estado') estado?: string, @Query('clienteId') clienteId?: string) {
        let result = ventasData.map(v => ({
            ...v,
            cliente: clientes.find(c => c.id === v.clienteId),
            vendedor: vendedores.find(vnd => vnd.id === v.vendedorId),
        }));
        if (estado) result = result.filter(v => v.estado === estado.toUpperCase());
        if (clienteId) result = result.filter(v => v.clienteId === parseInt(clienteId));
        return result;
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        const venta = ventasData.find(v => v.id === id);
        if (!venta) return { error: 'Venta no encontrada', id };
        return {
            ...venta,
            cliente: clientes.find(c => c.id === venta.clienteId),
            vendedor: vendedores.find(v => v.id === venta.vendedorId),
            detallesEnriquecidos: venta.detalles.map(d => ({
                ...d,
                producto: productos.find(p => p.id === d.productoId),
                lote: lotesData.find(l => l.id === d.loteId),
            })),
        };
    }

    @Post()
    create(@Body() body: { clienteId: number; vendedorId: number; rutaId: number; tipo: 'CONTADO' | 'CREDITO'; detalles: DetalleVenta[] }) {
        // Validar cliente
        const cliente = clientes.find(c => c.id === body.clienteId);
        if (!cliente) return { error: 'Cliente no encontrado' };
        if (!cliente.activo) return { error: 'Cliente inactivo' };

        // Validar inventario por lote
        for (const detalle of body.detalles) {
            const lote = lotesData.find(l => l.id === detalle.loteId);
            if (!lote) return { error: `Lote ${detalle.loteId} no encontrado` };
            if (lote.cantidad < detalle.cantidad) {
                return { error: `Stock insuficiente en lote ${lote.numero}. Disponible: ${lote.cantidad}` };
            }
            // Validar vencimiento
            const hoy = new Date();
            if (new Date(lote.fechaVencimiento) < hoy) {
                return { error: `Lote ${lote.numero} está vencido` };
            }
        }

        // Validar crédito
        const total = body.detalles.reduce((s, d) => s + d.subtotal, 0);
        if (body.tipo === 'CREDITO' && cliente.tipo === 'CREDITO') {
            if (cliente.saldoCredito + total > cliente.limiteCredito) {
                return { error: 'Límite de crédito excedido', disponible: cliente.limiteCredito - cliente.saldoCredito, total };
            }
        }

        // Descontar inventario
        for (const detalle of body.detalles) {
            const loteIdx = lotesData.findIndex(l => l.id === detalle.loteId);
            if (loteIdx !== -1) lotesData[loteIdx].cantidad -= detalle.cantidad;
        }

        const nuevaVenta: Venta = {
            id: nextVentaId++,
            clienteId: body.clienteId,
            vendedorId: body.vendedorId,
            rutaId: body.rutaId,
            fecha: new Date().toISOString().split('T')[0],
            estado: 'PENDIENTE',
            tipo: body.tipo,
            detalles: body.detalles,
            total,
        };
        ventasData.push(nuevaVenta);
        return nuevaVenta;
    }

    @Put(':id/facturar')
    facturar(@Param('id', ParseIntPipe) id: number) {
        const venta = ventasData.find(v => v.id === id);
        if (!venta) return { error: 'Venta no encontrada' };
        if (venta.estado !== 'PENDIENTE') return { error: 'Solo se pueden facturar ventas pendientes' };

        venta.estado = 'FACTURADA';
        const factura: Factura = {
            id: nextFacturaId++,
            ventaId: id,
            numero: `FAC-2025-${String(facturaNumero++).padStart(4, '0')}`,
            fecha: new Date().toISOString().split('T')[0],
            total: venta.total,
            estado: venta.tipo === 'CONTADO' ? 'PAGADA' : 'PENDIENTE',
            tipo: venta.tipo,
        };
        facturasData.push(factura);
        return { mensaje: 'Venta facturada', venta, factura };
    }

    @Put(':id/anular')
    anular(@Param('id', ParseIntPipe) id: number) {
        const venta = ventasData.find(v => v.id === id);
        if (!venta) return { error: 'Venta no encontrada' };
        if (venta.estado === 'ANULADA') return { error: 'Venta ya está anulada' };
        venta.estado = 'ANULADA';
        return { mensaje: 'Venta anulada', id };
    }
}

@Controller('facturas')
export class FacturasController {

    @Get()
    findAll(@Query('estado') estado?: string) {
        let result = facturasData.map(f => ({
            ...f,
            venta: ventasData.find(v => v.id === f.ventaId),
            cliente: clientes.find(c => {
                const venta = ventasData.find(v => v.id === f.ventaId);
                return venta ? c.id === venta.clienteId : false;
            }),
        }));
        if (estado) result = result.filter(f => f.estado === estado.toUpperCase());
        return result;
    }

    @Get('pendientes')
    pendientes() {
        return facturasData
            .filter(f => f.estado === 'PENDIENTE')
            .map(f => {
                const venta = ventasData.find(v => v.id === f.ventaId);
                return {
                    ...f,
                    cliente: venta ? clientes.find(c => c.id === venta.clienteId) : null,
                };
            });
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        const factura = facturasData.find(f => f.id === id);
        if (!factura) return { error: 'Factura no encontrada', id };
        const venta = ventasData.find(v => v.id === factura.ventaId);
        return {
            ...factura,
            venta,
            cliente: venta ? clientes.find(c => c.id === venta.clienteId) : null,
        };
    }
}
