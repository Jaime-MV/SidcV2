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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCobroDto = exports.MetodoPagoEnum = void 0;
const class_validator_1 = require("class-validator");
var MetodoPagoEnum;
(function (MetodoPagoEnum) {
    MetodoPagoEnum["EFECTIVO"] = "EFECTIVO";
    MetodoPagoEnum["TARJETA"] = "TARJETA";
    MetodoPagoEnum["TRANSFERENCIA"] = "TRANSFERENCIA";
    MetodoPagoEnum["CHEQUE"] = "CHEQUE";
})(MetodoPagoEnum || (exports.MetodoPagoEnum = MetodoPagoEnum = {}));
class CreateCobroDto {
    monto;
    metodoPago;
    referenciaPago;
    facturaId;
    clienteId;
}
exports.CreateCobroDto = CreateCobroDto;
__decorate([
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateCobroDto.prototype, "monto", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(MetodoPagoEnum),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCobroDto.prototype, "metodoPago", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCobroDto.prototype, "referenciaPago", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateCobroDto.prototype, "facturaId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateCobroDto.prototype, "clienteId", void 0);
//# sourceMappingURL=create-cobro.dto.js.map