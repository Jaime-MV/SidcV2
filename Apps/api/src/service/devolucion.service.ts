import { Injectable } from '@nestjs/common';
import { DevolucionRepository } from '../repository/devolucion.repository';

@Injectable()
export class DevolucionService {
    constructor(private repo: DevolucionRepository) { }

    async crearDevolucion(data: { ventaId: number; motivo: string }) {
        return this.repo.crearDevolucion(data);
    }
}
