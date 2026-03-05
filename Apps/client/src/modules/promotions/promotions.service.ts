import { promocionesApi, type Promocion } from '../../services/api';

export type { Promocion };

export const promotionsService = {
    getAll: () => promocionesApi.getPromociones(),
    getVigentes: () => promocionesApi.getVigentes(),
    create: (data: Parameters<typeof promocionesApi.createPromocion>[0]) =>
        promocionesApi.createPromocion(data),
    toggle: (id: number) => promocionesApi.toggleActiva(id),
};
