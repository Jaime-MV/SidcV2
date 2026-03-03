import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RutaRepository {
    constructor(private prisma: PrismaService) { }

    async crearVendedor(data: { nombre: string; telefono?: string }) {
        return this.prisma.vendedor.create({ data });
    }

    async crearRuta(data: { nombre: string; descripcion?: string; vendedorId: number }) {
        const vendedor = await this.prisma.vendedor.findUnique({ where: { id: data.vendedorId } });
        if (!vendedor) throw new BadRequestException('Vendedor no encontrado');
        if (!vendedor.activo) throw new BadRequestException('El vendedor no está activo');

        return this.prisma.ruta.create({ data });
    }

    async asignarClienteARuta(clienteId: number, rutaId: number) {
        const ruta = await this.prisma.ruta.findUnique({ where: { id: rutaId } });
        if (!ruta) throw new BadRequestException('Ruta no encontrada');
        return this.prisma.cliente.update({
            where: { id: clienteId },
            data: { rutaId }
        });
    }
}
