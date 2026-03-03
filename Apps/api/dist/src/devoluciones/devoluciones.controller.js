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
exports.DevolucionesController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DevolucionesController = class DevolucionesController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.devolucion.findMany({
            include: { venta: { include: { cliente: true } } },
            orderBy: { fecha: 'desc' },
        });
    }
    async pendientes() {
        return this.prisma.devolucion.findMany({
            where: { estado: 'PENDIENTE' },
            include: { venta: { include: { cliente: true } } },
        });
    }
    async findOne(id) {
        const item = await this.prisma.devolucion.findUnique({
            where: { id },
            include: { venta: { include: { cliente: true, detalles: { include: { producto: true } } } } },
        });
        if (!item)
            return { error: 'Devolución no encontrada', id };
        return item;
    }
    async create(body) {
        const venta = await this.prisma.venta.findUnique({ where: { id: body.ventaId } });
        if (!venta)
            return { error: 'Venta no encontrada' };
        return this.prisma.devolucion.create({
            data: {
                motivo: body.motivo,
                ventaId: body.ventaId,
                estado: 'PENDIENTE',
            },
            include: { venta: { include: { cliente: true } } },
        });
    }
    async aprobar(id) {
        const item = await this.prisma.devolucion.findUnique({ where: { id } });
        if (!item)
            return { error: 'Devolución no encontrada' };
        if (item.estado !== 'PENDIENTE')
            return { error: 'Solo se pueden aprobar devoluciones pendientes' };
        return this.prisma.devolucion.update({ where: { id }, data: { estado: 'APROBADA' } });
    }
    async rechazar(id) {
        const item = await this.prisma.devolucion.findUnique({ where: { id } });
        if (!item)
            return { error: 'Devolución no encontrada' };
        if (item.estado !== 'PENDIENTE')
            return { error: 'Solo se pueden rechazar devoluciones pendientes' };
        return this.prisma.devolucion.update({ where: { id }, data: { estado: 'RECHAZADA' } });
    }
};
exports.DevolucionesController = DevolucionesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DevolucionesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pendientes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DevolucionesController.prototype, "pendientes", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DevolucionesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevolucionesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id/aprobar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DevolucionesController.prototype, "aprobar", null);
__decorate([
    (0, common_1.Put)(':id/rechazar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DevolucionesController.prototype, "rechazar", null);
exports.DevolucionesController = DevolucionesController = __decorate([
    (0, common_1.Controller)('devoluciones'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DevolucionesController);
//# sourceMappingURL=devoluciones.controller.js.map