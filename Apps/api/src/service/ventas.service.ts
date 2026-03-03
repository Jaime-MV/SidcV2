import { Injectable } from '@nestjs/common';
import { VentasRepository } from '../repository/ventas.repository';

@Injectable()
export class VentasService {
    constructor(private repo: VentasRepository) { }

    async crearVenta(data: {
        clienteId: number;
        vendedorId: number;
        productos: { productoId: number; cantidad: number }[];
    }) {
        return this.repo.crearVentaTransaccion(data);
    }
}
