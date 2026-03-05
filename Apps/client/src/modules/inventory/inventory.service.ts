import { inventarioApi, type Categoria, type Producto, type Lote } from '../../services/api';

export type { Categoria, Producto, Lote };

export const inventoryService = {
    // Categorías
    getCategorias: () => inventarioApi.getCategorias(),
    createCategoria: (data: Parameters<typeof inventarioApi.createCategoria>[0]) =>
        inventarioApi.createCategoria(data),

    // Productos
    getProductos: (page = 1, pageSize = 20) =>
        inventarioApi.getProductos(page, pageSize),
    createProducto: (data: Parameters<typeof inventarioApi.createProducto>[0]) =>
        inventarioApi.createProducto(data),

    // Lotes
    getLotes: (productoId?: number) =>
        inventarioApi.getLotes(productoId),
    createLote: (data: Parameters<typeof inventarioApi.createLote>[0]) =>
        inventarioApi.createLote(data),

    // Reportes
    getInventarioPorLote: () => inventarioApi.getInventarioPorLote(),
    getProximosVencer: (dias = 30) => inventarioApi.getProximosVencer(dias),
};
