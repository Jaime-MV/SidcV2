import { PrismaService } from '../prisma/prisma.service';
export declare class ProductosController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(categoriaId?: string, activo?: string): Promise<any>;
    bajoStock(minimo?: string): Promise<any>;
    findOne(id: number): Promise<any>;
    create(body: any): Promise<any>;
    update(id: number, body: any): Promise<any>;
    remove(id: number): Promise<any>;
}
export declare class LotesController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(productoId?: string): Promise<any>;
    porVencer(dias?: string): Promise<any>;
    findOne(id: number): Promise<any>;
    create(body: any): Promise<any>;
    update(id: number, body: any): Promise<any>;
}
