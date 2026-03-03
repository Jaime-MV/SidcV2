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
const mock_data_1 = require("../data/mock-data");
let VendedoresController = class VendedoresController {
    data = [...mock_data_1.vendedores];
    nextId = this.data.length + 1;
    findAll() {
        return this.data;
    }
    findOne(id) {
        return this.data.find(v => v.id === id) || { error: 'Vendedor no encontrado', id };
    }
    getRutas(id) {
        const rutasData = [...mock_data_1.rutas];
        return rutasData.filter(r => r.vendedorId === id);
    }
    create(body) {
        const nuevo = { id: this.nextId++, ...body };
        this.data.push(nuevo);
        return nuevo;
    }
    update(id, body) {
        const idx = this.data.findIndex(v => v.id === id);
        if (idx === -1)
            return { error: 'Vendedor no encontrado', id };
        this.data[idx] = { ...this.data[idx], ...body };
        return this.data[idx];
    }
    remove(id) {
        const idx = this.data.findIndex(v => v.id === id);
        if (idx === -1)
            return { error: 'Vendedor no encontrado', id };
        this.data[idx].activo = false;
        return { mensaje: 'Vendedor desactivado', id };
    }
};
exports.VendedoresController = VendedoresController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VendedoresController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VendedoresController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/rutas'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VendedoresController.prototype, "getRutas", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VendedoresController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], VendedoresController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VendedoresController.prototype, "remove", null);
exports.VendedoresController = VendedoresController = __decorate([
    (0, common_1.Controller)('vendedores')
], VendedoresController);
let RutasController = class RutasController {
    data = [...mock_data_1.rutas];
    nextId = this.data.length + 1;
    clientesData = [...mock_data_1.clientes];
    findAll() {
        return this.data.map(r => ({
            ...r,
            vendedor: mock_data_1.vendedores.find(v => v.id === r.vendedorId),
            clientes: r.clienteIds.map(cid => this.clientesData.find(c => c.id === cid)).filter(Boolean),
        }));
    }
    findOne(id) {
        const ruta = this.data.find(r => r.id === id);
        if (!ruta)
            return { error: 'Ruta no encontrada', id };
        return {
            ...ruta,
            vendedor: mock_data_1.vendedores.find(v => v.id === ruta.vendedorId),
            clientes: ruta.clienteIds.map(cid => this.clientesData.find(c => c.id === cid)).filter(Boolean),
        };
    }
    create(body) {
        const nueva = { id: this.nextId++, ...body };
        this.data.push(nueva);
        return nueva;
    }
    update(id, body) {
        const idx = this.data.findIndex(r => r.id === id);
        if (idx === -1)
            return { error: 'Ruta no encontrada', id };
        this.data[idx] = { ...this.data[idx], ...body };
        return this.data[idx];
    }
    remove(id) {
        const idx = this.data.findIndex(r => r.id === id);
        if (idx === -1)
            return { error: 'Ruta no encontrada', id };
        this.data.splice(idx, 1);
        return { mensaje: 'Ruta eliminada', id };
    }
};
exports.RutasController = RutasController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RutasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RutasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RutasController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], RutasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RutasController.prototype, "remove", null);
exports.RutasController = RutasController = __decorate([
    (0, common_1.Controller)('rutas')
], RutasController);
//# sourceMappingURL=rutas.controller.js.map