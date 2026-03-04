import { api } from '../../services/api';

export interface Promocion {
    id: number;
    nombre: string;
    descripcion?: string;
    fechaInicio: string;
    fechaFin: string;
    porcentajeDesc: number;
    activa: boolean;
    productoIds?: number[];
}

export const promotionsService = {
    getAll: () => api.get<Promocion[]>('/promotions'),
    getVigentes: () => api.get<Promocion[]>('/promotions/vigentes'),
    getById: (id: number) => api.get<Promocion>(`/promotions/${id}`),
    create: (data: Omit<Promocion, 'id' | 'activa'> & { productoIds: number[] }) =>
        api.post<Promocion>('/promotions', data),
    toggle: (id: number) => api.patch<Promocion>(`/promotions/${id}/toggle`, {}),
};
