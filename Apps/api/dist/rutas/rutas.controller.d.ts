import { Vendedor, Ruta } from '../data/mock-data';
export declare class VendedoresController {
    private data;
    private nextId;
    findAll(): Vendedor[];
    findOne(id: number): Vendedor | {
        error: string;
        id: number;
    };
    getRutas(id: number): Ruta[];
    create(body: Omit<Vendedor, 'id'>): Vendedor;
    update(id: number, body: Partial<Vendedor>): Vendedor | {
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
export declare class RutasController {
    private data;
    private nextId;
    private clientesData;
    findAll(): {
        vendedor: Vendedor | undefined;
        clientes: (import("../data/mock-data").Cliente | undefined)[];
        id: number;
        vendedorId: number;
        nombre: string;
        zona: string;
        dias: string[];
        clienteIds: number[];
    }[];
    findOne(id: number): {
        error: string;
        id: number;
    } | {
        vendedor: Vendedor | undefined;
        clientes: (import("../data/mock-data").Cliente | undefined)[];
        id: number;
        vendedorId: number;
        nombre: string;
        zona: string;
        dias: string[];
        clienteIds: number[];
        error?: undefined;
    };
    create(body: Omit<Ruta, 'id'>): Ruta;
    update(id: number, body: Partial<Ruta>): Ruta | {
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
