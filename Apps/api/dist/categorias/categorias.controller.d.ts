import { Categoria } from '../data/mock-data';
export declare class CategoriasController {
    private data;
    private nextId;
    findAll(activa?: string): Categoria[];
    findOne(id: number): Categoria | {
        error: string;
        id: number;
    };
    create(body: Omit<Categoria, 'id'>): Categoria;
    update(id: number, body: Partial<Categoria>): Categoria | {
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
