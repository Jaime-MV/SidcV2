import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    /**
     * GET /api/reports/general
     * Genera un reporte completo con análisis de datos.
     * 
     * Query params:
     *   dias   — lista de fechas ISO "2026-03-01,2026-03-05"
     *   semanas — lista de semanas ISO "2026-W10,2026-W12"
     *   anios  — lista de años "2025,2026"
     */
    @Get('general')
    getReporte(
        @Query('dias') dias?: string,
        @Query('semanas') semanas?: string,
        @Query('anios') anios?: string,
    ) {
        return this.reportsService.getReporteGeneral({
            dias: dias ? dias.split(',').map(d => d.trim()) : undefined,
            semanas: semanas ? semanas.split(',').map(s => s.trim()) : undefined,
            anios: anios ? anios.split(',').map(a => parseInt(a.trim())) : undefined,
        });
    }
}
