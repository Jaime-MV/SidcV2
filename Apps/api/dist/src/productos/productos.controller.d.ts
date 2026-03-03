import { PrismaService } from '../prisma/prisma.service';
export declare class ProductosController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(categoriaId?: string, activo?: string): Promise<({
        categoria: {
            activa: boolean;
            id: number;
            nombre: string;
            descripcion: string | null;
        };
    } & {
        id: number;
        nombre: string;
        descripcion: string | null;
        categoriaId: number;
        activo: boolean;
        codigo: string | null;
        precio: import("@prisma/client-runtime-utils").Decimal;
        unidad: string | null;
    })[]>;
    bajoStock(minimo?: string): Promise<{
        stockTotal: number;
        categoria: {
            activa: boolean;
            id: number;
            nombre: string;
            descripcion: string | null;
        };
        lotes: {
            id: number;
            numero: string;
            fechaFabricacion: Date | null;
            fechaVencimiento: Date;
            cantidad: number;
            bodega: string | null;
            productoId: number;
        }[];
        id: number;
        nombre: string;
        descripcion: string | null;
        categoriaId: number;
        activo: boolean;
        codigo: string | null;
        precio: import("@prisma/client-runtime-utils").Decimal;
        unidad: string | null;
    }[]>;
    findOne(id: number): Promise<({
        categoria: {
            activa: boolean;
            id: number;
            nombre: string;
            descripcion: string | null;
        };
        lotes: {
            id: number;
            numero: string;
            fechaFabricacion: Date | null;
            fechaVencimiento: Date;
            cantidad: number;
            bodega: string | null;
            productoId: number;
        }[];
    } & {
        id: number;
        nombre: string;
        descripcion: string | null;
        categoriaId: number;
        activo: boolean;
        codigo: string | null;
        precio: import("@prisma/client-runtime-utils").Decimal;
        unidad: string | null;
    }) | {
        error: string;
        id: number;
    }>;
    create(body: any): Promise<{
        id: number;
        nombre: string;
        descripcion: string | null;
        categoriaId: number;
        activo: boolean;
        codigo: string | null;
        precio: import("@prisma/client-runtime-utils").Decimal;
        unidad: string | null;
    }>;
    update(id: number, body: any): Promise<{
        id: number;
        nombre: string;
        descripcion: string | null;
        categoriaId: number;
        activo: boolean;
        codigo: string | null;
        precio: import("@prisma/client-runtime-utils").Decimal;
        unidad: string | null;
    } | {
        error: string;
        id: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        nombre: string;
        descripcion: string | null;
        categoriaId: number;
        activo: boolean;
        codigo: string | null;
        precio: import("@prisma/client-runtime-utils").Decimal;
        unidad: string | null;
    } | {
        error: string;
        id: number;
    }>;
}
export declare class LotesController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(productoId?: string): Promise<({
        producto: {
            id: number;
            nombre: string;
            descripcion: string | null;
            categoriaId: number;
            activo: boolean;
            codigo: string | null;
            precio: import("@prisma/client-runtime-utils").Decimal;
            unidad: string | null;
        };
    } & {
        id: number;
        numero: string;
        fechaFabricacion: Date | null;
        fechaVencimiento: Date;
        cantidad: number;
        bodega: string | null;
        productoId: number;
    })[]>;
    porVencer(dias?: string): Promise<({
        producto: {
            id: number;
            nombre: string;
            descripcion: string | null;
            categoriaId: number;
            activo: boolean;
            codigo: string | null;
            precio: import("@prisma/client-runtime-utils").Decimal;
            unidad: string | null;
        };
    } & {
        id: number;
        numero: string;
        fechaFabricacion: Date | null;
        fechaVencimiento: Date;
        cantidad: number;
        bodega: string | null;
        productoId: number;
    })[]>;
    findOne(id: number): Promise<({
        producto: {
            id: number;
            nombre: string;
            descripcion: string | null;
            categoriaId: number;
            activo: boolean;
            codigo: string | null;
            precio: import("@prisma/client-runtime-utils").Decimal;
            unidad: string | null;
        };
    } & {
        id: number;
        numero: string;
        fechaFabricacion: Date | null;
        fechaVencimiento: Date;
        cantidad: number;
        bodega: string | null;
        productoId: number;
    }) | {
        error: string;
        id: number;
    }>;
    create(body: any): Promise<{
        id: number;
        numero: string;
        fechaFabricacion: Date | null;
        fechaVencimiento: Date;
        cantidad: number;
        bodega: string | null;
        productoId: number;
    }>;
    update(id: number, body: any): Promise<{
        id: number;
        numero: string;
        fechaFabricacion: Date | null;
        fechaVencimiento: Date;
        cantidad: number;
        bodega: string | null;
        productoId: number;
    } | {
        error: string;
        id: number;
    }>;
}
