import { api } from '../../services/api';

export interface Venta {
    id: number;
    clienteId: number;
    vendedorId: number;
    total: number;
    estado: string;
    fecha: string;
    detalles?: DetalleVenta[];
    cliente?: { nombre: string };
    vendedor?: { nombre: string };
}

export interface DetalleVenta {
    id: number;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    producto?: { nombre: string };
}

export interface Devolucion {
    id: number;
    ventaId: number;
    motivo: string;
    fecha: string;
}

export const salesService = {
    getAll: (page = 1, pageSize = 20, estado?: string) =>
        api.get<{ data: Venta[]; total: number }>(`/sales?page=${page}&pageSize=${pageSize}${estado ? `&estado=${estado}` : ''}`),
    getById: (id: number) => api.get<Venta>(`/sales/${id}`),
    create: (data: { clienteId: number; vendedorId: number; detalles: { productoId: number; cantidad: number }[] }) =>
        api.post<Venta>('/sales', data),
    createDevolucion: (data: { ventaId: number; motivo: string }) =>
        api.post<Devolucion>('/sales/devoluciones', data),
    getMasVendidos: (limit = 10) => api.get(`/sales/reportes/mas-vendidos?limit=${limit}`),
};
