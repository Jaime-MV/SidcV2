import { SalesService } from './sales.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { CreateDevolucionDto } from './dto/create-devolucion.dto';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(dto: CreateVentaDto): Promise<{
        factura: {
            fechaVencimiento: Date | null;
            id: number;
            total: import("@prisma/client/runtime/library").Decimal;
            estado: import(".prisma/client").$Enums.EstadoFactura;
            numeroFactura: string;
            ventaId: number;
            fechaEmision: Date;
        };
        vendedor: {
            nombre: string;
            id: number;
            telefono: string | null;
            activo: boolean;
        };
        cliente: {
            nombre: string;
            codigo: string | null;
            id: number;
            identificacion: string;
            direccion: string;
            telefono: string | null;
            email: string | null;
            tipo: import(".prisma/client").$Enums.TipoCliente;
            estado: import(".prisma/client").$Enums.EstadoCliente;
            limiteCredito: import("@prisma/client/runtime/library").Decimal;
            diasCredito: number;
            rutaId: number | null;
            ultimaCompra: Date | null;
            saldoActual: import("@prisma/client/runtime/library").Decimal;
        };
        detalles: ({
            producto: {
                nombre: string;
                descripcion: string | null;
                codigoBarras: string | null;
                precioCompra: import("@prisma/client/runtime/library").Decimal;
                precioVenta: import("@prisma/client/runtime/library").Decimal;
                categoriaId: number;
                codigo: string | null;
                id: number;
                minStock: number;
                estadoProducto: import(".prisma/client").$Enums.EstadoProducto;
                bodegaId: number | null;
            };
        } & {
            productoId: number;
            id: number;
            cantidad: number;
            ventaId: number;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
        })[];
        id: number;
        total: import("@prisma/client/runtime/library").Decimal;
        estado: import(".prisma/client").$Enums.EstadoVenta;
        vendedorId: number;
        fecha: Date;
        clienteId: number;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        descuentoTotal: import("@prisma/client/runtime/library").Decimal;
    }>;
    findAll(page?: string, pageSize?: string, estado?: string): Promise<{
        items: ({
            vendedor: {
                nombre: string;
                id: number;
                telefono: string | null;
                activo: boolean;
            };
            cliente: {
                nombre: string;
                codigo: string | null;
                id: number;
                identificacion: string;
                direccion: string;
                telefono: string | null;
                email: string | null;
                tipo: import(".prisma/client").$Enums.TipoCliente;
                estado: import(".prisma/client").$Enums.EstadoCliente;
                limiteCredito: import("@prisma/client/runtime/library").Decimal;
                diasCredito: number;
                rutaId: number | null;
                ultimaCompra: Date | null;
                saldoActual: import("@prisma/client/runtime/library").Decimal;
            };
            factura: {
                fechaVencimiento: Date | null;
                id: number;
                total: import("@prisma/client/runtime/library").Decimal;
                estado: import(".prisma/client").$Enums.EstadoFactura;
                numeroFactura: string;
                ventaId: number;
                fechaEmision: Date;
            } | null;
        } & {
            id: number;
            total: import("@prisma/client/runtime/library").Decimal;
            estado: import(".prisma/client").$Enums.EstadoVenta;
            vendedorId: number;
            fecha: Date;
            clienteId: number;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            descuentoTotal: import("@prisma/client/runtime/library").Decimal;
        })[];
        total: number;
        page: number;
        pageSize: number;
        pages: number;
    }>;
    getProductosMasVendidos(limit?: string): Promise<{
        nombre: string;
        producto: ({
            categoria: {
                nombre: string;
                descripcion: string | null;
                colorHex: string | null;
                id: number;
            };
        } & {
            nombre: string;
            descripcion: string | null;
            codigoBarras: string | null;
            precioCompra: import("@prisma/client/runtime/library").Decimal;
            precioVenta: import("@prisma/client/runtime/library").Decimal;
            categoriaId: number;
            codigo: string | null;
            id: number;
            minStock: number;
            estadoProducto: import(".prisma/client").$Enums.EstadoProducto;
            bodegaId: number | null;
        }) | null;
        totalVendido: number | null;
        unidades: number | null;
        ingresos: number;
    }[]>;
    findAllFacturas(page?: string, pageSize?: string, estado?: string): Promise<{
        items: ({
            venta: {
                vendedor: {
                    nombre: string;
                    id: number;
                    telefono: string | null;
                    activo: boolean;
                };
                cliente: {
                    nombre: string;
                    codigo: string | null;
                    id: number;
                    identificacion: string;
                    direccion: string;
                    telefono: string | null;
                    email: string | null;
                    tipo: import(".prisma/client").$Enums.TipoCliente;
                    estado: import(".prisma/client").$Enums.EstadoCliente;
                    limiteCredito: import("@prisma/client/runtime/library").Decimal;
                    diasCredito: number;
                    rutaId: number | null;
                    ultimaCompra: Date | null;
                    saldoActual: import("@prisma/client/runtime/library").Decimal;
                };
            } & {
                id: number;
                total: import("@prisma/client/runtime/library").Decimal;
                estado: import(".prisma/client").$Enums.EstadoVenta;
                vendedorId: number;
                fecha: Date;
                clienteId: number;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                descuentoTotal: import("@prisma/client/runtime/library").Decimal;
            };
            cobros: {
                monto: import("@prisma/client/runtime/library").Decimal;
            }[];
        } & {
            fechaVencimiento: Date | null;
            id: number;
            total: import("@prisma/client/runtime/library").Decimal;
            estado: import(".prisma/client").$Enums.EstadoFactura;
            numeroFactura: string;
            ventaId: number;
            fechaEmision: Date;
        })[];
        total: number;
        page: number;
        pageSize: number;
        pages: number;
    }>;
    findAllDevoluciones(page?: string, pageSize?: string): Promise<{
        items: ({
            producto: {
                nombre: string;
                descripcion: string | null;
                codigoBarras: string | null;
                precioCompra: import("@prisma/client/runtime/library").Decimal;
                precioVenta: import("@prisma/client/runtime/library").Decimal;
                categoriaId: number;
                codigo: string | null;
                id: number;
                minStock: number;
                estadoProducto: import(".prisma/client").$Enums.EstadoProducto;
                bodegaId: number | null;
            };
            venta: {
                vendedor: {
                    nombre: string;
                    id: number;
                    telefono: string | null;
                    activo: boolean;
                };
                cliente: {
                    nombre: string;
                    codigo: string | null;
                    id: number;
                    identificacion: string;
                    direccion: string;
                    telefono: string | null;
                    email: string | null;
                    tipo: import(".prisma/client").$Enums.TipoCliente;
                    estado: import(".prisma/client").$Enums.EstadoCliente;
                    limiteCredito: import("@prisma/client/runtime/library").Decimal;
                    diasCredito: number;
                    rutaId: number | null;
                    ultimaCompra: Date | null;
                    saldoActual: import("@prisma/client/runtime/library").Decimal;
                };
                factura: {
                    fechaVencimiento: Date | null;
                    id: number;
                    total: import("@prisma/client/runtime/library").Decimal;
                    estado: import(".prisma/client").$Enums.EstadoFactura;
                    numeroFactura: string;
                    ventaId: number;
                    fechaEmision: Date;
                } | null;
            } & {
                id: number;
                total: import("@prisma/client/runtime/library").Decimal;
                estado: import(".prisma/client").$Enums.EstadoVenta;
                vendedorId: number;
                fecha: Date;
                clienteId: number;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                descuentoTotal: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            productoId: number;
            codigo: string | null;
            id: number;
            cantidad: number;
            estado: import(".prisma/client").$Enums.EstadoDevolucion;
            monto: import("@prisma/client/runtime/library").Decimal;
            fecha: Date;
            ventaId: number;
            motivo: string;
        })[];
        total: number;
        page: number;
        pageSize: number;
        pages: number;
    }>;
    findOne(id: number): Promise<{
        vendedor: {
            nombre: string;
            id: number;
            telefono: string | null;
            activo: boolean;
        };
        cliente: {
            nombre: string;
            codigo: string | null;
            id: number;
            identificacion: string;
            direccion: string;
            telefono: string | null;
            email: string | null;
            tipo: import(".prisma/client").$Enums.TipoCliente;
            estado: import(".prisma/client").$Enums.EstadoCliente;
            limiteCredito: import("@prisma/client/runtime/library").Decimal;
            diasCredito: number;
            rutaId: number | null;
            ultimaCompra: Date | null;
            saldoActual: import("@prisma/client/runtime/library").Decimal;
        };
        factura: ({
            cobros: {
                codigo: string | null;
                id: number;
                estado: import(".prisma/client").$Enums.EstadoCobro;
                monto: import("@prisma/client/runtime/library").Decimal;
                metodoPago: import(".prisma/client").$Enums.MetodoPago | null;
                referenciaPago: string | null;
                facturaId: number;
                fecha: Date;
                fechaPago: Date | null;
                diasVencido: number;
                clienteId: number;
            }[];
        } & {
            fechaVencimiento: Date | null;
            id: number;
            total: import("@prisma/client/runtime/library").Decimal;
            estado: import(".prisma/client").$Enums.EstadoFactura;
            numeroFactura: string;
            ventaId: number;
            fechaEmision: Date;
        }) | null;
        devoluciones: {
            productoId: number;
            codigo: string | null;
            id: number;
            cantidad: number;
            estado: import(".prisma/client").$Enums.EstadoDevolucion;
            monto: import("@prisma/client/runtime/library").Decimal;
            fecha: Date;
            ventaId: number;
            motivo: string;
        }[];
        detalles: ({
            producto: {
                nombre: string;
                descripcion: string | null;
                codigoBarras: string | null;
                precioCompra: import("@prisma/client/runtime/library").Decimal;
                precioVenta: import("@prisma/client/runtime/library").Decimal;
                categoriaId: number;
                codigo: string | null;
                id: number;
                minStock: number;
                estadoProducto: import(".prisma/client").$Enums.EstadoProducto;
                bodegaId: number | null;
            };
        } & {
            productoId: number;
            id: number;
            cantidad: number;
            ventaId: number;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        id: number;
        total: import("@prisma/client/runtime/library").Decimal;
        estado: import(".prisma/client").$Enums.EstadoVenta;
        vendedorId: number;
        fecha: Date;
        clienteId: number;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        descuentoTotal: import("@prisma/client/runtime/library").Decimal;
    }>;
    createDevolucion(dto: CreateDevolucionDto): Promise<{
        producto: {
            nombre: string;
            descripcion: string | null;
            codigoBarras: string | null;
            precioCompra: import("@prisma/client/runtime/library").Decimal;
            precioVenta: import("@prisma/client/runtime/library").Decimal;
            categoriaId: number;
            codigo: string | null;
            id: number;
            minStock: number;
            estadoProducto: import(".prisma/client").$Enums.EstadoProducto;
            bodegaId: number | null;
        };
        venta: {
            id: number;
            total: import("@prisma/client/runtime/library").Decimal;
            estado: import(".prisma/client").$Enums.EstadoVenta;
            vendedorId: number;
            fecha: Date;
            clienteId: number;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            descuentoTotal: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        productoId: number;
        codigo: string | null;
        id: number;
        cantidad: number;
        estado: import(".prisma/client").$Enums.EstadoDevolucion;
        monto: import("@prisma/client/runtime/library").Decimal;
        fecha: Date;
        ventaId: number;
        motivo: string;
    }>;
}
