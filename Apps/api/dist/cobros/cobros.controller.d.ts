import { Cobro } from '../data/mock-data';
export declare class CobrosController {
    findAll(clienteId?: string, metodoPago?: string): {
        cliente: import("../data/mock-data").Cliente | undefined;
        id: number;
        facturaId: number;
        clienteId: number;
        fecha: string;
        monto: number;
        metodoPago: "EFECTIVO" | "TRANSFERENCIA" | "CHEQUE";
    }[];
    resumen(): {
        totalCobrado: string;
        porMetodo: Record<string, number>;
        totalCobros: number;
    };
    findOne(id: number): {
        error: string;
        id: number;
    } | {
        cliente: import("../data/mock-data").Cliente | undefined;
        id: number;
        facturaId: number;
        clienteId: number;
        fecha: string;
        monto: number;
        metodoPago: "EFECTIVO" | "TRANSFERENCIA" | "CHEQUE";
        error?: undefined;
    };
    create(body: Omit<Cobro, 'id'>): {
        error: string;
        mensaje?: undefined;
        cobro?: undefined;
    } | {
        mensaje: string;
        cobro: Cobro;
        error?: undefined;
    };
}
