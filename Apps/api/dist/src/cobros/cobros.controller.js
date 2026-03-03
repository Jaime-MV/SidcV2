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
exports.CobrosController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CobrosController = class CobrosController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.cobro.findMany({
            include: { cliente: true, factura: true },
            orderBy: { fecha: 'desc' },
        });
    }
    async resumen() {
        const cobros = await this.prisma.cobro.findMany();
        const resumen = {};
        cobros.forEach(c => {
            if (!resumen[c.metodoPago])
                resumen[c.metodoPago] = { cantidad: 0, total: 0 };
            resumen[c.metodoPago].cantidad++;
            resumen[c.metodoPago].total += Number(c.monto);
        });
        return Object.entries(resumen).map(([metodo, data]) => ({ metodo, ...data }));
    }
    async findOne(id) {
        const item = await this.prisma.cobro.findUnique({
            where: { id },
            include: { cliente: true, factura: true },
        });
        if (!item)
            return { error: 'Cobro no encontrado', id };
        return item;
    }
    async create(body) {
        const cliente = await this.prisma.cliente.findUnique({ where: { id: body.clienteId } });
        if (!cliente)
            return { error: 'Cliente no encontrado' };
        return this.prisma.cobro.create({
            data: {
                monto: body.monto,
                metodoPago: body.metodoPago,
                referenciaPago: body.referenciaPago,
                facturaId: body.facturaId,
                clienteId: body.clienteId,
            },
            include: { cliente: true, factura: true },
        });
    }
};
exports.CobrosController = CobrosController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CobrosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('resumen'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CobrosController.prototype, "resumen", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CobrosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CobrosController.prototype, "create", null);
exports.CobrosController = CobrosController = __decorate([
    (0, common_1.Controller)('cobros'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CobrosController);
//# sourceMappingURL=cobros.controller.js.map