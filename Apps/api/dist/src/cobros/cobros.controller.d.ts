import { PrismaService } from '../prisma/prisma.service';
export declare class CobrosController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        cliente: {
            id: number;
            nombre: string;
            activo: boolean;
            tipo: string;
            identificacion: string | null;
            direccion: string;
            telefono: string | null;
            email: string | null;
            limiteCredito: import("@prisma/client-runtime-utils").Decimal;
            saldoCredito: import("@prisma/client-runtime-utils").Decimal;
            diasCredito: number;
            rutaId: number | null;
        };
        factura: {
            id: number;
            numero: string;
            tipo: string;
            estado: string;
            fecha: Date;
            total: import("@prisma/client-runtime-utils").Decimal;
            ventaId: number;
        };
    } & {
        id: number;
        clienteId: number;
        fecha: Date;
        monto: import("@prisma/client-runtime-utils").Decimal;
        metodoPago: string;
        referenciaPago: string | null;
        facturaId: number;
    })[]>;
    resumen(): Promise<{
        cantidad: number;
        total: number;
        metodo: string;
    }[]>;
    findOne(id: number): Promise<({
        cliente: {
            id: number;
            nombre: string;
            activo: boolean;
            tipo: string;
            identificacion: string | null;
            direccion: string;
            telefono: string | null;
            email: string | null;
            limiteCredito: import("@prisma/client-runtime-utils").Decimal;
            saldoCredito: import("@prisma/client-runtime-utils").Decimal;
            diasCredito: number;
            rutaId: number | null;
        };
        factura: {
            id: number;
            numero: string;
            tipo: string;
            estado: string;
            fecha: Date;
            total: import("@prisma/client-runtime-utils").Decimal;
            ventaId: number;
        };
    } & {
        id: number;
        clienteId: number;
        fecha: Date;
        monto: import("@prisma/client-runtime-utils").Decimal;
        metodoPago: string;
        referenciaPago: string | null;
        facturaId: number;
    }) | {
        error: string;
        id: number;
    }>;
    create(body: any): Promise<({
        cliente: {
            id: number;
            nombre: string;
            activo: boolean;
            tipo: string;
            identificacion: string | null;
            direccion: string;
            telefono: string | null;
            email: string | null;
            limiteCredito: import("@prisma/client-runtime-utils").Decimal;
            saldoCredito: import("@prisma/client-runtime-utils").Decimal;
            diasCredito: number;
            rutaId: number | null;
        };
        factura: {
            id: number;
            numero: string;
            tipo: string;
            estado: string;
            fecha: Date;
            total: import("@prisma/client-runtime-utils").Decimal;
            ventaId: number;
        };
    } & {
        id: number;
        clienteId: number;
        fecha: Date;
        monto: import("@prisma/client-runtime-utils").Decimal;
        metodoPago: string;
        referenciaPago: string | null;
        facturaId: number;
    }) | {
        error: string;
    }>;
}
