/**
 * SIDC API Service
 * Centraliza todas las llamadas al backend NestJS.
 */

const BASE = '/api';

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function get<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE}${path}`);
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? `Error ${res.status} en ${path}`);
    }
    return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        const msg = Array.isArray(error.message) ? error.message.join(', ') : (error.message ?? `Error ${res.status}`);
        throw new Error(msg);
    }
    return res.json();
}

async function patch<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        const msg = Array.isArray(error.message) ? error.message.join(', ') : (error.message ?? `Error ${res.status}`);
        throw new Error(msg);
    }
    return res.json();
}

// ─── Normalización de enums ───────────────────────────────────────────────────

export const estadoFacturaLabel: Record<string, string> = {
    CREADA: 'Pendiente',
    PAGADA: 'Pagada',
    PAGADA_PARCIALMENTE: 'Parcial',
    ANULADA: 'Anulada',
    VENCIDA: 'Vencida',
};

export const estadoClienteLabel: Record<string, string> = {
    ACTIVO: 'Activo',
    BLOQUEADO: 'Bloqueado',
    SUSPENDIDO: 'Suspendido',
};

export const estadoRutaLabel: Record<string, string> = {
    EN_RUTA: 'En Ruta',
    COMPLETADA: 'Completada',
    PENDIENTE: 'Pendiente',
    CANCELADA: 'Cancelada',
};

export const estadoCobroLabel: Record<string, string> = {
    COBRADO: 'Cobrado',
    PENDIENTE: 'Pendiente',
    VENCIDO: 'Vencido',
};

export const estadoDevolucionLabel: Record<string, string> = {
    PENDIENTE: 'Pendiente',
    PROCESADA: 'Procesada',
    RECHAZADA: 'Rechazada',
    APROBADA: 'Aprobada',
};

export const tipoClienteLabel: Record<string, string> = {
    SUPERMERCADO: 'Supermercado',
    FARMACIA: 'Farmacia',
    TIENDA: 'Tienda',
    MAYORISTA: 'Mayorista',
};

export const estadoPromocionLabel: Record<string, string> = {
    ACTIVA: 'Activa',
    PROXIMA: 'Próxima',
    EXPIRADA: 'Expirada',
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const dashboardApi = {
    getStats: () => get<DashboardStats>('/dashboard/stats'),
    getVentasMensuales: (meses = 6) => get<ResumenMensual[]>(`/dashboard/ventas-mensuales?meses=${meses}`),
    getVentasPorCategoria: () => get<VentasPorCategoria[]>('/dashboard/ventas-categoria'),
};

// ─── Inventario ───────────────────────────────────────────────────────────────

export const inventarioApi = {
    // GET
    getProductos: (page = 1, pageSize = 50) =>
        get<PaginatedResponse<Producto>>(`/inventory/productos?page=${page}&pageSize=${pageSize}`),
    getLotes: (productoId?: number) =>
        get<Lote[]>(`/inventory/lotes${productoId ? `?productoId=${productoId}` : ''}`),
    getCategorias: () => get<Categoria[]>('/inventory/categorias'),
    getProximosVencer: (dias = 30) => get<Lote[]>(`/inventory/reportes/proximos-vencer?dias=${dias}`),
    getInventarioPorLote: () => get<Lote[]>('/inventory/reportes/inventario-lote'),
    getBodegas: () => get<Bodega[]>('/inventory/bodegas'),
    // CREATE
    createCategoria: (dto: CreateCategoriaDto) => post<Categoria>('/inventory/categorias', dto),
    createProducto: (dto: CreateProductoDto) => post<Producto>('/inventory/productos', dto),
    createLote: (dto: CreateLoteDto) => post<Lote>('/inventory/lotes', dto),
    createBodega: (dto: CreateBodegaDto) => post<Bodega>('/inventory/bodegas', dto),
    // UPDATE
    updateBodega: (id: number, dto: Partial<CreateBodegaDto>) => patch<Bodega>(`/inventory/bodegas/${id}`, dto),
};

// ─── Ventas ───────────────────────────────────────────────────────────────────

export const ventasApi = {
    // GET
    getVentas: (page = 1, pageSize = 50, estado?: string) =>
        get<PaginatedResponse<Venta>>(`/sales?page=${page}&pageSize=${pageSize}${estado ? `&estado=${estado}` : ''}`),
    getFacturas: (page = 1, pageSize = 50, estado?: string) =>
        get<PaginatedResponse<Factura>>(`/sales/facturas?page=${page}&pageSize=${pageSize}${estado ? `&estado=${estado}` : ''}`),
    getDevoluciones: (page = 1, pageSize = 50) =>
        get<PaginatedResponse<Devolucion>>(`/sales/devoluciones?page=${page}&pageSize=${pageSize}`),
    getMasVendidos: (limit = 10) => get<ProductoMasVendido[]>(`/sales/reportes/mas-vendidos?limit=${limit}`),
    // CREATE
    createVenta: (dto: CreateVentaDto) => post<Venta>('/sales', dto),
    createDevolucion: (dto: CreateDevolucionDto) => post<Devolucion>('/sales/devoluciones', dto),
};

// ─── Clientes ─────────────────────────────────────────────────────────────────

export const clientesApi = {
    // GET
    getClientes: (page = 1, pageSize = 100, estado?: string, tipo?: string) =>
        get<PaginatedResponse<Cliente>>(
            `/clients?page=${page}&pageSize=${pageSize}${estado ? `&estado=${estado}` : ''}${tipo ? `&tipo=${tipo}` : ''}`
        ),
    getCobros: (page = 1, pageSize = 100, estado?: string) =>
        get<PaginatedResponse<Cobro>>(
            `/clients/cobros?page=${page}&pageSize=${pageSize}${estado ? `&estado=${estado}` : ''}`
        ),
    // CREATE
    createCliente: (dto: CreateClienteDto) => post<Cliente>('/clients', dto),
    createCobro: (dto: CreateCobroDto) => post<Cobro>('/clients/cobros', dto),
    // UPDATE
    updateCliente: (id: number, dto: Partial<CreateClienteDto & { estado?: string }>) =>
        patch<Cliente>(`/clients/${id}`, dto),
};

// ─── Rutas / Logística ────────────────────────────────────────────────────────

export const rutasApi = {
    // GET
    getRutas: () => get<Ruta[]>('/logistics/rutas'),
    getVendedores: () => get<Vendedor[]>('/logistics/vendedores'),
    // CREATE
    createRuta: (dto: CreateRutaDto) => post<Ruta>('/logistics/rutas', dto),
    createVendedor: (dto: CreateVendedorDto) => post<Vendedor>('/logistics/vendedores', dto),
    // UPDATE
    updateVendedor: (id: number, dto: Partial<CreateVendedorDto & { activo?: boolean }>) =>
        patch<Vendedor>(`/logistics/vendedores/${id}`, dto),
};

// ─── Promociones ──────────────────────────────────────────────────────────────

export const promocionesApi = {
    // GET
    getPromociones: () => get<Promocion[]>('/promotions'),
    getVigentes: () => get<Promocion[]>('/promotions/vigentes'),
    // CREATE / UPDATE
    createPromocion: (dto: CreatePromocionDto) => post<Promocion>('/promotions', dto),
    toggleActiva: (id: number) => patch<Promocion>(`/promotions/${id}/toggle`, {}),
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardStats {
    ventasMes: number;
    ventasMesAnterior: number;
    facturasPendientes: number;
    facturasVencidas: number;
    clientesActivos: number;
    clientesBloqueados: number;
    rutasActivas: number;
    rutasCompletadas: number;
    productosVencer: number;
    productosStockBajo: number;
    cobrosVencidos: number;
    montoVencido: number;
    productosMasVendidos?: { nombre: string; unidades: number; ingresos: number }[];
    totalInventario?: number;
}

export interface ResumenMensual {
    anio?: number;
    mes?: number;
    mesLabel: string;
    ventas: number;
    cobros: number;
    devoluciones: number;
}

export interface VentasPorCategoria {
    categoria: string;
    valor: number;
    valorAbsoluto?: number;
    color?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    pages: number;
}

export interface Categoria {
    id: number;
    nombre: string;
    descripcion?: string;
    colorHex?: string;
}

export interface Bodega {
    id: number;
    codigo?: string;
    nombre: string;
    ubicacion?: string;
    capacidadTotal: number;
    capacidadUsada: number;
    encargado?: string;
    productos?: number;
}

export interface Producto {
    id: number;
    codigo?: string;
    nombre: string;
    descripcion?: string;
    precioCompra: number;
    precioVenta: number;
    minStock: number;
    estadoProducto?: string;
    categoriaId: number;
    bodegaId?: number;
    categoria?: Categoria;
    bodega?: Bodega;
    lotes?: Lote[];
}

export interface Lote {
    id: number;
    numeroLote: string;
    fechaFabricacion: string;
    fechaVencimiento: string;
    cantidadInicial: number;
    cantidadDisponible: number;
    productoId: number;
    producto?: Producto;
}

export interface Vendedor {
    id: number;
    nombre: string;
    telefono?: string;
    activo: boolean;
}

export interface Ruta {
    id: number;
    codigo?: string;
    nombre: string;
    descripcion?: string;
    vehiculo?: string;
    kmEstimados?: number;
    horaInicio?: string;
    horaFin?: string;
    departamento?: string;
    estado: string;
    clientesTotal?: number;
    entregasHoy?: number;
    entregasCompletadas?: number;
    vendedorId: number;
    vendedor?: Vendedor;
    clientes?: Cliente[];
}

export interface Cliente {
    id: number;
    codigo?: string;
    nombre: string;
    identificacion: string;
    direccion: string;
    telefono?: string;
    email?: string;
    tipo: string;
    estado: string;
    limiteCredito: number;
    saldoActual: number;
    diasCredito: number;
    ultimaCompra?: string;
    rutaId?: number;
    ruta?: Ruta;
}

export interface Factura {
    id: number;
    numeroFactura: string;
    fechaEmision: string;
    fechaVencimiento?: string;
    total: number;
    estado: string;
    ventaId: number;
    venta?: Venta;
    cobros?: { monto: number }[];
}

export interface Venta {
    id: number;
    fecha: string;
    subtotal: number;
    descuentoTotal: number;
    total: number;
    estado: string;
    clienteId: number;
    vendedorId: number;
    cliente?: Cliente;
    vendedor?: Vendedor;
    factura?: Factura;
}

export interface Cobro {
    id: number;
    codigo?: string;
    fecha: string;
    fechaPago?: string;
    monto: number;
    metodoPago?: string;
    referenciaPago?: string;
    estado: string;
    diasVencido?: number;
    facturaId: number;
    clienteId: number;
    factura?: Factura;
    cliente?: Cliente;
}

export interface Devolucion {
    id: number;
    codigo?: string;
    fecha: string;
    motivo: string;
    estado: string;
    cantidad: number;
    monto: number;
    ventaId: number;
    productoId: number;
    venta?: Venta;
    producto?: Producto;
}

export interface Promocion {
    id: number;
    codigo?: string;
    nombre: string;
    tipo: string;
    descripcion?: string;
    fechaInicio: string;
    fechaFin: string;
    porcentajeDesc: number;
    canal?: string;
    usos: number;
    presupuesto: number;
    gastado: number;
    estado: string;
    activa: boolean;
    productos?: { producto: Producto }[];
}

export interface ProductoMasVendido {
    nombre?: string;
    producto?: Producto;
    totalVendido?: number;
    unidades?: number;
    ingresos?: number;
}

// ─── DTO interfaces (para tipar los formularios) ──────────────────────────────

export interface CreateCategoriaDto {
    nombre: string;
    descripcion?: string;
    colorHex?: string;
}

export interface CreateProductoDto {
    nombre: string;
    descripcion?: string;
    codigoBarras?: string;
    precioBase: number;
    categoriaId: number;
}

export interface CreateLoteDto {
    numeroLote: string;
    fechaFabricacion: string;
    fechaVencimiento: string;
    cantidadInicial: number;
    productoId: number;
}

export interface CreateBodegaDto {
    nombre: string;
    codigo?: string;
    ubicacion?: string;
    capacidadTotal?: number;
    encargado?: string;
}

export interface CreateClienteDto {
    nombre: string;
    identificacion: string;
    direccion: string;
    telefono?: string;
    email?: string;
    limiteCredito?: number;
    diasCredito?: number;
    rutaId?: number;
    tipo?: string;
    estado?: string;
}

export interface CreateCobroDto {
    facturaId: number;
    monto: number;
    metodoPago?: string;
    referenciaPago?: string;
}

export interface CreateVentaDto {
    clienteId: number;
    vendedorId: number;
    detalles: { productoId: number; cantidad: number }[];
}

export interface CreateDevolucionDto {
    ventaId: number;
    productoId: number;
    cantidad: number;
    motivo: string;
}

export interface CreateRutaDto {
    nombre: string;
    descripcion?: string;
    vendedorId: number;
}

export interface CreateVendedorDto {
    nombre: string;
    telefono?: string;
}

export interface CreatePromocionDto {
    nombre: string;
    descripcion?: string;
    fechaInicio: string;
    fechaFin: string;
    porcentajeDesc: number;
    activa?: boolean;
    productoIds: number[];
}

// ─── Reportes ─────────────────────────────────────────────────────────────────

export interface FiltrosReporte {
    dias?: string[];
    semanas?: string[];
    anios?: number[];
}

export interface ReporteGeneral {
    meta: {
        generadoEn: string;
        filtros: FiltrosReporte;
        periodoDescripcion: string;
    };
    resumenVentas: {
        totalBruto: number;
        totalDescuentos: number;
        totalDevoluciones: number;
        totalNeto: number;
        promedioVenta: number;
        ventaMaxima: number;
        ventaMinima: number;
        cantidadVentas: number;
        completadas: number;
        anuladas: number;
        pendientes: number;
        tasaCompletacion: number;
    };
    facturacion: {
        totalFacturas: number;
        pagadas: { count: number; monto: number };
        pendientes: { count: number; monto: number };
        vencidas: { count: number; monto: number };
        tasaCobranza: number;
    };
    cobros: {
        cobrados: { count: number; monto: number };
        pendientes: { count: number; monto: number };
        vencidos: { count: number; monto: number };
    };
    devoluciones: {
        cantidad: number;
        unidadesDevueltas: number;
        montoTotal: number;
        tasaDevolucion: number;
    };
    topProductos: {
        productoId: number;
        nombre: string;
        codigo?: string;
        categoria: string;
        unidadesVendidas: number;
        ingresos: number;
    }[];
    ventasPorCategoria: {
        categoria: string;
        cantidad: number;
        ingresos: number;
        color: string;
    }[];
    ventasPorVendedor: {
        vendedorId: number;
        nombre: string;
        totalVentas: number;
        cantidadVentas: number;
    }[];
    topClientes: {
        clienteId: number;
        nombre: string;
        tipo: string;
        totalCompras: number;
        cantidadCompras: number;
    }[];
    inventario: {
        totalProductos: number;
        lotesActivos: number;
        lotesProxVencer: number;
        lotesVencidos: number;
        movimientos: { tipo: string; count: number; totalUnidades: number }[];
    };
    promociones: {
        activas: number;
        expiradas: number;
        proximas: number;
    };
    clientes: {
        activos: number;
        bloqueados: number;
        suspendidos: number;
        saldoCreditoTotal: number;
        limiteCreditoTotal: number;
    };
    ventasDiarias: { fecha: string; total: number }[];
}

export const reportsApi = {
    getReporteGeneral: (filtros: FiltrosReporte) => {
        const params = new URLSearchParams();
        if (filtros.dias?.length) params.set('dias', filtros.dias.join(','));
        if (filtros.semanas?.length) params.set('semanas', filtros.semanas.join(','));
        if (filtros.anios?.length) params.set('anios', filtros.anios.join(','));
        const qs = params.toString();
        return get<ReporteGeneral>(`/reports/general${qs ? `?${qs}` : ''}`);
    },
};
