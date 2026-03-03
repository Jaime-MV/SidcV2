import { PrismaService } from '../prisma/prisma.service';
export declare class ClientesController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(activo?: string, tipo?: string): Promise<any>;
    conCreditoDisponible(): Promise<any>;
    findOne(id: number): Promise<any>;
    create(body: any): Promise<any>;
    update(id: number, body: any): Promise<any>;
    remove(id: number): Promise<any>;
}
