import { Injectable } from '@nestjs/common';
import { RutaRepository } from '../repository/ruta.repository';

@Injectable()
export class RutaService {
    constructor(private repo: RutaRepository) { }

    async crearVendedor(data: { nombre: string; telefono?: string }) {
        return this.repo.crearVendedor(data);
    }

    async crearRuta(data: { nombre: string; descripcion?: string; vendedorId: number }) {
        return this.repo.crearRuta(data);
    }

    async asignarClienteARuta(clienteId: number, rutaId: number) {
        return this.repo.asignarClienteARuta(clienteId, rutaId);
    }
}
