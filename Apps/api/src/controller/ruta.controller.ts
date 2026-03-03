import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { RutaService } from '../service/ruta.service';

@Controller('rutas')
export class RutaController {
    constructor(private readonly service: RutaService) { }

    @Post('vendedores')
    crearVendedor(@Body() body: { nombre: string; telefono?: string }) {
        return this.service.crearVendedor(body);
    }

    @Post()
    crearRuta(@Body() body: { nombre: string; descripcion?: string; vendedorId: number }) {
        return this.service.crearRuta(body);
    }

    @Patch('clientes/:clienteId')
    asignarClienteARuta(
        @Param('clienteId') clienteId: string,
        @Body('rutaId') rutaId: number
    ) {
        return this.service.asignarClienteARuta(Number(clienteId), Number(rutaId));
    }
}
