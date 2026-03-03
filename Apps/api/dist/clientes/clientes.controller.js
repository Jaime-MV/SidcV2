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
exports.ClientesController = void 0;
const common_1 = require("@nestjs/common");
const mock_data_1 = require("../data/mock-data");
let ClientesController = class ClientesController {
    data = [...mock_data_1.clientes];
    nextId = this.data.length + 1;
    findAll(tipo, activo) {
        let result = [...this.data];
        if (tipo)
            result = result.filter(c => c.tipo === tipo.toUpperCase());
        if (activo !== undefined)
            result = result.filter(c => c.activo === (activo === 'true'));
        return result;
    }
    conCreditoDisponible() {
        return this.data
            .filter(c => c.tipo === 'CREDITO' && c.activo)
            .map(c => ({
            ...c,
            creditoDisponible: c.limiteCredito - c.saldoCredito,
            porcentajeUsado: ((c.saldoCredito / c.limiteCredito) * 100).toFixed(1),
        }));
    }
    findOne(id) {
        const item = this.data.find(c => c.id === id);
        if (!item)
            return { error: 'Cliente no encontrado', id };
        return {
            ...item,
            creditoDisponible: item.tipo === 'CREDITO' ? item.limiteCredito - item.saldoCredito : null,
        };
    }
    create(body) {
        const nuevo = { id: this.nextId++, ...body, saldoCredito: body.saldoCredito ?? 0 };
        this.data.push(nuevo);
        return nuevo;
    }
    update(id, body) {
        const idx = this.data.findIndex(c => c.id === id);
        if (idx === -1)
            return { error: 'Cliente no encontrado', id };
        if (body.saldoCredito !== undefined && this.data[idx].tipo === 'CREDITO') {
            const nuevoSaldo = body.saldoCredito;
            const limite = body.limiteCredito ?? this.data[idx].limiteCredito;
            if (nuevoSaldo > limite) {
                return { error: 'El saldo supera el límite de crédito', limite, saldo: nuevoSaldo };
            }
        }
        this.data[idx] = { ...this.data[idx], ...body };
        return this.data[idx];
    }
    remove(id) {
        const idx = this.data.findIndex(c => c.id === id);
        if (idx === -1)
            return { error: 'Cliente no encontrado', id };
        this.data[idx].activo = false;
        return { mensaje: 'Cliente desactivado', id };
    }
};
exports.ClientesController = ClientesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('tipo')),
    __param(1, (0, common_1.Query)('activo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('con-credito-disponible'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "conCreditoDisponible", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "remove", null);
exports.ClientesController = ClientesController = __decorate([
    (0, common_1.Controller)('clientes')
], ClientesController);
//# sourceMappingURL=clientes.controller.js.map