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
exports.CategoriasController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoriasController = class CategoriasController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(activa) {
        if (activa !== undefined) {
            return this.prisma.categoria.findMany({
                where: { activa: activa === 'true' }
            });
        }
        return this.prisma.categoria.findMany();
    }
    async findOne(id) {
        const item = await this.prisma.categoria.findUnique({ where: { id } });
        if (!item)
            return { error: 'Categoría no encontrada', id };
        return item;
    }
    async create(body) {
        return this.prisma.categoria.create({
            data: {
                nombre: body.nombre,
                descripcion: body.descripcion,
                activa: body.activa !== undefined ? body.activa : true,
            }
        });
    }
    async update(id, body) {
        const item = await this.prisma.categoria.findUnique({ where: { id } });
        if (!item)
            return { error: 'Categoría no encontrada', id };
        return this.prisma.categoria.update({
            where: { id },
            data: body,
        });
    }
    async remove(id) {
        const item = await this.prisma.categoria.findUnique({ where: { id } });
        if (!item)
            return { error: 'Categoría no encontrada', id };
        return this.prisma.categoria.update({
            where: { id },
            data: { activa: false },
        });
    }
};
exports.CategoriasController = CategoriasController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('activa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoriasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoriasController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CategoriasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoriasController.prototype, "remove", null);
exports.CategoriasController = CategoriasController = __decorate([
    (0, common_1.Controller)('categorias'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriasController);
//# sourceMappingURL=categorias.controller.js.map