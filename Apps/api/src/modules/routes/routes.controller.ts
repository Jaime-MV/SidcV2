import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CreateVendedorDto } from './dto/create-vendedor.dto';
import { CreateRutaDto } from './dto/create-ruta.dto';

@Controller('logistics')
export class RoutesController {
    constructor(private readonly routesService: RoutesService) { }

    // ─── VENDEDORES (/api/logistics/vendedores) ────────────────────
    @Post('vendedores')
    @HttpCode(HttpStatus.CREATED)
    createVendedor(@Body() dto: CreateVendedorDto) {
        return this.routesService.createVendedor(dto);
    }

    @Get('vendedores')
    findAllVendedores() {
        return this.routesService.findAllVendedores();
    }

    @Get('vendedores/:id')
    findVendedorById(@Param('id', ParseIntPipe) id: number) {
        return this.routesService.findVendedorById(id);
    }

    @Patch('vendedores/:id')
    updateVendedor(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateVendedorDto>) {
        return this.routesService.updateVendedor(id, dto);
    }

    // ─── RUTAS (/api/logistics/rutas) ──────────────────────────────
    @Post('rutas')
    @HttpCode(HttpStatus.CREATED)
    createRuta(@Body() dto: CreateRutaDto) {
        return this.routesService.createRuta(dto);
    }

    @Get('rutas')
    findAllRutas() {
        return this.routesService.findAllRutas();
    }

    @Get('rutas/:id')
    findRutaById(@Param('id', ParseIntPipe) id: number) {
        return this.routesService.findRutaById(id);
    }
}
