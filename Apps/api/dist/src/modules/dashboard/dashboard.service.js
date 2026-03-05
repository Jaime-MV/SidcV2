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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        const now = new Date();
        const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);
        const inicioMesAnterior = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const finMesAnterior = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        const [ventasMesRaw, ventasMesAnteriorRaw, facturasPendientes, facturasVencidas, clientesActivos, clientesBloqueados, rutasActivas, rutasCompletadas, productosProxVencer, productosStockBajo, cobrosVencidosRaw, topProductos,] = await Promise.all([
            this.prisma.venta.aggregate({
                _sum: { total: true },
                where: { fecha: { gte: inicioMes }, estado: 'COMPLETADA' },
            }),
            this.prisma.venta.aggregate({
                _sum: { total: true },
                where: { fecha: { gte: inicioMesAnterior, lte: finMesAnterior }, estado: 'COMPLETADA' },
            }),
            this.prisma.factura.count({ where: { estado: { in: ['CREADA', 'PAGADA_PARCIALMENTE'] } } }),
            this.prisma.factura.count({ where: { estado: 'VENCIDA' } }),
            this.prisma.cliente.count({ where: { estado: 'ACTIVO' } }),
            this.prisma.cliente.count({ where: { estado: 'BLOQUEADO' } }),
            this.prisma.ruta.count({ where: { estado: 'EN_RUTA' } }),
            this.prisma.ruta.count({ where: { estado: 'COMPLETADA' } }),
            this.prisma.lote.count({
                where: {
                    cantidadDisponible: { gt: 0 },
                    fechaVencimiento: {
                        lte: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
                        gt: now,
                    },
                },
            }),
            this.prisma.lote.count({
                where: { cantidadDisponible: { gt: 0, lte: 10 } },
            }),
            this.prisma.cobro.aggregate({
                _count: { id: true },
                _sum: { monto: true },
                where: { estado: 'VENCIDO' },
            }),
            this.prisma.estadisticaProducto.findMany({
                take: 6,
                orderBy: { totalVendido: 'desc' },
                include: { producto: { include: { categoria: true } } },
            }),
        ]);
        let ventasMes = Number(ventasMesRaw._sum.total ?? 0);
        let ventasMesAnterior = Number(ventasMesAnteriorRaw._sum.total ?? 0);
        if (ventasMes === 0) {
            const resumenActual = await this.prisma.resumenMensual.findFirst({
                where: { anio: now.getFullYear(), mes: now.getMonth() + 1 },
            });
            if (resumenActual)
                ventasMes = Number(resumenActual.ventas);
        }
        if (ventasMesAnterior === 0) {
            const mesAnt = now.getMonth() === 0 ? 12 : now.getMonth();
            const anioAnt = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
            const resumenAnterior = await this.prisma.resumenMensual.findFirst({
                where: { anio: anioAnt, mes: mesAnt },
            });
            if (resumenAnterior)
                ventasMesAnterior = Number(resumenAnterior.ventas);
        }
        return {
            ventasMes,
            ventasMesAnterior,
            facturasPendientes,
            facturasVencidas,
            clientesActivos,
            clientesBloqueados,
            rutasActivas,
            rutasCompletadas,
            productosVencer: productosProxVencer,
            productosStockBajo,
            cobrosVencidos: cobrosVencidosRaw._count.id,
            montoVencido: Number(cobrosVencidosRaw._sum.monto ?? 0),
            productosMasVendidos: topProductos.map((e) => ({
                nombre: e.producto.nombre,
                unidades: Number(e.totalVendido),
                ingresos: Number(e.ingresos ?? 0),
            })),
        };
    }
    async getVentasMensuales(meses = 6) {
        const resumen = await this.prisma.resumenMensual.findMany({
            orderBy: [{ anio: 'asc' }, { mes: 'asc' }],
            take: meses,
        });
        if (resumen.length >= meses) {
            return resumen.slice(-meses).map((r) => ({
                mesLabel: r.mesLabel,
                ventas: Number(r.ventas),
                cobros: Number(r.cobros),
                devoluciones: Number(r.devoluciones),
            }));
        }
        const resultado = [];
        for (let i = meses - 1; i >= 0; i--) {
            const now = new Date();
            const inicio = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const fin = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
            const [ventasAgg, cobrosAgg, devolucionesAgg] = await Promise.all([
                this.prisma.venta.aggregate({
                    _sum: { total: true },
                    where: { fecha: { gte: inicio, lte: fin }, estado: 'COMPLETADA' },
                }),
                this.prisma.cobro.aggregate({
                    _sum: { monto: true },
                    where: { fecha: { gte: inicio, lte: fin } },
                }),
                this.prisma.devolucion.aggregate({
                    _sum: { monto: true },
                    where: { fecha: { gte: inicio, lte: fin } },
                }),
            ]);
            resultado.push({
                mesLabel: inicio.toLocaleDateString('es-SV', { month: 'short', year: '2-digit' }),
                ventas: Number(ventasAgg._sum.total ?? 0),
                cobros: Number(cobrosAgg._sum.monto ?? 0),
                devoluciones: Number(devolucionesAgg._sum.monto ?? 0),
            });
        }
        return resultado;
    }
    async getVentasPorCategoria() {
        const estadisticas = await this.prisma.estadisticaProducto.findMany({
            include: { producto: { include: { categoria: true } } },
        });
        if (estadisticas.length > 0) {
            const totalPorCategoria = {};
            let totalGeneral = 0;
            for (const est of estadisticas) {
                const cat = est.producto.categoria.nombre;
                const color = est.producto.categoria.colorHex ?? '#6b7280';
                const valor = Number(est.ingresos ?? est.totalVendido);
                totalPorCategoria[cat] = {
                    valor: (totalPorCategoria[cat]?.valor ?? 0) + valor,
                    color,
                };
                totalGeneral += valor;
            }
            if (totalGeneral > 0) {
                return Object.entries(totalPorCategoria).map(([categoria, { valor, color }]) => ({
                    categoria,
                    valor: Math.round((valor / totalGeneral) * 100),
                    valorAbsoluto: valor,
                    color,
                }));
            }
        }
        const detalles = await this.prisma.detalleVenta.findMany({
            include: { producto: { include: { categoria: true } } },
        });
        const totalPorCategoria = {};
        let totalGeneral = 0;
        for (const detalle of detalles) {
            const cat = detalle.producto.categoria.nombre;
            const color = detalle.producto.categoria.colorHex ?? '#6b7280';
            const valor = Number(detalle.subtotal);
            totalPorCategoria[cat] = {
                valor: (totalPorCategoria[cat]?.valor ?? 0) + valor,
                color,
            };
            totalGeneral += valor;
        }
        if (totalGeneral === 0) {
            const categorias = await this.prisma.categoria.findMany();
            const distribuciones = [38, 22, 18, 14, 8];
            return categorias.slice(0, 5).map((cat, i) => ({
                categoria: cat.nombre,
                valor: distribuciones[i] ?? 5,
                valorAbsoluto: 0,
                color: cat.colorHex ?? '#6b7280',
            }));
        }
        return Object.entries(totalPorCategoria).map(([categoria, { valor, color }]) => ({
            categoria,
            valor: Math.round((valor / totalGeneral) * 100),
            valorAbsoluto: valor,
            color,
        }));
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map