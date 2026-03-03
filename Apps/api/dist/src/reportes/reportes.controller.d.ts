import { PrismaService } from '../prisma/prisma.service';
export declare class ReportesController {
    private prisma;
    constructor(prisma: PrismaService);
    productosMasVendidos(limite?: string): Promise<{
        producto: any;
        totalCantidad: number;
        totalMonto: number;
    }[]>;
    ventasPorVendedor(): Promise<any>;
    ventasPorCliente(): Promise<any>;
    inventarioResumen(): Promise<{
        totalLotes: any;
        lotesVencidos: any;
        lotesPorVencer30Dias: any;
        stockTotal: any;
        productos: any;
    }>;
    dashboard(): Promise<{
        ventas: {
            total: any;
            facturadas: any;
            pendientes: any;
        };
        financiero: {
            montoTotalVentas: number;
            totalCobrado: number;
            pendienteCobro: number;
            totalDevuelto: number;
        };
        clientes: {
            total: any;
            credito: any;
            contado: any;
        };
    }>;
    cuentasPorCobrar(): Promise<any>;
}
