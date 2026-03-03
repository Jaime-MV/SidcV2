export declare class ReportesController {
    productosMasVendidos(limite?: string): {
        producto: import("../data/mock-data").Producto | undefined;
        totalCantidad: number;
        totalMonto: number;
    }[];
    ventasPorVendedor(): {
        vendedor: import("../data/mock-data").Vendedor | undefined;
        totalVentas: number;
        totalMonto: number;
    }[];
    ventasPorCliente(): {
        cliente: import("../data/mock-data").Cliente | undefined;
        totalVentas: number;
        totalMonto: number;
    }[];
    inventarioResumen(): {
        totalLotes: number;
        lotesVencidos: number;
        lotesPorVencer30Dias: number;
        porBodega: Record<string, {
            totalLotes: number;
            totalProductos: number;
        }>;
    };
    dashboard(): {
        ventas: {
            total: number;
            facturadas: number;
            pendientes: number;
        };
        financiero: {
            montoTotalVentas: number;
            totalCobrado: number;
            pendienteCobro: number;
            totalDevuelto: number;
        };
        clientes: {
            total: number;
            credito: number;
            contado: number;
        };
        productos: {
            total: number;
            lotes: number;
        };
    };
    cuentasPorCobrar(): {
        cliente: import("../data/mock-data").Cliente;
        saldoPendiente: number;
        porcentajeLimite: string;
        riesgo: string;
    }[];
}
