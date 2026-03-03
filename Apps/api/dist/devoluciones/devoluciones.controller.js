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
const mock_data_1 = require("../data/mock-data");
const devolucionesData = [...mock_data_1.devoluciones];
let nextDevolucionId = devolucionesData.length + 1;
let DevolucionesController = class DevolucionesController {
    findAll() {
        return devolucionesData.map(d => ({
            ...d,
            cliente: mock_data_1.clientes.find(c => c.id === d.clienteId),
            ventaInfo: mock_data_1.ventas.find(v => v.id === d.ventaId),
            detallesEnriquecidos: d.detalles.map(det => ({
                ...det,
                producto: mock_data_1.productos.find(p => p.id === det.productoId),
            })),
        }));
    }
    pendientes() {
        return devolucionesData.filter(d => d.estado === 'PENDIENTE').map(d => ({
            ...d,
            cliente: mock_data_1.clientes.find(c => c.id === d.clienteId),
        }));
    }
    findOne(id) {
        const dev = devolucionesData.find(d => d.id === id);
        if (!dev)
            return { error: 'Devolución no encontrada', id };
        return {
            ...dev,
            cliente: mock_data_1.clientes.find(c => c.id === dev.clienteId),
            venta: mock_data_1.ventas.find(v => v.id === dev.ventaId),
            detallesEnriquecidos: dev.detalles.map(det => ({
                ...det,
                producto: mock_data_1.productos.find(p => p.id === det.productoId),
            })),
        };
    }
    create(body) {
        const venta = mock_data_1.ventas.find(v => v.id === body.ventaId);
        if (!venta)
            return { error: 'Venta no encontrada' };
        if (venta.estado === 'ANULADA')
            return { error: 'No se puede devolver una venta anulada' };
        const total = body.detalles.reduce((sum, d) => sum + d.monto, 0);
        const nuevaDevolucion = {
            id: nextDevolucionId++,
            ...body,
            totalDevuelto: total,
            fecha: body.fecha || new Date().toISOString().split('T')[0],
            estado: 'PENDIENTE',
        };
        devolucionesData.push(nuevaDevolucion);
        return nuevaDevolucion;
    }
    aprobar(id) {
        const dev = devolucionesData.find(d => d.id === id);
        if (!dev)
            return { error: 'Devolución no encontrada' };
        if (dev.estado !== 'PENDIENTE')
            return { error: 'Solo se pueden aprobar devoluciones pendientes' };
        dev.estado = 'APROBADA';
        return { mensaje: 'Devolución aprobada', devolucion: dev };
    }
    rechazar(id) {
        const dev = devolucionesData.find(d => d.id === id);
        if (!dev)
            return { error: 'Devolución no encontrada' };
        if (dev.estado !== 'PENDIENTE')
            return { error: 'Solo se pueden rechazar devoluciones pendientes' };
        dev.estado = 'RECHAZADA';
        return { mensaje: 'Devolución rechazada', devolucion: dev };
    }
};
exports.DevolucionesController = DevolucionesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DevolucionesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pendientes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DevolucionesController.prototype, "pendientes", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DevolucionesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DevolucionesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id/aprobar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DevolucionesController.prototype, "aprobar", null);
__decorate([
    (0, common_1.Put)(':id/rechazar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DevolucionesController.prototype, "rechazar", null);
exports.DevolucionesController = DevolucionesController = __decorate([
    (0, common_1.Controller)('devoluciones')
], DevolucionesController);
//# sourceMappingURL=devoluciones.controller.js.map