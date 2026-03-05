"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ClientService = class ClientService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCliente(dto) {
        if (dto.rutaId) {
            const ruta = await this.prisma.ruta.findUnique({ where: { id: dto.rutaId } });
            if (!ruta)
                throw new common_1.NotFoundException(`Ruta con ID ${dto.rutaId} no existe`);
        }
        return this.prisma.cliente.create({ data: dto, include: { ruta: true } });
    }
    async findAllClientes(page = 1, pageSize = 20, estado, tipo) {
        const skip = (page - 1) * pageSize;
        const where = {};
        if (estado)
            where.estado = estado;
        if (tipo)
            where.tipo = tipo;
        const [items, total] = await Promise.all([
            this.prisma.cliente.findMany({
                skip,
                take: pageSize,
                where,
                include: { ruta: true },
                orderBy: { id: 'desc' },
            }),
            this.prisma.cliente.count({ where }),
        ]);
        return { items, total, page, pageSize, pages: Math.ceil(total / pageSize) };
    }
    async findClienteById(id) {
        const cliente = await this.prisma.cliente.findUnique({
            where: { id },
            include: { ruta: true, ventas: { take: 10, orderBy: { fecha: 'desc' } }, cobros: { take: 10, orderBy: { fecha: 'desc' } } },
        });
        if (!cliente)
            throw new common_1.NotFoundException(`Cliente con ID ${id} no encontrado`);
        return cliente;
    }
    async updateCliente(id, dto) {
        await this.findClienteById(id);
        return this.prisma.cliente.update({ where: { id }, data: dto, include: { ruta: true } });
    }
    async createCobro(dto) {
        return this.prisma.$transaction(async (tx) => {
            const factura = await tx.factura.findUnique({
                where: { id: dto.facturaId },
                include: { cobros: true },
            });
            if (!factura)
                throw new common_1.NotFoundException(`Factura con ID ${dto.facturaId} no encontrada`);
            if (factura.estado === 'ANULADA')
                throw new common_1.BadRequestException('No se puede cobrar una factura anulada');
            if (factura.estado === 'PAGADA')
                throw new common_1.BadRequestException('La factura ya está completamente pagada');
            const cliente = await tx.cliente.findUnique({ where: { id: dto.clienteId } });
            if (!cliente)
                throw new common_1.NotFoundException(`Cliente con ID ${dto.clienteId} no encontrado`);
            const totalCobrado = factura.cobros.reduce((acc, c) => acc + Number(c.monto), 0);
            const saldoPendiente = Number(factura.total) - totalCobrado;
            if (dto.monto > saldoPendiente) {
                throw new common_1.BadRequestException(`El monto ($${dto.monto}) excede el saldo pendiente ($${saldoPendiente.toFixed(2)})`);
            }
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
            const nuevoTotalCobrado = totalCobrado + dto.monto;
            const nuevoEstado = nuevoTotalCobrado >= Number(factura.total) ? 'PAGADA' : 'PAGADA_PARCIALMENTE';
            await tx.factura.update({
                where: { id: dto.facturaId },
                data: { estado: nuevoEstado },
            });
            if (cliente.diasCredito > 0) {
                const nuevoSaldo = Math.max(0, Number(cliente.saldoActual) - dto.monto);
                await tx.cliente.update({ where: { id: cliente.id }, data: { saldoActual: nuevoSaldo } });
            }
            return cobro;
        });
    }
    async findCobrosByCliente(clienteId) {
        return this.prisma.cobro.findMany({
            where: { clienteId },
            include: { factura: true },
            orderBy: { fecha: 'desc' },
        });
    }
    async findAllCobros(page = 1, pageSize = 50, estado) {
        const skip = (page - 1) * pageSize;
        const where = estado ? { estado: estado } : {};
        const [items, total] = await Promise.all([
            this.prisma.cobro.findMany({
                skip,
                take: pageSize,
                where,
                include: { cliente: true, factura: { include: { venta: { include: { vendedor: true } } } } },
                orderBy: { fecha: 'desc' },
            }),
            this.prisma.cobro.count({ where }),
        ]);
        return { items, total, page, pageSize, pages: Math.ceil(total / pageSize) };
    }
};
exports.ClientService = ClientService;
exports.ClientService = ClientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClientService);
//# sourceMappingURL=client.service.js.map