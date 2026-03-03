import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriasController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(activa?: string): Promise<any>;
    findOne(id: number): Promise<any>;
    create(body: any): Promise<any>;
    update(id: number, body: any): Promise<any>;
    remove(id: number): Promise<any>;
}
