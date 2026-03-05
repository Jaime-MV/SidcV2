import { useState, useEffect } from 'react';
import { Package, Search, Filter, BarChart2, RefreshCw, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Header } from '../components/layout/Header';
import { Badge } from '../components/ui/Badge';
import { inventarioApi, type Lote, type Bodega } from '../services/api';

const fmt = (n: number) => new Intl.NumberFormat('es-SV', { style: 'currency', currency: 'USD' }).format(n);
const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#6b7280'];

function calcEstado(lote: Lote): string {
    const now = Date.now();
    const venc = new Date(lote.fechaVencimiento).getTime();
    const dias = Math.ceil((venc - now) / (1000 * 60 * 60 * 24));
    if (dias < 0) return 'Vencido';
    if (dias < 7) return 'Crítico';
    if (dias < 30) return 'Por Vencer';
    const minStock = lote.producto?.minStock ?? 0;
    if (lote.cantidadDisponible < minStock) return 'Stock Bajo';
    return 'Normal';
}

const estadoBadge = (estado: string) => {
    if (estado === 'Normal') return <Badge label="Normal" variant="success" />;
    if (estado === 'Stock Bajo') return <Badge label="Stock Bajo" variant="warning" />;
    if (estado === 'Por Vencer') return <Badge label="Por Vencer" variant="warning" />;
    if (estado === 'Crítico') return <Badge label="Crítico" variant="danger" />;
    if (estado === 'Vencido') return <Badge label="Vencido" variant="danger" />;
    return <Badge label={estado} variant="neutral" />;
};

