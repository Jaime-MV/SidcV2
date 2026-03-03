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
const mock_data_1 = require("../data/mock-data");
let PromocionesController = class PromocionesController {
    data = [...mock_data_1.promociones];
    nextId = this.data.length + 1;
    findAll(activa) {
        const hoy = new Date().toISOString().split('T')[0];
        let result = this.data.map(p => ({
            ...p,
            vigente: p.activa && p.fechaInicio <= hoy && p.fechaFin >= hoy,
            productosNombres: p.productoIds.map(pid => mock_data_1.productos.find(pr => pr.id === pid)?.nombre).filter(Boolean),
        }));
        if (activa !== undefined) {
            result = result.filter(p => p.activa === (activa === 'true'));
        }
        return result;
    }
    vigentes() {
        const hoy = new Date().toISOString().split('T')[0];
        return this.data.filter(p => p.activa && p.fechaInicio <= hoy && p.fechaFin >= hoy).map(p => ({
            ...p,
            productosNombres: p.productoIds.map(pid => mock_data_1.productos.find(pr => pr.id === pid)?.nombre).filter(Boolean),
        }));
    }
    findOne(id) {
        const item = this.data.find(p => p.id === id);
        if (!item)
            return { error: 'Promoción no encontrada', id };
        const hoy = new Date().toISOString().split('T')[0];
        return {
            ...item,
            vigente: item.activa && item.fechaInicio <= hoy && item.fechaFin >= hoy,
            productosNombres: item.productoIds.map(pid => mock_data_1.productos.find(pr => pr.id === pid)?.nombre).filter(Boolean),
        };
    }
    create(body) {
        const nueva = { id: this.nextId++, ...body };
        this.data.push(nueva);
        return nueva;
    }
    update(id, body) {
        const idx = this.data.findIndex(p => p.id === id);
        if (idx === -1)
            return { error: 'Promoción no encontrada', id };
        this.data[idx] = { ...this.data[idx], ...body };
        return this.data[idx];
    }
    remove(id) {
        const idx = this.data.findIndex(p => p.id === id);
        if (idx === -1)
            return { error: 'Promoción no encontrada', id };
        this.data[idx].activa = false;
        return { mensaje: 'Promoción desactivada', id };
    }
};
exports.PromocionesController = PromocionesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('activa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('vigentes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "vigentes", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "remove", null);
exports.PromocionesController = PromocionesController = __decorate([
    (0, common_1.Controller)('promociones')
], PromocionesController);
//# sourceMappingURL=promociones.controller.js.map