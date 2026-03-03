import { Cliente } from '../data/mock-data';
export declare class ClientesController {
    private data;
    private nextId;
    findAll(tipo?: string, activo?: string): Cliente[];
    conCreditoDisponible(): {
        creditoDisponible: number;
        porcentajeUsado: string;
        id: number;
        nombre: string;
        tipo: "CONTADO" | "CREDITO";
        direccion: string;
        telefono: string;
        email: string;
        limiteCredito: number;
        saldoCredito: number;
        activo: boolean;
    }[];
    findOne(id: number): {
        error: string;
        id: number;
    } | {
        creditoDisponible: number | null;
        id: number;
        nombre: string;
        tipo: "CONTADO" | "CREDITO";
        direccion: string;
        telefono: string;
        email: string;
        limiteCredito: number;
        saldoCredito: number;
        activo: boolean;
        error?: undefined;
    };
    create(body: Omit<Cliente, 'id'>): Cliente;
    update(id: number, body: Partial<Cliente>): Cliente | {
        error: string;
        id: number;
        limite?: undefined;
        saldo?: undefined;
    } | {
        error: string;
        limite: number;
        saldo: number;
        id?: undefined;
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
