import { PrismaService } from '../prisma/prisma.service';
export declare class ReportesController {
    private prisma;
    constructor(prisma: PrismaService);
    productosMasVendidos(limite?: string): Promise<{
        producto: any;
        totalCantidad: number;
        totalMonto: number;
    }[]>;
    ventasPorVendedor(): Promise<{
        vendedor: {
            id: number;
            nombre: string;
            codigo: string | null;
        };
        totalVentas: number;
        totalMonto: number;
    }[]>;
    ventasPorCliente(): Promise<{
        cliente: {
            id: number;
            nombre: string;
            tipo: string;
        };
        totalVentas: number;
        totalMonto: number;
    }[]>;
    inventarioResumen(): Promise<{
        totalLotes: number;
        lotesVencidos: number;
        lotesPorVencer30Dias: number;
        stockTotal: number;
        productos: {
            lote: string;
            producto: string;
            cantidad: number;
            fechaVencimiento: Date;
            bodega: string | null;
            vencido: boolean;
        }[];
    }>;
    dashboard(): Promise<{
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
    }>;
    cuentasPorCobrar(): Promise<{
        cliente: {
            id: number;
            nombre: string;
            limiteCredito: number;
        };
        saldoPendiente: number;
        porcentajeLimite: number;
        riesgo: string;
    }[]>;
}
