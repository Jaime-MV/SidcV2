import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { productos, lotes, Producto, Lote } from '../data/mock-data';

@Controller('productos')
export class ProductosController {
    private data = [...productos];
    private lotesData = [...lotes];
    private nextId = this.data.length + 1;

    @Get()
    findAll(@Query('categoriaId') categoriaId?: string, @Query('activo') activo?: string) {
        let result = [...this.data];
        if (categoriaId) result = result.filter(p => p.categoriaId === parseInt(categoriaId));
        if (activo !== undefined) result = result.filter(p => p.activo === (activo === 'true'));
        return result;
    }

    @Get('bajo-stock')
    bajoStock(@Query('limite') limite?: string) {
        const limiteNum = parseInt(limite || '50');
        return this.lotesData
            .filter(l => l.cantidad < limiteNum)
            .map(l => ({ ...l, producto: this.data.find(p => p.id === l.productoId) }));
    }

    @Get('proximos-vencer')
    proximosVencer(@Query('dias') dias?: string) {
        const diasNum = parseInt(dias || '30');
        const hoy = new Date();
        const limite = new Date();
        limite.setDate(limite.getDate() + diasNum);
        return this.lotesData
            .filter(l => {
                const fv = new Date(l.fechaVencimiento);
                return fv >= hoy && fv <= limite;
            })
            .map(l => ({ ...l, producto: this.data.find(p => p.id === l.productoId) }));
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        const item = this.data.find(p => p.id === id);
        if (!item) return { error: 'Producto no encontrado', id };
        const lotesProducto = this.lotesData.filter(l => l.productoId === id);
        return { ...item, lotes: lotesProducto };
    }

    @Post()
    create(@Body() body: Omit<Producto, 'id'>) {
        const nuevo: Producto = { id: this.nextId++, ...body };
        this.data.push(nuevo);
        return nuevo;
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<Producto>) {
        const idx = this.data.findIndex(p => p.id === id);
        if (idx === -1) return { error: 'Producto no encontrado', id };
        this.data[idx] = { ...this.data[idx], ...body };
        return this.data[idx];
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        const idx = this.data.findIndex(p => p.id === id);
        if (idx === -1) return { error: 'Producto no encontrado', id };
        this.data[idx].activo = false;
        return { mensaje: 'Producto desactivado', id };
    }
}

@Controller('lotes')
export class LotesController {
    private data = [...lotes];
    private nextId = this.data.length + 1;

    @Get()
    findAll(@Query('productoId') productoId?: string, @Query('bodega') bodega?: string) {
        let result = [...this.data];
        if (productoId) result = result.filter(l => l.productoId === parseInt(productoId));
        if (bodega) result = result.filter(l => l.bodega === bodega);
        return result;
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.data.find(l => l.id === id) || { error: 'Lote no encontrado', id };
    }

    @Post()
    create(@Body() body: Omit<Lote, 'id'>) {
        const nuevo: Lote = { id: this.nextId++, ...body };
        this.data.push(nuevo);
        return nuevo;
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<Lote>) {
        const idx = this.data.findIndex(l => l.id === id);
        if (idx === -1) return { error: 'Lote no encontrado', id };
        this.data[idx] = { ...this.data[idx], ...body };
        return this.data[idx];
    }
}
