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
exports.PromotionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PromotionsService = class PromotionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const fechaInicio = new Date(dto.fechaInicio);
        const fechaFin = new Date(dto.fechaFin);
        if (fechaFin <= fechaInicio) {
            throw new common_1.BadRequestException('La fecha de fin debe ser posterior a la fecha de inicio');
        }
        const productos = await this.prisma.producto.findMany({
            where: { id: { in: dto.productoIds } },
        });
        if (productos.length !== dto.productoIds.length) {
            throw new common_1.NotFoundException('Uno o más productos no existen');
        }
        return this.prisma.promocion.create({
            data: {
                nombre: dto.nombre,
                descripcion: dto.descripcion,
                fechaInicio,
                fechaFin,
                porcentajeDesc: dto.porcentajeDesc,
                activa: dto.activa ?? true,
                productos: {
                    create: dto.productoIds.map((productoId) => ({ productoId })),
                },
            },
            include: { productos: { include: { producto: true } } },
        });
    }
    async findAll() {
        return this.prisma.promocion.findMany({
            include: { productos: { include: { producto: true } } },
            orderBy: { fechaInicio: 'desc' },
        });
    }
    async findVigentes() {
        const now = new Date();
        return this.prisma.promocion.findMany({
            where: {
                activa: true,
                fechaInicio: { lte: now },
                fechaFin: { gte: now },
            },
            include: { productos: { include: { producto: true } } },
        });
    }
    async findById(id) {
        const promo = await this.prisma.promocion.findUnique({
            where: { id },
            include: { productos: { include: { producto: true } } },
        });
        if (!promo)
            throw new common_1.NotFoundException(`Promoción con ID ${id} no encontrada`);
        return promo;
    }
    async toggleActiva(id) {
        const promo = await this.findById(id);
        return this.prisma.promocion.update({
            where: { id },
            data: { activa: !promo.activa },
            include: { productos: { include: { producto: true } } },
        });
    }
    async getDescuentoVigente(productoId) {
        const now = new Date();
        const promos = await this.prisma.promocionProducto.findMany({
            where: {
                productoId,
                promocion: {
                    activa: true,
                    fechaInicio: { lte: now },
                    fechaFin: { gte: now },
                },
            },
            include: { promocion: true },
            orderBy: { promocion: { porcentajeDesc: 'desc' } },
        });
        if (promos.length === 0)
            return 0;
        return Number(promos[0].promocion.porcentajeDesc);
    }
};
exports.PromotionsService = PromotionsService;
exports.PromotionsService = PromotionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PromotionsService);
//# sourceMappingURL=promotions.service.js.map