import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        ventasMes: number;
        ventasMesAnterior: number;
        facturasPendientes: number;
        facturasVencidas: number;
        clientesActivos: number;
        clientesBloqueados: number;
        rutasActivas: number;
        rutasCompletadas: number;
        productosVencer: number;
        productosStockBajo: number;
        cobrosVencidos: number;
        montoVencido: number;
        productosMasVendidos: {
            nombre: string;
            unidades: number;
            ingresos: number;
        }[];
    }>;
    getVentasMensuales(meses?: number): Promise<{
        mesLabel: string;
        ventas: number;
        cobros: number;
        devoluciones: number;
    }[]>;
    getVentasPorCategoria(): Promise<{
        categoria: string;
        valor: number;
        valorAbsoluto: number;
        color: string;
    }[]>;
}
