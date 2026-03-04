export declare enum MetodoPagoEnum {
    EFECTIVO = "EFECTIVO",
    TARJETA = "TARJETA",
    TRANSFERENCIA = "TRANSFERENCIA",
    CHEQUE = "CHEQUE"
}
export declare class CreateCobroDto {
    monto: number;
    metodoPago: MetodoPagoEnum;
    referenciaPago?: string;
    facturaId: number;
    clienteId: number;
}
