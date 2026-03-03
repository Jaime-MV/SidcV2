import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { vendedores, rutas, Vendedor, Ruta, clientes } from '../data/mock-data';

@Controller('vendedores')
export class VendedoresController {
    private data = [...vendedores];
    private nextId = this.data.length + 1;

    @Get()
    findAll() {
        return this.data;
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.data.find(v => v.id === id) || { error: 'Vendedor no encontrado', id };
    }

    @Get(':id/rutas')
    getRutas(@Param('id', ParseIntPipe) id: number) {
        const rutasData = [...rutas];
        return rutasData.filter(r => r.vendedorId === id);
    }

    @Post()
    create(@Body() body: Omit<Vendedor, 'id'>) {
        const nuevo: Vendedor = { id: this.nextId++, ...body };
        this.data.push(nuevo);
        return nuevo;
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<Vendedor>) {
        const idx = this.data.findIndex(v => v.id === id);
        if (idx === -1) return { error: 'Vendedor no encontrado', id };
        this.data[idx] = { ...this.data[idx], ...body };
        return this.data[idx];
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        const idx = this.data.findIndex(v => v.id === id);
        if (idx === -1) return { error: 'Vendedor no encontrado', id };
        this.data[idx].activo = false;
        return { mensaje: 'Vendedor desactivado', id };
    }
}

@Controller('rutas')
export class RutasController {
    private data = [...rutas];
    private nextId = this.data.length + 1;
    private clientesData = [...clientes];

    @Get()
    findAll() {
        return this.data.map(r => ({
            ...r,
            vendedor: vendedores.find(v => v.id === r.vendedorId),
            clientes: r.clienteIds.map(cid => this.clientesData.find(c => c.id === cid)).filter(Boolean),
        }));
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        const ruta = this.data.find(r => r.id === id);
        if (!ruta) return { error: 'Ruta no encontrada', id };
        return {
            ...ruta,
            vendedor: vendedores.find(v => v.id === ruta.vendedorId),
            clientes: ruta.clienteIds.map(cid => this.clientesData.find(c => c.id === cid)).filter(Boolean),
        };
    }

    @Post()
    create(@Body() body: Omit<Ruta, 'id'>) {
        const nueva: Ruta = { id: this.nextId++, ...body };
        this.data.push(nueva);
        return nueva;
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<Ruta>) {
        const idx = this.data.findIndex(r => r.id === id);
        if (idx === -1) return { error: 'Ruta no encontrada', id };
        this.data[idx] = { ...this.data[idx], ...body };
        return this.data[idx];
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        const idx = this.data.findIndex(r => r.id === id);
        if (idx === -1) return { error: 'Ruta no encontrada', id };
        this.data.splice(idx, 1);
        return { mensaje: 'Ruta eliminada', id };
    }
}
