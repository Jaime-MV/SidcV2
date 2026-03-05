import { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingDown, DollarSign, RefreshCw, Plus, Search, Filter, X, Save } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Header } from '../components/layout/Header';
import { Badge } from '../components/ui/Badge';
import { inventarioApi, type Lote, type Bodega, type Categoria, type Producto } from '../services/api';

const fmt = (n: number) => new Intl.NumberFormat('es-SV', { style: 'currency', currency: 'USD' }).format(n);
const fmtDate = (s: string) => new Date(s).toLocaleDateString('es-SV');

function diasParaVencer(fechaVenc: string): number {
    return Math.ceil((new Date(fechaVenc).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

const _estadoBadge = (e: string) => {
    if (e === 'NORMAL') return <Badge label="Normal" variant="success" />;
    if (e === 'STOCK_BAJO') return <Badge label="Stock bajo" variant="warning" />;
    if (e === 'POR_VENCER') return <Badge label="Por vencer" variant="warning" />;
    if (e === 'CRITICO') return <Badge label="Crítico" variant="danger" />;
    return <Badge label={e || 'Normal'} variant="neutral" />;
};
void _estadoBadge;

// ─── Modal Nuevo Producto ─────────────────────────────────────────────────────
function NuevoProductoModal({ open, onClose, onSaved, categorias }: {
    open: boolean; onClose: () => void; onSaved: () => void; categorias: Categoria[];
}) {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [codigoBarras, setCodigoBarras] = useState('');
    const [precioBase, setPrecioBase] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) { setNombre(''); setDescripcion(''); setCodigoBarras(''); setPrecioBase(''); setCategoriaId(''); setError(null); }
    }, [open]);

    const handleSave = async () => {
        if (!nombre.trim()) { setError('El nombre es requerido'); return; }
        if (!precioBase || parseFloat(precioBase) <= 0) { setError('El precio base es requerido'); return; }
        if (!categoriaId) { setError('Selecciona una categoría'); return; }
        setSaving(true); setError(null);
        try {
            await inventarioApi.createProducto({
                nombre: nombre.trim(),
                descripcion: descripcion.trim() || undefined,
                codigoBarras: codigoBarras.trim() || undefined,
                precioBase: parseFloat(precioBase),
                categoriaId: parseInt(categoriaId),
            });
            onSaved();
            onClose();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error al crear el producto');
        } finally { setSaving(false); }
    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-gray-900">Nuevo Producto</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><X className="w-4 h-4 text-gray-500" /></button>
                </div>
                <div className="p-6 space-y-4">
                    {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">{error}</div>}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Nombre *</label>
                        <input value={nombre} onChange={e => setNombre(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="Nombre del producto" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Descripción</label>
                        <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Precio Base ($) *</label>
                            <input type="number" min="0.01" step="0.01" value={precioBase} onChange={e => setPrecioBase(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="0.00" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Código de Barras</label>
                            <input value={codigoBarras} onChange={e => setCodigoBarras(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="123456789" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Categoría *</label>
                        <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400">
                            <option value="">Seleccionar categoría...</option>
                            {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors">
                        <Save className="w-3.5 h-3.5" />{saving ? 'Creando...' : 'Crear Producto'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Modal Nuevo Lote ─────────────────────────────────────────────────────────
function NuevoLoteModal({ open, onClose, onSaved, productos }: {
    open: boolean; onClose: () => void; onSaved: () => void; productos: Producto[];
}) {
    const [productoId, setProductoId] = useState('');
    const [numeroLote, setNumeroLote] = useState('');
    const [fechaFabricacion, setFechaFabricacion] = useState('');
    const [fechaVencimiento, setFechaVencimiento] = useState('');
    const [cantidadInicial, setCantidadInicial] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) { setProductoId(''); setNumeroLote(''); setFechaFabricacion(''); setFechaVencimiento(''); setCantidadInicial(''); setError(null); }
    }, [open]);

    const handleSave = async () => {
        if (!productoId) { setError('Selecciona un producto'); return; }
        if (!numeroLote.trim()) { setError('El número de lote es requerido'); return; }
        if (!fechaFabricacion) { setError('La fecha de fabricación es requerida'); return; }
        if (!fechaVencimiento) { setError('La fecha de vencimiento es requerida'); return; }
        if (!cantidadInicial || parseInt(cantidadInicial) < 1) { setError('La cantidad debe ser mayor a 0'); return; }
        setSaving(true); setError(null);
        try {
            await inventarioApi.createLote({
                productoId: parseInt(productoId),
                numeroLote: numeroLote.trim(),
                fechaFabricacion,
                fechaVencimiento,
                cantidadInicial: parseInt(cantidadInicial),
            });
            onSaved();
            onClose();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error al crear el lote');
        } finally { setSaving(false); }
    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-gray-900">Nuevo Lote de Inventario</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><X className="w-4 h-4 text-gray-500" /></button>
                </div>
                <div className="p-6 space-y-4">
                    {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">{error}</div>}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Producto *</label>
                        <select value={productoId} onChange={e => setProductoId(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400">
                            <option value="">Seleccionar producto...</option>
                            {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Número de Lote *</label>
                        <input value={numeroLote} onChange={e => setNumeroLote(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="LOT-2025-001" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Fecha Fabricación *</label>
                            <input type="date" value={fechaFabricacion} onChange={e => setFechaFabricacion(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Fecha Vencimiento *</label>
                            <input type="date" value={fechaVencimiento} onChange={e => setFechaVencimiento(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Cantidad Inicial *</label>
                        <input type="number" min="1" value={cantidadInicial} onChange={e => setCantidadInicial(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="Unidades" />
                    </div>
                </div>
                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-60 transition-colors">
                        <Save className="w-3.5 h-3.5" />{saving ? 'Registrando...' : 'Registrar Lote'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function InventarioPage() {
    const [lotes, setLotes] = useState<Lote[]>([]);
    const [bodegas, setBodegas] = useState<Bodega[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('Todos');
    const [modalProducto, setModalProducto] = useState(false);
    const [modalLote, setModalLote] = useState(false);

    const loadData = async () => {
        setLoading(true); setError(null);
        try {
            const [lotesData, bodegasData, categoriasData, productosData] = await Promise.all([
                inventarioApi.getInventarioPorLote(),
                inventarioApi.getBodegas(),
                inventarioApi.getCategorias(),
                inventarioApi.getProductos(1, 200),
            ]);
            setLotes(lotesData);
            setBodegas(bodegasData);
            setCategorias(categoriasData);
            setProductos(productosData.items);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error al cargar inventario');
        } finally { setLoading(false); }
    };

    useEffect(() => { loadData(); }, []);

    const filtered = lotes.filter(l => {
        const nombre = l.producto?.nombre ?? '';
        const cat = l.producto?.categoria?.nombre ?? '';
        const matchSearch = nombre.toLowerCase().includes(search.toLowerCase()) || l.numeroLote.toLowerCase().includes(search.toLowerCase());
        const matchCat = filterCat === 'Todos' || cat === filterCat;
        return matchSearch && matchCat;
    });

    const totalUnidades = lotes.reduce((s, l) => s + l.cantidadDisponible, 0);
    const valorInventario = lotes.reduce((s, l) => s + l.cantidadDisponible * Number(l.producto?.precioVenta ?? 0), 0);
    const stockCritico = lotes.filter(l => l.cantidadDisponible < 10).length;
    const proxVencer = lotes.filter(l => diasParaVencer(l.fechaVencimiento) <= 30 && diasParaVencer(l.fechaVencimiento) > 0).length;

    const catStockData = categorias.map(c => ({
        name: c.nombre,
        unidades: lotes.filter(l => l.producto?.categoriaId === c.id).reduce((s, l) => s + l.cantidadDisponible, 0),
    })).filter(d => d.unidades > 0);

    const bodegaOcup = bodegas.map(b => ({
        name: b.nombre.split(' ')[0],
        pct: b.capacidadTotal > 0 ? Math.round((b.capacidadUsada / b.capacidadTotal) * 100) : 0,
    }));

    const getLoteBadge = (l: Lote) => {
        const dias = diasParaVencer(l.fechaVencimiento);
        if (l.cantidadDisponible === 0) return <Badge label="Agotado" variant="neutral" />;
        if (dias <= 0) return <Badge label="Vencido" variant="danger" />;
        if (dias <= 30) return <Badge label="Por Vencer" variant="warning" />;
        if (l.cantidadDisponible < 10) return <Badge label="Stock Bajo" variant="danger" />;
        return <Badge label="Normal" variant="success" />;
    };

    if (loading) return (
        <div className="flex flex-col h-full">
            <Header title="Inventario" subtitle="Cargando..." />
            <div className="flex-1 flex items-center justify-center"><RefreshCw className="w-8 h-8 text-blue-500 animate-spin" /></div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col h-full">
            <Header title="Inventario" subtitle="Error" onRefresh={loadData} />
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
                    <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                    <p className="text-red-700 font-medium">{error}</p>
                    <button onClick={loadData} className="mt-3 bg-red-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700">Reintentar</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full">
            <NuevoProductoModal open={modalProducto} onClose={() => setModalProducto(false)} onSaved={loadData} categorias={categorias} />
            <NuevoLoteModal open={modalLote} onClose={() => setModalLote(false)} onSaved={loadData} productos={productos} />
            <Header title="Inventario" subtitle="Control de stock, lotes y fechas de vencimiento" onRefresh={loadData} />
            <div className="flex-1 p-6 space-y-5 overflow-y-auto">

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-gray-500">Total Unidades</p>
                                <p className="text-2xl font-semibold text-gray-900 mt-1">{totalUnidades.toLocaleString()}</p>
                                <p className="text-xs text-gray-400 mt-0.5">En existencia</p>
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center"><Package className="w-4 h-4 text-blue-600" /></div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-gray-500">Valor Inventario</p>
                                <p className="text-2xl font-semibold text-gray-900 mt-1">{fmt(valorInventario)}</p>
                                <p className="text-xs text-gray-400 mt-0.5">Precio venta</p>
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center"><DollarSign className="w-4 h-4 text-emerald-600" /></div>
                        </div>
                    </div>
                    <div className={`rounded-xl p-5 shadow-sm border ${stockCritico > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-gray-500">Stock Crítico</p>
                                <p className="text-2xl font-semibold text-red-600 mt-1">{stockCritico}</p>
                                <p className="text-xs text-gray-400 mt-0.5">Lotes &lt; 10 uds</p>
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center"><TrendingDown className="w-4 h-4 text-red-600" /></div>
                        </div>
                    </div>
                    <div className={`rounded-xl p-5 shadow-sm border ${proxVencer > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-gray-500">Próximos a Vencer</p>
                                <p className="text-2xl font-semibold text-amber-600 mt-1">{proxVencer}</p>
                                <p className="text-xs text-gray-400 mt-0.5">En los próximos 30 días</p>
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center"><AlertTriangle className="w-4 h-4 text-amber-600" /></div>
                        </div>
                    </div>
                </div>

                {/* Charts row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {catStockData.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <h3 className="font-medium text-gray-900 mb-4">Stock por Categoría (unidades)</h3>
                            <ResponsiveContainer width="100%" height={180}>
                                <BarChart data={catStockData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                    <Bar dataKey="unidades" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Unidades" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                    {bodegaOcup.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <h3 className="font-medium text-gray-900 mb-4">Ocupación de Bodegas (%)</h3>
                            <ResponsiveContainer width="100%" height={180}>
                                <BarChart data={bodegaOcup} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                                    <Tooltip formatter={(v: number | undefined) => [`${v ?? 0}%`, 'Ocupación']} contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                    <Bar dataKey="pct" fill="#10b981" radius={[4, 4, 0, 0]} name="Ocupación" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Tabla de Lotes */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <h3 className="font-medium text-gray-900">Inventario por Lote</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-48">
                                <Search className="w-3.5 h-3.5 text-gray-400" />
                                <input type="text" placeholder="Buscar producto, lote..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-xs text-gray-600 placeholder-gray-400 outline-none w-full" />
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Filter className="w-3.5 h-3.5 text-gray-400" />
                                <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="bg-gray-100 rounded-lg px-2 py-2 text-xs text-gray-600 outline-none">
                                    <option value="Todos">Todas las cat.</option>
                                    {categorias.map(c => <option key={c.id}>{c.nombre}</option>)}
                                </select>
                            </div>
                            <button onClick={() => setModalLote(true)} className="flex items-center gap-1.5 bg-emerald-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                                <Plus className="w-3.5 h-3.5" />Nuevo Lote
                            </button>
                            <button onClick={() => setModalProducto(true)} className="flex items-center gap-1.5 bg-blue-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                <Plus className="w-3.5 h-3.5" />Nuevo Producto
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    {['Producto', 'Categoría', 'Lote', 'Fabricación', 'Vencimiento', 'Disponible', 'Inicial', 'Precio Venta', 'Estado'].map(h => (
                                        <th key={h} className="text-left text-xs text-gray-400 pb-3 font-medium pr-4">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={9} className="py-8 text-center text-gray-400 text-sm">No se encontraron lotes</td></tr>
                                ) : filtered.map(l => {
                                    const dias = diasParaVencer(l.fechaVencimiento);
                                    return (
                                        <tr key={l.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${dias <= 30 && dias > 0 ? 'bg-amber-50/30' : ''} ${l.cantidadDisponible < 10 ? 'bg-red-50/20' : ''}`}>
                                            <td className="py-3 pr-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                        <Package className="w-3.5 h-3.5 text-blue-500" />
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-800 truncate max-w-[160px]">{l.producto?.nombre ?? '—'}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 pr-4 text-xs text-gray-500">{l.producto?.categoria?.nombre ?? '—'}</td>
                                            <td className="py-3 pr-4 text-xs font-mono text-gray-500">{l.numeroLote}</td>
                                            <td className="py-3 pr-4 text-xs text-gray-500">{fmtDate(l.fechaFabricacion)}</td>
                                            <td className={`py-3 pr-4 text-xs font-medium ${dias <= 0 ? 'text-red-600' : dias <= 30 ? 'text-amber-600' : 'text-gray-700'}`}>
                                                {fmtDate(l.fechaVencimiento)}
                                                {dias > 0 && dias <= 30 && <span className="ml-1 text-gray-400">({dias}d)</span>}
                                            </td>
                                            <td className={`py-3 pr-4 text-xs font-semibold ${l.cantidadDisponible < 10 ? 'text-red-600' : 'text-gray-900'}`}>{l.cantidadDisponible.toLocaleString()}</td>
                                            <td className="py-3 pr-4 text-xs text-gray-400">{l.cantidadInicial.toLocaleString()}</td>
                                            <td className="py-3 pr-4 text-xs text-gray-700">{l.producto?.precioVenta ? fmt(Number(l.producto.precioVenta)) : '—'}</td>
                                            <td className="py-3">{getLoteBadge(l)}</td>
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
