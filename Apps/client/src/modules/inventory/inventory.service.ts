import { api } from '../../services/api';

export interface Categoria {
    id: number;
    nombre: string;
    descripcion?: string;
}

export interface Producto {
    id: number;
    nombre: string;
    descripcion?: string;
    codigoBarras?: string;
    precioBase: number;
    categoriaId: number;
    categoria?: Categoria;
}

export interface Lote {
    id: number;
    numeroLote: string;
    fechaFabricacion: string;
    fechaVencimiento: string;
    cantidadInicial: number;
    cantidadActual: number;
    productoId: number;
    producto?: Producto;
}

export const inventoryService = {
    // Categorías
    getCategorias: () => api.get<Categoria[]>('/inventory/categorias'),
    createCategoria: (data: { nombre: string; descripcion?: string }) =>
        api.post<Categoria>('/inventory/categorias', data),

    // Productos
    getProductos: (page = 1, pageSize = 20) =>
        api.get<{ data: Producto[]; total: number }>(`/inventory/productos?page=${page}&pageSize=${pageSize}`),
    createProducto: (data: { nombre: string; descripcion?: string; codigoBarras?: string; precioBase: number; categoriaId: number }) =>
        api.post<Producto>('/inventory/productos', data),

    // Lotes
    getLotes: (productoId?: number) =>
        api.get<Lote[]>(`/inventory/lotes${productoId ? `?productoId=${productoId}` : ''}`),
    createLote: (data: { numeroLote: string; fechaFabricacion: string; fechaVencimiento: string; cantidadInicial: number; productoId: number }) =>
        api.post<Lote>('/inventory/lotes', data),

    // Reportes
    getInventarioPorLote: () => api.get('/inventory/reportes/inventario-lote'),
    getProximosVencer: (dias = 30) => api.get(`/inventory/reportes/proximos-vencer?dias=${dias}`),
};
