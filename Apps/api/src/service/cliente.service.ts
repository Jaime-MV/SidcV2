import { Injectable } from '@nestjs/common';
import { ClienteRepository } from '../repository/cliente.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClienteService {
    constructor(private repo: ClienteRepository) { }

    async crearCliente(data: Prisma.ClienteCreateInput) {
        return this.repo.create(data);
    }

    async obtenerCliente(id: number) {
        return this.repo.findById(id);
    }
}
