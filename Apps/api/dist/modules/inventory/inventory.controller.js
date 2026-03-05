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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const create_categoria_dto_1 = require("./dto/create-categoria.dto");
const create_producto_dto_1 = require("./dto/create-producto.dto");
const create_lote_dto_1 = require("./dto/create-lote.dto");
const create_bodega_dto_1 = require("./dto/create-bodega.dto");
let InventoryController = class InventoryController {
    inventoryService;
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    createCategoria(dto) {
        return this.inventoryService.createCategoria(dto);
    }
    findAllCategorias() {
        return this.inventoryService.findAllCategorias();
    }
    findCategoriaById(id) {
        return this.inventoryService.findCategoriaById(id);
    }
    createProducto(dto) {
        return this.inventoryService.createProducto(dto);
    }
    findAllProductos(page, pageSize) {
        return this.inventoryService.findAllProductos(page ? parseInt(page) : 1, pageSize ? parseInt(pageSize) : 20);
    }
    findProductoById(id) {
        return this.inventoryService.findProductoById(id);
    }
    createLote(dto) {
        return this.inventoryService.createLote(dto);
    }
    findAllLotes(productoId) {
        return this.inventoryService.findAllLotes(productoId ? parseInt(productoId) : undefined);
    }
    findLoteById(id) {
        return this.inventoryService.findLoteById(id);
    }
    getInventarioPorLote() {
        return this.inventoryService.getInventarioPorLote();
    }
    getProductosProximosAVencer(dias) {
        return this.inventoryService.getProductosProximosAVencer(dias ? parseInt(dias) : 30);
    }
    getMovimientos(loteId) {
        return this.inventoryService.getMovimientos(loteId ? parseInt(loteId) : undefined);
    }
    createBodega(dto) {
        return this.inventoryService.createBodega(dto);
    }
    findAllBodegas() {
        return this.inventoryService.findAllBodegas();
    }
    findBodegaById(id) {
        return this.inventoryService.findBodegaById(id);
    }
    updateBodega(id, dto) {
        return this.inventoryService.updateBodega(id, dto);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Post)('categorias'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_categoria_dto_1.CreateCategoriaDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createCategoria", null);
__decorate([
    (0, common_1.Get)('categorias'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findAllCategorias", null);
__decorate([
    (0, common_1.Get)('categorias/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findCategoriaById", null);
__decorate([
    (0, common_1.Post)('productos'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_producto_dto_1.CreateProductoDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createProducto", null);
__decorate([
    (0, common_1.Get)('productos'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findAllProductos", null);
__decorate([
    (0, common_1.Get)('productos/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findProductoById", null);
__decorate([
    (0, common_1.Post)('lotes'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lote_dto_1.CreateLoteDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createLote", null);
__decorate([
    (0, common_1.Get)('lotes'),
    __param(0, (0, common_1.Query)('productoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findAllLotes", null);
__decorate([
    (0, common_1.Get)('lotes/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findLoteById", null);
__decorate([
    (0, common_1.Get)('reportes/inventario-lote'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getInventarioPorLote", null);
__decorate([
    (0, common_1.Get)('reportes/proximos-vencer'),
    __param(0, (0, common_1.Query)('dias')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getProductosProximosAVencer", null);
__decorate([
    (0, common_1.Get)('reportes/movimientos'),
    __param(0, (0, common_1.Query)('loteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getMovimientos", null);
__decorate([
    (0, common_1.Post)('bodegas'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bodega_dto_1.CreateBodegaDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createBodega", null);
__decorate([
    (0, common_1.Get)('bodegas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findAllBodegas", null);
__decorate([
    (0, common_1.Get)('bodegas/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findBodegaById", null);
__decorate([
    (0, common_1.Patch)('bodegas/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateBodega", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.Controller)('inventory'),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map