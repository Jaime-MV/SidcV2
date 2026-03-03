import { Producto, Lote } from '../data/mock-data';
export declare class ProductosController {
    private data;
    private lotesData;
    private nextId;
    findAll(categoriaId?: string, activo?: string): Producto[];
    bajoStock(limite?: string): {
        producto: Producto | undefined;
        id: number;
        productoId: number;
        numero: string;
        cantidad: number;
        fechaVencimiento: string;
        bodega: string;
    }[];
    proximosVencer(dias?: string): {
        producto: Producto | undefined;
        id: number;
        productoId: number;
        numero: string;
        cantidad: number;
        fechaVencimiento: string;
        bodega: string;
    }[];
    findOne(id: number): {
        error: string;
        id: number;
    } | {
        lotes: Lote[];
        id: number;
        categoriaId: number;
        nombre: string;
        codigo: string;
        precio: number;
        unidad: string;
        activo: boolean;
        error?: undefined;
    };
    create(body: Omit<Producto, 'id'>): Producto;
    update(id: number, body: Partial<Producto>): Producto | {
        error: string;
        id: number;
    };
    remove(id: number): {
        error: string;
        id: number;
        mensaje?: undefined;
    } | {
        mensaje: string;
        id: number;
        error?: undefined;
    };
}
export declare class LotesController {
    private data;
    private nextId;
    findAll(productoId?: string, bodega?: string): Lote[];
    findOne(id: number): Lote | {
        error: string;
        id: number;
    };
    create(body: Omit<Lote, 'id'>): Lote;
    update(id: number, body: Partial<Lote>): Lote | {
        error: string;
        id: number;
    };
}
