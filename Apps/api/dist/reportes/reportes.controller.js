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
exports.ReportesController = void 0;
const common_1 = require("@nestjs/common");
const mock_data_1 = require("../data/mock-data");
let ReportesController = class ReportesController {
    productosMasVendidos(limite) {
        const lim = parseInt(limite || '5');
        const conteo = {};
        for (const venta of mock_data_1.ventas) {
            if (venta.estado !== 'ANULADA') {
                for (const det of venta.detalles) {
                    if (!conteo[det.productoId])
                        conteo[det.productoId] = { cantidad: 0, monto: 0 };
                    conteo[det.productoId].cantidad += det.cantidad;
                    conteo[det.productoId].monto += det.subtotal;
                }
            }
        }
        return Object.entries(conteo)
            .map(([pid, data]) => ({
            producto: mock_data_1.productos.find(p => p.id === parseInt(pid)),
            totalCantidad: data.cantidad,
            totalMonto: parseFloat(data.monto.toFixed(2)),
        }))
            .sort((a, b) => b.totalCantidad - a.totalCantidad)
            .slice(0, lim);
    }
    ventasPorVendedor() {
        const result = {};
        for (const venta of mock_data_1.ventas) {
            if (venta.estado !== 'ANULADA') {
                if (!result[venta.vendedorId])
                    result[venta.vendedorId] = { totalVentas: 0, totalMonto: 0 };
                result[venta.vendedorId].totalVentas++;
                result[venta.vendedorId].totalMonto += venta.total;
            }
        }
        return Object.entries(result).map(([vid, data]) => ({
            vendedor: mock_data_1.vendedores.find(v => v.id === parseInt(vid)),
            totalVentas: data.totalVentas,
            totalMonto: parseFloat(data.totalMonto.toFixed(2)),
        }));
    }
    ventasPorCliente() {
        const result = {};
        for (const venta of mock_data_1.ventas) {
            if (venta.estado !== 'ANULADA') {
                if (!result[venta.clienteId])
                    result[venta.clienteId] = { totalVentas: 0, totalMonto: 0 };
                result[venta.clienteId].totalVentas++;
                result[venta.clienteId].totalMonto += venta.total;
            }
        }
        return Object.entries(result).map(([cid, data]) => ({
            cliente: mock_data_1.clientes.find(c => c.id === parseInt(cid)),
            totalVentas: data.totalVentas,
            totalMonto: parseFloat(data.totalMonto.toFixed(2)),
        })).sort((a, b) => b.totalMonto - a.totalMonto);
    }
    inventarioResumen() {
        const porBodega = {};
        for (const lote of mock_data_1.lotes) {
            if (!porBodega[lote.bodega])
                porBodega[lote.bodega] = { totalLotes: 0, totalProductos: 0 };
            porBodega[lote.bodega].totalLotes++;
            porBodega[lote.bodega].totalProductos += lote.cantidad;
        }
        const hoy = new Date();
        const vencidos = mock_data_1.lotes.filter(l => new Date(l.fechaVencimiento) < hoy).length;
        const porVencer30 = mock_data_1.lotes.filter(l => {
            const fv = new Date(l.fechaVencimiento);
            const limite = new Date();
            limite.setDate(limite.getDate() + 30);
            return fv >= hoy && fv <= limite;
        }).length;
        return {
            totalLotes: mock_data_1.lotes.length,
            lotesVencidos: vencidos,
            lotesPorVencer30Dias: porVencer30,
            porBodega,
        };
    }
    dashboard() {
        const totalVentas = mock_data_1.ventas.filter(v => v.estado !== 'ANULADA').length;
        const ventasFacturadas = mock_data_1.ventas.filter(v => v.estado === 'FACTURADA').length;
        const ventasPendientes = mock_data_1.ventas.filter(v => v.estado === 'PENDIENTE').length;
        const montoTotal = mock_data_1.ventas.filter(v => v.estado !== 'ANULADA').reduce((s, v) => s + v.total, 0);
        const totalCobrado = mock_data_1.cobros.reduce((s, c) => s + c.monto, 0);
        const totalDevuelto = mock_data_1.devoluciones.filter(d => d.estado === 'APROBADA').reduce((s, d) => s + d.totalDevuelto, 0);
        const clientesActivos = mock_data_1.clientes.filter(c => c.activo).length;
        const clientesCredito = mock_data_1.clientes.filter(c => c.tipo === 'CREDITO' && c.activo).length;
        return {
            ventas: { total: totalVentas, facturadas: ventasFacturadas, pendientes: ventasPendientes },
            financiero: {
                montoTotalVentas: parseFloat(montoTotal.toFixed(2)),
                totalCobrado: parseFloat(totalCobrado.toFixed(2)),
                pendienteCobro: parseFloat((montoTotal - totalCobrado).toFixed(2)),
                totalDevuelto: parseFloat(totalDevuelto.toFixed(2)),
            },
            clientes: { total: clientesActivos, credito: clientesCredito, contado: clientesActivos - clientesCredito },
            productos: { total: mock_data_1.productos.length, lotes: mock_data_1.lotes.length },
        };
    }
    cuentasPorCobrar() {
        return mock_data_1.clientes
            .filter(c => c.tipo === 'CREDITO' && c.saldoCredito > 0)
            .map(c => ({
            cliente: c,
            saldoPendiente: c.saldoCredito,
            porcentajeLimite: ((c.saldoCredito / c.limiteCredito) * 100).toFixed(1),
            riesgo: c.saldoCredito / c.limiteCredito > 0.8 ? 'ALTO' : c.saldoCredito / c.limiteCredito > 0.5 ? 'MEDIO' : 'BAJO',
        }));
    }
};
exports.ReportesController = ReportesController;
__decorate([
    (0, common_1.Get)('productos-mas-vendidos'),
    __param(0, (0, common_1.Query)('limite')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportesController.prototype, "productosMasVendidos", null);
__decorate([
    (0, common_1.Get)('ventas-por-vendedor'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportesController.prototype, "ventasPorVendedor", null);
__decorate([
    (0, common_1.Get)('ventas-por-cliente'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportesController.prototype, "ventasPorCliente", null);
__decorate([
    (0, common_1.Get)('inventario-resumen'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportesController.prototype, "inventarioResumen", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportesController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Get)('cuentas-por-cobrar'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportesController.prototype, "cuentasPorCobrar", null);
exports.ReportesController = ReportesController = __decorate([
    (0, common_1.Controller)('reportes')
], ReportesController);
//# sourceMappingURL=reportes.controller.js.map