import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateBodegaDto {
    @IsString()
    nombre: string;

    @IsOptional()
    @IsString()
    codigo?: string;

    @IsOptional()
    @IsString()
    ubicacion?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    capacidadTotal?: number;

    @IsOptional()
    @IsString()
    encargado?: string;
}
