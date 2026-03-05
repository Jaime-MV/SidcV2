export declare class DetalleVentaDto {
    productoId: number;
    cantidad: number;
}
export declare class CreateVentaDto {
    clienteId: number;
    vendedorId: number;
    detalles: DetalleVentaDto[];
}
