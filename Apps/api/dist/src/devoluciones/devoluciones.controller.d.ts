import { PrismaService } from '../prisma/prisma.service';
export declare class DevolucionesController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        venta: {
            cliente: {
                id: number;
                nombre: string;
                activo: boolean;
                tipo: string;
                identificacion: string | null;
                direccion: string;
                telefono: string | null;
                email: string | null;
                limiteCredito: import("@prisma/client-runtime-utils").Decimal;
                saldoCredito: import("@prisma/client-runtime-utils").Decimal;
                diasCredito: number;
                rutaId: number | null;
            };
        } & {
            id: number;
            tipo: string;
            vendedorId: number;
            estado: string;
            clienteId: number;
            fecha: Date;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            descuentoTotal: import("@prisma/client-runtime-utils").Decimal;
            total: import("@prisma/client-runtime-utils").Decimal;
        };
    } & {
        id: number;
        estado: string;
        fecha: Date;
        ventaId: number;
        motivo: string;
    })[]>;
    pendientes(): Promise<({
        venta: {
            cliente: {
                id: number;
                nombre: string;
                activo: boolean;
                tipo: string;
                identificacion: string | null;
                direccion: string;
                telefono: string | null;
                email: string | null;
                limiteCredito: import("@prisma/client-runtime-utils").Decimal;
                saldoCredito: import("@prisma/client-runtime-utils").Decimal;
                diasCredito: number;
                rutaId: number | null;
            };
        } & {
            id: number;
            tipo: string;
            vendedorId: number;
            estado: string;
            clienteId: number;
            fecha: Date;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            descuentoTotal: import("@prisma/client-runtime-utils").Decimal;
            total: import("@prisma/client-runtime-utils").Decimal;
        };
    } & {
        id: number;
        estado: string;
        fecha: Date;
        ventaId: number;
        motivo: string;
    })[]>;
    findOne(id: number): Promise<({
        venta: {
            cliente: {
                id: number;
                nombre: string;
                activo: boolean;
                tipo: string;
                identificacion: string | null;
                direccion: string;
                telefono: string | null;
                email: string | null;
                limiteCredito: import("@prisma/client-runtime-utils").Decimal;
                saldoCredito: import("@prisma/client-runtime-utils").Decimal;
                diasCredito: number;
                rutaId: number | null;
            };
            detalles: ({
                producto: {
                    id: number;
                    nombre: string;
                    descripcion: string | null;
                    categoriaId: number;
                    activo: boolean;
                    codigo: string | null;
                    precio: import("@prisma/client-runtime-utils").Decimal;
                    unidad: string | null;
                };
            } & {
                id: number;
                cantidad: number;
                productoId: number;
                subtotal: import("@prisma/client-runtime-utils").Decimal;
                ventaId: number;
                precioUnitario: import("@prisma/client-runtime-utils").Decimal;
                descuento: import("@prisma/client-runtime-utils").Decimal;
                loteId: number | null;
            })[];
        } & {
            id: number;
            tipo: string;
            vendedorId: number;
            estado: string;
            clienteId: number;
            fecha: Date;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            descuentoTotal: import("@prisma/client-runtime-utils").Decimal;
            total: import("@prisma/client-runtime-utils").Decimal;
        };
    } & {
        id: number;
        estado: string;
        fecha: Date;
        ventaId: number;
        motivo: string;
    }) | {
        error: string;
        id: number;
    }>;
    create(body: any): Promise<({
        venta: {
            cliente: {
                id: number;
                nombre: string;
                activo: boolean;
                tipo: string;
                identificacion: string | null;
                direccion: string;
                telefono: string | null;
                email: string | null;
                limiteCredito: import("@prisma/client-runtime-utils").Decimal;
                saldoCredito: import("@prisma/client-runtime-utils").Decimal;
                diasCredito: number;
                rutaId: number | null;
            };
        } & {
            id: number;
            tipo: string;
            vendedorId: number;
            estado: string;
            clienteId: number;
            fecha: Date;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            descuentoTotal: import("@prisma/client-runtime-utils").Decimal;
            total: import("@prisma/client-runtime-utils").Decimal;
        };
    } & {
        id: number;
        estado: string;
        fecha: Date;
        ventaId: number;
        motivo: string;
    }) | {
        error: string;
    }>;
    aprobar(id: number): Promise<{
        id: number;
        estado: string;
        fecha: Date;
        ventaId: number;
        motivo: string;
    } | {
        error: string;
    }>;
    rechazar(id: number): Promise<{
        id: number;
        estado: string;
        fecha: Date;
        ventaId: number;
        motivo: string;
    } | {
        error: string;
    }>;
}
