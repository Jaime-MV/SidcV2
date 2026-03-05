import { Controller, Get, Post, Patch, Body, Param, Query, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { CreateCobroDto } from './dto/create-cobro.dto';

@Controller('clients')
export class ClientController {
    constructor(private readonly clientService: ClientService) { }

    // ─── CLIENTES (/api/clients) ───────────────────────────────────────────
    @Post()
    @HttpCode(HttpStatus.CREATED)
    createCliente(@Body() dto: CreateClienteDto) {
        return this.clientService.createCliente(dto);
    }

    @Get()
    findAllClientes(
        @Query('page') page?: string,
        @Query('pageSize') pageSize?: string,
        @Query('estado') estado?: string,
        @Query('tipo') tipo?: string,
    ) {
        return this.clientService.findAllClientes(
            page ? parseInt(page) : 1,
            pageSize ? parseInt(pageSize) : 20,
            estado,
            tipo,
        );
    }

    // ─── COBROS ESTÁTICOS antes que :id ──────────────────────────────────
    // IMPORTANTE: Estas rutas deben estar ANTES de GET :id para evitar
    // que NestJS intente parsear "cobros" como número con ParseIntPipe.

    @Post('cobros')
    @HttpCode(HttpStatus.CREATED)
    createCobro(@Body() dto: CreateCobroDto) {
        return this.clientService.createCobro(dto);
    }

    // GET /api/clients/cobros — Listado global de cobros
    @Get('cobros')
    findAllCobros(
        @Query('page') page?: string,
        @Query('pageSize') pageSize?: string,
        @Query('estado') estado?: string,
    ) {
        return this.clientService.findAllCobros(
            page ? parseInt(page) : 1,
            pageSize ? parseInt(pageSize) : 50,
            estado,
        );
    }

    // ─── CLIENTES POR ID (después de rutas estáticas) ─────────────────────
    @Get(':id')
    findClienteById(@Param('id', ParseIntPipe) id: number) {
        return this.clientService.findClienteById(id);
    }

    @Patch(':id')
    updateCliente(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateClienteDto>) {
        return this.clientService.updateCliente(id, dto);
    }

    @Get(':id/cobros')
    findCobrosByCliente(@Param('id', ParseIntPipe) id: number) {
        return this.clientService.findCobrosByCliente(id);
    }
}
