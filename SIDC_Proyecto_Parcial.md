# PROYECTO PARCIAL: SISTEMA INTEGRAL DE DISTRIBUCIÓN COMERCIAL (SIDC)

## Modelado Orientado a Objetos en PostgreSQL

### 1. CONTEXTO EMPRESARIAL
En El Salvador existen empresas distribuidoras que abastecen tiendas, supermercados, farmacias y mayoristas con productos de consumo masivo (alimentos, bebidas, limpieza y cuidado personal). Estas empresas manejan múltiples bodegas, rutas de reparto, vendedores, clientes con crédito, promociones por canal, control de inventario por lote y vencimiento, devoluciones, facturación electrónica y cobros.

Muchas organizaciones aún utilizan sistemas fragmentados o hojas de cálculo, lo que provoca inventarios inconsistentes, pérdidas por vencimiento, errores logísticos, mala gestión de crédito y reportes financieros tardíos.

La empresa desea implementar un **Sistema Integral de Distribución Comercial (SIDC)** centralizado.

### 2. OBJETIVO DEL PROYECTO
Diseñar e implementar en PostgreSQL orientado a objetos una base de datos que permita:
- Gestionar inventario por lote y vencimiento
- Administrar clientes y crédito
- Controlar ventas y facturación
- Planificar rutas de reparto
- Registrar cobros
- Manejar devoluciones
- Controlar promociones
- Generar trazabilidad completa

### 3. REGLAS DE NEGOCIO
- No vender productos vencidos
- No vender sin inventario
- Cliente crédito no puede exceder límite
- Lote con fecha de vencimiento obligatoria
- Venta genera movimiento inventario
- Pago aplica a factura existente
- Devolución solo de ventas previas
- Promoción vigente por fecha
- Ruta asignada a vendedor
- Entrega solo en clientes de ruta

### 4. MÓDULOS A DESARROLLAR

**Módulo obligatorio: Ventas y Facturación**
- Crear cliente
- Crear venta
- Agregar productos
- Validar inventario
- Generar factura
- Aplicar promoción

**Otros Módulos:**
- Inventario
- Cobros
- Rutas

### 5. REPORTES REQUERIDOS
- Productos más vendidos
