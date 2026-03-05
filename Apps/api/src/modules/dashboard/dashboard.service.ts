import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private readonly prisma: PrismaService) { }

    /** KPIs generales del sistema para el Overview */
    async getStats() {
        const now = new Date();
        const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);
        const inicioMesAnterior = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const finMesAnterior = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

        const [
            ventasMesRaw,
            ventasMesAnteriorRaw,
            facturasPendientes,
            facturasVencidas,
            clientesActivos,
            clientesBloqueados,
            rutasActivas,
            rutasCompletadas,
            productosProxVencer,
            productosStockBajo,
            cobrosVencidosRaw,
            topProductos,
        ] = await Promise.all([
            // Ventas del mes actual
            this.prisma.venta.aggregate({
                _sum: { total: true },
                where: { fecha: { gte: inicioMes }, estado: 'COMPLETADA' },
            }),
            // Ventas del mes anterior
            this.prisma.venta.aggregate({
                _sum: { total: true },
                where: { fecha: { gte: inicioMesAnterior, lte: finMesAnterior }, estado: 'COMPLETADA' },
            }),
            // Facturas pendientes
            this.prisma.factura.count({ where: { estado: { in: ['CREADA', 'PAGADA_PARCIALMENTE'] } } }),
            // Facturas vencidas
            this.prisma.factura.count({ where: { estado: 'VENCIDA' } }),
            // Clientes activos
            this.prisma.cliente.count({ where: { estado: 'ACTIVO' } }),
            // Clientes bloqueados
            this.prisma.cliente.count({ where: { estado: 'BLOQUEADO' } }),
            // Rutas activas (EN_RUTA)
            this.prisma.ruta.count({ where: { estado: 'EN_RUTA' } }),
            // Rutas completadas
            this.prisma.ruta.count({ where: { estado: 'COMPLETADA' } }),
            // Productos por vencer en 30 días
            this.prisma.lote.count({
                where: {
                    cantidadDisponible: { gt: 0 },
                    fechaVencimiento: {
                        lte: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
                        gt: now,
                    },
                },
            }),
            // Productos con stock bajo (genérico)
            this.prisma.lote.count({
                where: { cantidadDisponible: { gt: 0, lte: 10 } },
            }),
            // Cobros vencidos
            this.prisma.cobro.aggregate({
                _count: { id: true },
                _sum: { monto: true },
                where: { estado: 'VENCIDO' },
            }),
            // Top productos más vendidos desde EstadisticaProducto
            this.prisma.estadisticaProducto.findMany({
                take: 6,
                orderBy: { totalVendido: 'desc' },
                include: { producto: { include: { categoria: true } } },
            }),
        ]);

        // Si no hay datos de ventas en el mes actual, usar ResumenMensual
        let ventasMes = Number(ventasMesRaw._sum.total ?? 0);
        let ventasMesAnterior = Number(ventasMesAnteriorRaw._sum.total ?? 0);

        if (ventasMes === 0) {
            const resumenActual = await this.prisma.resumenMensual.findFirst({
                where: { anio: now.getFullYear(), mes: now.getMonth() + 1 },
            });
            if (resumenActual) ventasMes = Number(resumenActual.ventas);
        }
        if (ventasMesAnterior === 0) {
            const mesAnt = now.getMonth() === 0 ? 12 : now.getMonth();
            const anioAnt = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
            const resumenAnterior = await this.prisma.resumenMensual.findFirst({
                where: { anio: anioAnt, mes: mesAnt },
            });
            if (resumenAnterior) ventasMesAnterior = Number(resumenAnterior.ventas);
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

    /** 
     * Serie temporal de ventas vs cobros de los últimos N meses.
     * Prioriza la tabla ResumenMensual (datos históricos precalculados).
     * Si no hay datos suficientes, complementa con cálculo en tiempo real.
     */
    async getVentasMensuales(meses = 6) {
        // 1. Intentar desde ResumenMensual (ordenado cronológicamente)
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

        // 2. Fallback: calcular en tiempo real desde Venta/Cobro/Devolucion
        const resultado: { mesLabel: string; ventas: number; cobros: number; devoluciones: number }[] = [];

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

    /**
     * Ventas agrupadas por categoría de producto (porcentaje).
     * Prioriza EstadisticaProducto → fallback a categorías con colorHex.
     */
    async getVentasPorCategoria() {
        // 1. Intentar desde EstadisticaProducto (datos precalculados)
        const estadisticas = await this.prisma.estadisticaProducto.findMany({
            include: { producto: { include: { categoria: true } } },
        });

        if (estadisticas.length > 0) {
            const totalPorCategoria: Record<string, { valor: number; color: string }> = {};
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

        // 2. Fallback: calcular desde DetalleVenta
        const detalles = await this.prisma.detalleVenta.findMany({
            include: { producto: { include: { categoria: true } } },
        });

        const totalPorCategoria: Record<string, { valor: number; color: string }> = {};
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
            // 3. Último fallback: devolver categorías con distribución fija
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
}
