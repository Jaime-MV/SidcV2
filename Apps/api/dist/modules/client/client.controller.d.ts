import { ClientService } from './client.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { CreateCobroDto } from './dto/create-cobro.dto';
export declare class ClientController {
    private readonly clientService;
    constructor(clientService: ClientService);
    createCliente(dto: CreateClienteDto): Promise<{
        ruta: {
            nombre: string;
            descripcion: string | null;
            codigo: string | null;
            id: number;
            vehiculo: string | null;
            kmEstimados: number | null;
            horaInicio: string | null;
            horaFin: string | null;
            departamento: string | null;
            estado: import(".prisma/client").$Enums.EstadoRuta;
            clientesTotal: number;
            entregasHoy: number;
            entregasCompletadas: number;
            vendedorId: number;
        } | null;
    } & {
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
    }>;
    findAllClientes(page?: string, pageSize?: string, estado?: string, tipo?: string): Promise<{
        items: ({
            ruta: {
                nombre: string;
                descripcion: string | null;
                codigo: string | null;
                id: number;
                vehiculo: string | null;
                kmEstimados: number | null;
                horaInicio: string | null;
                horaFin: string | null;
                departamento: string | null;
                estado: import(".prisma/client").$Enums.EstadoRuta;
                clientesTotal: number;
                entregasHoy: number;
                entregasCompletadas: number;
                vendedorId: number;
            } | null;
        } & {
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
        })[];
        total: number;
        page: number;
        pageSize: number;
        pages: number;
    }>;
    createCobro(dto: CreateCobroDto): Promise<{
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
        };
    } & {
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
    }>;
    findAllCobros(page?: string, pageSize?: string, estado?: string): Promise<{
        items: ({
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
                venta: {
                    vendedor: {
                        nombre: string;
                        id: number;
                        telefono: string | null;
                        activo: boolean;
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
            } & {
                fechaVencimiento: Date | null;
                id: number;
                total: import("@prisma/client/runtime/library").Decimal;
                estado: import(".prisma/client").$Enums.EstadoFactura;
                numeroFactura: string;
                fechaEmision: Date;
                ventaId: number;
            };
        } & {
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
        })[];
        total: number;
        page: number;
        pageSize: number;
        pages: number;
    }>;
    findClienteById(id: number): Promise<{
        ruta: {
            nombre: string;
            descripcion: string | null;
            codigo: string | null;
            id: number;
            vehiculo: string | null;
            kmEstimados: number | null;
            horaInicio: string | null;
            horaFin: string | null;
            departamento: string | null;
            estado: import(".prisma/client").$Enums.EstadoRuta;
            clientesTotal: number;
            entregasHoy: number;
            entregasCompletadas: number;
            vendedorId: number;
        } | null;
        ventas: {
            id: number;
            total: import("@prisma/client/runtime/library").Decimal;
            clienteId: number;
            estado: import(".prisma/client").$Enums.EstadoVenta;
            vendedorId: number;
            fecha: Date;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            descuentoTotal: import("@prisma/client/runtime/library").Decimal;
        }[];
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
    }>;
    updateCliente(id: number, dto: Partial<CreateClienteDto>): Promise<{
        ruta: {
            nombre: string;
            descripcion: string | null;
            codigo: string | null;
            id: number;
            vehiculo: string | null;
            kmEstimados: number | null;
            horaInicio: string | null;
            horaFin: string | null;
            departamento: string | null;
            estado: import(".prisma/client").$Enums.EstadoRuta;
            clientesTotal: number;
            entregasHoy: number;
            entregasCompletadas: number;
            vendedorId: number;
        } | null;
    } & {
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
    }>;
    findCobrosByCliente(id: number): Promise<({
        factura: {
            fechaVencimiento: Date | null;
            id: number;
            total: import("@prisma/client/runtime/library").Decimal;
            estado: import(".prisma/client").$Enums.EstadoFactura;
            numeroFactura: string;
            fechaEmision: Date;
            ventaId: number;
        };
    } & {
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
    })[]>;
}
