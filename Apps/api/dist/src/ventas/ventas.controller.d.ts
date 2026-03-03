import { PrismaService } from '../prisma/prisma.service';
export declare class VentasController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(estado?: string, clienteId?: string): Promise<any>;
    findOne(id: number): Promise<any>;
    create(body: any): Promise<any>;
    facturar(id: number): Promise<{
        error: string;
        mensaje?: undefined;
        venta?: undefined;
        factura?: undefined;
    } | {
        mensaje: string;
        venta: any;
        factura: any;
        error?: undefined;
    }>;
    anular(id: number): Promise<{
        error: string;
        mensaje?: undefined;
        id?: undefined;
    } | {
        mensaje: string;
        id: number;
        error?: undefined;
    }>;
}
export declare class FacturasController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(estado?: string): Promise<any>;
    pendientes(): Promise<any>;
    findOne(id: number): Promise<any>;
}
