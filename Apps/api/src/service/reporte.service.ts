import { Injectable } from '@nestjs/common';
import { ReporteRepository } from '../repository/reporte.repository';

@Injectable()
export class ReporteService {
    constructor(private repo: ReporteRepository) { }

    async obtenerProductosMasVendidos(limit?: number) {
        return this.repo.obtenerProductosMasVendidos(limit);
    }
}
