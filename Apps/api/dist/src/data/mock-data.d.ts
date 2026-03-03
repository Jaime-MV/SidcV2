export interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
    activa: boolean;
}
export interface Producto {
    id: number;
    categoriaId: number;
    nombre: string;
    codigo: string;
    precio: number;
    unidad: string;
    activo: boolean;
}
export interface Lote {
    id: number;
    productoId: number;
    numero: string;
    cantidad: number;
    fechaVencimiento: string;
    bodega: string;
}
export interface Cliente {
    id: number;
    nombre: string;
    tipo: 'CONTADO' | 'CREDITO';
    direccion: string;
    telefono: string;
    email: string;
    limiteCredito: number;
    saldoCredito: number;
    activo: boolean;
}
export interface Vendedor {
    id: number;
    nombre: string;
    codigo: string;
    email: string;
    telefono: string;
    activo: boolean;
}
export interface Ruta {
    id: number;
    vendedorId: number;
    nombre: string;
    zona: string;
    dias: string[];
    clienteIds: number[];
}
export interface Promocion {
    id: number;
    nombre: string;
    tipo: 'DESCUENTO_PORCENTAJE' | 'DESCUENTO_MONTO' | '2x1' | 'REGALO';
    valor: number;
    productoIds: number[];
    fechaInicio: string;
    fechaFin: string;
    activa: boolean;
}
export interface DetalleVenta {
    productoId: number;
    loteId: number;
    cantidad: number;
    precioUnitario: number;
    descuento: number;
    subtotal: number;
}
export interface Venta {
    id: number;
    clienteId: number;
    vendedorId: number;
    rutaId: number;
    fecha: string;
    estado: 'PENDIENTE' | 'FACTURADA' | 'ANULADA';
    detalles: DetalleVenta[];
    total: number;
    tipo: 'CONTADO' | 'CREDITO';
}
export interface Factura {
    id: number;
    ventaId: number;
    numero: string;
    fecha: string;
    total: number;
    estado: 'PENDIENTE' | 'PAGADA' | 'ANULADA';
    tipo: 'CONTADO' | 'CREDITO';
}
export interface Cobro {
    id: number;
    facturaId: number;
    clienteId: number;
    fecha: string;
    monto: number;
    metodoPago: 'EFECTIVO' | 'TRANSFERENCIA' | 'CHEQUE';
}
export interface Devolucion {
    id: number;
    ventaId: number;
    clienteId: number;
    fecha: string;
    motivo: string;
    detalles: {
        productoId: number;
        cantidad: number;
        monto: number;
    }[];
    totalDevuelto: number;
    estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
}
export declare const categorias: Categoria[];
export declare const productos: Producto[];
export declare const lotes: Lote[];
export declare const clientes: Cliente[];
export declare const vendedores: Vendedor[];
export declare const rutas: Ruta[];
export declare const promociones: Promocion[];
export declare const ventas: Venta[];
export declare const facturas: Factura[];
export declare const cobros: Cobro[];
export declare const devoluciones: Devolucion[];
