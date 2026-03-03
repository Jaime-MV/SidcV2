import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { InventarioService } from '../service/inventario.service';
import { Prisma } from '@prisma/client';

@Controller('inventario')
export class InventarioController {
    constructor(private readonly service: InventarioService) { }

    @Post('productos')
    crearProducto(@Body() body: Prisma.ProductoUncheckedCreateInput) {
        return this.service.crearProducto(body);
    }

    @Post('lotes')
    crearLote(@Body() body: Prisma.LoteUncheckedCreateInput) {
        return this.service.crearLote(body);
    }

    @Get('disponible')
    obtenerInventarioDisponible() {
        return this.service.obtenerInventarioDisponible();
    }
}
