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
const mock_data_1 = require("../data/mock-data");
let ProductosController = class ProductosController {
    data = [...mock_data_1.productos];
    lotesData = [...mock_data_1.lotes];
    nextId = this.data.length + 1;
    findAll(categoriaId, activo) {
        let result = [...this.data];
        if (categoriaId)
            result = result.filter(p => p.categoriaId === parseInt(categoriaId));
        if (activo !== undefined)
            result = result.filter(p => p.activo === (activo === 'true'));
        return result;
    }
    bajoStock(limite) {
        const limiteNum = parseInt(limite || '50');
        return this.lotesData
            .filter(l => l.cantidad < limiteNum)
            .map(l => ({ ...l, producto: this.data.find(p => p.id === l.productoId) }));
    }
    proximosVencer(dias) {
        const diasNum = parseInt(dias || '30');
        const hoy = new Date();
        const limite = new Date();
        limite.setDate(limite.getDate() + diasNum);
        return this.lotesData
            .filter(l => {
            const fv = new Date(l.fechaVencimiento);
            return fv >= hoy && fv <= limite;
        })
            .map(l => ({ ...l, producto: this.data.find(p => p.id === l.productoId) }));
    }
    findOne(id) {
        const item = this.data.find(p => p.id === id);
        if (!item)
            return { error: 'Producto no encontrado', id };
        const lotesProducto = this.lotesData.filter(l => l.productoId === id);
        return { ...item, lotes: lotesProducto };
    }
    create(body) {
        const nuevo = { id: this.nextId++, ...body };
        this.data.push(nuevo);
        return nuevo;
    }
    update(id, body) {
        const idx = this.data.findIndex(p => p.id === id);
        if (idx === -1)
            return { error: 'Producto no encontrado', id };
        this.data[idx] = { ...this.data[idx], ...body };
        return this.data[idx];
    }
    remove(id) {
        const idx = this.data.findIndex(p => p.id === id);
        if (idx === -1)
            return { error: 'Producto no encontrado', id };
        this.data[idx].activo = false;
        return { mensaje: 'Producto desactivado', id };
    }
};
exports.ProductosController = ProductosController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('categoriaId')),
    __param(1, (0, common_1.Query)('activo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('bajo-stock'),
    __param(0, (0, common_1.Query)('limite')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "bajoStock", null);
__decorate([
    (0, common_1.Get)('proximos-vencer'),
    __param(0, (0, common_1.Query)('dias')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "proximosVencer", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "remove", null);
exports.ProductosController = ProductosController = __decorate([
    (0, common_1.Controller)('productos')
], ProductosController);
let LotesController = class LotesController {
    data = [...mock_data_1.lotes];
    nextId = this.data.length + 1;
    findAll(productoId, bodega) {
        let result = [...this.data];
        if (productoId)
            result = result.filter(l => l.productoId === parseInt(productoId));
        if (bodega)
            result = result.filter(l => l.bodega === bodega);
        return result;
    }
    findOne(id) {
        return this.data.find(l => l.id === id) || { error: 'Lote no encontrado', id };
    }
    create(body) {
        const nuevo = { id: this.nextId++, ...body };
        this.data.push(nuevo);
        return nuevo;
    }
    update(id, body) {
        const idx = this.data.findIndex(l => l.id === id);
        if (idx === -1)
            return { error: 'Lote no encontrado', id };
        this.data[idx] = { ...this.data[idx], ...body };
        return this.data[idx];
    }
};
exports.LotesController = LotesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('productoId')),
    __param(1, (0, common_1.Query)('bodega')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LotesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LotesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LotesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], LotesController.prototype, "update", null);
exports.LotesController = LotesController = __decorate([
    (0, common_1.Controller)('lotes')
], LotesController);
//# sourceMappingURL=productos.controller.js.map