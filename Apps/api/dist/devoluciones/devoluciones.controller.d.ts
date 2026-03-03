import { Devolucion } from '../data/mock-data';
export declare class DevolucionesController {
    findAll(): {
        cliente: import("../data/mock-data").Cliente | undefined;
        ventaInfo: import("../data/mock-data").Venta | undefined;
        detallesEnriquecidos: {
            producto: import("../data/mock-data").Producto | undefined;
            productoId: number;
            cantidad: number;
            monto: number;
        }[];
        id: number;
        ventaId: number;
        clienteId: number;
        fecha: string;
        motivo: string;
        detalles: {
            productoId: number;
            cantidad: number;
            monto: number;
        }[];
        totalDevuelto: number;
        estado: "PENDIENTE" | "APROBADA" | "RECHAZADA";
    }[];
    pendientes(): {
        cliente: import("../data/mock-data").Cliente | undefined;
        id: number;
        ventaId: number;
        clienteId: number;
        fecha: string;
        motivo: string;
        detalles: {
            productoId: number;
            cantidad: number;
            monto: number;
        }[];
        totalDevuelto: number;
        estado: "PENDIENTE" | "APROBADA" | "RECHAZADA";
    }[];
    findOne(id: number): {
        error: string;
        id: number;
    } | {
        cliente: import("../data/mock-data").Cliente | undefined;
        venta: import("../data/mock-data").Venta | undefined;
        detallesEnriquecidos: {
            producto: import("../data/mock-data").Producto | undefined;
            productoId: number;
            cantidad: number;
            monto: number;
        }[];
        id: number;
        ventaId: number;
        clienteId: number;
        fecha: string;
        motivo: string;
        detalles: {
            productoId: number;
            cantidad: number;
            monto: number;
        }[];
        totalDevuelto: number;
        estado: "PENDIENTE" | "APROBADA" | "RECHAZADA";
        error?: undefined;
    };
    create(body: Omit<Devolucion, 'id' | 'estado'>): Devolucion | {
        error: string;
    };
    aprobar(id: number): {
        error: string;
        mensaje?: undefined;
        devolucion?: undefined;
    } | {
        mensaje: string;
        devolucion: Devolucion;
        error?: undefined;
    };
    rechazar(id: number): {
        error: string;
        mensaje?: undefined;
        devolucion?: undefined;
    } | {
        mensaje: string;
        devolucion: Devolucion;
        error?: undefined;
    };
}
