import { Controller, Get, Post, Patch, Body, Param, Query, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { CreateCobroDto } from './dto/create-cobro.dto';

@Controller('clients')
export class ClientController {
    constructor(private readonly clientService: ClientService) { }

    // ─── CLIENTES (/api/clients) ───────────────────────────────────
    @Post()
    @HttpCode(HttpStatus.CREATED)
    createCliente(@Body() dto: CreateClienteDto) {
        return this.clientService.createCliente(dto);
    }

    @Get()
    findAllClientes(
        @Query('page') page?: string,
        @Query('pageSize') pageSize?: string,
    ) {
        return this.clientService.findAllClientes(
            page ? parseInt(page) : 1,
            pageSize ? parseInt(pageSize) : 20,
        );
    }

    @Get(':id')
    findClienteById(@Param('id', ParseIntPipe) id: number) {
        return this.clientService.findClienteById(id);
    }

    @Patch(':id')
    updateCliente(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateClienteDto>) {
        return this.clientService.updateCliente(id, dto);
    }

    // ─── COBROS (/api/clients/cobros) ──────────────────────────────
    @Post('cobros')
    @HttpCode(HttpStatus.CREATED)
    createCobro(@Body() dto: CreateCobroDto) {
        return this.clientService.createCobro(dto);
    }

    @Get(':id/cobros')
    findCobrosByCliente(@Param('id', ParseIntPipe) id: number) {
        return this.clientService.findCobrosByCliente(id);
    }
}
