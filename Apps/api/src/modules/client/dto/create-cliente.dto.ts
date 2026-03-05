import { IsString, IsNotEmpty, IsOptional, IsEmail, IsNumber, IsInt, Min, IsIn } from 'class-validator';

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
    @IsIn(['TIENDA', 'SUPERMERCADO', 'FARMACIA', 'MAYORISTA'])
    tipo?: string;

    @IsOptional()
    @IsIn(['ACTIVO', 'BLOQUEADO', 'SUSPENDIDO'])
    estado?: string;

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
