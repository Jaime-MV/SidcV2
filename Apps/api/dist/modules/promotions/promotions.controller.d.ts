import { PromotionsService } from './promotions.service';
import { CreatePromocionDto } from './dto/create-promocion.dto';
export declare class PromotionsController {
    private readonly promotionsService;
    constructor(promotionsService: PromotionsService);
    create(dto: CreatePromocionDto): Promise<{
        productos: ({
            producto: {
                nombre: string;
                descripcion: string | null;
                codigoBarras: string | null;
                categoriaId: number;
                codigo: string | null;
                id: number;
                precioCompra: import("@prisma/client/runtime/library").Decimal;
                precioVenta: import("@prisma/client/runtime/library").Decimal;
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
        estado: import(".prisma/client").$Enums.EstadoPromocion;
        tipo: import(".prisma/client").$Enums.TipoPromocion;
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
                categoriaId: number;
                codigo: string | null;
                id: number;
                precioCompra: import("@prisma/client/runtime/library").Decimal;
                precioVenta: import("@prisma/client/runtime/library").Decimal;
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
        estado: import(".prisma/client").$Enums.EstadoPromocion;
        tipo: import(".prisma/client").$Enums.TipoPromocion;
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
                categoriaId: number;
                codigo: string | null;
                id: number;
                precioCompra: import("@prisma/client/runtime/library").Decimal;
                precioVenta: import("@prisma/client/runtime/library").Decimal;
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
        estado: import(".prisma/client").$Enums.EstadoPromocion;
        tipo: import(".prisma/client").$Enums.TipoPromocion;
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
                categoriaId: number;
                codigo: string | null;
                id: number;
                precioCompra: import("@prisma/client/runtime/library").Decimal;
                precioVenta: import("@prisma/client/runtime/library").Decimal;
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
        estado: import(".prisma/client").$Enums.EstadoPromocion;
        tipo: import(".prisma/client").$Enums.TipoPromocion;
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
                categoriaId: number;
                codigo: string | null;
                id: number;
                precioCompra: import("@prisma/client/runtime/library").Decimal;
                precioVenta: import("@prisma/client/runtime/library").Decimal;
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
        estado: import(".prisma/client").$Enums.EstadoPromocion;
        tipo: import(".prisma/client").$Enums.TipoPromocion;
        fechaInicio: Date;
        fechaFin: Date;
        porcentajeDesc: import("@prisma/client/runtime/library").Decimal;
        activa: boolean;
        canal: string | null;
        usos: number;
        presupuesto: import("@prisma/client/runtime/library").Decimal;
        gastado: import("@prisma/client/runtime/library").Decimal;
    }>;
}
