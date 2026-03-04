import { api } from '../../services/api';

export interface Cliente {
    id: number;
    nombre: string;
    identificacion: string;
    direccion: string;
    telefono?: string;
    email?: string;
    limiteCredito?: number;
    diasCredito?: number;
    rutaId?: number;
}

export interface Cobro {
    id: number;
    clienteId: number;
    monto: number;
    fecha: string;
}

export const clientsService = {
    getAll: (page = 1, pageSize = 20) =>
        api.get<{ data: Cliente[]; total: number }>(`/clients?page=${page}&pageSize=${pageSize}`),
    getById: (id: number) => api.get<Cliente>(`/clients/${id}`),
    create: (data: Omit<Cliente, 'id'>) => api.post<Cliente>('/clients', data),
    update: (id: number, data: Partial<Cliente>) => api.patch<Cliente>(`/clients/${id}`, data),
    getCobros: (clienteId: number) => api.get<Cobro[]>(`/clients/${clienteId}/cobros`),
    createCobro: (data: { clienteId: number; monto: number }) => api.post<Cobro>('/clients/cobros', data),
};
