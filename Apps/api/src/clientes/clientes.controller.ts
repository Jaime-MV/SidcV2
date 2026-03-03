import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { clientes, Cliente } from '../data/mock-data';

@Controller('clientes')
export class ClientesController {
    private data = [...clientes];
    private nextId = this.data.length + 1;

    @Get()
    findAll(@Query('tipo') tipo?: string, @Query('activo') activo?: string) {
        let result = [...this.data];
        if (tipo) result = result.filter(c => c.tipo === tipo.toUpperCase());
        if (activo !== undefined) result = result.filter(c => c.activo === (activo === 'true'));
        return result;
    }

    @Get('con-credito-disponible')
    conCreditoDisponible() {
        return this.data
            .filter(c => c.tipo === 'CREDITO' && c.activo)
            .map(c => ({
                ...c,
                creditoDisponible: c.limiteCredito - c.saldoCredito,
                porcentajeUsado: ((c.saldoCredito / c.limiteCredito) * 100).toFixed(1),
            }));
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        const item = this.data.find(c => c.id === id);
        if (!item) return { error: 'Cliente no encontrado', id };
        return {
            ...item,
            creditoDisponible: item.tipo === 'CREDITO' ? item.limiteCredito - item.saldoCredito : null,
        };
    }

    @Post()
    create(@Body() body: Omit<Cliente, 'id'>) {
        const nuevo: Cliente = { id: this.nextId++, ...body, saldoCredito: body.saldoCredito ?? 0 };
        this.data.push(nuevo);
        return nuevo;
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<Cliente>) {
        const idx = this.data.findIndex(c => c.id === id);
        if (idx === -1) return { error: 'Cliente no encontrado', id };
        // Validar límite de crédito
        if (body.saldoCredito !== undefined && this.data[idx].tipo === 'CREDITO') {
            const nuevoSaldo = body.saldoCredito;
            const limite = body.limiteCredito ?? this.data[idx].limiteCredito;
            if (nuevoSaldo > limite) {
                return { error: 'El saldo supera el límite de crédito', limite, saldo: nuevoSaldo };
            }
        }
        this.data[idx] = { ...this.data[idx], ...body };
        return this.data[idx];
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        const idx = this.data.findIndex(c => c.id === id);
        if (idx === -1) return { error: 'Cliente no encontrado', id };
        this.data[idx].activo = false;
        return { mensaje: 'Cliente desactivado', id };
    }
}
