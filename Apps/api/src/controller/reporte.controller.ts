import { Controller, Get, Query } from '@nestjs/common';
import { ReporteService } from '../service/reporte.service';

@Controller('reportes')
export class ReporteController {
    constructor(private readonly service: ReporteService) { }

    @Get('productos-mas-vendidos')
    obtenerProductosMasVendidos(@Query('limite') limite?: string) {
        const lim = limite ? parseInt(limite, 10) : 10;
        return this.service.obtenerProductosMasVendidos(lim);
    }
}
