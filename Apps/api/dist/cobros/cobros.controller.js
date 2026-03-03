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
exports.CobrosController = void 0;
const common_1 = require("@nestjs/common");
const mock_data_1 = require("../data/mock-data");
const cobrosData = [...mock_data_1.cobros];
let nextCobroId = cobrosData.length + 1;
let CobrosController = class CobrosController {
    findAll(clienteId, metodoPago) {
        let result = cobrosData.map(c => ({
            ...c,
            cliente: mock_data_1.clientes.find(cl => cl.id === c.clienteId),
        }));
        if (clienteId)
            result = result.filter(c => c.clienteId === parseInt(clienteId));
        if (metodoPago)
            result = result.filter(c => c.metodoPago === metodoPago.toUpperCase());
        return result;
    }
    resumen() {
        const total = cobrosData.reduce((sum, c) => sum + c.monto, 0);
        const porMetodo = cobrosData.reduce((acc, c) => {
            acc[c.metodoPago] = (acc[c.metodoPago] || 0) + c.monto;
            return acc;
        }, {});
        return { totalCobrado: total.toFixed(2), porMetodo, totalCobros: cobrosData.length };
    }
    findOne(id) {
        const cobro = cobrosData.find(c => c.id === id);
        if (!cobro)
            return { error: 'Cobro no encontrado', id };
        return { ...cobro, cliente: mock_data_1.clientes.find(c => c.id === cobro.clienteId) };
    }
    create(body) {
        const cliente = mock_data_1.clientes.find(c => c.id === body.clienteId);
        if (!cliente)
            return { error: 'Cliente no encontrado' };
        const nuevoCobro = {
            id: nextCobroId++,
            ...body,
            fecha: body.fecha || new Date().toISOString().split('T')[0],
        };
        cobrosData.push(nuevoCobro);
        return { mensaje: 'Cobro registrado exitosamente', cobro: nuevoCobro };
    }
};
exports.CobrosController = CobrosController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('clienteId')),
    __param(1, (0, common_1.Query)('metodoPago')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CobrosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('resumen'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CobrosController.prototype, "resumen", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CobrosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CobrosController.prototype, "create", null);
exports.CobrosController = CobrosController = __decorate([
    (0, common_1.Controller)('cobros')
], CobrosController);
//# sourceMappingURL=cobros.controller.js.map