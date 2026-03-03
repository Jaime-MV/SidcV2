import { Controller, Post, Body } from '@nestjs/common';
import { PromocionService } from '../service/promocion.service';

@Controller('promociones')
export class PromocionController {
    constructor(private readonly service: PromocionService) { }

    @Post()
    crearPromocion(@Body() body: {
        nombre: string;
        descripcion?: string;
        fechaInicio: string | Date;
        fechaFin: string | Date;
        porcentajeDesc: number;
        productosIds: number[];
    }) {
        return this.service.crearPromocion(body);
    }
}
