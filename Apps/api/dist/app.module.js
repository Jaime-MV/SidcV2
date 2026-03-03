"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const categorias_controller_1 = require("./categorias/categorias.controller");
const productos_controller_1 = require("./productos/productos.controller");
const clientes_controller_1 = require("./clientes/clientes.controller");
const rutas_controller_1 = require("./rutas/rutas.controller");
const promociones_controller_1 = require("./promociones/promociones.controller");
const ventas_controller_1 = require("./ventas/ventas.controller");
const cobros_controller_1 = require("./cobros/cobros.controller");
const devoluciones_controller_1 = require("./devoluciones/devoluciones.controller");
const reportes_controller_1 = require("./reportes/reportes.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [
            app_controller_1.AppController,
            categorias_controller_1.CategoriasController,
            productos_controller_1.ProductosController,
            productos_controller_1.LotesController,
            clientes_controller_1.ClientesController,
            rutas_controller_1.VendedoresController,
            rutas_controller_1.RutasController,
            promociones_controller_1.PromocionesController,
            ventas_controller_1.VentasController,
            ventas_controller_1.FacturasController,
            cobros_controller_1.CobrosController,
            devoluciones_controller_1.DevolucionesController,
            reportes_controller_1.ReportesController,
        ],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map