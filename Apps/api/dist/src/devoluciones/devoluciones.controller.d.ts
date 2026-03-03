import { PrismaService } from '../prisma/prisma.service';
export declare class DevolucionesController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
    pendientes(): Promise<any>;
    findOne(id: number): Promise<any>;
    create(body: any): Promise<any>;
    aprobar(id: number): Promise<any>;
    rechazar(id: number): Promise<any>;
}
