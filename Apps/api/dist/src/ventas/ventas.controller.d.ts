import { PrismaService } from '../prisma/prisma.service';
export declare class VentasController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(estado?: string, clienteId?: string): Promise<({
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
        vendedor: {
            id: number;
            nombre: string;
            activo: boolean;
            codigo: string | null;
            telefono: string | null;
            email: string | null;
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
    })[]>;
    findOne(id: number): Promise<({
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
        factura: {
            id: number;
            numero: string;
            tipo: string;
            estado: string;
            fecha: Date;
            total: import("@prisma/client-runtime-utils").Decimal;
            ventaId: number;
        } | null;
        vendedor: {
            id: number;
            nombre: string;
            activo: boolean;
            codigo: string | null;
            telefono: string | null;
            email: string | null;
        };
        detalles: ({
            lote: {
                id: number;
                numero: string;
                fechaFabricacion: Date | null;
                fechaVencimiento: Date;
                cantidad: number;
                bodega: string | null;
                productoId: number;
            } | null;
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
    }) | {
        error: string;
        id: number;
    }>;
    create(body: any): Promise<({
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
        vendedor: {
            id: number;
            nombre: string;
            activo: boolean;
            codigo: string | null;
            telefono: string | null;
            email: string | null;
        };
        detalles: {
            id: number;
            cantidad: number;
            productoId: number;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            ventaId: number;
            precioUnitario: import("@prisma/client-runtime-utils").Decimal;
            descuento: import("@prisma/client-runtime-utils").Decimal;
            loteId: number | null;
        }[];
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
    }) | {
        error: string;
        disponible?: undefined;
        total?: undefined;
    } | {
        error: string;
        disponible: number;
        total: any;
    }>;
    facturar(id: number): Promise<{
        error: string;
        mensaje?: undefined;
        venta?: undefined;
        factura?: undefined;
    } | {
        mensaje: string;
        venta: {
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
        factura: {
            id: number;
            numero: string;
            tipo: string;
            estado: string;
            fecha: Date;
            total: import("@prisma/client-runtime-utils").Decimal;
            ventaId: number;
        };
        error?: undefined;
    }>;
    anular(id: number): Promise<{
        error: string;
        mensaje?: undefined;
        id?: undefined;
    } | {
        mensaje: string;
        id: number;
        error?: undefined;
    }>;
}
export declare class FacturasController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(estado?: string): Promise<({
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
        numero: string;
        tipo: string;
        estado: string;
        fecha: Date;
        total: import("@prisma/client-runtime-utils").Decimal;
        ventaId: number;
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
        numero: string;
        tipo: string;
        estado: string;
        fecha: Date;
        total: import("@prisma/client-runtime-utils").Decimal;
        ventaId: number;
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
        cobros: {
            id: number;
            clienteId: number;
            fecha: Date;
            monto: import("@prisma/client-runtime-utils").Decimal;
            metodoPago: string;
            referenciaPago: string | null;
            facturaId: number;
        }[];
    } & {
        id: number;
        numero: string;
        tipo: string;
        estado: string;
        fecha: Date;
        total: import("@prisma/client-runtime-utils").Decimal;
        ventaId: number;
    }) | {
        error: string;
        id: number;
    }>;
}
