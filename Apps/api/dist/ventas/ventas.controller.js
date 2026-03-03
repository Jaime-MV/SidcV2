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
exports.FacturasController = exports.VentasController = void 0;
const common_1 = require("@nestjs/common");
const mock_data_1 = require("../data/mock-data");
const ventasData = [...mock_data_1.ventas];
const facturasData = [...mock_data_1.facturas];
const lotesData = [...mock_data_1.lotes];
let nextVentaId = ventasData.length + 1;
let nextFacturaId = facturasData.length + 1;
let facturaNumero = facturasData.length + 1;
let VentasController = class VentasController {
    findAll(estado, clienteId) {
        let result = ventasData.map(v => ({
            ...v,
            cliente: mock_data_1.clientes.find(c => c.id === v.clienteId),
            vendedor: mock_data_1.vendedores.find(vnd => vnd.id === v.vendedorId),
        }));
        if (estado)
            result = result.filter(v => v.estado === estado.toUpperCase());
        if (clienteId)
            result = result.filter(v => v.clienteId === parseInt(clienteId));
        return result;
    }
    findOne(id) {
        const venta = ventasData.find(v => v.id === id);
        if (!venta)
            return { error: 'Venta no encontrada', id };
        return {
            ...venta,
            cliente: mock_data_1.clientes.find(c => c.id === venta.clienteId),
            vendedor: mock_data_1.vendedores.find(v => v.id === venta.vendedorId),
            detallesEnriquecidos: venta.detalles.map(d => ({
                ...d,
                producto: mock_data_1.productos.find(p => p.id === d.productoId),
                lote: lotesData.find(l => l.id === d.loteId),
            })),
        };
    }
    create(body) {
        const cliente = mock_data_1.clientes.find(c => c.id === body.clienteId);
        if (!cliente)
            return { error: 'Cliente no encontrado' };
        if (!cliente.activo)
            return { error: 'Cliente inactivo' };
        for (const detalle of body.detalles) {
            const lote = lotesData.find(l => l.id === detalle.loteId);
            if (!lote)
                return { error: `Lote ${detalle.loteId} no encontrado` };
            if (lote.cantidad < detalle.cantidad) {
                return { error: `Stock insuficiente en lote ${lote.numero}. Disponible: ${lote.cantidad}` };
            }
            const hoy = new Date();
            if (new Date(lote.fechaVencimiento) < hoy) {
                return { error: `Lote ${lote.numero} está vencido` };
            }
        }
        const total = body.detalles.reduce((s, d) => s + d.subtotal, 0);
        if (body.tipo === 'CREDITO' && cliente.tipo === 'CREDITO') {
            if (cliente.saldoCredito + total > cliente.limiteCredito) {
                return { error: 'Límite de crédito excedido', disponible: cliente.limiteCredito - cliente.saldoCredito, total };
            }
        }
        for (const detalle of body.detalles) {
            const loteIdx = lotesData.findIndex(l => l.id === detalle.loteId);
            if (loteIdx !== -1)
                lotesData[loteIdx].cantidad -= detalle.cantidad;
        }
        const nuevaVenta = {
            id: nextVentaId++,
            clienteId: body.clienteId,
            vendedorId: body.vendedorId,
            rutaId: body.rutaId,
            fecha: new Date().toISOString().split('T')[0],
            estado: 'PENDIENTE',
            tipo: body.tipo,
            detalles: body.detalles,
            total,
        };
        ventasData.push(nuevaVenta);
        return nuevaVenta;
    }
    facturar(id) {
        const venta = ventasData.find(v => v.id === id);
        if (!venta)
            return { error: 'Venta no encontrada' };
        if (venta.estado !== 'PENDIENTE')
            return { error: 'Solo se pueden facturar ventas pendientes' };
        venta.estado = 'FACTURADA';
        const factura = {
            id: nextFacturaId++,
            ventaId: id,
            numero: `FAC-2025-${String(facturaNumero++).padStart(4, '0')}`,
            fecha: new Date().toISOString().split('T')[0],
            total: venta.total,
            estado: venta.tipo === 'CONTADO' ? 'PAGADA' : 'PENDIENTE',
            tipo: venta.tipo,
        };
        facturasData.push(factura);
        return { mensaje: 'Venta facturada', venta, factura };
    }
    anular(id) {
        const venta = ventasData.find(v => v.id === id);
        if (!venta)
            return { error: 'Venta no encontrada' };
        if (venta.estado === 'ANULADA')
            return { error: 'Venta ya está anulada' };
        venta.estado = 'ANULADA';
        return { mensaje: 'Venta anulada', id };
    }
};
exports.VentasController = VentasController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('estado')),
    __param(1, (0, common_1.Query)('clienteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], VentasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VentasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VentasController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id/facturar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VentasController.prototype, "facturar", null);
__decorate([
    (0, common_1.Put)(':id/anular'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VentasController.prototype, "anular", null);
exports.VentasController = VentasController = __decorate([
    (0, common_1.Controller)('ventas')
], VentasController);
let FacturasController = class FacturasController {
    findAll(estado) {
        let result = facturasData.map(f => ({
            ...f,
            venta: ventasData.find(v => v.id === f.ventaId),
            cliente: mock_data_1.clientes.find(c => {
                const venta = ventasData.find(v => v.id === f.ventaId);
                return venta ? c.id === venta.clienteId : false;
            }),
        }));
        if (estado)
            result = result.filter(f => f.estado === estado.toUpperCase());
        return result;
    }
    pendientes() {
        return facturasData
            .filter(f => f.estado === 'PENDIENTE')
            .map(f => {
            const venta = ventasData.find(v => v.id === f.ventaId);
            return {
                ...f,
                cliente: venta ? mock_data_1.clientes.find(c => c.id === venta.clienteId) : null,
            };
        });
    }
    findOne(id) {
        const factura = facturasData.find(f => f.id === id);
        if (!factura)
            return { error: 'Factura no encontrada', id };
        const venta = ventasData.find(v => v.id === factura.ventaId);
        return {
            ...factura,
            venta,
            cliente: venta ? mock_data_1.clientes.find(c => c.id === venta.clienteId) : null,
        };
    }
};
exports.FacturasController = FacturasController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('estado')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FacturasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pendientes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FacturasController.prototype, "pendientes", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FacturasController.prototype, "findOne", null);
exports.FacturasController = FacturasController = __decorate([
    (0, common_1.Controller)('facturas')
], FacturasController);
//# sourceMappingURL=ventas.controller.js.map