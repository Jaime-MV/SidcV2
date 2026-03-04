import { PrismaService } from '../prisma/prisma.service';
import { PromotionsService } from '../promotions/promotions.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { CreateDevolucionDto } from './dto/create-devolucion.dto';
export declare class SalesService {
    private readonly prisma;
    private readonly promotionsService;
    constructor(prisma: PrismaService, promotionsService: PromotionsService);
    create(dto: CreateVentaDto): Promise<{
        factura: {
            id: number;
            total: import("@prisma/client/runtime/library").Decimal;
            numeroFactura: string;
            ventaId: number;
            fechaEmision: Date;
            estado: import(".prisma/client").$Enums.EstadoFactura;
        };
        vendedor: {
            nombre: string;
            id: number;
            telefono: string | null;
            activo: boolean;
        };
        cliente: {
            nombre: string;
            id: number;
            identificacion: string;
            direccion: string;
            telefono: string | null;
            email: string | null;
            limiteCredito: import("@prisma/client/runtime/library").Decimal;
            diasCredito: number;
            rutaId: number | null;
            saldoActual: import("@prisma/client/runtime/library").Decimal;
        };
        detalles: ({
            producto: {
                nombre: string;
                descripcion: string | null;
                codigoBarras: string | null;
                precioBase: import("@prisma/client/runtime/library").Decimal;
                categoriaId: number;
                id: number;
            };
        } & {
            productoId: number;
            id: number;
            cantidad: number;
            ventaId: number;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
        })[];
        id: number;
        total: import("@prisma/client/runtime/library").Decimal;
        clienteId: number;
        vendedorId: number;
        fecha: Date;
        estado: import(".prisma/client").$Enums.EstadoVenta;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        descuentoTotal: import("@prisma/client/runtime/library").Decimal;
    }>;
    findAll(page?: number, pageSize?: number, estado?: string): Promise<{
        items: ({
            vendedor: {
                nombre: string;
                id: number;
                telefono: string | null;
                activo: boolean;
            };
            cliente: {
                nombre: string;
                id: number;
                identificacion: string;
                direccion: string;
                telefono: string | null;
                email: string | null;
                limiteCredito: import("@prisma/client/runtime/library").Decimal;
                diasCredito: number;
                rutaId: number | null;
                saldoActual: import("@prisma/client/runtime/library").Decimal;
            };
            factura: {
                id: number;
                total: import("@prisma/client/runtime/library").Decimal;
                numeroFactura: string;
                ventaId: number;
                fechaEmision: Date;
                estado: import(".prisma/client").$Enums.EstadoFactura;
            } | null;
        } & {
            id: number;
            total: import("@prisma/client/runtime/library").Decimal;
            clienteId: number;
            vendedorId: number;
            fecha: Date;
            estado: import(".prisma/client").$Enums.EstadoVenta;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            descuentoTotal: import("@prisma/client/runtime/library").Decimal;
        })[];
        total: number;
        page: number;
        pageSize: number;
        pages: number;
    }>;
    findOne(id: number): Promise<{
        vendedor: {
            nombre: string;
            id: number;
            telefono: string | null;
            activo: boolean;
        };
        cliente: {
            nombre: string;
            id: number;
            identificacion: string;
            direccion: string;
            telefono: string | null;
            email: string | null;
            limiteCredito: import("@prisma/client/runtime/library").Decimal;
            diasCredito: number;
            rutaId: number | null;
            saldoActual: import("@prisma/client/runtime/library").Decimal;
        };
        factura: ({
            cobros: {
                id: number;
                monto: import("@prisma/client/runtime/library").Decimal;
                metodoPago: import(".prisma/client").$Enums.MetodoPago;
                referenciaPago: string | null;
                facturaId: number;
                clienteId: number;
                fecha: Date;
            }[];
        } & {
            id: number;
            total: import("@prisma/client/runtime/library").Decimal;
            numeroFactura: string;
            ventaId: number;
            fechaEmision: Date;
            estado: import(".prisma/client").$Enums.EstadoFactura;
        }) | null;
        detalles: ({
            producto: {
                nombre: string;
                descripcion: string | null;
                codigoBarras: string | null;
                precioBase: import("@prisma/client/runtime/library").Decimal;
                categoriaId: number;
                id: number;
            };
        } & {
            productoId: number;
            id: number;
            cantidad: number;
            ventaId: number;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
        })[];
        devoluciones: {
            id: number;
            fecha: Date;
            ventaId: number;
            estado: import(".prisma/client").$Enums.EstadoDevolucion;
            motivo: string;
        }[];
    } & {
        id: number;
        total: import("@prisma/client/runtime/library").Decimal;
        clienteId: number;
        vendedorId: number;
        fecha: Date;
        estado: import(".prisma/client").$Enums.EstadoVenta;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        descuentoTotal: import("@prisma/client/runtime/library").Decimal;
    }>;
    createDevolucion(dto: CreateDevolucionDto): Promise<{
        venta: {
            id: number;
            total: import("@prisma/client/runtime/library").Decimal;
            clienteId: number;
            vendedorId: number;
            fecha: Date;
            estado: import(".prisma/client").$Enums.EstadoVenta;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            descuentoTotal: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: number;
        fecha: Date;
        ventaId: number;
        estado: import(".prisma/client").$Enums.EstadoDevolucion;
        motivo: string;
    }>;
    getProductosMasVendidos(limit?: number): Promise<{
        producto: ({
            categoria: {
                nombre: string;
                descripcion: string | null;
                id: number;
            };
        } & {
            nombre: string;
            descripcion: string | null;
            codigoBarras: string | null;
            precioBase: import("@prisma/client/runtime/library").Decimal;
            categoriaId: number;
            id: number;
        }) | null;
        totalVendido: number | null;
    }[]>;
}
