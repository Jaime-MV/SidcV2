import { rutasApi, type Vendedor, type Ruta } from '../../services/api';

export type { Vendedor, Ruta };

export const logisticsService = {
    // Vendedores
    getVendedores: () => rutasApi.getVendedores(),
    createVendedor: (data: Parameters<typeof rutasApi.createVendedor>[0]) =>
        rutasApi.createVendedor(data),
    updateVendedor: (id: number, data: Partial<Vendedor>) =>
        rutasApi.updateVendedor(id, data),

    // Rutas
    getRutas: () => rutasApi.getRutas(),
    createRuta: (data: Parameters<typeof rutasApi.createRuta>[0]) =>
        rutasApi.createRuta(data),
};
