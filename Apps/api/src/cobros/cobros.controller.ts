import { Controller, Get, Post, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { cobros, Cobro, clientes } from '../data/mock-data';

// Shared facturas state (reference same module-level array)
const cobrosData = [...cobros];
let nextCobroId = cobrosData.length + 1;

@Controller('cobros')
export class CobrosController {

    @Get()
    findAll(@Query('clienteId') clienteId?: string, @Query('metodoPago') metodoPago?: string) {
        let result = cobrosData.map(c => ({
            ...c,
            cliente: clientes.find(cl => cl.id === c.clienteId),
        }));
        if (clienteId) result = result.filter(c => c.clienteId === parseInt(clienteId));
        if (metodoPago) result = result.filter(c => c.metodoPago === metodoPago.toUpperCase());
        return result;
    }

    @Get('resumen')
    resumen() {
        const total = cobrosData.reduce((sum, c) => sum + c.monto, 0);
        const porMetodo = cobrosData.reduce((acc, c) => {
            acc[c.metodoPago] = (acc[c.metodoPago] || 0) + c.monto;
            return acc;
        }, {} as Record<string, number>);
        return { totalCobrado: total.toFixed(2), porMetodo, totalCobros: cobrosData.length };
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        const cobro = cobrosData.find(c => c.id === id);
        if (!cobro) return { error: 'Cobro no encontrado', id };
        return { ...cobro, cliente: clientes.find(c => c.id === cobro.clienteId) };
    }

    @Post()
    create(@Body() body: Omit<Cobro, 'id'>) {
        // Validar cliente
        const cliente = clientes.find(c => c.id === body.clienteId);
        if (!cliente) return { error: 'Cliente no encontrado' };

        const nuevoCobro: Cobro = {
            id: nextCobroId++,
            ...body,
            fecha: body.fecha || new Date().toISOString().split('T')[0],
        };
        cobrosData.push(nuevoCobro);
        return { mensaje: 'Cobro registrado exitosamente', cobro: nuevoCobro };
    }
}
