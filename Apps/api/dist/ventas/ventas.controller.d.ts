import { Venta, DetalleVenta, Factura } from '../data/mock-data';
export declare class VentasController {
    findAll(estado?: string, clienteId?: string): {
        cliente: import("../data/mock-data").Cliente | undefined;
        vendedor: import("../data/mock-data").Vendedor | undefined;
        id: number;
        clienteId: number;
        vendedorId: number;
        rutaId: number;
        fecha: string;
        estado: "PENDIENTE" | "FACTURADA" | "ANULADA";
        detalles: DetalleVenta[];
        total: number;
        tipo: "CONTADO" | "CREDITO";
    }[];
    findOne(id: number): {
        error: string;
        id: number;
    } | {
        cliente: import("../data/mock-data").Cliente | undefined;
        vendedor: import("../data/mock-data").Vendedor | undefined;
        detallesEnriquecidos: {
            producto: import("../data/mock-data").Producto | undefined;
            lote: import("../data/mock-data").Lote | undefined;
            productoId: number;
            loteId: number;
            cantidad: number;
            precioUnitario: number;
            descuento: number;
            subtotal: number;
        }[];
        id: number;
        clienteId: number;
        vendedorId: number;
        rutaId: number;
        fecha: string;
        estado: "PENDIENTE" | "FACTURADA" | "ANULADA";
        detalles: DetalleVenta[];
        total: number;
        tipo: "CONTADO" | "CREDITO";
        error?: undefined;
    };
    create(body: {
        clienteId: number;
        vendedorId: number;
        rutaId: number;
        tipo: 'CONTADO' | 'CREDITO';
        detalles: DetalleVenta[];
    }): Venta | {
        error: string;
        disponible?: undefined;
        total?: undefined;
    } | {
        error: string;
        disponible: number;
        total: number;
    };
    facturar(id: number): {
        error: string;
        mensaje?: undefined;
        venta?: undefined;
        factura?: undefined;
    } | {
        mensaje: string;
        venta: Venta;
        factura: Factura;
        error?: undefined;
    };
    anular(id: number): {
        error: string;
        mensaje?: undefined;
        id?: undefined;
    } | {
        mensaje: string;
        id: number;
        error?: undefined;
    };
}
export declare class FacturasController {
    findAll(estado?: string): {
        venta: Venta | undefined;
        cliente: import("../data/mock-data").Cliente | undefined;
        id: number;
        ventaId: number;
        numero: string;
        fecha: string;
        total: number;
        estado: "PENDIENTE" | "PAGADA" | "ANULADA";
        tipo: "CONTADO" | "CREDITO";
    }[];
    pendientes(): {
        cliente: import("../data/mock-data").Cliente | null | undefined;
        id: number;
        ventaId: number;
        numero: string;
        fecha: string;
        total: number;
        estado: "PENDIENTE" | "PAGADA" | "ANULADA";
        tipo: "CONTADO" | "CREDITO";
    }[];
    findOne(id: number): {
        error: string;
        id: number;
    } | {
        venta: Venta | undefined;
        cliente: import("../data/mock-data").Cliente | null | undefined;
        id: number;
        ventaId: number;
        numero: string;
        fecha: string;
        total: number;
        estado: "PENDIENTE" | "PAGADA" | "ANULADA";
        tipo: "CONTADO" | "CREDITO";
        error?: undefined;
    };
}
