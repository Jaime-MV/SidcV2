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
exports.PromocionesController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PromocionesController = class PromocionesController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(activa) {
        const where = {};
        if (activa !== undefined)
            where.activa = activa === 'true';
        return this.prisma.promocion.findMany({
            where,
            include: { productos: { include: { producto: true } } }
        });
    }
    async vigentes() {
        const hoy = new Date();
        return this.prisma.promocion.findMany({
            where: {
                activa: true,
                fechaInicio: { lte: hoy },
                fechaFin: { gte: hoy },
            },
            include: { productos: { include: { producto: true } } }
        });
    }
    async findOne(id) {
        const item = await this.prisma.promocion.findUnique({
            where: { id },
            include: { productos: { include: { producto: true } } }
        });
        if (!item)
            return { error: 'Promoción no encontrada', id };
        return item;
    }
    async create(body) {
        return this.prisma.promocion.create({ data: body });
    }
    async update(id, body) {
        const item = await this.prisma.promocion.findUnique({ where: { id } });
        if (!item)
            return { error: 'Promoción no encontrada', id };
        return this.prisma.promocion.update({ where: { id }, data: body });
    }
    async remove(id) {
        return this.prisma.promocion.update({ where: { id }, data: { activa: false } });
    }
};
exports.PromocionesController = PromocionesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('activa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PromocionesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('vigentes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromocionesController.prototype, "vigentes", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PromocionesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PromocionesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PromocionesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PromocionesController.prototype, "remove", null);
exports.PromocionesController = PromocionesController = __decorate([
    (0, common_1.Controller)('promociones'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PromocionesController);
//# sourceMappingURL=promociones.controller.js.map