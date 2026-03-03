import { Controller, Post, Body } from '@nestjs/common';
import { CobroService } from '../service/cobro.service';

@Controller('cobros')
export class CobroController {
    constructor(private readonly service: CobroService) { }

    @Post()
    registrarCobro(@Body() body: {
        monto: number;
        metodoPago: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'CHEQUE';
        referenciaPago?: string;
        facturaId: number;
        clienteId: number;
    }) {
        return this.service.registrarCobro(body);
    }
}
