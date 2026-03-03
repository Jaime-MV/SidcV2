import { PrismaService } from '../prisma/prisma.service';
export declare class CobrosController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
    resumen(): Promise<{
        cantidad: number;
        total: number;
        metodo: string;
    }[]>;
    findOne(id: number): Promise<any>;
    create(body: any): Promise<any>;
}
