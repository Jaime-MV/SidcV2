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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InventoryService = class InventoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCategoria(dto) {
        return this.prisma.categoria.create({ data: dto });
    }
    async findAllCategorias() {
        return this.prisma.categoria.findMany({ include: { productos: true } });
    }
    async findCategoriaById(id) {
        const cat = await this.prisma.categoria.findUnique({ where: { id }, include: { productos: true } });
        if (!cat)
            throw new common_1.NotFoundException(`Categoría con ID ${id} no encontrada`);
        return cat;
    }
    async createProducto(dto) {
        const categoria = await this.prisma.categoria.findUnique({ where: { id: dto.categoriaId } });
        if (!categoria)
            throw new common_1.NotFoundException(`Categoría con ID ${dto.categoriaId} no existe`);
        return this.prisma.producto.create({ data: dto, include: { categoria: true } });
    }
    async findAllProductos(page = 1, pageSize = 20) {
        const skip = (page - 1) * pageSize;
        const [items, total] = await Promise.all([
            this.prisma.producto.findMany({
                skip,
                take: pageSize,
                include: { categoria: true, lotes: true },
                orderBy: { id: 'desc' },
            }),
            this.prisma.producto.count(),
        ]);
        return { items, total, page, pageSize, pages: Math.ceil(total / pageSize) };
    }
    async findProductoById(id) {
        const prod = await this.prisma.producto.findUnique({
            where: { id },
            include: { categoria: true, lotes: { orderBy: { fechaVencimiento: 'asc' } } },
        });
        if (!prod)
            throw new common_1.NotFoundException(`Producto con ID ${id} no encontrado`);
        return prod;
    }
    async createLote(dto) {
        const producto = await this.prisma.producto.findUnique({ where: { id: dto.productoId } });
        if (!producto)
            throw new common_1.NotFoundException(`Producto con ID ${dto.productoId} no existe`);
        const fechaVenc = new Date(dto.fechaVencimiento);
        if (fechaVenc <= new Date())
            throw new common_1.BadRequestException('La fecha de vencimiento debe ser futura');
        const lote = await this.prisma.lote.create({
            data: {
                numeroLote: dto.numeroLote,
                fechaFabricacion: new Date(dto.fechaFabricacion),
                fechaVencimiento: fechaVenc,
                cantidadInicial: dto.cantidadInicial,
                cantidadDisponible: dto.cantidadInicial,
                productoId: dto.productoId,
            },
            include: { producto: true },
        });
        await this.prisma.movimientoInventario.create({
            data: {
                tipoMovimiento: 'ENTRADA',
                cantidad: dto.cantidadInicial,
                loteId: lote.id,
                referencia: `Ingreso inicial Lote ${dto.numeroLote}`,
            },
        });
        return lote;
    }
    async findAllLotes(productoId) {
        const where = productoId ? { productoId } : {};
        return this.prisma.lote.findMany({
            where,
            include: { producto: true },
            orderBy: { fechaVencimiento: 'asc' },
        });
    }
    async findLoteById(id) {
        const lote = await this.prisma.lote.findUnique({
            where: { id },
            include: { producto: true, movimientos: { orderBy: { fechaMovimiento: 'desc' } } },
        });
        if (!lote)
            throw new common_1.NotFoundException(`Lote con ID ${id} no encontrado`);
        return lote;
    }
    async getInventarioPorLote() {
        return this.prisma.lote.findMany({
            where: { cantidadDisponible: { gt: 0 } },
            include: { producto: { include: { categoria: true } } },
            orderBy: { fechaVencimiento: 'asc' },
        });
    }
    async getProductosProximosAVencer(diasAlerta = 30) {
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() + diasAlerta);
        return this.prisma.lote.findMany({
            where: {
                cantidadDisponible: { gt: 0 },
                fechaVencimiento: { lte: fechaLimite, gt: new Date() },
            },
            include: { producto: { include: { categoria: true } } },
            orderBy: { fechaVencimiento: 'asc' },
        });
    }
    async getMovimientos(loteId) {
        const where = loteId ? { loteId } : {};
        return this.prisma.movimientoInventario.findMany({
            where,
            include: { lote: { include: { producto: true } } },
            orderBy: { fechaMovimiento: 'desc' },
        });
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map