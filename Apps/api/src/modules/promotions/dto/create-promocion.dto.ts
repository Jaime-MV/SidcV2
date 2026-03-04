import { IsString, IsNotEmpty, IsOptional, IsDateString, IsNumber, IsPositive, IsBoolean, IsArray, ArrayMinSize } from 'class-validator';

export class CreatePromocionDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsDateString()
    fechaInicio: string;

    @IsDateString()
    fechaFin: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    porcentajeDesc: number;

    @IsOptional()
    @IsBoolean()
    activa?: boolean;

    @IsArray()
    @ArrayMinSize(1)
    productoIds: number[];
}
