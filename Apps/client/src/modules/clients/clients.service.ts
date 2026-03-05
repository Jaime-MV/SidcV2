import { clientesApi, type Cliente, type Cobro, type CreateClienteDto } from '../../services/api';

export type { Cliente, Cobro };

export const clientsService = {
    getAll: (page = 1, pageSize = 20) =>
        clientesApi.getClientes(page, pageSize),
    create: (data: CreateClienteDto) =>
        clientesApi.createCliente(data),
    update: (id: number, data: Partial<Cliente>) =>
        clientesApi.updateCliente(id, data),
    getCobros: (page = 1, pageSize = 100) =>
        clientesApi.getCobros(page, pageSize),
    createCobro: (data: Parameters<typeof clientesApi.createCobro>[0]) =>
        clientesApi.createCobro(data),
};
