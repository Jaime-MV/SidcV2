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

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    precioBase?: number;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    precioCompra?: number;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    precioVenta?: number;

    @IsInt()
    @IsPositive()
    categoriaId: number;
}
