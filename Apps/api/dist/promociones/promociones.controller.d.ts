import { Promocion } from '../data/mock-data';
export declare class PromocionesController {
    private data;
    private nextId;
    findAll(activa?: string): {
        vigente: boolean;
        productosNombres: (string | undefined)[];
        id: number;
        nombre: string;
        tipo: "DESCUENTO_PORCENTAJE" | "DESCUENTO_MONTO" | "2x1" | "REGALO";
        valor: number;
        productoIds: number[];
        fechaInicio: string;
        fechaFin: string;
        activa: boolean;
    }[];
    vigentes(): {
        productosNombres: (string | undefined)[];
        id: number;
        nombre: string;
        tipo: "DESCUENTO_PORCENTAJE" | "DESCUENTO_MONTO" | "2x1" | "REGALO";
        valor: number;
        productoIds: number[];
        fechaInicio: string;
        fechaFin: string;
        activa: boolean;
    }[];
    findOne(id: number): {
        error: string;
        id: number;
    } | {
        vigente: boolean;
        productosNombres: (string | undefined)[];
        id: number;
        nombre: string;
        tipo: "DESCUENTO_PORCENTAJE" | "DESCUENTO_MONTO" | "2x1" | "REGALO";
        valor: number;
        productoIds: number[];
        fechaInicio: string;
        fechaFin: string;
        activa: boolean;
        error?: undefined;
    };
    create(body: Omit<Promocion, 'id'>): Promocion;
    update(id: number, body: Partial<Promocion>): Promocion | {
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
