/**
 * SIDC API Service
 * Centraliza todas las llamadas al backend NestJS.
 * La URL base se resuelve via el proxy de Vite (/api → http://localhost:3000/api)
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

// ─── Normalización de enums (DB → Frontend label) ─────────────────────────────

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
    getProductos: (page = 1, pageSize = 50) =>
        get<PaginatedResponse<Producto>>(`/inventory/productos?page=${page}&pageSize=${pageSize}`),
    getLotes: (productoId?: number) =>
        get<Lote[]>(`/inventory/lotes${productoId ? `?productoId=${productoId}` : ''}`),
    getCategorias: () => get<Categoria[]>('/inventory/categorias'),
    getProximosVencer: (dias = 30) => get<Lote[]>(`/inventory/reportes/proximos-vencer?dias=${dias}`),
    getInventarioPorLote: () => get<Lote[]>('/inventory/reportes/inventario-lote'),
    getBodegas: () => get<Bodega[]>('/inventory/bodegas'),
};

// ─── Ventas ───────────────────────────────────────────────────────────────────

export const ventasApi = {
    getVentas: (page = 1, pageSize = 50, estado?: string) =>
        get<PaginatedResponse<Venta>>(`/sales?page=${page}&pageSize=${pageSize}${estado ? `&estado=${estado}` : ''}`),
    getFacturas: (page = 1, pageSize = 50, estado?: string) =>
        get<PaginatedResponse<Factura>>(`/sales/facturas?page=${page}&pageSize=${pageSize}${estado ? `&estado=${estado}` : ''}`),
    getDevoluciones: (page = 1, pageSize = 50) =>
        get<PaginatedResponse<Devolucion>>(`/sales/devoluciones?page=${page}&pageSize=${pageSize}`),
    getMasVendidos: (limit = 10) => get<ProductoMasVendido[]>(`/sales/reportes/mas-vendidos?limit=${limit}`),
};

// ─── Clientes ─────────────────────────────────────────────────────────────────

export const clientesApi = {
    getClientes: (page = 1, pageSize = 100, estado?: string, tipo?: string) =>
        get<PaginatedResponse<Cliente>>(
            `/clients?page=${page}&pageSize=${pageSize}${estado ? `&estado=${estado}` : ''}${tipo ? `&tipo=${tipo}` : ''}`
        ),
    getCobros: (page = 1, pageSize = 100, estado?: string) =>
        get<PaginatedResponse<Cobro>>(
            `/clients/cobros?page=${page}&pageSize=${pageSize}${estado ? `&estado=${estado}` : ''}`
        ),
};

// ─── Rutas ────────────────────────────────────────────────────────────────────

export const rutasApi = {
    getRutas: () => get<Ruta[]>('/logistics/rutas'),
    getVendedores: () => get<Vendedor[]>('/logistics/vendedores'),
};

// ─── Promociones ──────────────────────────────────────────────────────────────

export const promocionesApi = {
    getPromociones: () => get<Promocion[]>('/promotions'),
    getVigentes: () => get<Promocion[]>('/promotions/vigentes'),
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

/** Resumen mensual de ventas/cobros/devoluciones */
export interface ResumenMensual {
    anio?: number;
    mes?: number;
    mesLabel: string;   // Ej: "Mar '26"
    ventas: number;
    cobros: number;
    devoluciones: number;
}

/** Distribución de ventas por categoría */
export interface VentasPorCategoria {
    categoria: string;
    valor: number;          // porcentaje
    valorAbsoluto?: number; // monto USD
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
    productos?: number; // cantidad de SKUs
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
    estado: string;             // EstadoRuta
    clientesTotal?: number;     // Total clientes asignados
    entregasHoy?: number;       // Entregas programadas hoy
    entregasCompletadas?: number; // Completadas hoy
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
    tipo: string;           // TipoCliente
    estado: string;         // EstadoCliente
    limiteCredito: number;
    saldoActual: number;
    diasCredito: number;
    ultimaCompra?: string;  // ISO date
    rutaId?: number;
    ruta?: Ruta;
}

export interface Factura {
    id: number;
    numeroFactura: string;
    fechaEmision: string;
    fechaVencimiento?: string;  // ISO date
    total: number;
    estado: string;             // EstadoFactura
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
    fechaPago?: string;     // ISO date si ya fue cobrado
    monto: number;
    metodoPago?: string;
    referenciaPago?: string;
    estado: string;         // EstadoCobro
    diasVencido?: number;   // Días vencidos (si aplica)
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
    estado: string;         // EstadoDevolucion
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
    tipo: string;           // TipoPromocion
    descripcion?: string;
    fechaInicio: string;
    fechaFin: string;
    porcentajeDesc: number;
    canal?: string;
    usos: number;
    presupuesto: number;
    gastado: number;
    estado: string;         // EstadoPromocion
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
