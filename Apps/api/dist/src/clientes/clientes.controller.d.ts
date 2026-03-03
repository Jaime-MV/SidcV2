import { PrismaService } from '../prisma/prisma.service';
export declare class ClientesController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(activo?: string, tipo?: string): Promise<({
        ruta: {
            id: number;
            nombre: string;
            descripcion: string | null;
            dias: string[];
            zona: string | null;
            vendedorId: number;
        } | null;
    } & {
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
    })[]>;
    conCreditoDisponible(): Promise<{
        limiteCredito: number;
        saldoCredito: number;
        creditoDisponible: number;
        id: number;
        nombre: string;
        activo: boolean;
        tipo: string;
        identificacion: string | null;
        direccion: string;
        telefono: string | null;
        email: string | null;
        diasCredito: number;
        rutaId: number | null;
    }[]>;
    findOne(id: number): Promise<{
        error: string;
        id: number;
    } | {
        limiteCredito: number;
        saldoCredito: number;
        creditoDisponible: number;
        ruta: {
            id: number;
            nombre: string;
            descripcion: string | null;
            dias: string[];
            zona: string | null;
            vendedorId: number;
        } | null;
        id: number;
        nombre: string;
        activo: boolean;
        tipo: string;
        identificacion: string | null;
        direccion: string;
        telefono: string | null;
        email: string | null;
        diasCredito: number;
        rutaId: number | null;
        error?: undefined;
    }>;
    create(body: any): Promise<{
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
    }>;
    update(id: number, body: any): Promise<{
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
    } | {
        error: string;
        id: number;
    }>;
    remove(id: number): Promise<{
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
    } | {
        error: string;
        id: number;
    }>;
}
