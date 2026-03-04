import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { CreateProductoDto } from './dto/create-producto.dto';
import { CreateLoteDto } from './dto/create-lote.dto';
export declare class InventoryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createCategoria(dto: CreateCategoriaDto): Promise<{
        nombre: string;
        descripcion: string | null;
        id: number;
    }>;
    findAllCategorias(): Promise<({
        productos: {
            nombre: string;
            descripcion: string | null;
            codigoBarras: string | null;
            precioBase: import("@prisma/client/runtime/library").Decimal;
            categoriaId: number;
            id: number;
        }[];
    } & {
        nombre: string;
        descripcion: string | null;
        id: number;
    })[]>;
    findCategoriaById(id: number): Promise<{
        productos: {
            nombre: string;
            descripcion: string | null;
            codigoBarras: string | null;
            precioBase: import("@prisma/client/runtime/library").Decimal;
            categoriaId: number;
            id: number;
        }[];
    } & {
        nombre: string;
        descripcion: string | null;
        id: number;
    }>;
    createProducto(dto: CreateProductoDto): Promise<{
        categoria: {
            nombre: string;
            descripcion: string | null;
            id: number;
        };
    } & {
        nombre: string;
        descripcion: string | null;
        codigoBarras: string | null;
        precioBase: import("@prisma/client/runtime/library").Decimal;
        categoriaId: number;
        id: number;
    }>;
    findAllProductos(page?: number, pageSize?: number): Promise<{
        items: ({
            categoria: {
                nombre: string;
                descripcion: string | null;
                id: number;
            };
            lotes: {
                numeroLote: string;
                fechaFabricacion: Date;
                fechaVencimiento: Date;
                cantidadInicial: number;
                productoId: number;
                id: number;
                cantidadDisponible: number;
            }[];
        } & {
            nombre: string;
            descripcion: string | null;
            codigoBarras: string | null;
            precioBase: import("@prisma/client/runtime/library").Decimal;
            categoriaId: number;
            id: number;
        })[];
        total: number;
        page: number;
        pageSize: number;
        pages: number;
    }>;
    findProductoById(id: number): Promise<{
        categoria: {
            nombre: string;
            descripcion: string | null;
            id: number;
        };
        lotes: {
            numeroLote: string;
            fechaFabricacion: Date;
            fechaVencimiento: Date;
            cantidadInicial: number;
            productoId: number;
            id: number;
            cantidadDisponible: number;
        }[];
    } & {
        nombre: string;
        descripcion: string | null;
        codigoBarras: string | null;
        precioBase: import("@prisma/client/runtime/library").Decimal;
        categoriaId: number;
        id: number;
    }>;
    createLote(dto: CreateLoteDto): Promise<{
        producto: {
            nombre: string;
            descripcion: string | null;
            codigoBarras: string | null;
            precioBase: import("@prisma/client/runtime/library").Decimal;
            categoriaId: number;
            id: number;
        };
    } & {
        numeroLote: string;
        fechaFabricacion: Date;
        fechaVencimiento: Date;
        cantidadInicial: number;
        productoId: number;
        id: number;
        cantidadDisponible: number;
    }>;
    findAllLotes(productoId?: number): Promise<({
        producto: {
            nombre: string;
            descripcion: string | null;
            codigoBarras: string | null;
            precioBase: import("@prisma/client/runtime/library").Decimal;
            categoriaId: number;
            id: number;
        };
    } & {
        numeroLote: string;
        fechaFabricacion: Date;
        fechaVencimiento: Date;
        cantidadInicial: number;
        productoId: number;
        id: number;
        cantidadDisponible: number;
    })[]>;
    findLoteById(id: number): Promise<{
        producto: {
            nombre: string;
            descripcion: string | null;
            codigoBarras: string | null;
            precioBase: import("@prisma/client/runtime/library").Decimal;
            categoriaId: number;
            id: number;
        };
        movimientos: {
            id: number;
            tipoMovimiento: import(".prisma/client").$Enums.TipoMovimiento;
            cantidad: number;
            fechaMovimiento: Date;
            referencia: string | null;
            loteId: number;
        }[];
    } & {
        numeroLote: string;
        fechaFabricacion: Date;
        fechaVencimiento: Date;
        cantidadInicial: number;
        productoId: number;
        id: number;
        cantidadDisponible: number;
    }>;
    getInventarioPorLote(): Promise<({
        producto: {
            categoria: {
                nombre: string;
                descripcion: string | null;
                id: number;
            };
        } & {
            nombre: string;
            descripcion: string | null;
            codigoBarras: string | null;
            precioBase: import("@prisma/client/runtime/library").Decimal;
            categoriaId: number;
            id: number;
        };
    } & {
        numeroLote: string;
        fechaFabricacion: Date;
        fechaVencimiento: Date;
        cantidadInicial: number;
        productoId: number;
        id: number;
        cantidadDisponible: number;
    })[]>;
    getProductosProximosAVencer(diasAlerta?: number): Promise<({
        producto: {
            categoria: {
                nombre: string;
                descripcion: string | null;
                id: number;
            };
        } & {
            nombre: string;
            descripcion: string | null;
            codigoBarras: string | null;
            precioBase: import("@prisma/client/runtime/library").Decimal;
            categoriaId: number;
            id: number;
        };
    } & {
        numeroLote: string;
        fechaFabricacion: Date;
        fechaVencimiento: Date;
        cantidadInicial: number;
        productoId: number;
        id: number;
        cantidadDisponible: number;
    })[]>;
    getMovimientos(loteId?: number): Promise<({
        lote: {
            producto: {
                nombre: string;
                descripcion: string | null;
                codigoBarras: string | null;
                precioBase: import("@prisma/client/runtime/library").Decimal;
                categoriaId: number;
                id: number;
            };
        } & {
            numeroLote: string;
            fechaFabricacion: Date;
            fechaVencimiento: Date;
            cantidadInicial: number;
            productoId: number;
            id: number;
            cantidadDisponible: number;
        };
    } & {
        id: number;
        tipoMovimiento: import(".prisma/client").$Enums.TipoMovimiento;
        cantidad: number;
        fechaMovimiento: Date;
        referencia: string | null;
        loteId: number;
    })[]>;
}
