import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ClienteRepository } from './repository/cliente.repository';
import { VentasRepository } from './repository/ventas.repository';
import { ClienteService } from './service/cliente.service';
import { VentasService } from './service/ventas.service';
import { ClienteController } from './controller/cliente.controller';
import { VentasController } from './controller/ventas.controller';

import { InventarioRepository } from './repository/inventario.repository';
import { CobroRepository } from './repository/cobro.repository';
import { RutaRepository } from './repository/ruta.repository';
import { ReporteRepository } from './repository/reporte.repository';
import { DevolucionRepository } from './repository/devolucion.repository';
import { PromocionRepository } from './repository/promocion.repository';
import { InventarioService } from './service/inventario.service';
import { CobroService } from './service/cobro.service';
import { RutaService } from './service/ruta.service';
import { ReporteService } from './service/reporte.service';
import { DevolucionService } from './service/devolucion.service';
import { PromocionService } from './service/promocion.service';
import { InventarioController } from './controller/inventario.controller';
import { CobroController } from './controller/cobro.controller';
import { RutaController } from './controller/ruta.controller';
import { ReporteController } from './controller/reporte.controller';
import { DevolucionController } from './controller/devolucion.controller';
import { PromocionController } from './controller/promocion.controller';

@Module({
    controllers: [
        ClienteController,
        VentasController,
        InventarioController,
        CobroController,
        RutaController,
        ReporteController,
        DevolucionController,
        PromocionController
    ],
    providers: [
        PrismaService,
        ClienteRepository,
        VentasRepository,
        InventarioRepository,
        CobroRepository,
        RutaRepository,
        ReporteRepository,
        DevolucionRepository,
        PromocionRepository,
        ClienteService,
        VentasService,
        InventarioService,
        CobroService,
        RutaService,
        ReporteService,
        DevolucionService,
        PromocionService
    ],
})
export class VentasModule { }
