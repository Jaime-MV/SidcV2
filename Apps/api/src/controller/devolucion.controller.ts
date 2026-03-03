import { Controller, Post, Body } from '@nestjs/common';
import { DevolucionService } from '../service/devolucion.service';

@Controller('devoluciones')
export class DevolucionController {
    constructor(private readonly service: DevolucionService) { }

    @Post()
    crearDevolucion(@Body() body: { ventaId: number; motivo: string }) {
        return this.service.crearDevolucion(body);
    }
}
