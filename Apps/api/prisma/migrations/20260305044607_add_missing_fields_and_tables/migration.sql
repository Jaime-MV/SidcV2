-- CreateEnum
CREATE TYPE "EstadoProducto" AS ENUM ('NORMAL', 'STOCK_BAJO', 'POR_VENCER', 'CRITICO', 'VENCIDO');

-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('ENTRADA', 'SALIDA', 'AJUSTE_POSITIVO', 'AJUSTE_NEGATIVO');

-- CreateEnum
CREATE TYPE "EstadoRuta" AS ENUM ('EN_RUTA', 'COMPLETADA', 'PENDIENTE', 'CANCELADA');

-- CreateEnum
CREATE TYPE "TipoCliente" AS ENUM ('SUPERMERCADO', 'FARMACIA', 'TIENDA', 'MAYORISTA');

-- CreateEnum
CREATE TYPE "EstadoCliente" AS ENUM ('ACTIVO', 'BLOQUEADO', 'SUSPENDIDO');

-- CreateEnum
CREATE TYPE "EstadoVenta" AS ENUM ('PENDIENTE', 'COMPLETADA', 'ANULADA');

-- CreateEnum
CREATE TYPE "EstadoFactura" AS ENUM ('CREADA', 'PAGADA', 'PAGADA_PARCIALMENTE', 'ANULADA', 'VENCIDA');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'CHEQUE');

-- CreateEnum
CREATE TYPE "EstadoCobro" AS ENUM ('COBRADO', 'PENDIENTE', 'VENCIDO');

-- CreateEnum
CREATE TYPE "EstadoDevolucion" AS ENUM ('PENDIENTE', 'PROCESADA', 'RECHAZADA', 'APROBADA');

-- CreateEnum
CREATE TYPE "TipoPromocion" AS ENUM ('VOLUMEN', 'DESCUENTO', 'COMBO', 'ESPECIAL');

-- CreateEnum
CREATE TYPE "EstadoPromocion" AS ENUM ('ACTIVA', 'PROXIMA', 'EXPIRADA');

