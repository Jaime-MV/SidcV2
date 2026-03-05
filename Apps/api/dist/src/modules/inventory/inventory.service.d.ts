import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { CreateProductoDto } from './dto/create-producto.dto';
import { CreateLoteDto } from './dto/create-lote.dto';
import { CreateBodegaDto } from './dto/create-bodega.dto';
export declare class InventoryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createCategoria(dto: CreateCategoriaDto): Promise<{
        nombre: string;
        descripcion: string | null;
        colorHex: string | null;
        id: number;
    }>;
    findAllCategorias(): Promise<({
        productos: {
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
        }[];
    } & {
        nombre: string;
        descripcion: string | null;
        colorHex: string | null;
        id: number;
    })[]>;
    findCategoriaById(id: number): Promise<{
        productos: {
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
        }[];
    } & {
        nombre: string;
        descripcion: string | null;
        colorHex: string | null;
        id: number;
    }>;
    createProducto(dto: CreateProductoDto): Promise<{
        categoria: {
            nombre: string;
            descripcion: string | null;
            colorHex: string | null;
            id: number;
        };
    } & {
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
    }>;
    findAllProductos(page?: number, pageSize?: number): Promise<{
        items: ({
            categoria: {
                nombre: string;
                descripcion: string | null;
                colorHex: string | null;
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
            precioCompra: import("@prisma/client/runtime/library").Decimal;
            precioVenta: import("@prisma/client/runtime/library").Decimal;
            categoriaId: number;
            codigo: string | null;
            id: number;
            minStock: number;
            estadoProducto: import(".prisma/client").$Enums.EstadoProducto;
            bodegaId: number | null;
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
            colorHex: string | null;
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
        precioCompra: import("@prisma/client/runtime/library").Decimal;
        precioVenta: import("@prisma/client/runtime/library").Decimal;
        categoriaId: number;
        codigo: string | null;
        id: number;
        minStock: number;
        estadoProducto: import(".prisma/client").$Enums.EstadoProducto;
        bodegaId: number | null;
    }>;
    createLote(dto: CreateLoteDto): Promise<{
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
            precioCompra: import("@prisma/client/runtime/library").Decimal;
            precioVenta: import("@prisma/client/runtime/library").Decimal;
            categoriaId: number;
            codigo: string | null;
            id: number;
            minStock: number;
            estadoProducto: import(".prisma/client").$Enums.EstadoProducto;
            bodegaId: number | null;
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
                colorHex: string | null;
                id: number;
            };
        } & {
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
                colorHex: string | null;
                id: number;
            };
        } & {
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
    createBodega(dto: CreateBodegaDto): Promise<{
        productos: {
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
        }[];
    } & {
        nombre: string;
        codigo: string | null;
        ubicacion: string | null;
        capacidadTotal: number;
        encargado: string | null;
        id: number;
        capacidadUsada: number;
    }>;
    findAllBodegas(): Promise<{
        productos: number;
        nombre: string;
        codigo: string | null;
        ubicacion: string | null;
        capacidadTotal: number;
        encargado: string | null;
        id: number;
        capacidadUsada: number;
    }[]>;
    findBodegaById(id: number): Promise<{
        productos: ({
            categoria: {
                nombre: string;
                descripcion: string | null;
                colorHex: string | null;
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
            precioCompra: import("@prisma/client/runtime/library").Decimal;
            precioVenta: import("@prisma/client/runtime/library").Decimal;
            categoriaId: number;
            codigo: string | null;
            id: number;
            minStock: number;
            estadoProducto: import(".prisma/client").$Enums.EstadoProducto;
            bodegaId: number | null;
        })[];
    } & {
        nombre: string;
        codigo: string | null;
        ubicacion: string | null;
        capacidadTotal: number;
        encargado: string | null;
        id: number;
        capacidadUsada: number;
    }>;
    updateBodega(id: number, dto: Partial<CreateBodegaDto>): Promise<{
        nombre: string;
        codigo: string | null;
        ubicacion: string | null;
        capacidadTotal: number;
        encargado: string | null;
        id: number;
        capacidadUsada: number;
    }>;
}
