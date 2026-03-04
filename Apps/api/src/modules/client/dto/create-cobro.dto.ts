import { IsInt, IsPositive, IsNumber, IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';

export enum MetodoPagoEnum {
    EFECTIVO = 'EFECTIVO',
    TARJETA = 'TARJETA',
    TRANSFERENCIA = 'TRANSFERENCIA',
    CHEQUE = 'CHEQUE',
}

export class CreateCobroDto {
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    monto: number;

    @IsEnum(MetodoPagoEnum)
    @IsNotEmpty()
    metodoPago: MetodoPagoEnum;

    @IsOptional()
    @IsString()
    referenciaPago?: string;

    @IsInt()
    @IsPositive()
    facturaId: number;

    @IsInt()
    @IsPositive()
    clienteId: number;
}
