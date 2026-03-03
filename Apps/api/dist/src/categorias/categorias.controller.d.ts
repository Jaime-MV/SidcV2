import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriasController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(activa?: string): Promise<{
        activa: boolean;
        id: number;
        nombre: string;
        descripcion: string | null;
    }[]>;
    findOne(id: number): Promise<{
        activa: boolean;
        id: number;
        nombre: string;
        descripcion: string | null;
    } | {
        error: string;
        id: number;
    }>;
    create(body: any): Promise<{
        activa: boolean;
        id: number;
        nombre: string;
        descripcion: string | null;
    }>;
    update(id: number, body: any): Promise<{
        activa: boolean;
        id: number;
        nombre: string;
        descripcion: string | null;
    } | {
        error: string;
        id: number;
    }>;
    remove(id: number): Promise<{
        activa: boolean;
        id: number;
        nombre: string;
        descripcion: string | null;
    } | {
        error: string;
        id: number;
    }>;
}
