import { PrismaService } from '../prisma/prisma.service';
export declare class VendedoresController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        rutas: {
            id: number;
            nombre: string;
            descripcion: string | null;
            dias: string[];
            zona: string | null;
            vendedorId: number;
        }[];
    } & {
        id: number;
        nombre: string;
        activo: boolean;
        codigo: string | null;
        telefono: string | null;
        email: string | null;
    })[]>;
    findOne(id: number): Promise<({
        rutas: {
            id: number;
            nombre: string;
            descripcion: string | null;
            dias: string[];
            zona: string | null;
            vendedorId: number;
        }[];
    } & {
        id: number;
        nombre: string;
        activo: boolean;
        codigo: string | null;
        telefono: string | null;
        email: string | null;
    }) | {
        error: string;
        id: number;
    }>;
    rutasDeVendedor(id: number): Promise<({
        clientes: {
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
        }[];
    } & {
        id: number;
        nombre: string;
        descripcion: string | null;
        dias: string[];
        zona: string | null;
        vendedorId: number;
    })[]>;
    create(body: any): Promise<{
        id: number;
        nombre: string;
        activo: boolean;
        codigo: string | null;
        telefono: string | null;
        email: string | null;
    }>;
    update(id: number, body: any): Promise<{
        id: number;
        nombre: string;
        activo: boolean;
        codigo: string | null;
        telefono: string | null;
        email: string | null;
    } | {
        error: string;
        id: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        nombre: string;
        activo: boolean;
        codigo: string | null;
        telefono: string | null;
        email: string | null;
    }>;
}
export declare class RutasController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        vendedor: {
            id: number;
            nombre: string;
            activo: boolean;
            codigo: string | null;
            telefono: string | null;
            email: string | null;
        };
        clientes: {
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
        }[];
    } & {
        id: number;
        nombre: string;
        descripcion: string | null;
        dias: string[];
        zona: string | null;
        vendedorId: number;
    })[]>;
    findOne(id: number): Promise<({
        vendedor: {
            id: number;
            nombre: string;
            activo: boolean;
            codigo: string | null;
            telefono: string | null;
            email: string | null;
        };
        clientes: {
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
        }[];
    } & {
        id: number;
        nombre: string;
        descripcion: string | null;
        dias: string[];
        zona: string | null;
        vendedorId: number;
    }) | {
        error: string;
        id: number;
    }>;
    create(body: any): Promise<{
        id: number;
        nombre: string;
        descripcion: string | null;
        dias: string[];
        zona: string | null;
        vendedorId: number;
    }>;
    update(id: number, body: any): Promise<{
        id: number;
        nombre: string;
        descripcion: string | null;
        dias: string[];
        zona: string | null;
        vendedorId: number;
    } | {
        error: string;
        id: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        nombre: string;
        descripcion: string | null;
        dias: string[];
        zona: string | null;
        vendedorId: number;
    }>;
}
