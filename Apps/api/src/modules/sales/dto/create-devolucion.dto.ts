import { IsString, IsNotEmpty, IsInt, IsPositive } from 'class-validator';

export class CreateDevolucionDto {
    @IsInt()
    @IsPositive()
    ventaId: number;

    @IsString()
    @IsNotEmpty()
    motivo: string;

    @IsInt()
    @IsPositive()
    productoId: number;

    @IsInt()
    @IsPositive()
    cantidad: number;
}
