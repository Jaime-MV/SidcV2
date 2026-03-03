import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { promociones, Promocion, productos } from '../data/mock-data';

@Controller('promociones')
export class PromocionesController {
    private data = [...promociones];
    private nextId = this.data.length + 1;

    @Get()
    findAll(@Query('activa') activa?: string) {
        const hoy = new Date().toISOString().split('T')[0];
        let result = this.data.map(p => ({
            ...p,
            vigente: p.activa && p.fechaInicio <= hoy && p.fechaFin >= hoy,
            productosNombres: p.productoIds.map(pid => productos.find(pr => pr.id === pid)?.nombre).filter(Boolean),
        }));
        if (activa !== undefined) {
            result = result.filter(p => p.activa === (activa === 'true'));
        }
        return result;
    }

    @Get('vigentes')
    vigentes() {
        const hoy = new Date().toISOString().split('T')[0];
        return this.data.filter(p => p.activa && p.fechaInicio <= hoy && p.fechaFin >= hoy).map(p => ({
            ...p,
            productosNombres: p.productoIds.map(pid => productos.find(pr => pr.id === pid)?.nombre).filter(Boolean),
        }));
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        const item = this.data.find(p => p.id === id);
        if (!item) return { error: 'Promoción no encontrada', id };
        const hoy = new Date().toISOString().split('T')[0];
        return {
            ...item,
            vigente: item.activa && item.fechaInicio <= hoy && item.fechaFin >= hoy,
            productosNombres: item.productoIds.map(pid => productos.find(pr => pr.id === pid)?.nombre).filter(Boolean),
        };
    }

    @Post()
    create(@Body() body: Omit<Promocion, 'id'>) {
        const nueva: Promocion = { id: this.nextId++, ...body };
        this.data.push(nueva);
        return nueva;
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<Promocion>) {
        const idx = this.data.findIndex(p => p.id === id);
        if (idx === -1) return { error: 'Promoción no encontrada', id };
        this.data[idx] = { ...this.data[idx], ...body };
        return this.data[idx];
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        const idx = this.data.findIndex(p => p.id === id);
        if (idx === -1) return { error: 'Promoción no encontrada', id };
        this.data[idx].activa = false;
        return { mensaje: 'Promoción desactivada', id };
    }
}
