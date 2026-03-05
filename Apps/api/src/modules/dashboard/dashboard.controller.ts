import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    /** GET /api/dashboard/stats — KPIs generales del sistema */
    @Get('stats')
    getStats() {
        return this.dashboardService.getStats();
    }

    /** GET /api/dashboard/ventas-mensuales?meses=6 — Serie temporal */
    @Get('ventas-mensuales')
    getVentasMensuales(@Query('meses') meses?: string) {
        return this.dashboardService.getVentasMensuales(meses ? parseInt(meses) : 6);
    }

    /** GET /api/dashboard/ventas-categoria — Agrupado por categoría */
    @Get('ventas-categoria')
    getVentasPorCategoria() {
        return this.dashboardService.getVentasPorCategoria();
    }
}
