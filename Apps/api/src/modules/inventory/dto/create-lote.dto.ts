import { IsString, IsNotEmpty, IsInt, IsPositive, IsDateString } from 'class-validator';

export class CreateLoteDto {
    @IsString()
    @IsNotEmpty()
    numeroLote: string;

    @IsDateString()
    fechaFabricacion: string;

    @IsDateString()
    fechaVencimiento: string;

    @IsInt()
    @IsPositive()
    cantidadInicial: number;

    @IsInt()
    @IsPositive()
    productoId: number;
}
