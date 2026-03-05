import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getReporte(dias?: string, semanas?: string, anios?: string): Promise<{
        meta: {
            generadoEn: string;
            filtros: {
                dias: string[];
                semanas: string[];
                anios: number[];
            };
            periodoDescripcion: string;
        };
        resumenVentas: {
            totalBruto: number;
            totalDescuentos: number;
            totalDevoluciones: number;
            totalNeto: number;
            promedioVenta: number;
            ventaMaxima: number;
            ventaMinima: number;
            cantidadVentas: number;
            completadas: number;
            anuladas: number;
            pendientes: number;
            tasaCompletacion: number;
        };
        facturacion: {
            totalFacturas: number;
            pagadas: {
                count: number;
                monto: number;
            };
            pendientes: {
                count: number;
                monto: number;
            };
            vencidas: {
                count: number;
                monto: number;
            };
            tasaCobranza: number;
        };
        cobros: {
            cobrados: {
                count: number;
                monto: number;
            };
            pendientes: {
                count: number;
                monto: number;
            };
            vencidos: {
                count: number;
                monto: number;
            };
        };
        devoluciones: {
            cantidad: number;
            unidadesDevueltas: number;
            montoTotal: number;
            tasaDevolucion: number;
        };
        topProductos: {
            productoId: number;
            nombre: string;
            codigo: string | null | undefined;
            categoria: string;
            unidadesVendidas: number;
            ingresos: number;
        }[];
        ventasPorCategoria: {
            cantidad: number;
            ingresos: number;
            color: string;
            categoria: string;
        }[];
        ventasPorVendedor: {
            vendedorId: number;
            nombre: string;
            totalVentas: number;
            cantidadVentas: number;
        }[];
        topClientes: {
            clienteId: number;
            nombre: string;
            tipo: string;
            totalCompras: number;
            cantidadCompras: number;
        }[];
        inventario: {
            totalProductos: number;
            lotesActivos: number;
            lotesProxVencer: number;
            lotesVencidos: number;
            movimientos: {
                tipo: import(".prisma/client").$Enums.TipoMovimiento;
                count: number;
                totalUnidades: number;
            }[];
        };
        promociones: {
            activas: number;
            expiradas: number;
            proximas: number;
        };
        clientes: {
            activos: number;
            bloqueados: number;
            suspendidos: number;
            saldoCreditoTotal: number;
            limiteCreditoTotal: number;
        };
        ventasDiarias: {
            fecha: string;
            total: number;
        }[];
    }>;
}
