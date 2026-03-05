import { PrismaService } from '../prisma/prisma.service';
import { CreateVendedorDto } from './dto/create-vendedor.dto';
import { CreateRutaDto } from './dto/create-ruta.dto';
export declare class RoutesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createVendedor(dto: CreateVendedorDto): Promise<{
        nombre: string;
        id: number;
        telefono: string | null;
        activo: boolean;
    }>;
    findAllVendedores(): Promise<({
        rutas: ({
            clientes: {
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
            }[];
        } & {
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
        })[];
    } & {
        nombre: string;
        id: number;
        telefono: string | null;
        activo: boolean;
    })[]>;
    findVendedorById(id: number): Promise<{
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
        rutas: ({
            clientes: {
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
            }[];
        } & {
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
        })[];
    } & {
        nombre: string;
        id: number;
        telefono: string | null;
        activo: boolean;
    }>;
    updateVendedor(id: number, dto: Partial<CreateVendedorDto>): Promise<{
        nombre: string;
        id: number;
        telefono: string | null;
        activo: boolean;
    }>;
    createRuta(dto: CreateRutaDto): Promise<{
        vendedor: {
            nombre: string;
            id: number;
            telefono: string | null;
            activo: boolean;
        };
    } & {
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
    }>;
    findAllRutas(): Promise<({
        vendedor: {
            nombre: string;
            id: number;
            telefono: string | null;
            activo: boolean;
        };
        clientes: {
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
        }[];
    } & {
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
    })[]>;
    findRutaById(id: number): Promise<{
        vendedor: {
            nombre: string;
            id: number;
            telefono: string | null;
            activo: boolean;
        };
        clientes: {
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
        }[];
    } & {
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
    }>;
}
