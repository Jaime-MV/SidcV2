import { ventasApi, type Venta, type Devolucion } from '../../services/api';

export type { Venta, Devolucion };

export const salesService = {
    getAll: (page = 1, pageSize = 20, estado?: string) =>
        ventasApi.getVentas(page, pageSize, estado),
    create: (data: Parameters<typeof ventasApi.createVenta>[0]) =>
        ventasApi.createVenta(data),
    createDevolucion: (data: Parameters<typeof ventasApi.createDevolucion>[0]) =>
        ventasApi.createDevolucion(data),
    getMasVendidos: (limit = 10) => ventasApi.getMasVendidos(limit),
};
