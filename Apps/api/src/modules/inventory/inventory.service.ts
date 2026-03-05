import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { CreateProductoDto } from './dto/create-producto.dto';
import { CreateLoteDto } from './dto/create-lote.dto';
import { CreateBodegaDto } from './dto/create-bodega.dto';

@Injectable()
export class InventoryService {
    constructor(private readonly prisma: PrismaService) { }

    // ─── CATEGORÍAS ────────────────────────────────────────────────
    async createCategoria(dto: CreateCategoriaDto) {
        return this.prisma.categoria.create({ data: dto });
    }

    async findAllCategorias() {
        return this.prisma.categoria.findMany({ include: { productos: true } });
    }

    async findCategoriaById(id: number) {
        const cat = await this.prisma.categoria.findUnique({ where: { id }, include: { productos: true } });
        if (!cat) throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
        return cat;
    }

    // ─── PRODUCTOS ─────────────────────────────────────────────────
    async createProducto(dto: CreateProductoDto) {
        const categoria = await this.prisma.categoria.findUnique({ where: { id: dto.categoriaId } });
        if (!categoria) throw new NotFoundException(`Categoría con ID ${dto.categoriaId} no existe`);
        return this.prisma.producto.create({ data: dto, include: { categoria: true } });
    }

    async findAllProductos(page = 1, pageSize = 20) {
        const skip = (page - 1) * pageSize;
        const [items, total] = await Promise.all([
            this.prisma.producto.findMany({
                skip,
                take: pageSize,
                include: { categoria: true, lotes: true },
                orderBy: { id: 'desc' },
            }),
            this.prisma.producto.count(),
        ]);
        return { items, total, page, pageSize, pages: Math.ceil(total / pageSize) };
    }

    async findProductoById(id: number) {
        const prod = await this.prisma.producto.findUnique({
            where: { id },
            include: { categoria: true, lotes: { orderBy: { fechaVencimiento: 'asc' } } },
        });
        if (!prod) throw new NotFoundException(`Producto con ID ${id} no encontrado`);
        return prod;
    }

    // ─── LOTES ─────────────────────────────────────────────────────
    async createLote(dto: CreateLoteDto) {
        const producto = await this.prisma.producto.findUnique({ where: { id: dto.productoId } });
        if (!producto) throw new NotFoundException(`Producto con ID ${dto.productoId} no existe`);

        const fechaVenc = new Date(dto.fechaVencimiento);
        if (fechaVenc <= new Date()) throw new BadRequestException('La fecha de vencimiento debe ser futura');

        const lote = await this.prisma.lote.create({
            data: {
                numeroLote: dto.numeroLote,
                fechaFabricacion: new Date(dto.fechaFabricacion),
                fechaVencimiento: fechaVenc,
                cantidadInicial: dto.cantidadInicial,
                cantidadDisponible: dto.cantidadInicial,
                productoId: dto.productoId,
            },
            include: { producto: true },
        });

        // Registrar movimiento de ENTRADA
        await this.prisma.movimientoInventario.create({
            data: {
                tipoMovimiento: 'ENTRADA',
                cantidad: dto.cantidadInicial,
                loteId: lote.id,
                referencia: `Ingreso inicial Lote ${dto.numeroLote}`,
            },
        });

        return lote;
    }

    async findAllLotes(productoId?: number) {
        const where = productoId ? { productoId } : {};
        return this.prisma.lote.findMany({
            where,
            include: { producto: true },
            orderBy: { fechaVencimiento: 'asc' },
        });
    }

    async findLoteById(id: number) {
        const lote = await this.prisma.lote.findUnique({
            where: { id },
            include: { producto: true, movimientos: { orderBy: { fechaMovimiento: 'desc' } } },
        });
        if (!lote) throw new NotFoundException(`Lote con ID ${id} no encontrado`);
        return lote;
    }

    // ─── REPORTES ──────────────────────────────────────────────────
    async getInventarioPorLote() {
        return this.prisma.lote.findMany({
            where: { cantidadDisponible: { gt: 0 } },
            include: { producto: { include: { categoria: true } } },
            orderBy: { fechaVencimiento: 'asc' },
        });
    }

    async getProductosProximosAVencer(diasAlerta = 30) {
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() + diasAlerta);

        return this.prisma.lote.findMany({
            where: {
                cantidadDisponible: { gt: 0 },
                fechaVencimiento: { lte: fechaLimite, gt: new Date() },
            },
            include: { producto: { include: { categoria: true } } },
            orderBy: { fechaVencimiento: 'asc' },
        });
    }

    async getMovimientos(loteId?: number) {
        const where = loteId ? { loteId } : {};
        return this.prisma.movimientoInventario.findMany({
            where,
            include: { lote: { include: { producto: true } } },
            orderBy: { fechaMovimiento: 'desc' },
        });
    }

    // ─── BODEGAS ───────────────────────────────────────────────────
    async createBodega(dto: CreateBodegaDto) {
        return this.prisma.bodega.create({ data: dto, include: { productos: true } });
    }

    async findAllBodegas() {
        const bodegas = await this.prisma.bodega.findMany({
            include: { productos: { select: { id: true } } },
            orderBy: { id: 'asc' },
        });
        // Enriquecer con cantidad de SKUs
        return bodegas.map(b => ({ ...b, productos: b.productos.length }));
    }

    async findBodegaById(id: number) {
        const bodega = await this.prisma.bodega.findUnique({
            where: { id },
            include: { productos: { include: { categoria: true, lotes: true } } },
        });
        if (!bodega) throw new NotFoundException(`Bodega con ID ${id} no encontrada`);
        return bodega;
    }

    async updateBodega(id: number, dto: Partial<CreateBodegaDto>) {
        await this.findBodegaById(id);
        return this.prisma.bodega.update({ where: { id }, data: dto });
    }
}
