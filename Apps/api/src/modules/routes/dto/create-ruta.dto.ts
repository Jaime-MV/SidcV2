import { IsString, IsNotEmpty, IsOptional, IsInt, IsPositive } from 'class-validator';

export class CreateRutaDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsInt()
    @IsPositive()
    vendedorId: number;
}
