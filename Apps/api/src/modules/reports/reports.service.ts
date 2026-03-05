import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

interface FiltrosReporte {
    dias?: string[];       // "2026-03-01"
    semanas?: string[];    // "2026-W10"
    anios?: number[];      // 2026
}

@Injectable()
export class ReportsService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Genera un análisis completo del negocio filtrado por días, semanas y/o años.
     * Si no se envía ningún filtro, analiza todo el histórico.
     */
    async getReporteGeneral(filtros: FiltrosReporte) {
        const dateRanges = this.buildDateRanges(filtros);
        const where = dateRanges.length > 0
            ? { fecha: { OR: dateRanges.map(r => ({ gte: r.start, lte: r.end })) } }
            : {};

        // Build Prisma-compatible date filter
        const ventaWhere: Prisma.VentaWhereInput = dateRanges.length > 0
            ? { OR: dateRanges.map(r => ({ fecha: { gte: r.start, lte: r.end } })) }
            : {};

        const cobroWhere: Prisma.CobroWhereInput = dateRanges.length > 0
            ? { OR: dateRanges.map(r => ({ fecha: { gte: r.start, lte: r.end } })) }
            : {};

        const devolucionWhere: Prisma.DevolucionWhereInput = dateRanges.length > 0
            ? { OR: dateRanges.map(r => ({ fecha: { gte: r.start, lte: r.end } })) }
            : {};

        const movimientoWhere: Prisma.MovimientoInventarioWhereInput = dateRanges.length > 0
            ? { OR: dateRanges.map(r => ({ fechaMovimiento: { gte: r.start, lte: r.end } })) }
            : {};

        // ═══════════════════════════════════════════════════════
        // 1. RESUMEN DE VENTAS
        // ═══════════════════════════════════════════════════════
        const [
            ventasAgg,
            ventasCount,
            ventasCompletadas,
            ventasAnuladas,
            ventasPendientes,
        ] = await Promise.all([
            this.prisma.venta.aggregate({
                _sum: { total: true, subtotal: true, descuentoTotal: true },
                _avg: { total: true },
                _max: { total: true },
                _min: { total: true },
                where: { ...ventaWhere, estado: 'COMPLETADA' },
            }),
            this.prisma.venta.count({ where: ventaWhere }),
            this.prisma.venta.count({ where: { ...ventaWhere, estado: 'COMPLETADA' } }),
            this.prisma.venta.count({ where: { ...ventaWhere, estado: 'ANULADA' } }),
            this.prisma.venta.count({ where: { ...ventaWhere, estado: 'PENDIENTE' } }),
        ]);

        // ═══════════════════════════════════════════════════════
        // 2. FACTURACIÓN
        // ═══════════════════════════════════════════════════════
        const facturaWhere: Prisma.FacturaWhereInput = dateRanges.length > 0
            ? { OR: dateRanges.map(r => ({ fechaEmision: { gte: r.start, lte: r.end } })) }
            : {};

        const [facturasPagadas, facturasPendientes, facturasVencidas, facturasTotal] = await Promise.all([
            this.prisma.factura.aggregate({
                _sum: { total: true }, _count: { id: true },
                where: { ...facturaWhere, estado: 'PAGADA' },
            }),
            this.prisma.factura.aggregate({
                _sum: { total: true }, _count: { id: true },
                where: { ...facturaWhere, estado: { in: ['CREADA', 'PAGADA_PARCIALMENTE'] } },
            }),
            this.prisma.factura.aggregate({
                _sum: { total: true }, _count: { id: true },
                where: { ...facturaWhere, estado: 'VENCIDA' },
            }),
            this.prisma.factura.count({ where: facturaWhere }),
        ]);

        // ═══════════════════════════════════════════════════════
        // 3. COBROS
        // ═══════════════════════════════════════════════════════
        const [cobrosCobrados, cobrosPendientes, cobrosVencidos] = await Promise.all([
            this.prisma.cobro.aggregate({
                _sum: { monto: true }, _count: { id: true },
                where: { ...cobroWhere, estado: 'COBRADO' },
            }),
            this.prisma.cobro.aggregate({
                _sum: { monto: true }, _count: { id: true },
                where: { ...cobroWhere, estado: 'PENDIENTE' },
            }),
            this.prisma.cobro.aggregate({
                _sum: { monto: true }, _count: { id: true },
                where: { ...cobroWhere, estado: 'VENCIDO' },
            }),
        ]);

        // ═══════════════════════════════════════════════════════
        // 4. DEVOLUCIONES
        // ═══════════════════════════════════════════════════════
        const devolucionesAgg = await this.prisma.devolucion.aggregate({
            _sum: { monto: true, cantidad: true },
            _count: { id: true },
            where: devolucionWhere,
        });

        // ═══════════════════════════════════════════════════════
        // 5. TOP PRODUCTOS MÁS VENDIDOS (por unidades)
        // ═══════════════════════════════════════════════════════
        const detalleWhereForProducts: Prisma.DetalleVentaWhereInput = dateRanges.length > 0
            ? { venta: { OR: dateRanges.map(r => ({ fecha: { gte: r.start, lte: r.end } })) } }
            : {};

        const detallesVenta = await this.prisma.detalleVenta.groupBy({
            by: ['productoId'],
            _sum: { cantidad: true, subtotal: true },
            where: detalleWhereForProducts,
            orderBy: { _sum: { cantidad: 'desc' } },
            take: 10,
        });

        const productoIds = detallesVenta.map(d => d.productoId);
        const productosMap = new Map(
            (await this.prisma.producto.findMany({
                where: { id: { in: productoIds } },
                include: { categoria: true },
            })).map(p => [p.id, p]),
        );

        const topProductos = detallesVenta.map(d => {
            const prod = productosMap.get(d.productoId);
            return {
                productoId: d.productoId,
                nombre: prod?.nombre ?? 'Desconocido',
                codigo: prod?.codigo,
                categoria: prod?.categoria?.nombre ?? '—',
                unidadesVendidas: d._sum.cantidad ?? 0,
                ingresos: Number(d._sum.subtotal ?? 0),
            };
        });

        // ═══════════════════════════════════════════════════════
        // 6. VENTAS POR CATEGORÍA
        // ═══════════════════════════════════════════════════════
        const allDetalles = await this.prisma.detalleVenta.findMany({
            where: detalleWhereForProducts,
            include: { producto: { include: { categoria: true } } },
        });

        const categoriasMap: Record<string, { cantidad: number; ingresos: number; color: string }> = {};
        for (const det of allDetalles) {
            const cat = det.producto.categoria.nombre;
            const color = det.producto.categoria.colorHex ?? '#6b7280';
            if (!categoriasMap[cat]) categoriasMap[cat] = { cantidad: 0, ingresos: 0, color };
            categoriasMap[cat].cantidad += det.cantidad;
            categoriasMap[cat].ingresos += Number(det.subtotal);
        }

        const ventasPorCategoria = Object.entries(categoriasMap)
            .map(([categoria, data]) => ({ categoria, ...data }))
            .sort((a, b) => b.ingresos - a.ingresos);

        // ═══════════════════════════════════════════════════════
        // 7. VENTAS POR VENDEDOR
        // ═══════════════════════════════════════════════════════
        const ventasPorVendedorRaw = await this.prisma.venta.groupBy({
            by: ['vendedorId'],
            _sum: { total: true },
            _count: { id: true },
            where: { ...ventaWhere, estado: 'COMPLETADA' },
            orderBy: { _sum: { total: 'desc' } },
        });

        const vendedorIds = ventasPorVendedorRaw.map(v => v.vendedorId);
        const vendedoresMap = new Map(
            (await this.prisma.vendedor.findMany({ where: { id: { in: vendedorIds } } }))
                .map(v => [v.id, v]),
        );

        const ventasPorVendedor = ventasPorVendedorRaw.map(v => ({
            vendedorId: v.vendedorId,
            nombre: vendedoresMap.get(v.vendedorId)?.nombre ?? 'Desconocido',
            totalVentas: Number(v._sum.total ?? 0),
            cantidadVentas: v._count.id,
        }));

        // ═══════════════════════════════════════════════════════
        // 8. VENTAS POR CLIENTE (TOP 10)
        // ═══════════════════════════════════════════════════════
        const ventasPorClienteRaw = await this.prisma.venta.groupBy({
            by: ['clienteId'],
            _sum: { total: true },
            _count: { id: true },
            where: { ...ventaWhere, estado: 'COMPLETADA' },
            orderBy: { _sum: { total: 'desc' } },
            take: 10,
        });

        const clienteIds = ventasPorClienteRaw.map(c => c.clienteId);
        const clientesMap = new Map(
            (await this.prisma.cliente.findMany({ where: { id: { in: clienteIds } } }))
                .map(c => [c.id, c]),
        );

        const topClientes = ventasPorClienteRaw.map(c => ({
            clienteId: c.clienteId,
            nombre: clientesMap.get(c.clienteId)?.nombre ?? 'Desconocido',
            tipo: clientesMap.get(c.clienteId)?.tipo ?? '—',
            totalCompras: Number(c._sum.total ?? 0),
            cantidadCompras: c._count.id,
        }));

        // ═══════════════════════════════════════════════════════
        // 9. INVENTARIO — Estado general
        // ═══════════════════════════════════════════════════════
        const [totalProductos, lotesActivos, lotesProxVencer, lotesVencidos, movimientos] = await Promise.all([
            this.prisma.producto.count(),
            this.prisma.lote.count({ where: { cantidadDisponible: { gt: 0 } } }),
            this.prisma.lote.count({
                where: {
                    cantidadDisponible: { gt: 0 },
                    fechaVencimiento: {
                        lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                        gt: new Date(),
                    },
                },
            }),
            this.prisma.lote.count({
                where: { fechaVencimiento: { lte: new Date() }, cantidadDisponible: { gt: 0 } },
            }),
            this.prisma.movimientoInventario.groupBy({
                by: ['tipoMovimiento'],
                _count: { id: true },
                _sum: { cantidad: true },
                where: movimientoWhere,
            }),
        ]);

        const movimientosResumen = movimientos.map(m => ({
            tipo: m.tipoMovimiento,
            count: m._count.id,
            totalUnidades: m._sum.cantidad ?? 0,
        }));

        // ═══════════════════════════════════════════════════════
        // 10. PROMOCIONES ACTIVAS
        // ═══════════════════════════════════════════════════════
        const [promoActivas, promoExpiradas, promoProximas] = await Promise.all([
            this.prisma.promocion.count({ where: { estado: 'ACTIVA' } }),
            this.prisma.promocion.count({ where: { estado: 'EXPIRADA' } }),
            this.prisma.promocion.count({ where: { estado: 'PROXIMA' } }),
        ]);

        // ═══════════════════════════════════════════════════════
        // 11. CLIENTES — Resumen
        // ═══════════════════════════════════════════════════════
        const [clientesActivos, clientesBloqueados, clientesSuspendidos, creditoTotal] = await Promise.all([
            this.prisma.cliente.count({ where: { estado: 'ACTIVO' } }),
            this.prisma.cliente.count({ where: { estado: 'BLOQUEADO' } }),
            this.prisma.cliente.count({ where: { estado: 'SUSPENDIDO' } }),
            this.prisma.cliente.aggregate({
                _sum: { saldoActual: true, limiteCredito: true },
            }),
        ]);

        // ═══════════════════════════════════════════════════════
        // 12. SERIE TEMPORAL (ventas día a día en el rango)
        // ═══════════════════════════════════════════════════════
        const ventasEnRango = await this.prisma.venta.findMany({
            where: { ...ventaWhere, estado: 'COMPLETADA' },
            select: { fecha: true, total: true },
            orderBy: { fecha: 'asc' },
        });

        const serieTemporal: Record<string, number> = {};
        for (const v of ventasEnRango) {
            const key = v.fecha.toISOString().split('T')[0];
            serieTemporal[key] = (serieTemporal[key] ?? 0) + Number(v.total);
        }

        const ventasDiarias = Object.entries(serieTemporal).map(([fecha, total]) => ({ fecha, total }));

        // ═══════════════════════════════════════════════════════
        // COMPILAR REPORTE
        // ═══════════════════════════════════════════════════════
        const totalVentas = Number(ventasAgg._sum.total ?? 0);
        const totalDevoluciones = Number(devolucionesAgg._sum.monto ?? 0);
        const ventasNetoTotal = totalVentas - totalDevoluciones;

        return {
            meta: {
                generadoEn: new Date().toISOString(),
                filtros: {
                    dias: filtros.dias ?? [],
                    semanas: filtros.semanas ?? [],
                    anios: filtros.anios ?? [],
                },
                periodoDescripcion: this.buildPeriodoDescripcion(filtros),
            },
            resumenVentas: {
                totalBruto: totalVentas,
                totalDescuentos: Number(ventasAgg._sum.descuentoTotal ?? 0),
                totalDevoluciones,
                totalNeto: ventasNetoTotal,
                promedioVenta: Number(ventasAgg._avg.total ?? 0),
                ventaMaxima: Number(ventasAgg._max.total ?? 0),
                ventaMinima: Number(ventasAgg._min.total ?? 0),
                cantidadVentas: ventasCount,
                completadas: ventasCompletadas,
                anuladas: ventasAnuladas,
                pendientes: ventasPendientes,
                tasaCompletacion: ventasCount > 0 ? Math.round((ventasCompletadas / ventasCount) * 100) : 0,
            },
            facturacion: {
                totalFacturas: facturasTotal,
                pagadas: { count: facturasPagadas._count.id, monto: Number(facturasPagadas._sum.total ?? 0) },
                pendientes: { count: facturasPendientes._count.id, monto: Number(facturasPendientes._sum.total ?? 0) },
                vencidas: { count: facturasVencidas._count.id, monto: Number(facturasVencidas._sum.total ?? 0) },
                tasaCobranza: facturasTotal > 0 ? Math.round((facturasPagadas._count.id / facturasTotal) * 100) : 0,
            },
            cobros: {
                cobrados: { count: cobrosCobrados._count.id, monto: Number(cobrosCobrados._sum.monto ?? 0) },
                pendientes: { count: cobrosPendientes._count.id, monto: Number(cobrosPendientes._sum.monto ?? 0) },
                vencidos: { count: cobrosVencidos._count.id, monto: Number(cobrosVencidos._sum.monto ?? 0) },
            },
            devoluciones: {
                cantidad: devolucionesAgg._count.id,
                unidadesDevueltas: Number(devolucionesAgg._sum.cantidad ?? 0),
                montoTotal: totalDevoluciones,
                tasaDevolucion: ventasCount > 0 ? Math.round((devolucionesAgg._count.id / ventasCount) * 100) : 0,
            },
            topProductos,
            ventasPorCategoria,
            ventasPorVendedor,
            topClientes,
            inventario: {
                totalProductos,
                lotesActivos,
                lotesProxVencer,
                lotesVencidos,
                movimientos: movimientosResumen,
            },
            promociones: {
                activas: promoActivas,
                expiradas: promoExpiradas,
                proximas: promoProximas,
            },
            clientes: {
                activos: clientesActivos,
                bloqueados: clientesBloqueados,
                suspendidos: clientesSuspendidos,
                saldoCreditoTotal: Number(creditoTotal._sum.saldoActual ?? 0),
                limiteCreditoTotal: Number(creditoTotal._sum.limiteCredito ?? 0),
            },
            ventasDiarias,
        };
    }

    // ───────────────────────────────────────────────────────
    // Helpers
    // ───────────────────────────────────────────────────────

    private buildDateRanges(filtros: FiltrosReporte): { start: Date; end: Date }[] {
        const ranges: { start: Date; end: Date }[] = [];

        // Días específicos
        if (filtros.dias?.length) {
            for (const d of filtros.dias) {
                const start = new Date(d + 'T00:00:00');
                const end = new Date(d + 'T23:59:59.999');
                if (!isNaN(start.getTime())) ranges.push({ start, end });
            }
        }

        // Semanas ISO (e.g. "2026-W10")
        if (filtros.semanas?.length) {
            for (const w of filtros.semanas) {
                const match = w.match(/^(\d{4})-W(\d{1,2})$/);
                if (!match) continue;
                const year = parseInt(match[1]);
                const week = parseInt(match[2]);
                const { start, end } = this.getWeekRange(year, week);
                ranges.push({ start, end });
            }
        }

        // Años
        if (filtros.anios?.length) {
            for (const year of filtros.anios) {
                ranges.push({
                    start: new Date(year, 0, 1),
                    end: new Date(year, 11, 31, 23, 59, 59, 999),
                });
            }
        }

        return ranges;
    }

    private getWeekRange(year: number, week: number): { start: Date; end: Date } {
        // ISO 8601: week 1 contains Jan 4th
        const jan4 = new Date(year, 0, 4);
        const dayOfWeek = jan4.getDay() || 7; // Mon=1 ... Sun=7
        const mondayWeek1 = new Date(jan4);
        mondayWeek1.setDate(jan4.getDate() - dayOfWeek + 1);

        const start = new Date(mondayWeek1);
        start.setDate(mondayWeek1.getDate() + (week - 1) * 7);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        return { start, end };
    }

    private buildPeriodoDescripcion(filtros: FiltrosReporte): string {
        const partes: string[] = [];

        if (filtros.dias?.length) {
            partes.push(`Días: ${filtros.dias.join(', ')}`);
        }
        if (filtros.semanas?.length) {
            partes.push(`Semanas: ${filtros.semanas.join(', ')}`);
        }
        if (filtros.anios?.length) {
            partes.push(`Años: ${filtros.anios.join(', ')}`);
        }

        return partes.length > 0 ? partes.join(' | ') : 'Todos los datos históricos';
    }
}
