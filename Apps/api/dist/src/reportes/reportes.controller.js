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
const prisma_service_1 = require("../prisma/prisma.service");
let ReportesController = class ReportesController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async productosMasVendidos(limite) {
        const lim = parseInt(limite || '10');
        const detalles = await this.prisma.detalleVenta.findMany({
            include: { producto: true },
        });
        const map = {};
        detalles.forEach(d => {
            if (!map[d.productoId]) {
                map[d.productoId] = { producto: d.producto, totalCantidad: 0, totalMonto: 0 };
            }
            map[d.productoId].totalCantidad += d.cantidad;
            map[d.productoId].totalMonto += Number(d.subtotal);
        });
        return Object.values(map)
            .sort((a, b) => b.totalCantidad - a.totalCantidad)
            .slice(0, lim);
    }
    async ventasPorVendedor() {
        const vendedores = await this.prisma.vendedor.findMany({
            include: { ventas: true },
        });
        return vendedores.map(v => ({
            vendedor: { id: v.id, nombre: v.nombre, codigo: v.codigo },
            totalVentas: v.ventas.length,
            totalMonto: v.ventas.reduce((s, vt) => s + Number(vt.total), 0),
        })).sort((a, b) => b.totalMonto - a.totalMonto);
    }
    async ventasPorCliente() {
        const clientes = await this.prisma.cliente.findMany({
            include: { ventas: true },
        });
        return clientes.map(c => ({
            cliente: { id: c.id, nombre: c.nombre, tipo: c.tipo },
            totalVentas: c.ventas.length,
            totalMonto: c.ventas.reduce((s, v) => s + Number(v.total), 0),
        })).sort((a, b) => b.totalMonto - a.totalMonto);
    }
    async inventarioResumen() {
        const lotes = await this.prisma.lote.findMany({ include: { producto: true } });
        const hoy = new Date();
        const en30 = new Date();
        en30.setDate(en30.getDate() + 30);
        return {
            totalLotes: lotes.length,
            lotesVencidos: lotes.filter(l => new Date(l.fechaVencimiento) < hoy).length,
            lotesPorVencer30Dias: lotes.filter(l => {
                const exp = new Date(l.fechaVencimiento);
                return exp >= hoy && exp <= en30;
            }).length,
            stockTotal: lotes.reduce((s, l) => s + l.cantidad, 0),
            productos: lotes.map(l => ({
                lote: l.numero,
                producto: l.producto?.nombre,
                cantidad: l.cantidad,
                fechaVencimiento: l.fechaVencimiento,
                bodega: l.bodega,
                vencido: new Date(l.fechaVencimiento) < hoy,
            })),
        };
    }
    async dashboard() {
        const [ventas, clientes, cobros, devoluciones, facturas] = await Promise.all([
            this.prisma.venta.findMany(),
            this.prisma.cliente.findMany({ where: { activo: true } }),
            this.prisma.cobro.findMany(),
            this.prisma.devolucion.findMany(),
            this.prisma.factura.findMany(),
        ]);
        const totalVentas = ventas.length;
        const facturadas = ventas.filter(v => v.estado === 'FACTURADA').length;
        const pendientes = ventas.filter(v => v.estado === 'PENDIENTE').length;
        const montoTotalVentas = ventas.reduce((s, v) => s + Number(v.total), 0);
        const totalCobrado = cobros.reduce((s, c) => s + Number(c.monto), 0);
        const totalDevuelto = 0;
        const pendienteCobro = montoTotalVentas - totalCobrado;
        return {
            ventas: { total: totalVentas, facturadas, pendientes },
            financiero: {
                montoTotalVentas: Math.round(montoTotalVentas * 100) / 100,
                totalCobrado: Math.round(totalCobrado * 100) / 100,
                pendienteCobro: Math.round(pendienteCobro * 100) / 100,
                totalDevuelto: Math.round(totalDevuelto * 100) / 100,
            },
            clientes: {
                total: clientes.length,
                credito: clientes.filter(c => c.tipo === 'CREDITO').length,
                contado: clientes.filter(c => c.tipo === 'CONTADO').length,
            },
        };
    }
    async cuentasPorCobrar() {
        const clientes = await this.prisma.cliente.findMany({
            where: { tipo: 'CREDITO', activo: true },
        });
        return clientes
            .filter(c => Number(c.saldoCredito) > 0)
            .map(c => {
            const limite = Number(c.limiteCredito);
            const saldo = Number(c.saldoCredito);
            const porcentaje = limite > 0 ? Math.round((saldo / limite) * 100) : 0;
            let riesgo = 'BAJO';
            if (porcentaje >= 80)
                riesgo = 'ALTO';
            else if (porcentaje >= 50)
                riesgo = 'MEDIO';
            return {
                cliente: { id: c.id, nombre: c.nombre, limiteCredito: limite },
                saldoPendiente: saldo,
                porcentajeLimite: porcentaje,
                riesgo,
            };
        })
            .sort((a, b) => b.porcentajeLimite - a.porcentajeLimite);
    }
};
exports.ReportesController = ReportesController;
__decorate([
    (0, common_1.Get)('productos-mas-vendidos'),
    __param(0, (0, common_1.Query)('limite')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "productosMasVendidos", null);
__decorate([
    (0, common_1.Get)('ventas-por-vendedor'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "ventasPorVendedor", null);
__decorate([
    (0, common_1.Get)('ventas-por-cliente'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "ventasPorCliente", null);
__decorate([
    (0, common_1.Get)('inventario-resumen'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "inventarioResumen", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Get)('cuentas-por-cobrar'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "cuentasPorCobrar", null);
exports.ReportesController = ReportesController = __decorate([
    (0, common_1.Controller)('reportes'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportesController);
//# sourceMappingURL=reportes.controller.js.map