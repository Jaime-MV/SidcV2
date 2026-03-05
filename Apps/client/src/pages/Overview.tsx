import { useState, useEffect } from 'react';
import { ShoppingCart, FileText, Users, Truck, DollarSign, Package, AlertTriangle, TrendingUp, Clock, CheckCircle2, RefreshCw } from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Header } from '../components/layout/Header';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { dashboardApi, ventasApi, rutasApi, inventarioApi, type DashboardStats, type ResumenMensual, type VentasPorCategoria, type Ruta, type Lote, type Factura, estadoRutaLabel, estadoFacturaLabel } from '../services/api';

const fmt = (n: number) => new Intl.NumberFormat('es-SV', { style: 'currency', currency: 'USD' }).format(n);
const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#6b7280'];

function calcDias(fechaVenc: string) {
    return Math.ceil((new Date(fechaVenc).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export default function Overview() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [ventas, setVentas] = useState<ResumenMensual[]>([]);
    const [categorias, setCategorias] = useState<VentasPorCategoria[]>([]);
    const [rutas, setRutas] = useState<Ruta[]>([]);
    const [lotes, setLotes] = useState<Lote[]>([]);
    const [facturas, setFacturas] = useState<Factura[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const [statsData, ventasData, catData, rutasData, lotesData, facturasData] = await Promise.all([
                dashboardApi.getStats(),
                dashboardApi.getVentasMensuales(),
                dashboardApi.getVentasPorCategoria(),
                rutasApi.getRutas(),
                inventarioApi.getInventarioPorLote(),
                ventasApi.getFacturas(1, 6),
            ]);
            setStats(statsData);
            setVentas(ventasData);
            setCategorias(catData);
            setRutas(rutasData);
            setLotes(lotesData);
            setFacturas(facturasData.items);
        } catch (e) {
            console.error('Error cargando dashboard:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const productosPorVencer = lotes.filter(l => {
        const dias = calcDias(l.fechaVencimiento);
        return dias >= 0 && dias < 30;
    });
    const productosCriticos = lotes.filter(l => {
        const dias = calcDias(l.fechaVencimiento);
        return dias >= 0 && dias < 7;
    });
    const productosStockBajo = lotes.filter(l => l.cantidadDisponible < (l.producto?.minStock ?? 0));

    const productosMasVendidos = stats?.productosMasVendidos ?? [];
    const ventasTrend = stats && stats.ventasMes > 0 && stats.ventasMesAnterior > 0
        ? Math.round(((stats.ventasMes - stats.ventasMesAnterior) / stats.ventasMesAnterior) * 100)
        : 0;

    const facturasBadge = (estado: string) => {
        const label = estadoFacturaLabel[estado] ?? estado;
        if (estado === 'PAGADA') return <Badge label={label} variant="success" />;
        if (estado === 'CREADA' || estado === 'PAGADA_PARCIALMENTE') return <Badge label={label} variant="warning" />;
        if (estado === 'VENCIDA') return <Badge label={label} variant="danger" />;
        return <Badge label={label} variant="neutral" />;
    };

    const entregasPorRuta = rutas.map(r => ({
        ruta: r.nombre.length > 12 ? r.nombre.substring(0, 12) + '…' : r.nombre,
        completadas: r.entregasCompletadas ?? 0,
        pendientes: (r.entregasHoy ?? 0) - (r.entregasCompletadas ?? 0),
        estado: r.estado,
    }));

    if (loading) return (
        <div className="flex flex-col h-full">
            <Header title="Dashboard General" subtitle="Cargando..." />
            <div className="flex-1 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full">
            <Header title="Dashboard General" subtitle="Monitoreo del flujo comercial · SIDC El Salvador" onRefresh={loadData} />
            <div className="flex-1 p-6 overflow-y-auto space-y-6">

                {/* ===== ALERTAS ACTIVAS ===== */}
                {(productosCriticos.length > 0 || productosStockBajo.length > 0 || (stats?.cobrosVencidos ?? 0) > 0 || (stats?.clientesBloqueados ?? 0) > 0) && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-wrap gap-3 items-center">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium text-amber-800">Alertas del Sistema</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {productosPorVencer.length > 0 && (
                                <span className="bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-full border border-amber-300">
                                    ⏰ {productosPorVencer.length} lotes por vencer en &lt;30 días
                                </span>
                            )}
                            {(stats?.cobrosVencidos ?? 0) > 0 && (
                                <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full border border-red-300">
                                    🔴 {stats!.cobrosVencidos} cobros vencidos · {fmt(stats!.montoVencido)}
                                </span>
                            )}
                            {productosStockBajo.length > 0 && (
                                <span className="bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-full border border-amber-300">
                                    📦 {productosStockBajo.length} productos con stock bajo/crítico
                                </span>
                            )}
                            {(stats?.clientesBloqueados ?? 0) > 0 && (
                                <span className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full border border-orange-300">
                                    🚫 {stats!.clientesBloqueados} clientes bloqueados por crédito
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* ===== KPI CARDS ===== */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Ventas del Mes"
                        value={fmt(stats?.ventasMes ?? 0)}
                        subtitle={new Date().toLocaleString('es-SV', { month: 'long', year: 'numeric' })}
                        icon={ShoppingCart}
                        iconColor="text-blue-600"
                        iconBg="bg-blue-100"
                        trend={ventasTrend}
                        trendLabel="vs mes anterior"
                    />
                    <StatCard
                        title="Facturas Pendientes"
                        value={stats?.facturasPendientes ?? 0}
                        subtitle={`${stats?.facturasVencidas ?? 0} vencidas`}
                        icon={FileText}
                        iconColor="text-amber-600"
                        iconBg="bg-amber-100"
                        alert={(stats?.facturasVencidas ?? 0) > 0}
                    />
                    <StatCard
                        title="Clientes Activos"
                        value={stats?.clientesActivos ?? 0}
                        subtitle={`${stats?.clientesBloqueados ?? 0} bloqueados`}
                        icon={Users}
                        iconColor="text-emerald-600"
                        iconBg="bg-emerald-100"
                    />
                    <StatCard
                        title="Rutas Activas Hoy"
                        value={`${stats?.rutasActivas ?? 0} / ${(stats?.rutasActivas ?? 0) + (stats?.rutasCompletadas ?? 0)}`}
                        subtitle={`${stats?.rutasCompletadas ?? 0} completadas`}
                        icon={Truck}
                        iconColor="text-purple-600"
                        iconBg="bg-purple-100"
                    />
                </div>

                {/* ===== CHARTS ROW ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Area Chart: Ventas vs Cobros */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-medium text-gray-900">Tendencia Ventas vs Cobros</h3>
                                <p className="text-gray-400 text-xs mt-0.5">Últimos 6 meses · USD</p>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-blue-500 rounded"></div>Ventas</div>
                                <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-emerald-500 rounded"></div>Cobros</div>
                            </div>
                        </div>
                        {ventas.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <AreaChart data={ventas} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorCobros" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="mesLabel" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip formatter={(v: number) => [fmt(v), '']} contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                    <Area type="monotone" dataKey="ventas" stroke="#3b82f6" strokeWidth={2} fill="url(#colorVentas)" name="Ventas" />
                                    <Area type="monotone" dataKey="cobros" stroke="#10b981" strokeWidth={2} fill="url(#colorCobros)" name="Cobros" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : <div className="flex items-center justify-center h-44 text-gray-400 text-sm">Sin datos de ventas mensuales aún</div>}
                    </div>

                    {/* Pie Chart: Ventas por Categoría */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-medium text-gray-900 mb-1">Ventas por Categoría</h3>
                        <p className="text-gray-400 text-xs mb-4">Distribución porcentual</p>
                        {categorias.length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={160}>
                                    <PieChart>
                                        <Pie data={categorias} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="valor">
                                            {categorias.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip formatter={v => [`${v}%`, '']} contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="space-y-1.5 mt-2">
                                    {categorias.map((cat, i) => (
                                        <div key={cat.categoria} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                                                <span className="text-gray-600">{cat.categoria}</span>
                                            </div>
                                            <span className="text-gray-800 font-medium">{cat.valor}%</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : <div className="flex items-center justify-center h-44 text-gray-400 text-sm">Sin datos de categorías</div>}
                    </div>
                </div>

                {/* ===== PRODUCTOS MÁS VENDIDOS + RUTAS ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Horizontal Bar: Productos más vendidos */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-medium text-gray-900">Productos Más Vendidos</h3>
                                <p className="text-gray-400 text-xs mt-0.5">Por unidades vendidas</p>
                            </div>
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                        </div>
                        {productosMasVendidos.length > 0 ? (
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={productosMasVendidos} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                                    <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <YAxis dataKey="nombre" type="category" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} width={140} />
                                    <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} formatter={(v: number) => [v.toLocaleString(), 'Unidades']} />
                                    <Bar dataKey="unidades" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Unidades" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <div className="flex items-center justify-center h-44 text-gray-400 text-sm">Sin datos de ventas aún</div>}
                    </div>

                    {/* Rutas: barras de progreso */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-medium text-gray-900">Estado de Rutas</h3>
                                <p className="text-gray-400 text-xs mt-0.5">Entregas del día</p>
                            </div>
                            <Truck className="w-4 h-4 text-purple-500" />
                        </div>
                        {rutas.length > 0 ? (
                            <div className="space-y-3">
                                {rutas.slice(0, 6).map(r => {
                                    const entH = r.entregasHoy ?? 0;
                                    const entC = r.entregasCompletadas ?? 0;
                                    const pct = entH > 0 ? Math.round((entC / entH) * 100) : 0;
                                    const color = r.estado === 'COMPLETADA' ? 'bg-emerald-500' : r.estado === 'EN_RUTA' ? 'bg-blue-500' : 'bg-gray-300';
                                    const statusColor = r.estado === 'COMPLETADA' ? 'text-emerald-600' : r.estado === 'EN_RUTA' ? 'text-blue-600' : 'text-gray-400';
                                    return (
                                        <div key={r.id}>
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="text-gray-700 font-medium truncate max-w-[120px]">{r.nombre}</span>
                                                <div className="flex items-center gap-1">
                                                    {r.estado === 'COMPLETADA' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Clock className="w-3 h-3 text-blue-400" />}
                                                    <span className={statusColor}>{entC}/{entH}</span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Sin rutas configuradas</div>}
                    </div>
                </div>

                {/* ===== FACTURAS + PRODUCTOS POR VENCER ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Últimas Facturas */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-gray-900">Últimas Facturas</h3>
                            <a href="/ventas" className="text-blue-500 text-xs hover:text-blue-700">Ver todas →</a>
                        </div>
                        {facturas.length > 0 ? (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left text-xs text-gray-400 pb-2 font-medium">Factura</th>
                                        <th className="text-left text-xs text-gray-400 pb-2 font-medium">Cliente</th>
                                        <th className="text-right text-xs text-gray-400 pb-2 font-medium">Total</th>
                                        <th className="text-center text-xs text-gray-400 pb-2 font-medium">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {facturas.slice(0, 6).map(f => (
                                        <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="py-2.5 text-xs text-gray-500 font-mono">{f.numeroFactura}</td>
                                            <td className="py-2.5 text-xs text-gray-700 max-w-[120px] truncate">{f.venta?.cliente?.nombre ?? '—'}</td>
                                            <td className="py-2.5 text-xs text-gray-900 text-right font-medium">{fmt(Number(f.total))}</td>
                                            <td className="py-2.5 text-center">{facturasBadge(f.estado)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Sin facturas registradas</div>}
                    </div>

                    {/* Productos / Lotes por vencer */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-gray-900">Alertas de Inventario</h3>
                            <a href="/inventario" className="text-blue-500 text-xs hover:text-blue-700">Ver inventario →</a>
                        </div>
                        <div className="space-y-3 overflow-y-auto max-h-64">
                            {productosPorVencer.slice(0, 4).map(l => {
                                const dias = calcDias(l.fechaVencimiento);
                                const isCritical = dias < 7;
                                return (
                                    <div key={l.id} className={`flex items-start justify-between p-3 rounded-lg border ${isCritical ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                                        <div className="flex items-start gap-2.5">
                                            <Package className={`w-4 h-4 mt-0.5 ${isCritical ? 'text-red-500' : 'text-amber-500'}`} />
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{l.producto?.nombre ?? 'Producto'}</p>
                                                <p className="text-xs text-gray-500">Lote {l.numeroLote}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">Stock: {l.cantidadDisponible} uds</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${isCritical ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {dias}d
                                            </span>
                                            <p className="text-xs text-gray-400 mt-1">{new Date(l.fechaVencimiento).toLocaleDateString('es-SV')}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            {productosStockBajo.slice(0, 2).map(l => (
                                <div key={`sb-${l.id}`} className="flex items-start justify-between p-3 rounded-lg border bg-blue-50 border-blue-200">
                                    <div className="flex items-start gap-2.5">
                                        <DollarSign className="w-4 h-4 mt-0.5 text-blue-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{l.producto?.nombre ?? 'Producto'}</p>
                                            <p className="text-xs text-gray-500">Stock bajo mínimo</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                            {l.cantidadDisponible}/{l.producto?.minStock ?? '?'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {productosPorVencer.length === 0 && productosStockBajo.length === 0 && (
                                <div className="flex items-center justify-center h-24 text-gray-400 text-sm">✅ Sin alertas de inventario</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
