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
exports.ClientesController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ClientesController = class ClientesController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(activo, tipo) {
        const where = {};
        if (activo !== undefined)
            where.activo = activo === 'true';
        if (tipo)
            where.tipo = tipo.toUpperCase();
        return this.prisma.cliente.findMany({ where, include: { ruta: true } });
    }
    async conCreditoDisponible() {
        const clientes = await this.prisma.cliente.findMany({
            where: { tipo: 'CREDITO', activo: true }
        });
        return clientes.map(c => ({
            ...c,
            limiteCredito: Number(c.limiteCredito),
            saldoCredito: Number(c.saldoCredito),
            creditoDisponible: Number(c.limiteCredito) - Number(c.saldoCredito),
        }));
    }
    async findOne(id) {
        const item = await this.prisma.cliente.findUnique({ where: { id }, include: { ruta: true } });
        if (!item)
            return { error: 'Cliente no encontrado', id };
        return {
            ...item,
            limiteCredito: Number(item.limiteCredito),
            saldoCredito: Number(item.saldoCredito),
            creditoDisponible: Number(item.limiteCredito) - Number(item.saldoCredito),
        };
    }
    async create(body) {
        return this.prisma.cliente.create({
            data: {
                nombre: body.nombre,
                identificacion: body.identificacion,
                tipo: body.tipo || 'CONTADO',
                direccion: body.direccion,
                telefono: body.telefono,
                email: body.email,
                limiteCredito: body.limiteCredito || 0,
                saldoCredito: body.saldoCredito || 0,
                diasCredito: body.diasCredito || 0,
                rutaId: body.rutaId,
            }
        });
    }
    async update(id, body) {
        const item = await this.prisma.cliente.findUnique({ where: { id } });
        if (!item)
            return { error: 'Cliente no encontrado', id };
        return this.prisma.cliente.update({ where: { id }, data: body });
    }
    async remove(id) {
        const item = await this.prisma.cliente.findUnique({ where: { id } });
        if (!item)
            return { error: 'Cliente no encontrado', id };
        return this.prisma.cliente.update({ where: { id }, data: { activo: false } });
    }
};
exports.ClientesController = ClientesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('activo')),
    __param(1, (0, common_1.Query)('tipo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('con-credito-disponible'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "conCreditoDisponible", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "remove", null);
exports.ClientesController = ClientesController = __decorate([
    (0, common_1.Controller)('clientes'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClientesController);
//# sourceMappingURL=clientes.controller.js.map