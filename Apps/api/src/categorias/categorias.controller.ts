import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { categorias, Categoria } from '../data/mock-data';

@Controller('categorias')
export class CategoriasController {
    private data = [...categorias];
    private nextId = this.data.length + 1;

    @Get()
    findAll(@Query('activa') activa?: string) {
        if (activa !== undefined) {
            return this.data.filter(c => c.activa === (activa === 'true'));
        }
        return this.data;
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        const item = this.data.find(c => c.id === id);
        if (!item) return { error: 'Categoría no encontrada', id };
        return item;
    }

    @Post()
    create(@Body() body: Omit<Categoria, 'id'>) {
        const nueva: Categoria = { id: this.nextId++, ...body };
        this.data.push(nueva);
        return nueva;
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<Categoria>) {
        const idx = this.data.findIndex(c => c.id === id);
        if (idx === -1) return { error: 'Categoría no encontrada', id };
        this.data[idx] = { ...this.data[idx], ...body };
        return this.data[idx];
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        const idx = this.data.findIndex(c => c.id === id);
        if (idx === -1) return { error: 'Categoría no encontrada', id };
        this.data[idx].activa = false;
        return { mensaje: 'Categoría desactivada', id };
    }
}
