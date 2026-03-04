import { IsString, IsNotEmpty, IsOptional, IsEmail, IsNumber, IsInt, Min } from 'class-validator';

export class CreateClienteDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    identificacion: string;

    @IsString()
    @IsNotEmpty()
    direccion: string;

    @IsOptional()
    @IsString()
    telefono?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    limiteCredito?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    diasCredito?: number;

    @IsOptional()
    @IsInt()
    rutaId?: number;
}
