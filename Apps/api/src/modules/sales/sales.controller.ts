import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { CreateDevolucionDto } from './dto/create-devolucion.dto';

@Controller('sales')
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    // POST /api/sales — Crear venta
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreateVentaDto) {
        return this.salesService.create(dto);
    }

    // GET /api/sales — Listar ventas (paginado)
    @Get()
    findAll(
        @Query('page') page?: string,
        @Query('pageSize') pageSize?: string,
        @Query('estado') estado?: string,
    ) {
        return this.salesService.findAll(
            page ? parseInt(page) : 1,
            pageSize ? parseInt(pageSize) : 20,
            estado,
        );
    }

    // GET /api/sales/reportes/mas-vendidos — Reporte productos más vendidos
    @Get('reportes/mas-vendidos')
    getProductosMasVendidos(@Query('limit') limit?: string) {
        return this.salesService.getProductosMasVendidos(limit ? parseInt(limit) : 10);
    }

    // GET /api/sales/facturas — Listado global de facturas
    @Get('facturas')
    findAllFacturas(
        @Query('page') page?: string,
        @Query('pageSize') pageSize?: string,
        @Query('estado') estado?: string,
    ) {
        return this.salesService.findAllFacturas(
            page ? parseInt(page) : 1,
            pageSize ? parseInt(pageSize) : 20,
            estado,
        );
    }

    // GET /api/sales/devoluciones — Listado global de devoluciones
    @Get('devoluciones')
    findAllDevoluciones(
        @Query('page') page?: string,
        @Query('pageSize') pageSize?: string,
    ) {
        return this.salesService.findAllDevoluciones(
            page ? parseInt(page) : 1,
            pageSize ? parseInt(pageSize) : 20,
        );
    }

    // GET /api/sales/:id — Detalle de una venta
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.salesService.findOne(id);
    }

    // POST /api/sales/devoluciones — Crear devolución
    @Post('devoluciones')
    @HttpCode(HttpStatus.CREATED)
    createDevolucion(@Body() dto: CreateDevolucionDto) {
        return this.salesService.createDevolucion(dto);
    }
}
