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
exports.LotesController = exports.ProductosController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductosController = class ProductosController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(categoriaId, activo) {
        const where = {};
        if (categoriaId)
            where.categoriaId = parseInt(categoriaId);
        if (activo !== undefined)
            where.activo = activo === 'true';
        return this.prisma.producto.findMany({ where, include: { categoria: true } });
    }
    async bajoStock(minimo) {
        const min = parseInt(minimo || '10');
        const productos = await this.prisma.producto.findMany({
            include: {
                lotes: true,
                categoria: true,
            }
        });
        return productos.filter(p => {
            const totalStock = p.lotes.reduce((s, l) => s + l.cantidad, 0);
            return totalStock <= min;
        }).map(p => ({
            ...p,
            stockTotal: p.lotes.reduce((s, l) => s + l.cantidad, 0),
        }));
    }
    async findOne(id) {
        const item = await this.prisma.producto.findUnique({
            where: { id },
            include: { categoria: true, lotes: true }
        });
        if (!item)
            return { error: 'Producto no encontrado', id };
        return item;
    }
    async create(body) {
        return this.prisma.producto.create({
            data: {
                nombre: body.nombre,
                descripcion: body.descripcion,
                codigo: body.codigo,
                precio: body.precio,
                unidad: body.unidad,
                categoriaId: body.categoriaId,
            }
        });
    }
    async update(id, body) {
        const item = await this.prisma.producto.findUnique({ where: { id } });
        if (!item)
            return { error: 'Producto no encontrado', id };
        return this.prisma.producto.update({ where: { id }, data: body });
    }
    async remove(id) {
        const item = await this.prisma.producto.findUnique({ where: { id } });
        if (!item)
            return { error: 'Producto no encontrado', id };
        return this.prisma.producto.update({ where: { id }, data: { activo: false } });
    }
};
exports.ProductosController = ProductosController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('categoriaId')),
    __param(1, (0, common_1.Query)('activo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('bajo-stock'),
    __param(0, (0, common_1.Query)('minimo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductosController.prototype, "bajoStock", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductosController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProductosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductosController.prototype, "remove", null);
exports.ProductosController = ProductosController = __decorate([
    (0, common_1.Controller)('productos'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductosController);
let LotesController = class LotesController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(productoId) {
        const where = {};
        if (productoId)
            where.productoId = parseInt(productoId);
        return this.prisma.lote.findMany({ where, include: { producto: true } });
    }
    async porVencer(dias) {
        const d = parseInt(dias || '30');
        const limite = new Date();
        limite.setDate(limite.getDate() + d);
        return this.prisma.lote.findMany({
            where: {
                fechaVencimiento: { lte: limite },
                cantidad: { gt: 0 },
            },
            include: { producto: true },
            orderBy: { fechaVencimiento: 'asc' },
        });
    }
    async findOne(id) {
        const item = await this.prisma.lote.findUnique({ where: { id }, include: { producto: true } });
        if (!item)
            return { error: 'Lote no encontrado', id };
        return item;
    }
    async create(body) {
        return this.prisma.lote.create({ data: body });
    }
    async update(id, body) {
        const item = await this.prisma.lote.findUnique({ where: { id } });
        if (!item)
            return { error: 'Lote no encontrado', id };
        return this.prisma.lote.update({ where: { id }, data: body });
    }
};
exports.LotesController = LotesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('productoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LotesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('por-vencer'),
    __param(0, (0, common_1.Query)('dias')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LotesController.prototype, "porVencer", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LotesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LotesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], LotesController.prototype, "update", null);
exports.LotesController = LotesController = __decorate([
    (0, common_1.Controller)('lotes'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LotesController);
//# sourceMappingURL=productos.controller.js.map