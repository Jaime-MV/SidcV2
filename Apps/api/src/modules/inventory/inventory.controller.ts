import { Controller, Get, Post, Patch, Body, Param, Query, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { CreateProductoDto } from './dto/create-producto.dto';
import { CreateLoteDto } from './dto/create-lote.dto';
import { CreateBodegaDto } from './dto/create-bodega.dto';

@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    // ─── CATEGORÍAS (/api/inventory/categorias) ────────────────────
    @Post('categorias')
    @HttpCode(HttpStatus.CREATED)
    createCategoria(@Body() dto: CreateCategoriaDto) {
        return this.inventoryService.createCategoria(dto);
    }

    @Get('categorias')
    findAllCategorias() {
        return this.inventoryService.findAllCategorias();
    }

    @Get('categorias/:id')
    findCategoriaById(@Param('id', ParseIntPipe) id: number) {
        return this.inventoryService.findCategoriaById(id);
    }

    // ─── PRODUCTOS (/api/inventory/productos) ──────────────────────
    @Post('productos')
    @HttpCode(HttpStatus.CREATED)
    createProducto(@Body() dto: CreateProductoDto) {
        return this.inventoryService.createProducto(dto);
    }

    @Get('productos')
    findAllProductos(
        @Query('page') page?: string,
        @Query('pageSize') pageSize?: string,
    ) {
        return this.inventoryService.findAllProductos(
            page ? parseInt(page) : 1,
            pageSize ? parseInt(pageSize) : 20,
        );
    }

    @Get('productos/:id')
    findProductoById(@Param('id', ParseIntPipe) id: number) {
        return this.inventoryService.findProductoById(id);
    }

    // ─── LOTES (/api/inventory/lotes) ──────────────────────────────
    @Post('lotes')
    @HttpCode(HttpStatus.CREATED)
    createLote(@Body() dto: CreateLoteDto) {
        return this.inventoryService.createLote(dto);
    }

    @Get('lotes')
    findAllLotes(@Query('productoId') productoId?: string) {
        return this.inventoryService.findAllLotes(productoId ? parseInt(productoId) : undefined);
    }

    @Get('lotes/:id')
    findLoteById(@Param('id', ParseIntPipe) id: number) {
        return this.inventoryService.findLoteById(id);
    }

    // ─── REPORTES (/api/inventory/reportes) ────────────────────────
    @Get('reportes/inventario-lote')
    getInventarioPorLote() {
        return this.inventoryService.getInventarioPorLote();
    }

    @Get('reportes/proximos-vencer')
    getProductosProximosAVencer(@Query('dias') dias?: string) {
        return this.inventoryService.getProductosProximosAVencer(dias ? parseInt(dias) : 30);
    }

    @Get('reportes/movimientos')
    getMovimientos(@Query('loteId') loteId?: string) {
        return this.inventoryService.getMovimientos(loteId ? parseInt(loteId) : undefined);
    }

    // ─── BODEGAS (/api/inventory/bodegas) ─────────────────────────────────
    @Post('bodegas')
    @HttpCode(HttpStatus.CREATED)
    createBodega(@Body() dto: CreateBodegaDto) {
        return this.inventoryService.createBodega(dto);
    }

    @Get('bodegas')
    findAllBodegas() {
        return this.inventoryService.findAllBodegas();
    }

    @Get('bodegas/:id')
    findBodegaById(@Param('id', ParseIntPipe) id: number) {
        return this.inventoryService.findBodegaById(id);
    }

    @Patch('bodegas/:id')
    updateBodega(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateBodegaDto>) {
        return this.inventoryService.updateBodega(id, dto);
    }
}
