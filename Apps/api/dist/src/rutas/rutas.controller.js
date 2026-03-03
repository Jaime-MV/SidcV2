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
exports.RutasController = exports.VendedoresController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let VendedoresController = class VendedoresController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.vendedor.findMany({ include: { rutas: true } });
    }
    async findOne(id) {
        const item = await this.prisma.vendedor.findUnique({ where: { id }, include: { rutas: true } });
        if (!item)
            return { error: 'Vendedor no encontrado', id };
        return item;
    }
    async rutasDeVendedor(id) {
        return this.prisma.ruta.findMany({
            where: { vendedorId: id },
            include: { clientes: true },
        });
    }
    async create(body) {
        return this.prisma.vendedor.create({ data: body });
    }
    async update(id, body) {
        const item = await this.prisma.vendedor.findUnique({ where: { id } });
        if (!item)
            return { error: 'Vendedor no encontrado', id };
        return this.prisma.vendedor.update({ where: { id }, data: body });
    }
    async remove(id) {
        return this.prisma.vendedor.update({ where: { id }, data: { activo: false } });
    }
};
exports.VendedoresController = VendedoresController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VendedoresController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VendedoresController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/rutas'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VendedoresController.prototype, "rutasDeVendedor", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VendedoresController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], VendedoresController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VendedoresController.prototype, "remove", null);
exports.VendedoresController = VendedoresController = __decorate([
    (0, common_1.Controller)('vendedores'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VendedoresController);
let RutasController = class RutasController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.ruta.findMany({ include: { vendedor: true, clientes: true } });
    }
    async findOne(id) {
        const item = await this.prisma.ruta.findUnique({
            where: { id },
            include: { vendedor: true, clientes: true }
        });
        if (!item)
            return { error: 'Ruta no encontrada', id };
        return item;
    }
    async create(body) {
        return this.prisma.ruta.create({ data: body });
    }
    async update(id, body) {
        const item = await this.prisma.ruta.findUnique({ where: { id } });
        if (!item)
            return { error: 'Ruta no encontrada', id };
        return this.prisma.ruta.update({ where: { id }, data: body });
    }
    async remove(id) {
        return this.prisma.ruta.delete({ where: { id } });
    }
};
exports.RutasController = RutasController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RutasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RutasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RutasController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], RutasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RutasController.prototype, "remove", null);
exports.RutasController = RutasController = __decorate([
    (0, common_1.Controller)('rutas'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RutasController);
//# sourceMappingURL=rutas.controller.js.map