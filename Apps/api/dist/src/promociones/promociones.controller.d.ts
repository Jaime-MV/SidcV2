import { PrismaService } from '../prisma/prisma.service';
export declare class PromocionesController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(activa?: string): Promise<({
        productos: ({
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
            productoId: number;
            promocionId: number;
        })[];
    } & {
        activa: boolean;
        id: number;
        nombre: string;
        descripcion: string | null;
        tipo: string;
        fechaInicio: Date;
        fechaFin: Date;
        valor: import("@prisma/client-runtime-utils").Decimal;
    })[]>;
    vigentes(): Promise<({
        productos: ({
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
            productoId: number;
            promocionId: number;
        })[];
    } & {
        activa: boolean;
        id: number;
        nombre: string;
        descripcion: string | null;
        tipo: string;
        fechaInicio: Date;
        fechaFin: Date;
        valor: import("@prisma/client-runtime-utils").Decimal;
    })[]>;
    findOne(id: number): Promise<({
        productos: ({
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
            productoId: number;
            promocionId: number;
        })[];
    } & {
        activa: boolean;
        id: number;
        nombre: string;
        descripcion: string | null;
        tipo: string;
        fechaInicio: Date;
        fechaFin: Date;
        valor: import("@prisma/client-runtime-utils").Decimal;
    }) | {
        error: string;
        id: number;
    }>;
    create(body: any): Promise<{
        activa: boolean;
        id: number;
        nombre: string;
        descripcion: string | null;
        tipo: string;
        fechaInicio: Date;
        fechaFin: Date;
        valor: import("@prisma/client-runtime-utils").Decimal;
    }>;
    update(id: number, body: any): Promise<{
        activa: boolean;
        id: number;
        nombre: string;
        descripcion: string | null;
        tipo: string;
        fechaInicio: Date;
        fechaFin: Date;
        valor: import("@prisma/client-runtime-utils").Decimal;
    } | {
        error: string;
        id: number;
    }>;
    remove(id: number): Promise<{
        activa: boolean;
        id: number;
        nombre: string;
        descripcion: string | null;
        tipo: string;
        fechaInicio: Date;
        fechaFin: Date;
        valor: import("@prisma/client-runtime-utils").Decimal;
    }>;
}
