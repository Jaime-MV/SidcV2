import { Injectable } from '@nestjs/common';
import { InventarioRepository } from '../repository/inventario.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class InventarioService {
    constructor(private repo: InventarioRepository) { }

    async crearProducto(data: Prisma.ProductoUncheckedCreateInput) {
        return this.repo.crearProducto(data);
    }

    async crearLote(data: Prisma.LoteUncheckedCreateInput) {
        return this.repo.crearLote(data);
    }

    async obtenerInventarioDisponible() {
        return this.repo.obtenerInventarioDisponible();
    }
}
