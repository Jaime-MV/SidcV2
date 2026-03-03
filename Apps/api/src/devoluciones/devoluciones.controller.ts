import { Controller, Get, Post, Put, Body, Param, ParseIntPipe } from '@nestjs/common';
import { devoluciones, Devolucion, ventas, clientes, productos } from '../data/mock-data';

const devolucionesData = [...devoluciones];
let nextDevolucionId = devolucionesData.length + 1;

@Controller('devoluciones')
export class DevolucionesController {

    @Get()
    findAll() {
        return devolucionesData.map(d => ({
            ...d,
            cliente: clientes.find(c => c.id === d.clienteId),
            ventaInfo: ventas.find(v => v.id === d.ventaId),
            detallesEnriquecidos: d.detalles.map(det => ({
                ...det,
                producto: productos.find(p => p.id === det.productoId),
            })),
        }));
    }

    @Get('pendientes')
    pendientes() {
        return devolucionesData.filter(d => d.estado === 'PENDIENTE').map(d => ({
            ...d,
            cliente: clientes.find(c => c.id === d.clienteId),
        }));
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        const dev = devolucionesData.find(d => d.id === id);
        if (!dev) return { error: 'Devolución no encontrada', id };
        return {
            ...dev,
            cliente: clientes.find(c => c.id === dev.clienteId),
            venta: ventas.find(v => v.id === dev.ventaId),
            detallesEnriquecidos: dev.detalles.map(det => ({
                ...det,
                producto: productos.find(p => p.id === det.productoId),
            })),
        };
    }

    @Post()
    create(@Body() body: Omit<Devolucion, 'id' | 'estado'>) {
        // Validar que la venta existe
        const venta = ventas.find(v => v.id === body.ventaId);
        if (!venta) return { error: 'Venta no encontrada' };
        if (venta.estado === 'ANULADA') return { error: 'No se puede devolver una venta anulada' };

        const total = body.detalles.reduce((sum, d) => sum + d.monto, 0);
        const nuevaDevolucion: Devolucion = {
            id: nextDevolucionId++,
            ...body,
            totalDevuelto: total,
            fecha: body.fecha || new Date().toISOString().split('T')[0],
            estado: 'PENDIENTE',
        };
        devolucionesData.push(nuevaDevolucion);
        return nuevaDevolucion;
    }

    @Put(':id/aprobar')
    aprobar(@Param('id', ParseIntPipe) id: number) {
        const dev = devolucionesData.find(d => d.id === id);
        if (!dev) return { error: 'Devolución no encontrada' };
        if (dev.estado !== 'PENDIENTE') return { error: 'Solo se pueden aprobar devoluciones pendientes' };
        dev.estado = 'APROBADA';
        return { mensaje: 'Devolución aprobada', devolucion: dev };
    }

    @Put(':id/rechazar')
    rechazar(@Param('id', ParseIntPipe) id: number) {
        const dev = devolucionesData.find(d => d.id === id);
        if (!dev) return { error: 'Devolución no encontrada' };
        if (dev.estado !== 'PENDIENTE') return { error: 'Solo se pueden rechazar devoluciones pendientes' };
        dev.estado = 'RECHAZADA';
        return { mensaje: 'Devolución rechazada', devolucion: dev };
    }
}
