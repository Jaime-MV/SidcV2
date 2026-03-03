import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriasController } from './categorias/categorias.controller';
import { ProductosController, LotesController } from './productos/productos.controller';
import { ClientesController } from './clientes/clientes.controller';
import { VendedoresController, RutasController } from './rutas/rutas.controller';
import { PromocionesController } from './promociones/promociones.controller';
import { VentasController, FacturasController } from './ventas/ventas.controller';
import { CobrosController } from './cobros/cobros.controller';
import { DevolucionesController } from './devoluciones/devoluciones.controller';
import { ReportesController } from './reportes/reportes.controller';

@Module({
  imports: [PrismaModule],
  controllers: [
    AppController,
    CategoriasController,
    ProductosController,
    LotesController,
    ClientesController,
    VendedoresController,
    RutasController,
    PromocionesController,
    VentasController,
    FacturasController,
    CobrosController,
    DevolucionesController,
    ReportesController,
  ],
  providers: [AppService],
})
export class AppModule { }
