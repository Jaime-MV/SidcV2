import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CobroRepository {
    constructor(private prisma: PrismaService) { }

    async registrarCobro(data: {
        monto: number;
        metodoPago: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'CHEQUE';
        referenciaPago?: string;
        facturaId: number;
        clienteId: number;
    }) {
        return this.prisma.$transaction(async (tx) => {
            // Validar factura
            const factura = await tx.factura.findUnique({
                where: { id: data.facturaId },
                include: { cobros: true, venta: true }
            });

            if (!factura) throw new BadRequestException('Factura no encontrada');
            if (factura.estado === 'PAGADA' || factura.estado === 'ANULADA') {
                throw new BadRequestException(`No se puede abonar a una factura en estado ${factura.estado}`);
            }

            // Validar cliente
            if (factura.venta.clienteId !== data.clienteId) {
                throw new BadRequestException('La factura no pertenece al cliente indicado');
            }

            const totalPagado = factura.cobros.reduce((sum, c) => sum + Number(c.monto), 0);
            const saldoPendiente = Number(factura.total) - totalPagado;

            if (data.monto > saldoPendiente) {
                throw new BadRequestException(`El monto excede el saldo pendiente de ${saldoPendiente}`);
            }

            const cobro = await tx.cobro.create({
                data: {
                    monto: data.monto,
                    metodoPago: data.metodoPago,
                    referenciaPago: data.referenciaPago,
                    facturaId: data.facturaId,
                    clienteId: data.clienteId
                }
            });

            // Update factura status
            const nuevoTotalPagado = totalPagado + data.monto;
            let nuevoEstadoFactura = 'PAGADA_PARCIALMENTE';
            if (nuevoTotalPagado >= Number(factura.total)) {
                nuevoEstadoFactura = 'PAGADA';
            }

            await tx.factura.update({
                where: { id: factura.id },
                data: { estado: nuevoEstadoFactura as any }
            });

            // Update saldo cliente
            const cliente = await tx.cliente.findUnique({ where: { id: data.clienteId } });
            if (cliente && cliente.diasCredito > 0) {
                const saldoFinal = Number(cliente.saldoActual) - data.monto;
                await tx.cliente.update({
                    where: { id: cliente.id },
                    data: { saldoActual: saldoFinal >= 0 ? saldoFinal : 0 }
                });
            }

            return cobro;
        });
    }
}
