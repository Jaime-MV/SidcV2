"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutesController = void 0;
const common_1 = require("@nestjs/common");
const routes_service_1 = require("./routes.service");
const create_vendedor_dto_1 = require("./dto/create-vendedor.dto");
const create_ruta_dto_1 = require("./dto/create-ruta.dto");
let RoutesController = class RoutesController {
    routesService;
    constructor(routesService) {
        this.routesService = routesService;
    }
    createVendedor(dto) {
        return this.routesService.createVendedor(dto);
    }
    findAllVendedores() {
        return this.routesService.findAllVendedores();
    }
    findVendedorById(id) {
        return this.routesService.findVendedorById(id);
    }
    updateVendedor(id, dto) {
        return this.routesService.updateVendedor(id, dto);
    }
    createRuta(dto) {
        return this.routesService.createRuta(dto);
    }
    findAllRutas() {
        return this.routesService.findAllRutas();
    }
    findRutaById(id) {
        return this.routesService.findRutaById(id);
    }
};
exports.RoutesController = RoutesController;
__decorate([
    (0, common_1.Post)('vendedores'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_vendedor_dto_1.CreateVendedorDto]),
    __metadata("design:returntype", void 0)
], RoutesController.prototype, "createVendedor", null);
__decorate([
    (0, common_1.Get)('vendedores'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RoutesController.prototype, "findAllVendedores", null);
__decorate([
    (0, common_1.Get)('vendedores/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RoutesController.prototype, "findVendedorById", null);
__decorate([
    (0, common_1.Patch)('vendedores/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], RoutesController.prototype, "updateVendedor", null);
__decorate([
    (0, common_1.Post)('rutas'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ruta_dto_1.CreateRutaDto]),
    __metadata("design:returntype", void 0)
], RoutesController.prototype, "createRuta", null);
__decorate([
    (0, common_1.Get)('rutas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RoutesController.prototype, "findAllRutas", null);
__decorate([
    (0, common_1.Get)('rutas/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RoutesController.prototype, "findRutaById", null);
exports.RoutesController = RoutesController = __decorate([
    (0, common_1.Controller)('logistics'),
    __metadata("design:paramtypes", [routes_service_1.RoutesService])
], RoutesController);
//# sourceMappingURL=routes.controller.js.map