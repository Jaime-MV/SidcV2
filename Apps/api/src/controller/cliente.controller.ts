import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ClienteService } from '../service/cliente.service';
import { Prisma } from '@prisma/client';

@Controller('clientes')
export class ClienteController {
    constructor(private readonly service: ClienteService) { }

    @Post()
    crearCliente(@Body() data: Prisma.ClienteCreateInput) {
        return this.service.crearCliente(data);
    }

    @Get(':id')
    obtenerCliente(@Param('id') id: string) {
        return this.service.obtenerCliente(Number(id));
    }
}
