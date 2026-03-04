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
                id: number;
                identificacion: string;
                direccion: string;
                telefono: string | null;
                email: string | null;
                limiteCredito: import("@prisma/client/runtime/library").Decimal;
                diasCredito: number;
                rutaId: number | null;
                saldoActual: import("@prisma/client/runtime/library").Decimal;
            }[];
        } & {
            nombre: string;
            descripcion: string | null;
            id: number;
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
            vendedorId: number;
            fecha: Date;
            estado: import(".prisma/client").$Enums.EstadoVenta;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            descuentoTotal: import("@prisma/client/runtime/library").Decimal;
        }[];
        rutas: ({
            clientes: {
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
            }[];
        } & {
            nombre: string;
            descripcion: string | null;
            id: number;
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
        id: number;
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
            id: number;
            identificacion: string;
            direccion: string;
            telefono: string | null;
            email: string | null;
            limiteCredito: import("@prisma/client/runtime/library").Decimal;
            diasCredito: number;
            rutaId: number | null;
            saldoActual: import("@prisma/client/runtime/library").Decimal;
        }[];
    } & {
        nombre: string;
        descripcion: string | null;
        id: number;
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
            id: number;
            identificacion: string;
            direccion: string;
            telefono: string | null;
            email: string | null;
            limiteCredito: import("@prisma/client/runtime/library").Decimal;
            diasCredito: number;
            rutaId: number | null;
            saldoActual: import("@prisma/client/runtime/library").Decimal;
        }[];
    } & {
        nombre: string;
        descripcion: string | null;
        id: number;
        vendedorId: number;
    }>;
}
