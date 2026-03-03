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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacturasController = exports.VentasController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let VentasController = class VentasController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(estado, clienteId) {
        const where = {};
        if (estado)
            where.estado = estado.toUpperCase();
        if (clienteId)
            where.clienteId = parseInt(clienteId);
        return this.prisma.venta.findMany({
            where,
            include: { cliente: true, vendedor: true, detalles: { include: { producto: true } } },
            orderBy: { fecha: 'desc' },
        });
    }
    async findOne(id) {
        const venta = await this.prisma.venta.findUnique({
            where: { id },
            include: {
                cliente: true,
                vendedor: true,
                detalles: { include: { producto: true, lote: true } },
                factura: true,
            }
        });
        if (!venta)
            return { error: 'Venta no encontrada', id };
        return venta;
    }
    async create(body) {
        const cliente = await this.prisma.cliente.findUnique({ where: { id: body.clienteId } });
        if (!cliente)
            return { error: 'Cliente no encontrado' };
        if (!cliente.activo)
            return { error: 'Cliente inactivo' };
        const total = body.detalles?.reduce((s, d) => s + (d.subtotal || 0), 0) || 0;
        if (body.tipo === 'CREDITO') {
            const disponible = Number(cliente.limiteCredito) - Number(cliente.saldoCredito);
            if (total > disponible) {
                return { error: 'Límite de crédito excedido', disponible, total };
            }
        }
        const venta = await this.prisma.venta.create({
            data: {
                clienteId: body.clienteId,
                vendedorId: body.vendedorId,
                subtotal: total,
                total: total,
                estado: 'PENDIENTE',
                tipo: body.tipo || 'CONTADO',
                detalles: {
                    create: (body.detalles || []).map((d) => ({
                        productoId: d.productoId,
                        cantidad: d.cantidad,
                        precioUnitario: d.precioUnitario,
                        descuento: d.descuento || 0,
                        subtotal: d.subtotal,
                        loteId: d.loteId || null,
                    })),
                },
            },
            include: { detalles: true, cliente: true, vendedor: true },
        });
        return venta;
    }
    async facturar(id) {
        const venta = await this.prisma.venta.findUnique({ where: { id }, include: { factura: true } });
        if (!venta)
            return { error: 'Venta no encontrada' };
        if (venta.estado !== 'PENDIENTE')
            return { error: 'Solo se pueden facturar ventas pendientes' };
        const count = await this.prisma.factura.count();
        const numero = `FAC-2025-${String(count + 1).padStart(4, '0')}`;
        const [ventaActualizada, factura] = await this.prisma.$transaction([
            this.prisma.venta.update({ where: { id }, data: { estado: 'FACTURADA' } }),
            this.prisma.factura.create({
                data: {
                    ventaId: id,
                    numero,
                    total: venta.total,
                    estado: venta.tipo === 'CONTADO' ? 'PAGADA' : 'PENDIENTE',
                    tipo: venta.tipo,
                }
            }),
        ]);
        return { mensaje: 'Venta facturada', venta: ventaActualizada, factura };
    }
    async anular(id) {
        const venta = await this.prisma.venta.findUnique({ where: { id } });
        if (!venta)
            return { error: 'Venta no encontrada' };
        if (venta.estado === 'ANULADA')
            return { error: 'Venta ya está anulada' };
        await this.prisma.venta.update({ where: { id }, data: { estado: 'ANULADA' } });
        return { mensaje: 'Venta anulada', id };
    }
};
exports.VentasController = VentasController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('estado')),
    __param(1, (0, common_1.Query)('clienteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id/facturar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "facturar", null);
__decorate([
    (0, common_1.Put)(':id/anular'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "anular", null);
exports.VentasController = VentasController = __decorate([
    (0, common_1.Controller)('ventas'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VentasController);
let FacturasController = class FacturasController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(estado) {
        const where = {};
        if (estado)
            where.estado = estado.toUpperCase();
        return this.prisma.factura.findMany({
            where,
            include: { venta: { include: { cliente: true } } },
            orderBy: { fecha: 'desc' },
        });
    }
    async pendientes() {
        return this.prisma.factura.findMany({
            where: { estado: 'PENDIENTE' },
            include: { venta: { include: { cliente: true } } },
        });
    }
    async findOne(id) {
        const factura = await this.prisma.factura.findUnique({
            where: { id },
            include: { venta: { include: { cliente: true, detalles: { include: { producto: true } } } }, cobros: true },
        });
        if (!factura)
            return { error: 'Factura no encontrada', id };
        return factura;
    }
};
exports.FacturasController = FacturasController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('estado')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FacturasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pendientes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FacturasController.prototype, "pendientes", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FacturasController.prototype, "findOne", null);
exports.FacturasController = FacturasController = __decorate([
    (0, common_1.Controller)('facturas'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FacturasController);
//# sourceMappingURL=ventas.controller.js.map