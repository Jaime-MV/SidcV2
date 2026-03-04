import { api } from '../../services/api';

export interface Vendedor {
    id: number;
    nombre: string;
    telefono?: string;
    activo: boolean;
}

export interface Ruta {
    id: number;
    nombre: string;
    descripcion?: string;
    vendedorId: number;
    vendedor?: Vendedor;
}

export const logisticsService = {
    // Vendedores
    getVendedores: () => api.get<Vendedor[]>('/logistics/vendedores'),
    getVendedorById: (id: number) => api.get<Vendedor>(`/logistics/vendedores/${id}`),
    createVendedor: (data: { nombre: string; telefono?: string }) =>
        api.post<Vendedor>('/logistics/vendedores', data),
    updateVendedor: (id: number, data: Partial<Vendedor>) =>
        api.patch<Vendedor>(`/logistics/vendedores/${id}`, data),

    // Rutas
    getRutas: () => api.get<Ruta[]>('/logistics/rutas'),
    getRutaById: (id: number) => api.get<Ruta>(`/logistics/rutas/${id}`),
    createRuta: (data: { nombre: string; descripcion?: string; vendedorId: number }) =>
        api.post<Ruta>('/logistics/rutas', data),
};
