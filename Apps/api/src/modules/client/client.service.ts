import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { CreateCobroDto } from './dto/create-cobro.dto';

@Injectable()
export class ClientService {
    constructor(private readonly prisma: PrismaService) { }

    // ─── CLIENTES ──────────────────────────────────────────────────
    async createCliente(dto: CreateClienteDto) {
        if (dto.rutaId) {
            const ruta = await this.prisma.ruta.findUnique({ where: { id: dto.rutaId } });
            if (!ruta) throw new NotFoundException(`Ruta con ID ${dto.rutaId} no existe`);
        }
        return this.prisma.cliente.create({ data: dto, include: { ruta: true } });
    }

    async findAllClientes(page = 1, pageSize = 20) {
        const skip = (page - 1) * pageSize;
        const [items, total] = await Promise.all([
            this.prisma.cliente.findMany({
                skip,
                take: pageSize,
                include: { ruta: true },
                orderBy: { id: 'desc' },
            }),
            this.prisma.cliente.count(),
        ]);
        return { items, total, page, pageSize, pages: Math.ceil(total / pageSize) };
    }

    async findClienteById(id: number) {
        const cliente = await this.prisma.cliente.findUnique({
            where: { id },
            include: { ruta: true, ventas: { take: 10, orderBy: { fecha: 'desc' } }, cobros: { take: 10, orderBy: { fecha: 'desc' } } },
        });
        if (!cliente) throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
        return cliente;
    }

    async updateCliente(id: number, dto: Partial<CreateClienteDto>) {
        await this.findClienteById(id);
        return this.prisma.cliente.update({ where: { id }, data: dto, include: { ruta: true } });
    }

    // ─── COBROS ────────────────────────────────────────────────────
    async createCobro(dto: CreateCobroDto) {
        return this.prisma.$transaction(async (tx) => {
            // Validar factura
            const factura = await tx.factura.findUnique({
                where: { id: dto.facturaId },
                include: { cobros: true },
            });
            if (!factura) throw new NotFoundException(`Factura con ID ${dto.facturaId} no encontrada`);
            if (factura.estado === 'ANULADA') throw new BadRequestException('No se puede cobrar una factura anulada');
            if (factura.estado === 'PAGADA') throw new BadRequestException('La factura ya está completamente pagada');

            // Validar cliente
            const cliente = await tx.cliente.findUnique({ where: { id: dto.clienteId } });
            if (!cliente) throw new NotFoundException(`Cliente con ID ${dto.clienteId} no encontrado`);

            // Calcular saldo pendiente de la factura
            const totalCobrado = factura.cobros.reduce((acc, c) => acc + Number(c.monto), 0);
            const saldoPendiente = Number(factura.total) - totalCobrado;

            if (dto.monto > saldoPendiente) {
                throw new BadRequestException(`El monto ($${dto.monto}) excede el saldo pendiente ($${saldoPendiente.toFixed(2)})`);
            }

            // Crear cobro
            const cobro = await tx.cobro.create({
                data: {
                    monto: dto.monto,
                    metodoPago: dto.metodoPago,
                    referenciaPago: dto.referenciaPago,
                    facturaId: dto.facturaId,
                    clienteId: dto.clienteId,
                },
                include: { factura: true, cliente: true },
            });

            // Actualizar estado de factura
            const nuevoTotalCobrado = totalCobrado + dto.monto;
            const nuevoEstado = nuevoTotalCobrado >= Number(factura.total) ? 'PAGADA' : 'PAGADA_PARCIALMENTE';

            await tx.factura.update({
                where: { id: dto.facturaId },
                data: { estado: nuevoEstado },
            });

            // Actualizar saldo de crédito del cliente
            if (cliente.diasCredito > 0) {
                const nuevoSaldo = Math.max(0, Number(cliente.saldoActual) - dto.monto);
                await tx.cliente.update({ where: { id: cliente.id }, data: { saldoActual: nuevoSaldo } });
            }

            return cobro;
        });
    }

    async findCobrosByCliente(clienteId: number) {
        return this.prisma.cobro.findMany({
            where: { clienteId },
            include: { factura: true },
            orderBy: { fecha: 'desc' },
        });
    }
}