-- CreateTable
CREATE TABLE "Bodega" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "ubicacion" TEXT,
    "capacidadTotal" INTEGER NOT NULL DEFAULT 0,
    "capacidadUsada" INTEGER NOT NULL DEFAULT 0,
    "encargado" TEXT,

    CONSTRAINT "Bodega_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "colorHex" TEXT DEFAULT '#6b7280',

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "codigoBarras" TEXT,
    "precioCompra" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "precioVenta" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "minStock" INTEGER NOT NULL DEFAULT 0,
    "estadoProducto" "EstadoProducto" NOT NULL DEFAULT 'NORMAL',
    "categoriaId" INTEGER NOT NULL,
    "bodegaId" INTEGER,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lote" (
    "id" SERIAL NOT NULL,
    "numeroLote" TEXT NOT NULL,
    "fechaFabricacion" TIMESTAMP(3) NOT NULL,
    "fechaVencimiento" TIMESTAMP(3) NOT NULL,
    "cantidadInicial" INTEGER NOT NULL,
    "cantidadDisponible" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,

    CONSTRAINT "Lote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovimientoInventario" (
    "id" SERIAL NOT NULL,
    "tipoMovimiento" "TipoMovimiento" NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "fechaMovimiento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referencia" TEXT,
    "loteId" INTEGER NOT NULL,

    CONSTRAINT "MovimientoInventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendedor" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Vendedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ruta" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "vehiculo" TEXT,
    "kmEstimados" INTEGER,
    "horaInicio" TEXT,
    "horaFin" TEXT,
    "departamento" TEXT,
    "estado" "EstadoRuta" NOT NULL DEFAULT 'PENDIENTE',
    "clientesTotal" INTEGER NOT NULL DEFAULT 0,
    "entregasHoy" INTEGER NOT NULL DEFAULT 0,
    "entregasCompletadas" INTEGER NOT NULL DEFAULT 0,
    "vendedorId" INTEGER NOT NULL,

    CONSTRAINT "Ruta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "identificacion" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,
    "tipo" "TipoCliente" NOT NULL DEFAULT 'TIENDA',
    "estado" "EstadoCliente" NOT NULL DEFAULT 'ACTIVO',
    "ultimaCompra" TIMESTAMP(3),
    "limiteCredito" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "saldoActual" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "diasCredito" INTEGER NOT NULL DEFAULT 0,
    "rutaId" INTEGER,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Venta" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "descuentoTotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL,
    "estado" "EstadoVenta" NOT NULL DEFAULT 'COMPLETADA',
    "clienteId" INTEGER NOT NULL,
    "vendedorId" INTEGER NOT NULL,

    CONSTRAINT "Venta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalleVenta" (
    "id" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "ventaId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,

    CONSTRAINT "DetalleVenta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Factura" (
    "id" SERIAL NOT NULL,
    "numeroFactura" TEXT NOT NULL,
    "fechaEmision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaVencimiento" TIMESTAMP(3),
    "total" DECIMAL(12,2) NOT NULL,
    "estado" "EstadoFactura" NOT NULL DEFAULT 'CREADA',
    "ventaId" INTEGER NOT NULL,

    CONSTRAINT "Factura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cobro" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaPago" TIMESTAMP(3),
    "monto" DECIMAL(12,2) NOT NULL,
    "metodoPago" "MetodoPago",
    "referenciaPago" TEXT,
    "estado" "EstadoCobro" NOT NULL DEFAULT 'PENDIENTE',
    "diasVencido" INTEGER NOT NULL DEFAULT 0,
    "facturaId" INTEGER NOT NULL,
    "clienteId" INTEGER NOT NULL,

    CONSTRAINT "Cobro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Devolucion" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motivo" TEXT NOT NULL,
    "estado" "EstadoDevolucion" NOT NULL DEFAULT 'PROCESADA',
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "monto" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "ventaId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,

    CONSTRAINT "Devolucion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promocion" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoPromocion" NOT NULL DEFAULT 'DESCUENTO',
    "descripcion" TEXT,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "porcentajeDesc" DECIMAL(5,2) NOT NULL,
    "canal" TEXT,
    "usos" INTEGER NOT NULL DEFAULT 0,
    "presupuesto" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "gastado" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "estado" "EstadoPromocion" NOT NULL DEFAULT 'ACTIVA',
    "activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Promocion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromocionProducto" (
    "id" SERIAL NOT NULL,
    "promocionId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,

    CONSTRAINT "PromocionProducto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumenMensual" (
    "id" SERIAL NOT NULL,
    "anio" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "mesLabel" TEXT NOT NULL,
    "ventas" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "cobros" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "devoluciones" DECIMAL(14,2) NOT NULL DEFAULT 0,

    CONSTRAINT "ResumenMensual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstadisticaProducto" (
    "id" SERIAL NOT NULL,
    "totalVendido" INTEGER NOT NULL DEFAULT 0,
    "ingresos" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "productoId" INTEGER NOT NULL,

    CONSTRAINT "EstadisticaProducto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bodega_codigo_key" ON "Bodega"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_codigo_key" ON "Producto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_codigoBarras_key" ON "Producto"("codigoBarras");

-- CreateIndex
CREATE UNIQUE INDEX "Lote_numeroLote_key" ON "Lote"("numeroLote");

-- CreateIndex
CREATE UNIQUE INDEX "Ruta_codigo_key" ON "Ruta"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_codigo_key" ON "Cliente"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_identificacion_key" ON "Cliente"("identificacion");

-- CreateIndex
CREATE UNIQUE INDEX "Factura_numeroFactura_key" ON "Factura"("numeroFactura");

-- CreateIndex
CREATE UNIQUE INDEX "Factura_ventaId_key" ON "Factura"("ventaId");

-- CreateIndex
CREATE UNIQUE INDEX "Cobro_codigo_key" ON "Cobro"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Devolucion_codigo_key" ON "Devolucion"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Promocion_codigo_key" ON "Promocion"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "PromocionProducto_promocionId_productoId_key" ON "PromocionProducto"("promocionId", "productoId");

-- CreateIndex
CREATE UNIQUE INDEX "ResumenMensual_anio_mes_key" ON "ResumenMensual"("anio", "mes");

-- CreateIndex
CREATE UNIQUE INDEX "EstadisticaProducto_productoId_key" ON "EstadisticaProducto"("productoId");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_bodegaId_fkey" FOREIGN KEY ("bodegaId") REFERENCES "Bodega"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lote" ADD CONSTRAINT "Lote_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "Lote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruta" ADD CONSTRAINT "Ruta_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "Vendedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_rutaId_fkey" FOREIGN KEY ("rutaId") REFERENCES "Ruta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "Vendedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleVenta" ADD CONSTRAINT "DetalleVenta_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleVenta" ADD CONSTRAINT "DetalleVenta_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cobro" ADD CONSTRAINT "Cobro_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cobro" ADD CONSTRAINT "Cobro_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Devolucion" ADD CONSTRAINT "Devolucion_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Devolucion" ADD CONSTRAINT "Devolucion_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromocionProducto" ADD CONSTRAINT "PromocionProducto_promocionId_fkey" FOREIGN KEY ("promocionId") REFERENCES "Promocion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromocionProducto" ADD CONSTRAINT "PromocionProducto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstadisticaProducto" ADD CONSTRAINT "EstadisticaProducto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
