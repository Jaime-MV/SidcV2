import { RoutesService } from './routes.service';
import { CreateVendedorDto } from './dto/create-vendedor.dto';
import { CreateRutaDto } from './dto/create-ruta.dto';
export declare class RoutesController {
    private readonly routesService;
    constructor(routesService: RoutesService);
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
                tipo: import(".prisma/client").$Enums.TipoCliente;
                estado: import(".prisma/client").$Enums.EstadoCliente;
                limiteCredito: import("@prisma/client/runtime/library").Decimal;
                diasCredito: number;
                rutaId: number | null;
                ultimaCompra: Date | null;
                saldoActual: import("@prisma/client/runtime/library").Decimal;
            }[];
        } & {
            nombre: string;
            descripcion: string | null;
            codigo: string | null;
            id: number;
            estado: import(".prisma/client").$Enums.EstadoRuta;
            vehiculo: string | null;
            kmEstimados: number | null;
            horaInicio: string | null;
            horaFin: string | null;
            departamento: string | null;
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
            estado: import(".prisma/client").$Enums.EstadoVenta;
            vendedorId: number;
            fecha: Date;
            clienteId: number;
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
                tipo: import(".prisma/client").$Enums.TipoCliente;
                estado: import(".prisma/client").$Enums.EstadoCliente;
                limiteCredito: import("@prisma/client/runtime/library").Decimal;
                diasCredito: number;
                rutaId: number | null;
                ultimaCompra: Date | null;
                saldoActual: import("@prisma/client/runtime/library").Decimal;
            }[];
        } & {
            nombre: string;
            descripcion: string | null;
            codigo: string | null;
            id: number;
            estado: import(".prisma/client").$Enums.EstadoRuta;
            vehiculo: string | null;
            kmEstimados: number | null;
            horaInicio: string | null;
            horaFin: string | null;
            departamento: string | null;
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
        estado: import(".prisma/client").$Enums.EstadoRuta;
        vehiculo: string | null;
        kmEstimados: number | null;
        horaInicio: string | null;
        horaFin: string | null;
        departamento: string | null;
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
            tipo: import(".prisma/client").$Enums.TipoCliente;
            estado: import(".prisma/client").$Enums.EstadoCliente;
            limiteCredito: import("@prisma/client/runtime/library").Decimal;
            diasCredito: number;
            rutaId: number | null;
            ultimaCompra: Date | null;
            saldoActual: import("@prisma/client/runtime/library").Decimal;
        }[];
    } & {
        nombre: string;
        descripcion: string | null;
        codigo: string | null;
        id: number;
        estado: import(".prisma/client").$Enums.EstadoRuta;
        vehiculo: string | null;
        kmEstimados: number | null;
        horaInicio: string | null;
        horaFin: string | null;
        departamento: string | null;
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
            tipo: import(".prisma/client").$Enums.TipoCliente;
            estado: import(".prisma/client").$Enums.EstadoCliente;
            limiteCredito: import("@prisma/client/runtime/library").Decimal;
            diasCredito: number;
            rutaId: number | null;
            ultimaCompra: Date | null;
            saldoActual: import("@prisma/client/runtime/library").Decimal;
        }[];
    } & {
        nombre: string;
        descripcion: string | null;
        codigo: string | null;
        id: number;
        estado: import(".prisma/client").$Enums.EstadoRuta;
        vehiculo: string | null;
        kmEstimados: number | null;
        horaInicio: string | null;
        horaFin: string | null;
        departamento: string | null;
        clientesTotal: number;
        entregasHoy: number;
        entregasCompletadas: number;
        vendedorId: number;
    }>;
}
