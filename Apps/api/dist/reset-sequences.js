"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const tables = [
        'Bodega', 'Categoria', 'Producto', 'Lote', 'MovimientoInventario',
        'Vendedor', 'Ruta', 'Cliente', 'Venta', 'DetalleVenta', 'Factura',
        'Cobro', 'Devolucion', 'Promocion', 'PromocionProducto',
        'ResumenMensual', 'EstadisticaProducto'
    ];
    for (const table of tables) {
        try {
            await prisma.$queryRawUnsafe(`SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), coalesce(max(id), 0) + 1, false) FROM "${table}";`);
            console.log(`Secuencia ajustada para ${table}`);
        }
        catch (error) {
            console.error(`Error ajustando ${table}:`, error.message);
        }
    }
}
main()
    .catch(console.error)
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=reset-sequences.js.map