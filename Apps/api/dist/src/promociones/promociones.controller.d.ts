import { PrismaService } from '../prisma/prisma.service';
export declare class PromocionesController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(activa?: string): Promise<any>;
    vigentes(): Promise<any>;
    findOne(id: number): Promise<any>;
    create(body: any): Promise<any>;
    update(id: number, body: any): Promise<any>;
    remove(id: number): Promise<any>;
}
