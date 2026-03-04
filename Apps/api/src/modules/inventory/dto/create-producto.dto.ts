import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, IsInt } from 'class-validator';

export class CreateProductoDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsString()
    codigoBarras?: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    precioBase: number;

    @IsInt()
    @IsPositive()
    categoriaId: number;
}
