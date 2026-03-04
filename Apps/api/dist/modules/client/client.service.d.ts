import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { CreateCobroDto } from './dto/create-cobro.dto';
export declare class ClientService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createCliente(dto: CreateClienteDto): Promise<{
        ruta: {
            nombre: string;
            descripcion: string | null;
            id: number;
            vendedorId: number;
        } | null;
    } & {
        nombre: string;
        id: number;
        identificacion: string;
        direccion: string;
        telefono: string | null;
        email: string | null;
        limiteCredito: import("@prisma/client/runtime/library").Decimal;
        diasCredito: number;
        rutaId: number | null;
        saldoActual: import("@prisma/client/runtime/library").Decimal;
    }>;
    findAllClientes(page?: number, pageSize?: number): Promise<{
        items: ({
            ruta: {
                nombre: string;
                descripcion: string | null;
                id: number;
                vendedorId: number;
            } | null;
        } & {
            nombre: string;
            id: number;
            identificacion: string;
            direccion: string;
            telefono: string | null;
            email: string | null;
            limiteCredito: import("@prisma/client/runtime/library").Decimal;
            diasCredito: number;
            rutaId: number | null;
            saldoActual: import("@prisma/client/runtime/library").Decimal;
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
            id: number;
            vendedorId: number;
        } | null;
        ventas: {
            id: number;
            total: import("@prisma/client/runtime/library").Decimal;
            clienteId: number;
            vendedorId: number;
            fecha: Date;
            estado: import(".prisma/client").$Enums.EstadoVenta;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            descuentoTotal: import("@prisma/client/runtime/library").Decimal;
        }[];
        cobros: {
            id: number;
            monto: import("@prisma/client/runtime/library").Decimal;
            metodoPago: import(".prisma/client").$Enums.MetodoPago;
            referenciaPago: string | null;
            facturaId: number;
            clienteId: number;
            fecha: Date;
        }[];
    } & {
        nombre: string;
        id: number;
        identificacion: string;
        direccion: string;
        telefono: string | null;
        email: string | null;
        limiteCredito: import("@prisma/client/runtime/library").Decimal;
        diasCredito: number;
        rutaId: number | null;
        saldoActual: import("@prisma/client/runtime/library").Decimal;
    }>;
    updateCliente(id: number, dto: Partial<CreateClienteDto>): Promise<{
        ruta: {
            nombre: string;
            descripcion: string | null;
            id: number;
            vendedorId: number;
        } | null;
    } & {
        nombre: string;
        id: number;
        identificacion: string;
        direccion: string;
        telefono: string | null;
        email: string | null;
        limiteCredito: import("@prisma/client/runtime/library").Decimal;
        diasCredito: number;
        rutaId: number | null;
        saldoActual: import("@prisma/client/runtime/library").Decimal;
    }>;
    createCobro(dto: CreateCobroDto): Promise<{
        cliente: {
            nombre: string;
            id: number;
            identificacion: string;
            direccion: string;
            telefono: string | null;
            email: string | null;
            limiteCredito: import("@prisma/client/runtime/library").Decimal;
            diasCredito: number;
            rutaId: number | null;
            saldoActual: import("@prisma/client/runtime/library").Decimal;
        };
        factura: {
            id: number;
            total: import("@prisma/client/runtime/library").Decimal;
            numeroFactura: string;
            ventaId: number;
            fechaEmision: Date;
            estado: import(".prisma/client").$Enums.EstadoFactura;
        };
    } & {
        id: number;
        monto: import("@prisma/client/runtime/library").Decimal;
        metodoPago: import(".prisma/client").$Enums.MetodoPago;
        referenciaPago: string | null;
        facturaId: number;
        clienteId: number;
        fecha: Date;
    }>;
    findCobrosByCliente(clienteId: number): Promise<({
        factura: {
            id: number;
            total: import("@prisma/client/runtime/library").Decimal;
            numeroFactura: string;
            ventaId: number;
            fechaEmision: Date;
            estado: import(".prisma/client").$Enums.EstadoFactura;
        };
    } & {
        id: number;
        monto: import("@prisma/client/runtime/library").Decimal;
        metodoPago: import(".prisma/client").$Enums.MetodoPago;
        referenciaPago: string | null;
        facturaId: number;
        clienteId: number;
        fecha: Date;
    })[]>;
}
