import { Controller, Get, Query } from '@nestjs/common';
import { ventas, productos, clientes, vendedores, lotes, cobros, devoluciones } from '../data/mock-data';

@Controller('reportes')
export class ReportesController {

    @Get('productos-mas-vendidos')
    productosMasVendidos(@Query('limite') limite?: string) {
        const lim = parseInt(limite || '5');
        const conteo: Record<number, { cantidad: number; monto: number }> = {};

        for (const venta of ventas) {
            if (venta.estado !== 'ANULADA') {
                for (const det of venta.detalles) {
                    if (!conteo[det.productoId]) conteo[det.productoId] = { cantidad: 0, monto: 0 };
                    conteo[det.productoId].cantidad += det.cantidad;
                    conteo[det.productoId].monto += det.subtotal;
                }
            }
        }

        return Object.entries(conteo)
            .map(([pid, data]) => ({
                producto: productos.find(p => p.id === parseInt(pid)),
                totalCantidad: data.cantidad,
                totalMonto: parseFloat(data.monto.toFixed(2)),
            }))
            .sort((a, b) => b.totalCantidad - a.totalCantidad)
            .slice(0, lim);
    }

    @Get('ventas-por-vendedor')
    ventasPorVendedor() {
        const result: Record<number, { totalVentas: number; totalMonto: number }> = {};
        for (const venta of ventas) {
            if (venta.estado !== 'ANULADA') {
                if (!result[venta.vendedorId]) result[venta.vendedorId] = { totalVentas: 0, totalMonto: 0 };
                result[venta.vendedorId].totalVentas++;
                result[venta.vendedorId].totalMonto += venta.total;
            }
        }
        return Object.entries(result).map(([vid, data]) => ({
            vendedor: vendedores.find(v => v.id === parseInt(vid)),
            totalVentas: data.totalVentas,
            totalMonto: parseFloat(data.totalMonto.toFixed(2)),
        }));
    }

    @Get('ventas-por-cliente')
    ventasPorCliente() {
        const result: Record<number, { totalVentas: number; totalMonto: number }> = {};
        for (const venta of ventas) {
            if (venta.estado !== 'ANULADA') {
                if (!result[venta.clienteId]) result[venta.clienteId] = { totalVentas: 0, totalMonto: 0 };
                result[venta.clienteId].totalVentas++;
                result[venta.clienteId].totalMonto += venta.total;
            }
        }
        return Object.entries(result).map(([cid, data]) => ({
            cliente: clientes.find(c => c.id === parseInt(cid)),
            totalVentas: data.totalVentas,
            totalMonto: parseFloat(data.totalMonto.toFixed(2)),
        })).sort((a, b) => b.totalMonto - a.totalMonto);
    }

    @Get('inventario-resumen')
    inventarioResumen() {
        const porBodega: Record<string, { totalLotes: number; totalProductos: number }> = {};
        for (const lote of lotes) {
            if (!porBodega[lote.bodega]) porBodega[lote.bodega] = { totalLotes: 0, totalProductos: 0 };
            porBodega[lote.bodega].totalLotes++;
            porBodega[lote.bodega].totalProductos += lote.cantidad;
        }
        const hoy = new Date();
        const vencidos = lotes.filter(l => new Date(l.fechaVencimiento) < hoy).length;
        const porVencer30 = lotes.filter(l => {
            const fv = new Date(l.fechaVencimiento);
            const limite = new Date();
            limite.setDate(limite.getDate() + 30);
            return fv >= hoy && fv <= limite;
        }).length;

        return {
            totalLotes: lotes.length,
            lotesVencidos: vencidos,
            lotesPorVencer30Dias: porVencer30,
            porBodega,
        };
    }

    @Get('dashboard')
    dashboard() {
        const totalVentas = ventas.filter(v => v.estado !== 'ANULADA').length;
        const ventasFacturadas = ventas.filter(v => v.estado === 'FACTURADA').length;
        const ventasPendientes = ventas.filter(v => v.estado === 'PENDIENTE').length;
        const montoTotal = ventas.filter(v => v.estado !== 'ANULADA').reduce((s, v) => s + v.total, 0);
        const totalCobrado = cobros.reduce((s, c) => s + c.monto, 0);
        const totalDevuelto = devoluciones.filter(d => d.estado === 'APROBADA').reduce((s, d) => s + d.totalDevuelto, 0);
        const clientesActivos = clientes.filter(c => c.activo).length;
        const clientesCredito = clientes.filter(c => c.tipo === 'CREDITO' && c.activo).length;

        return {
            ventas: { total: totalVentas, facturadas: ventasFacturadas, pendientes: ventasPendientes },
            financiero: {
                montoTotalVentas: parseFloat(montoTotal.toFixed(2)),
                totalCobrado: parseFloat(totalCobrado.toFixed(2)),
                pendienteCobro: parseFloat((montoTotal - totalCobrado).toFixed(2)),
                totalDevuelto: parseFloat(totalDevuelto.toFixed(2)),
            },
            clientes: { total: clientesActivos, credito: clientesCredito, contado: clientesActivos - clientesCredito },
            productos: { total: productos.length, lotes: lotes.length },
        };
    }

    @Get('cuentas-por-cobrar')
    cuentasPorCobrar() {
        return clientes
            .filter(c => c.tipo === 'CREDITO' && c.saldoCredito > 0)
            .map(c => ({
                cliente: c,
                saldoPendiente: c.saldoCredito,
                porcentajeLimite: ((c.saldoCredito / c.limiteCredito) * 100).toFixed(1),
                riesgo: c.saldoCredito / c.limiteCredito > 0.8 ? 'ALTO' : c.saldoCredito / c.limiteCredito > 0.5 ? 'MEDIO' : 'BAJO',
            }));
    }
}