export default function InventarioPage() {
    const [lotes, setLotes] = useState<Lote[]>([]);
    const [bodegas, setBodegas] = useState<Bodega[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('Todas');
    const [filterEstado, setFilterEstado] = useState('Todos');

    const loadData = async () => {
        setLoading(true); setError(null);
        try {
            const [lotesData, bodegasData] = await Promise.all([
                inventarioApi.getInventarioPorLote(),
                inventarioApi.getBodegas(),
            ]);
            setLotes(lotesData);
            setBodegas(bodegasData);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error al cargar inventario');
        } finally { setLoading(false); }
    };

    useEffect(() => { loadData(); }, []);

    const categorias = [...new Set(lotes.map(l => l.producto?.categoria?.nombre ?? '').filter(Boolean))];
    const enrichedLotes = lotes.map(l => ({ ...l, _estado: calcEstado(l) }));

    const filtered = enrichedLotes.filter(l => {
        const nombre = l.producto?.nombre ?? '';
        const matchSearch = nombre.toLowerCase().includes(search.toLowerCase()) ||
            l.numeroLote.toLowerCase().includes(search.toLowerCase());
        const matchCat = filterCat === 'Todas' || l.producto?.categoria?.nombre === filterCat;
        const matchEstado = filterEstado === 'Todos' || l._estado === filterEstado;
        return matchSearch && matchCat && matchEstado;
    });

    const totalUnidades = enrichedLotes.reduce((s, l) => s + l.cantidadDisponible, 0);
    const totalValor = enrichedLotes.reduce((s, l) => s + (l.cantidadDisponible * Number(l.producto?.precioVenta ?? 0)), 0);
    const criticos = enrichedLotes.filter(l => l._estado === 'Crítico').length;
    const porVencer = enrichedLotes.filter(l => l._estado === 'Por Vencer').length;

    // Agrupar stock por categoría para la gráfica
    const stockPorCat: Record<string, number> = {};
    enrichedLotes.forEach(l => {
        const cat = l.producto?.categoria?.nombre ?? 'Sin categoría';
        stockPorCat[cat] = (stockPorCat[cat] ?? 0) + l.cantidadDisponible;
    });
    const stockData = Object.entries(stockPorCat).map(([name, valor], i) => ({ name, valor, color: COLORS[i % COLORS.length] }));

    if (loading) return (
        <div className="flex flex-col h-full">
            <Header title="Inventario" subtitle="Cargando..." />
            <div className="flex-1 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col h-full">
            <Header title="Inventario" subtitle="Error" onRefresh={loadData} />
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
                    <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                    <p className="text-red-700 font-medium mb-1">{error}</p>
                    <button onClick={loadData} className="mt-3 bg-red-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700">Reintentar</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full">
            <Header title="Inventario" subtitle="Control de stock por lote, vencimiento y bodega" onRefresh={loadData} />
            <div className="flex-1 p-6 space-y-5 overflow-y-auto">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-500">Total Unidades</p>
                        <p className="text-2xl font-semibold text-gray-900 mt-1">{totalUnidades.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{enrichedLotes.length} lotes activos</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-500">Valor Inventario</p>
                        <p className="text-2xl font-semibold text-gray-900 mt-1">{fmt(totalValor)}</p>
                        <p className="text-xs text-gray-400 mt-0.5">A precio de venta</p>
                    </div>
                    <div className={`rounded-xl p-5 shadow-sm border ${criticos > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}>
                        <p className="text-xs text-gray-500">Nivel Crítico</p>
                        <p className="text-2xl font-semibold text-red-600 mt-1">{criticos}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Lotes &lt;7 días para vencer</p>
                    </div>
                    <div className={`rounded-xl p-5 shadow-sm border ${porVencer > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}>
                        <p className="text-xs text-gray-500">Por Vencer &lt;30d</p>
                        <p className="text-2xl font-semibold text-amber-600 mt-1">{porVencer}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Requieren acción</p>
                    </div>
                </div>

                {/* Chart + Bodegas */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart2 className="w-4 h-4 text-blue-500" />
                            <h3 className="font-medium text-gray-900">Stock por Categoría (unidades)</h3>
                        </div>
                        {stockData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={180}>
                                <BarChart data={stockData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                    <Bar dataKey="valor" radius={[4, 4, 0, 0]} name="Unidades">
                                        {stockData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <div className="flex items-center justify-center h-44 text-gray-400 text-sm">Sin datos de inventario</div>}
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-medium text-gray-900 mb-4">Ocupación de Bodegas</h3>
                        {bodegas.length > 0 ? (
                            <div className="space-y-4">
                                {bodegas.map(b => {
                                    const pct = b.capacidadTotal > 0 ? Math.round((b.capacidadUsada / b.capacidadTotal) * 100) : 0;
                                    const color = pct > 85 ? 'bg-red-500' : pct > 65 ? 'bg-amber-500' : 'bg-emerald-500';
                                    return (
                                        <div key={b.id}>
                                            <div className="flex justify-between items-start mb-1">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{b.nombre}</p>
                                                    <p className="text-xs text-gray-400">{b.ubicacion ?? '—'} · {b.productos} SKUs</p>
                                                </div>
                                                <span className={`text-xs font-medium ${pct > 85 ? 'text-red-600' : pct > 65 ? 'text-amber-600' : 'text-emerald-600'}`}>{pct}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }}></div>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-0.5">{b.capacidadUsada.toLocaleString()} / {b.capacidadTotal.toLocaleString()} uds</p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Sin bodegas registradas</div>}
                    </div>
                </div>

                {/* Tabla de Lotes */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <h3 className="font-medium text-gray-900">Catálogo de Lotes</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-48">
                                <Search className="w-3.5 h-3.5 text-gray-400" />
                                <input type="text" placeholder="Buscar producto o lote..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-xs outline-none w-full text-gray-600 placeholder-gray-400" />
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Filter className="w-3.5 h-3.5 text-gray-400" />
                                <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="bg-gray-100 rounded-lg px-2 py-2 text-xs text-gray-600 outline-none">
                                    <option value="Todas">Todas las categorías</option>
                                    {categorias.map(c => <option key={c}>{c}</option>)}
                                </select>
                                <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)} className="bg-gray-100 rounded-lg px-2 py-2 text-xs text-gray-600 outline-none">
                                    <option>Todos</option>
                                    <option>Normal</option>
                                    <option>Stock Bajo</option>
                                    <option>Por Vencer</option>
                                    <option>Crítico</option>
                                    <option>Vencido</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    {['Lote', 'Producto', 'Categoría', 'Disponible', 'Mín.', 'P. Venta', 'Vencimiento', 'Estado'].map(h => (
                                        <th key={h} className="text-left text-xs text-gray-400 pb-3 font-medium pr-2">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={8} className="py-8 text-center text-gray-400 text-sm">No se encontraron resultados</td></tr>
                                ) : filtered.map(l => {
                                    const days = Math.ceil((new Date(l.fechaVencimiento).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                                    return (
                                        <tr key={l.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${l._estado === 'Crítico' || l._estado === 'Vencido' ? 'bg-red-50/40' : l._estado === 'Por Vencer' ? 'bg-amber-50/30' : ''}`}>
                                            <td className="py-3 text-xs text-gray-500 font-mono">{l.numeroLote}</td>
                                            <td className="py-3 pr-2">
                                                <div className="flex items-center gap-2">
                                                    <Package className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                                    <span className="text-xs text-gray-800 font-medium max-w-[160px] truncate block">{l.producto?.nombre ?? '—'}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 text-xs text-gray-500">{l.producto?.categoria?.nombre ?? '—'}</td>
                                            <td className="py-3">
                                                <span className={`text-xs font-medium ${l.cantidadDisponible < (l.producto?.minStock ?? 0) ? 'text-red-600' : 'text-gray-800'}`}>{l.cantidadDisponible.toLocaleString()}</span>
                                            </td>
                                            <td className="py-3 text-xs text-gray-400">{l.producto?.minStock ?? '—'}</td>
                                            <td className="py-3 text-xs text-gray-700">{fmt(Number(l.producto?.precioVenta ?? 0))}</td>
                                            <td className="py-3">
                                                <div className="flex flex-col">
                                                    <span className={`text-xs ${days < 7 ? 'text-red-600 font-medium' : days < 30 ? 'text-amber-600 font-medium' : 'text-gray-500'}`}>
                                                        {new Date(l.fechaVencimiento).toLocaleDateString('es-SV')}
                                                    </span>
                                                    {days < 30 && <span className="text-xs text-gray-400">{days}d restantes</span>}
                                                </div>
                                            </td>
                                            <td className="py-3">{estadoBadge(l._estado)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">{filtered.length} lotes encontrados</p>
                </div>
            </div>
        </div>
    );
}
