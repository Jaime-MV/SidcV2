import { PrismaService } from '../prisma/prisma.service';
import { CreatePromocionDto } from './dto/create-promocion.dto';
export declare class PromotionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePromocionDto): Promise<{
        productos: ({
            producto: {
                nombre: string;
                descripcion: string | null;
                codigoBarras: string | null;
                precioBase: import("@prisma/client/runtime/library").Decimal;
                categoriaId: number;
                id: number;
            };
        } & {
            productoId: number;
            id: number;
            promocionId: number;
        })[];
    } & {
        nombre: string;
        descripcion: string | null;
        id: number;
        fechaInicio: Date;
        fechaFin: Date;
        porcentajeDesc: import("@prisma/client/runtime/library").Decimal;
        activa: boolean;
    }>;
    findAll(): Promise<({
        productos: ({
            producto: {
                nombre: string;
                descripcion: string | null;
                codigoBarras: string | null;
                precioBase: import("@prisma/client/runtime/library").Decimal;
                categoriaId: number;
                id: number;
            };
        } & {
            productoId: number;
            id: number;
            promocionId: number;
        })[];
    } & {
        nombre: string;
        descripcion: string | null;
        id: number;
        fechaInicio: Date;
        fechaFin: Date;
        porcentajeDesc: import("@prisma/client/runtime/library").Decimal;
        activa: boolean;
    })[]>;
    findVigentes(): Promise<({
        productos: ({
            producto: {
                nombre: string;
                descripcion: string | null;
                codigoBarras: string | null;
                precioBase: import("@prisma/client/runtime/library").Decimal;
                categoriaId: number;
                id: number;
            };
        } & {
            productoId: number;
            id: number;
            promocionId: number;
        })[];
    } & {
        nombre: string;
        descripcion: string | null;
        id: number;
        fechaInicio: Date;
        fechaFin: Date;
        porcentajeDesc: import("@prisma/client/runtime/library").Decimal;
        activa: boolean;
    })[]>;
    findById(id: number): Promise<{
        productos: ({
            producto: {
                nombre: string;
                descripcion: string | null;
                codigoBarras: string | null;
                precioBase: import("@prisma/client/runtime/library").Decimal;
                categoriaId: number;
                id: number;
            };
        } & {
            productoId: number;
            id: number;
            promocionId: number;
        })[];
    } & {
        nombre: string;
        descripcion: string | null;
        id: number;
        fechaInicio: Date;
        fechaFin: Date;
        porcentajeDesc: import("@prisma/client/runtime/library").Decimal;
        activa: boolean;
    }>;
    toggleActiva(id: number): Promise<{
        productos: ({
            producto: {
                nombre: string;
                descripcion: string | null;
                codigoBarras: string | null;
                precioBase: import("@prisma/client/runtime/library").Decimal;
                categoriaId: number;
                id: number;
            };
        } & {
            productoId: number;
            id: number;
            promocionId: number;
        })[];
    } & {
        nombre: string;
        descripcion: string | null;
        id: number;
        fechaInicio: Date;
        fechaFin: Date;
        porcentajeDesc: import("@prisma/client/runtime/library").Decimal;
        activa: boolean;
    }>;
    getDescuentoVigente(productoId: number): Promise<number>;
}
