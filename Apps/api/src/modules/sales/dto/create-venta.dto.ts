import { IsInt, IsNotEmpty, IsPositive, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class DetalleVentaDto {
    @IsInt()
    @IsPositive()
    productoId: number;

    @IsInt()
    @IsPositive()
    cantidad: number;
}

export class CreateVentaDto {
    @IsInt()
    @IsPositive()
    clienteId: number;

    @IsInt()
    @IsPositive()
    vendedorId: number;

    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => DetalleVentaDto)
    detalles: DetalleVentaDto[];
}
