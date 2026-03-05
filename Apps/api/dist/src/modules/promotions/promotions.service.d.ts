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
                precioCompra: import("@prisma/client/runtime/library").Decimal;
                precioVenta: import("@prisma/client/runtime/library").Decimal;
                categoriaId: number;
                codigo: string | null;
                id: number;
                minStock: number;
                estadoProducto: import(".prisma/client").$Enums.EstadoProducto;
                bodegaId: number | null;
            };
        } & {
            productoId: number;
            id: number;
            promocionId: number;
        })[];
    } & {
        nombre: string;
        descripcion: string | null;
        codigo: string | null;
        id: number;
        tipo: import(".prisma/client").$Enums.TipoPromocion;
        estado: import(".prisma/client").$Enums.EstadoPromocion;
        fechaInicio: Date;
        fechaFin: Date;
        porcentajeDesc: import("@prisma/client/runtime/library").Decimal;
        activa: boolean;
        canal: string | null;
        usos: number;
        presupuesto: import("@prisma/client/runtime/library").Decimal;
        gastado: import("@prisma/client/runtime/library").Decimal;
    }>;
    findAll(): Promise<({
        productos: ({
            producto: {
                nombre: string;
                descripcion: string | null;
                codigoBarras: string | null;
                precioCompra: import("@prisma/client/runtime/library").Decimal;
                precioVenta: import("@prisma/client/runtime/library").Decimal;
                categoriaId: number;
                codigo: string | null;
                id: number;
                minStock: number;
                estadoProducto: import(".prisma/client").$Enums.EstadoProducto;
                bodegaId: number | null;
            };
        } & {
            productoId: number;
            id: number;
            promocionId: number;
        })[];
    } & {
        nombre: string;
        descripcion: string | null;
        codigo: string | null;
        id: number;
        tipo: import(".prisma/client").$Enums.TipoPromocion;
        estado: import(".prisma/client").$Enums.EstadoPromocion;
        fechaInicio: Date;
        fechaFin: Date;
        porcentajeDesc: import("@prisma/client/runtime/library").Decimal;
        activa: boolean;
        canal: string | null;
        usos: number;
        presupuesto: import("@prisma/client/runtime/library").Decimal;
        gastado: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    findVigentes(): Promise<({
        productos: ({
            producto: {
                nombre: string;
                descripcion: string | null;
                codigoBarras: string | null;
                precioCompra: import("@prisma/client/runtime/library").Decimal;
                precioVenta: import("@prisma/client/runtime/library").Decimal;
                categoriaId: number;
                codigo: string | null;
                id: number;
                minStock: number;
                estadoProducto: import(".prisma/client").$Enums.EstadoProducto;
                bodegaId: number | null;
            };
        } & {
            productoId: number;
            id: number;
            promocionId: number;
        })[];
    } & {
        nombre: string;
        descripcion: string | null;
        codigo: string | null;
        id: number;
        tipo: import(".prisma/client").$Enums.TipoPromocion;
        estado: import(".prisma/client").$Enums.EstadoPromocion;
        fechaInicio: Date;
        fechaFin: Date;
        porcentajeDesc: import("@prisma/client/runtime/library").Decimal;
        activa: boolean;
        canal: string | null;
        usos: number;
        presupuesto: import("@prisma/client/runtime/library").Decimal;
        gastado: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    findById(id: number): Promise<{
        productos: ({
            producto: {
                nombre: string;
                descripcion: string | null;
                codigoBarras: string | null;
                precioCompra: import("@prisma/client/runtime/library").Decimal;
                precioVenta: import("@prisma/client/runtime/library").Decimal;
                categoriaId: number;
                codigo: string | null;
                id: number;
                minStock: number;
                estadoProducto: import(".prisma/client").$Enums.EstadoProducto;
                bodegaId: number | null;
            };
        } & {
            productoId: number;
            id: number;
            promocionId: number;
        })[];
    } & {
        nombre: string;
        descripcion: string | null;
        codigo: string | null;
        id: number;
        tipo: import(".prisma/client").$Enums.TipoPromocion;
        estado: import(".prisma/client").$Enums.EstadoPromocion;
        fechaInicio: Date;
        fechaFin: Date;
        porcentajeDesc: import("@prisma/client/runtime/library").Decimal;
        activa: boolean;
        canal: string | null;
        usos: number;
        presupuesto: import("@prisma/client/runtime/library").Decimal;
        gastado: import("@prisma/client/runtime/library").Decimal;
    }>;
    toggleActiva(id: number): Promise<{
        productos: ({
            producto: {
                nombre: string;
                descripcion: string | null;
                codigoBarras: string | null;
                precioCompra: import("@prisma/client/runtime/library").Decimal;
                precioVenta: import("@prisma/client/runtime/library").Decimal;
                categoriaId: number;
                codigo: string | null;
                id: number;
                minStock: number;
                estadoProducto: import(".prisma/client").$Enums.EstadoProducto;
                bodegaId: number | null;
            };
        } & {
            productoId: number;
            id: number;
            promocionId: number;
        })[];
    } & {
        nombre: string;
        descripcion: string | null;
        codigo: string | null;
        id: number;
        tipo: import(".prisma/client").$Enums.TipoPromocion;
        estado: import(".prisma/client").$Enums.EstadoPromocion;
        fechaInicio: Date;
        fechaFin: Date;
        porcentajeDesc: import("@prisma/client/runtime/library").Decimal;
        activa: boolean;
        canal: string | null;
        usos: number;
        presupuesto: import("@prisma/client/runtime/library").Decimal;
        gastado: import("@prisma/client/runtime/library").Decimal;
    }>;
    getDescuentoVigente(productoId: number): Promise<number>;
}
