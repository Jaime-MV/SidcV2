import { PrismaService } from '../prisma/prisma.service';
import { PromotionsService } from '../promotions/promotions.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { CreateDevolucionDto } from './dto/create-devolucion.dto';
export declare class SalesService {
    private readonly prisma;
    private readonly promotionsService;
    constructor(prisma: PrismaService, promotionsService: PromotionsService);
    create(dto: CreateVentaDto): Promise<{
        factura: {
            fechaVencimiento: Date | null;
            id: number;
            total: import("@prisma/client/runtime/library").Decimal;
            estado: import(".prisma/client").$Enums.EstadoFactura;
            numeroFactura: string;
            fechaEmision: Date;
            ventaId: number;
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
            limiteCredito: import("@prisma/client/runtime/library").Decimal;
            diasCredito: number;
            rutaId: number | null;
            estado: import(".prisma/client").$Enums.EstadoCliente;
            tipo: import(".prisma/client").$Enums.TipoCliente;
            ultimaCompra: Date | null;
            saldoActual: import("@prisma/client/runtime/library").Decimal;
        };
        detalles: ({
            producto: {
                nombre: string;
                descripcion: string | null;
                codigoBarras: string | null;
                categoriaId: number;
                codigo: string | null;
                id: number;
                precioCompra: import("@prisma/client/runtime/library").Decimal;
                precioVenta: import("@prisma/client/runtime/library").Decimal;
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
        clienteId: number;
        estado: import(".prisma/client").$Enums.EstadoVenta;
        vendedorId: number;
        fecha: Date;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        descuentoTotal: import("@prisma/client/runtime/library").Decimal;
    }>;
    findAll(page?: number, pageSize?: number, estado?: string): Promise<{
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
                limiteCredito: import("@prisma/client/runtime/library").Decimal;
                diasCredito: number;
                rutaId: number | null;
                estado: import(".prisma/client").$Enums.EstadoCliente;
                tipo: import(".prisma/client").$Enums.TipoCliente;
                ultimaCompra: Date | null;
                saldoActual: import("@prisma/client/runtime/library").Decimal;
            };
            factura: {
                fechaVencimiento: Date | null;
                id: number;
                total: import("@prisma/client/runtime/library").Decimal;
                estado: import(".prisma/client").$Enums.EstadoFactura;
                numeroFactura: string;
                fechaEmision: Date;
                ventaId: number;
            } | null;
        } & {
            id: number;
            total: import("@prisma/client/runtime/library").Decimal;
            clienteId: number;
            estado: import(".prisma/client").$Enums.EstadoVenta;
            vendedorId: number;
            fecha: Date;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            descuentoTotal: import("@prisma/client/runtime/library").Decimal;
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
            limiteCredito: import("@prisma/client/runtime/library").Decimal;
            diasCredito: number;
            rutaId: number | null;
            estado: import(".prisma/client").$Enums.EstadoCliente;
            tipo: import(".prisma/client").$Enums.TipoCliente;
            ultimaCompra: Date | null;
            saldoActual: import("@prisma/client/runtime/library").Decimal;
        };
        factura: ({
            cobros: {
                codigo: string | null;
                id: number;
                monto: import("@prisma/client/runtime/library").Decimal;
                metodoPago: import(".prisma/client").$Enums.MetodoPago | null;
                referenciaPago: string | null;
                facturaId: number;
                clienteId: number;
                estado: import(".prisma/client").$Enums.EstadoCobro;
                fecha: Date;
                fechaPago: Date | null;
                diasVencido: number;
            }[];
        } & {
            fechaVencimiento: Date | null;
            id: number;
            total: import("@prisma/client/runtime/library").Decimal;
            estado: import(".prisma/client").$Enums.EstadoFactura;
            numeroFactura: string;
            fechaEmision: Date;
            ventaId: number;
        }) | null;
        devoluciones: {
            productoId: number;
            codigo: string | null;
            id: number;
            cantidad: number;
            monto: import("@prisma/client/runtime/library").Decimal;
            estado: import(".prisma/client").$Enums.EstadoDevolucion;
            fecha: Date;
            ventaId: number;
            motivo: string;
        }[];
        detalles: ({
            producto: {
                nombre: string;
                descripcion: string | null;
                codigoBarras: string | null;
                categoriaId: number;
                codigo: string | null;
                id: number;
                precioCompra: import("@prisma/client/runtime/library").Decimal;
                precioVenta: import("@prisma/client/runtime/library").Decimal;
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
        clienteId: number;
        estado: import(".prisma/client").$Enums.EstadoVenta;
        vendedorId: number;
        fecha: Date;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        descuentoTotal: import("@prisma/client/runtime/library").Decimal;
    }>;
    createDevolucion(dto: CreateDevolucionDto): Promise<{
        producto: {
            nombre: string;
            descripcion: string | null;
            codigoBarras: string | null;
            categoriaId: number;
            codigo: string | null;
            id: number;
            precioCompra: import("@prisma/client/runtime/library").Decimal;
            precioVenta: import("@prisma/client/runtime/library").Decimal;
            minStock: number;
            estadoProducto: import(".prisma/client").$Enums.EstadoProducto;
            bodegaId: number | null;
        };
        venta: {
            id: number;
            total: import("@prisma/client/runtime/library").Decimal;
            clienteId: number;
            estado: import(".prisma/client").$Enums.EstadoVenta;
            vendedorId: number;
            fecha: Date;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            descuentoTotal: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        productoId: number;
        codigo: string | null;
        id: number;
        cantidad: number;
        monto: import("@prisma/client/runtime/library").Decimal;
        estado: import(".prisma/client").$Enums.EstadoDevolucion;
        fecha: Date;
        ventaId: number;
        motivo: string;
    }>;
    getProductosMasVendidos(limit?: number): Promise<{
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
            categoriaId: number;
            codigo: string | null;
            id: number;
            precioCompra: import("@prisma/client/runtime/library").Decimal;
            precioVenta: import("@prisma/client/runtime/library").Decimal;
            minStock: number;
            estadoProducto: import(".prisma/client").$Enums.EstadoProducto;
            bodegaId: number | null;
        }) | null;
        totalVendido: number | null;
        unidades: number | null;
        ingresos: number;
    }[]>;
    findAllFacturas(page?: number, pageSize?: number, estado?: string): Promise<{
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
                    limiteCredito: import("@prisma/client/runtime/library").Decimal;
                    diasCredito: number;
                    rutaId: number | null;
                    estado: import(".prisma/client").$Enums.EstadoCliente;
                    tipo: import(".prisma/client").$Enums.TipoCliente;
                    ultimaCompra: Date | null;
                    saldoActual: import("@prisma/client/runtime/library").Decimal;
                };
            } & {
                id: number;
                total: import("@prisma/client/runtime/library").Decimal;
                clienteId: number;
                estado: import(".prisma/client").$Enums.EstadoVenta;
                vendedorId: number;
                fecha: Date;
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
            fechaEmision: Date;
            ventaId: number;
        })[];
        total: number;
        page: number;
        pageSize: number;
        pages: number;
    }>;
    findAllDevoluciones(page?: number, pageSize?: number): Promise<{
        items: ({
            producto: {
                nombre: string;
                descripcion: string | null;
                codigoBarras: string | null;
                categoriaId: number;
                codigo: string | null;
                id: number;
                precioCompra: import("@prisma/client/runtime/library").Decimal;
                precioVenta: import("@prisma/client/runtime/library").Decimal;
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
                    limiteCredito: import("@prisma/client/runtime/library").Decimal;
                    diasCredito: number;
                    rutaId: number | null;
                    estado: import(".prisma/client").$Enums.EstadoCliente;
                    tipo: import(".prisma/client").$Enums.TipoCliente;
                    ultimaCompra: Date | null;
                    saldoActual: import("@prisma/client/runtime/library").Decimal;
                };
                factura: {
                    fechaVencimiento: Date | null;
                    id: number;
                    total: import("@prisma/client/runtime/library").Decimal;
                    estado: import(".prisma/client").$Enums.EstadoFactura;
                    numeroFactura: string;
                    fechaEmision: Date;
                    ventaId: number;
                } | null;
            } & {
                id: number;
                total: import("@prisma/client/runtime/library").Decimal;
                clienteId: number;
                estado: import(".prisma/client").$Enums.EstadoVenta;
                vendedorId: number;
                fecha: Date;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                descuentoTotal: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            productoId: number;
            codigo: string | null;
            id: number;
            cantidad: number;
            monto: import("@prisma/client/runtime/library").Decimal;
            estado: import(".prisma/client").$Enums.EstadoDevolucion;
            fecha: Date;
            ventaId: number;
            motivo: string;
        })[];
        total: number;
        page: number;
        pageSize: number;
        pages: number;
    }>;
}
