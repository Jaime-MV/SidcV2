import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateVendedorDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsOptional()
    @IsString()
    telefono?: string;

    @IsOptional()
    @IsBoolean()
    activo?: boolean;
}
