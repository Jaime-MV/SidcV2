import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Cliente } from '@prisma/client';

@Injectable()
export class ClienteRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.ClienteCreateInput): Promise<Cliente> {
        return this.prisma.cliente.create({ data });
    }

    async findById(id: number): Promise<Cliente | null> {
        return this.prisma.cliente.findUnique({ where: { id } });
    }
}
