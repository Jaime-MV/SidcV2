import { Controller, Post, Body } from '@nestjs/common';
import { VentasService } from '../service/ventas.service';

@Controller('ventas')
export class VentasController {
    constructor(private readonly service: VentasService) { }

    @Post()
    crearVenta(@Body() data: { clienteId: number; vendedorId: number; productos: { productoId: number; cantidad: number }[] }) {
        return this.service.crearVenta(data);
    }
}
