"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devoluciones = exports.cobros = exports.facturas = exports.ventas = exports.promociones = exports.rutas = exports.vendedores = exports.clientes = exports.lotes = exports.productos = exports.categorias = void 0;
exports.categorias = [
    { id: 1, nombre: 'Alimentos', descripcion: 'Productos alimenticios en general', activa: true },
    { id: 2, nombre: 'Bebidas', descripcion: 'Bebidas gaseosas, jugos y agua', activa: true },
    { id: 3, nombre: 'Limpieza', descripcion: 'Productos de limpieza del hogar', activa: true },
    { id: 4, nombre: 'Cuidado Personal', descripcion: 'Higiene y cuidado personal', activa: true },
    { id: 5, nombre: 'Snacks', descripcion: 'Bocadillos y aperitivos', activa: true },
];
exports.productos = [
    { id: 1, categoriaId: 1, nombre: 'Arroz Blanco 5lb', codigo: 'ALI-001', precio: 3.50, unidad: 'bolsa', activo: true },
    { id: 2, categoriaId: 1, nombre: 'Frijoles Negros 1lb', codigo: 'ALI-002', precio: 1.25, unidad: 'bolsa', activo: true },
    { id: 3, categoriaId: 1, nombre: 'Azúcar Blanca 2lb', codigo: 'ALI-003', precio: 1.80, unidad: 'bolsa', activo: true },
    { id: 4, categoriaId: 2, nombre: 'Gaseosa Cola 1.5L', codigo: 'BEB-001', precio: 1.50, unidad: 'botella', activo: true },
    { id: 5, categoriaId: 2, nombre: 'Agua Purificada 600ml', codigo: 'BEB-002', precio: 0.75, unidad: 'botella', activo: true },
    { id: 6, categoriaId: 2, nombre: 'Jugo Natural Naranja 1L', codigo: 'BEB-003', precio: 2.25, unidad: 'botella', activo: true },
    { id: 7, categoriaId: 3, nombre: 'Detergente en Polvo 500g', codigo: 'LIM-001', precio: 2.00, unidad: 'bolsa', activo: true },
    { id: 8, categoriaId: 3, nombre: 'Jabón de Lavar', codigo: 'LIM-002', precio: 0.60, unidad: 'barra', activo: true },
    { id: 9, categoriaId: 4, nombre: 'Shampoo 400ml', codigo: 'CUI-001', precio: 3.75, unidad: 'envase', activo: true },
    { id: 10, categoriaId: 4, nombre: 'Pasta Dental 100g', codigo: 'CUI-002', precio: 1.50, unidad: 'envase', activo: true },
    { id: 11, categoriaId: 5, nombre: 'Papas Fritas 50g', codigo: 'SNK-001', precio: 0.90, unidad: 'bolsa', activo: true },
    { id: 12, categoriaId: 5, nombre: 'Galletas de Soda 200g', codigo: 'SNK-002', precio: 1.20, unidad: 'paquete', activo: true },
];
exports.lotes = [
    { id: 1, productoId: 1, numero: 'L2024-001', cantidad: 500, fechaVencimiento: '2025-12-31', bodega: 'Bodega A' },
    { id: 2, productoId: 2, numero: 'L2024-002', cantidad: 300, fechaVencimiento: '2025-08-15', bodega: 'Bodega A' },
    { id: 3, productoId: 3, numero: 'L2024-003', cantidad: 450, fechaVencimiento: '2025-10-30', bodega: 'Bodega B' },
    { id: 4, productoId: 4, numero: 'L2024-004', cantidad: 1200, fechaVencimiento: '2025-06-30', bodega: 'Bodega B' },
    { id: 5, productoId: 5, numero: 'L2024-005', cantidad: 2000, fechaVencimiento: '2025-09-15', bodega: 'Bodega C' },
    { id: 6, productoId: 7, numero: 'L2024-006', cantidad: 800, fechaVencimiento: '2026-03-31', bodega: 'Bodega A' },
    { id: 7, productoId: 9, numero: 'L2024-007', cantidad: 350, fechaVencimiento: '2026-01-15', bodega: 'Bodega C' },
    { id: 8, productoId: 11, numero: 'L2024-008', cantidad: 1500, fechaVencimiento: '2025-11-20', bodega: 'Bodega B' },
];
exports.clientes = [
    { id: 1, nombre: 'Tienda El Mercadito', tipo: 'CONTADO', direccion: 'Av. Santa Ana #45', telefono: '7800-1234', email: 'mercadito@gmail.com', limiteCredito: 0, saldoCredito: 0, activo: true },
    { id: 2, nombre: 'Supermercado La Colonia', tipo: 'CREDITO', direccion: 'Blvd. Los Héroes #120', telefono: '2222-3344', email: 'lacolonia@empresa.sv', limiteCredito: 5000, saldoCredito: 1500, activo: true },
    { id: 3, nombre: 'Farmacia San Lucas', tipo: 'CREDITO', direccion: 'Calle Arce #89', telefono: '7900-4321', email: 'fbsanlucas@farmacia.sv', limiteCredito: 3000, saldoCredito: 800, activo: true },
    { id: 4, nombre: 'Mayorista del Norte', tipo: 'CREDITO', direccion: 'Km 45 Carretera Norte', telefono: '2233-1122', email: 'norte@mayorista.sv', limiteCredito: 10000, saldoCredito: 4200, activo: true },
    { id: 5, nombre: 'Pulpería Los Pinos', tipo: 'CONTADO', direccion: 'Col. Los Pinos #12', telefono: '7711-2233', email: 'pinos@pulperia.com', limiteCredito: 0, saldoCredito: 0, activo: true },
    { id: 6, nombre: 'Distribuidora Centro', tipo: 'CREDITO', direccion: 'Centro Histórico #55', telefono: '2244-5566', email: 'centro@distribuidora.sv', limiteCredito: 8000, saldoCredito: 2100, activo: false },
];
exports.vendedores = [
    { id: 1, nombre: 'Carlos Martínez', codigo: 'VND-001', email: 'cmartinez@sidc.sv', telefono: '7700-0001', activo: true },
    { id: 2, nombre: 'Ana García', codigo: 'VND-002', email: 'agarcia@sidc.sv', telefono: '7700-0002', activo: true },
    { id: 3, nombre: 'Roberto López', codigo: 'VND-003', email: 'rlopez@sidc.sv', telefono: '7700-0003', activo: true },
    { id: 4, nombre: 'María Pérez', codigo: 'VND-004', email: 'mperez@sidc.sv', telefono: '7700-0004', activo: true },
];
exports.rutas = [
    { id: 1, vendedorId: 1, nombre: 'Ruta Norte', zona: 'Norte San Salvador', dias: ['Lunes', 'Miércoles', 'Viernes'], clienteIds: [2, 4] },
    { id: 2, vendedorId: 2, nombre: 'Ruta Sur', zona: 'Sur San Salvador', dias: ['Martes', 'Jueves'], clienteIds: [1, 5] },
    { id: 3, vendedorId: 3, nombre: 'Ruta Centro', zona: 'Centro Histórico', dias: ['Lunes', 'Martes', 'Miércoles'], clienteIds: [3, 6] },
    { id: 4, vendedorId: 4, nombre: 'Ruta Oriente', zona: 'Oriente del País', dias: ['Miércoles', 'Viernes'], clienteIds: [1, 2, 3] },
];
exports.promociones = [
    { id: 1, nombre: 'Descuento Bebidas 10%', tipo: 'DESCUENTO_PORCENTAJE', valor: 10, productoIds: [4, 5, 6], fechaInicio: '2025-01-01', fechaFin: '2025-06-30', activa: true },
    { id: 2, nombre: '2x1 en Snacks', tipo: '2x1', valor: 0, productoIds: [11, 12], fechaInicio: '2025-02-01', fechaFin: '2025-03-31', activa: true },
    { id: 3, nombre: 'Descuento $0.50 en Limpieza', tipo: 'DESCUENTO_MONTO', valor: 0.50, productoIds: [7, 8], fechaInicio: '2025-01-15', fechaFin: '2025-04-15', activa: true },
    { id: 4, nombre: 'Promo Cuidado Personal', tipo: 'DESCUENTO_PORCENTAJE', valor: 15, productoIds: [9, 10], fechaInicio: '2024-11-01', fechaFin: '2025-01-31', activa: false },
];
exports.ventas = [
    {
        id: 1, clienteId: 2, vendedorId: 1, rutaId: 1, fecha: '2025-02-20', estado: 'FACTURADA', tipo: 'CREDITO', total: 185.50,
        detalles: [
            { productoId: 1, loteId: 1, cantidad: 20, precioUnitario: 3.50, descuento: 0, subtotal: 70.00 },
            { productoId: 4, loteId: 4, cantidad: 50, precioUnitario: 1.50, descuento: 0.15, subtotal: 67.50 },
            { productoId: 7, loteId: 6, cantidad: 24, precioUnitario: 2.00, descuento: 0, subtotal: 48.00 },
        ]
    },
    {
        id: 2, clienteId: 1, vendedorId: 2, rutaId: 2, fecha: '2025-02-22', estado: 'FACTURADA', tipo: 'CONTADO', total: 45.75,
        detalles: [
            { productoId: 5, loteId: 5, cantidad: 24, precioUnitario: 0.75, descuento: 0, subtotal: 18.00 },
            { productoId: 11, loteId: 8, cantidad: 30, precioUnitario: 0.90, descuento: 0, subtotal: 27.00 },
        ]
    },
    {
        id: 3, clienteId: 4, vendedorId: 1, rutaId: 1, fecha: '2025-02-25', estado: 'FACTURADA', tipo: 'CREDITO', total: 320.00,
        detalles: [
            { productoId: 1, loteId: 1, cantidad: 50, precioUnitario: 3.50, descuento: 0, subtotal: 175.00 },
            { productoId: 2, loteId: 2, cantidad: 60, precioUnitario: 1.25, descuento: 0, subtotal: 75.00 },
            { productoId: 9, loteId: 7, cantidad: 18, precioUnitario: 3.75, descuento: 0.15, subtotal: 57.38 },
        ]
    },
    {
        id: 4, clienteId: 3, vendedorId: 3, rutaId: 3, fecha: '2025-02-27', estado: 'FACTURADA', tipo: 'CREDITO', total: 95.00,
        detalles: [
            { productoId: 10, loteId: 7, cantidad: 24, precioUnitario: 1.50, descuento: 0, subtotal: 36.00 },
            { productoId: 9, loteId: 7, cantidad: 12, precioUnitario: 3.75, descuento: 0, subtotal: 45.00 },
            { productoId: 3, loteId: 3, cantidad: 8, precioUnitario: 1.80, descuento: 0, subtotal: 14.40 },
        ]
    },
    {
        id: 5, clienteId: 5, vendedorId: 2, rutaId: 2, fecha: '2025-03-01', estado: 'PENDIENTE', tipo: 'CONTADO', total: 28.50,
        detalles: [
            { productoId: 12, loteId: 8, cantidad: 10, precioUnitario: 1.20, descuento: 0, subtotal: 12.00 },
            { productoId: 5, loteId: 5, cantidad: 12, precioUnitario: 0.75, descuento: 0, subtotal: 9.00 },
            { productoId: 8, loteId: 6, cantidad: 12, precioUnitario: 0.60, descuento: 0, subtotal: 7.20 },
        ]
    },
];
exports.facturas = [
    { id: 1, ventaId: 1, numero: 'FAC-2025-0001', fecha: '2025-02-20', total: 185.50, estado: 'PENDIENTE', tipo: 'CREDITO' },
    { id: 2, ventaId: 2, numero: 'FAC-2025-0002', fecha: '2025-02-22', total: 45.75, estado: 'PAGADA', tipo: 'CONTADO' },
    { id: 3, ventaId: 3, numero: 'FAC-2025-0003', fecha: '2025-02-25', total: 320.00, estado: 'PENDIENTE', tipo: 'CREDITO' },
    { id: 4, ventaId: 4, numero: 'FAC-2025-0004', fecha: '2025-02-27', total: 95.00, estado: 'PAGADA', tipo: 'CREDITO' },
];
exports.cobros = [
    { id: 1, facturaId: 2, clienteId: 1, fecha: '2025-02-22', monto: 45.75, metodoPago: 'EFECTIVO' },
    { id: 2, facturaId: 4, clienteId: 3, fecha: '2025-02-28', monto: 95.00, metodoPago: 'TRANSFERENCIA' },
    { id: 3, facturaId: 1, clienteId: 2, fecha: '2025-03-01', monto: 100.00, metodoPago: 'CHEQUE' },
];
exports.devoluciones = [
    {
        id: 1, ventaId: 2, clienteId: 1, fecha: '2025-02-24', motivo: 'Producto en mal estado',
        detalles: [{ productoId: 5, cantidad: 6, monto: 4.50 }],
        totalDevuelto: 4.50, estado: 'APROBADA'
    },
    {
        id: 2, ventaId: 1, clienteId: 2, fecha: '2025-02-26', motivo: 'Error en pedido',
        detalles: [{ productoId: 7, cantidad: 4, monto: 8.00 }],
        totalDevuelto: 8.00, estado: 'PENDIENTE'
    },
];
//# sourceMappingURL=mock-data.js.map