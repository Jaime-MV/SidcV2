import { useEffect, useState } from 'react';
import { Warehouse, RefreshCw, AlertTriangle, Package, User, ChevronDown, ChevronUp, Plus, Edit2, X, Save, Search } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Badge } from '../components/ui/Badge';
import { inventarioApi, type Bodega, type Producto, type CreateBodegaDto } from '../services/api';

const fmt = (n: number) => new Intl.NumberFormat('es-SV', { style: 'currency', currency: 'USD' }).format(n);
const fmtDate = (s: string) => new Date(s).toLocaleDateString('es-SV');

const estadoBadge = (e: string) => {
    if (e === 'NORMAL') return <Badge label="Normal" variant="success" />;
    if (e === 'STOCK_BAJO') return <Badge label="Stock Bajo" variant="warning" />;
    if (e === 'POR_VENCER') return <Badge label="Por Vencer" variant="warning" />;
    if (e === 'CRITICO') return <Badge label="Crítico" variant="danger" />;
    return <Badge label={e} variant="neutral" />;
};

// ─── Modal Bodega ─────────────────────────────────────────────────────────────
const BODEGA_EMPTY: CreateBodegaDto = { nombre: '', codigo: '', ubicacion: '', capacidadTotal: 0, encargado: '' };

function BodegaModal({ open, onClose, onSaved, editBodega }: {
    open: boolean; onClose: () => void; onSaved: () => void; editBodega?: Bodega | null;
}) {
    const [form, setForm] = useState<CreateBodegaDto>(BODEGA_EMPTY);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (editBodega) {
            setForm({
                nombre: editBodega.nombre,
                codigo: editBodega.codigo ?? '',
                ubicacion: editBodega.ubicacion ?? '',
                capacidadTotal: editBodega.capacidadTotal,
                encargado: editBodega.encargado ?? '',
            });
        } else {
            setForm(BODEGA_EMPTY);
        }
        setError(null);
    }, [editBodega, open]);

    const set = (k: keyof CreateBodegaDto, v: string | number) =>
        setForm(f => ({ ...f, [k]: v }));

    const handleSave = async () => {
        if (!form.nombre.trim()) { setError('El nombre es requerido'); return; }
        setSaving(true); setError(null);
        const payload: CreateBodegaDto = {
            nombre: form.nombre.trim(),
            codigo: form.codigo?.trim() || undefined,
            ubicacion: form.ubicacion?.trim() || undefined,
            capacidadTotal: Number(form.capacidadTotal) || 0,
            encargado: form.encargado?.trim() || undefined,
        };
        try {
            if (editBodega) {
                await inventarioApi.updateBodega(editBodega.id, payload);
            } else {
                await inventarioApi.createBodega(payload);
            }
            onSaved();
            onClose();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error al guardar');
        } finally { setSaving(false); }
    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-gray-900">{editBodega ? 'Editar Bodega' : 'Nueva Bodega'}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><X className="w-4 h-4 text-gray-500" /></button>
                </div>
                <div className="p-6 space-y-4">
                    {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">{error}</div>}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Nombre *</label>
                            <input value={form.nombre} onChange={e => set('nombre', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" placeholder="Bodega Central" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Código</label>
                            <input value={form.codigo} onChange={e => set('codigo', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="BOD-001" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Capacidad Total (uds)</label>
                            <input type="number" min="0" value={form.capacidadTotal} onChange={e => set('capacidadTotal', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Ubicación</label>
                            <input value={form.ubicacion} onChange={e => set('ubicacion', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="Zona Norte, San Salvador" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Encargado</label>
                            <input value={form.encargado} onChange={e => set('encargado', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="Nombre del encargado" />
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors">
                        <Save className="w-3.5 h-3.5" />{saving ? 'Guardando...' : (editBodega ? 'Actualizar' : 'Crear Bodega')}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BodegasPage() {
    const [bodegas, setBodegas] = useState<Bodega[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedBodega, setExpandedBodega] = useState<number | null>(null);
    const [buscar, setBuscar] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editBodega, setEditBodega] = useState<Bodega | null>(null);

    const loadData = async () => {
        setLoading(true); setError(null);
        try {
            const [bod, prod] = await Promise.all([
                inventarioApi.getBodegas(),
                inventarioApi.getProductos(1, 200),
            ]);
            setBodegas(bod);
            setProductos(prod.items);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error al cargar bodegas');
        } finally { setLoading(false); }
    };
    useEffect(() => { loadData(); }, []);

    const totalCapacidad = bodegas.reduce((s, b) => s + (b.capacidadTotal ?? 0), 0);
    const totalUsado = bodegas.reduce((s, b) => s + (b.capacidadUsada ?? 0), 0);
    const pctGlobal = totalCapacidad > 0 ? Math.round((totalUsado / totalCapacidad) * 100) : 0;
    const criticas = bodegas.filter(b => b.capacidadTotal > 0 && (b.capacidadUsada / b.capacidadTotal) > 0.85).length;

    const productosPorBodega = (bodegaId: number) => productos.filter(p => p.bodegaId === bodegaId);

    const productosFiltrados = productos.filter(p =>
        buscar === '' ||
        p.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
        p.categoria?.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
        p.codigo?.toLowerCase().includes(buscar.toLowerCase())
    );

    const nombreBodega = (id?: number) => {
        if (!id) return '—';
        return bodegas.find(b => b.id === id)?.nombre ?? '—';
    };

    const colorBodega = (nombre: string) => {
        if (nombre.includes('Central')) return 'bg-blue-100 text-blue-700';
        if (nombre.includes('Norte')) return 'bg-purple-100 text-purple-700';
        if (nombre.includes('Sur')) return 'bg-amber-100 text-amber-700';
        return 'bg-gray-100 text-gray-600';
    };

    const openNew = () => { setEditBodega(null); setModalOpen(true); };
    const openEdit = (b: Bodega) => { setEditBodega(b); setModalOpen(true); };

    if (loading) return <div className="flex flex-col h-full"><Header title="Bodegas" subtitle="Cargando..." /><div className="flex-1 flex items-center justify-center"><RefreshCw className="w-8 h-8 text-blue-500 animate-spin" /></div></div>;
    if (error) return <div className="flex flex-col h-full"><Header title="Bodegas" subtitle="Error" onRefresh={loadData} /><div className="flex-1 flex items-center justify-center p-8"><div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md"><AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" /><p className="text-red-700">{error}</p><button onClick={loadData} className="mt-3 bg-red-600 text-white text-sm px-4 py-2 rounded-lg">Reintentar</button></div></div></div>;

    return (
        <div className="flex flex-col h-full">
            <BodegaModal open={modalOpen} onClose={() => setModalOpen(false)} onSaved={loadData} editBodega={editBodega} />
            <Header title="Bodegas" subtitle="Control de almacenes y capacidad de almacenaje" onRefresh={loadData} />
            <div className="flex-1 p-6 space-y-5 overflow-y-auto">

                {/* Stats globales */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-500">Total Bodegas</p>
                        <p className="text-2xl font-semibold text-gray-900 mt-1">{bodegas.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-500">Capacidad Global</p>
                        <p className="text-2xl font-semibold text-blue-600 mt-1">{pctGlobal}%</p>
                        <p className="text-xs text-gray-400 mt-0.5">{totalUsado.toLocaleString()} / {totalCapacidad.toLocaleString()}</p>
                    </div>
                    <div className={`rounded-xl p-5 shadow-sm border ${criticas > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}>
                        <p className="text-xs text-gray-500">Bodegas Críticas</p>
                        <p className="text-2xl font-semibold text-red-600 mt-1">{criticas}</p>
                        <p className="text-xs text-gray-400 mt-0.5">&gt;85% ocupación</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-500">SKUs Totales</p>
                        <p className="text-2xl font-semibold text-gray-900 mt-1">{productos.length}</p>
                    </div>
                </div>

                {/* Header acción + Tarjetas de bodegas */}
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">Almacenes</h2>
                    <button onClick={openNew} className="flex items-center gap-1.5 bg-blue-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        <Plus className="w-3.5 h-3.5" />Nueva Bodega
                    </button>
                </div>

                {bodegas.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {bodegas.map(b => {
                            const pct = b.capacidadTotal > 0 ? Math.round((b.capacidadUsada / b.capacidadTotal) * 100) : 0;
                            const barColor = pct > 85 ? 'bg-red-500' : pct > 65 ? 'bg-amber-500' : 'bg-emerald-500';
                            const borderColor = pct > 85 ? 'border-red-200 bg-red-50/50' : pct > 65 ? 'border-amber-200 bg-amber-50/50' : 'border-gray-100';
                            const prods = productosPorBodega(b.id);
                            const isExpanded = expandedBodega === b.id;
                            return (
                                <div key={b.id} className={`bg-white rounded-xl shadow-sm border ${borderColor}`}>
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
                                                    <Warehouse className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <h3 className="font-semibold text-gray-900">{b.nombre}</h3>
                                                <p className="text-sm text-gray-500 mt-0.5">{b.ubicacion ?? 'Sin ubicación'}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-2xl font-bold ${pct > 85 ? 'text-red-600' : pct > 65 ? 'text-amber-600' : 'text-emerald-600'}`}>{pct}%</span>
                                                <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Editar bodega">
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <div className="w-full bg-gray-100 rounded-full h-3">
                                                <div className={`h-3 rounded-full ${barColor} transition-all`} style={{ width: `${Math.min(pct, 100)}%` }}></div>
                                            </div>
                                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                                <span>{b.capacidadUsada.toLocaleString()} usadas</span>
                                                <span>{b.capacidadTotal.toLocaleString()} total</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <Package className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <p className="text-lg font-semibold text-gray-900">{prods.length}</p>
                                                    <p className="text-xs text-gray-400">SKUs activos</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700 truncate">{b.encargado ?? '—'}</p>
                                                    <p className="text-xs text-gray-400">Encargado</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {prods.length > 0 && (
                                        <button
                                            onClick={() => setExpandedBodega(isExpanded ? null : b.id)}
                                            className="w-full flex items-center justify-between px-6 py-3 border-t border-gray-100 text-xs text-blue-600 hover:bg-blue-50 transition-colors rounded-b-xl"
                                        >
                                            <span>Ver {prods.length} productos</span>
                                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>
                                    )}
                                    {isExpanded && (
                                        <div className="border-t border-gray-100 px-4 pb-4 bg-gray-50/50 rounded-b-xl">
                                            <table className="w-full mt-3 text-xs">
                                                <thead>
                                                    <tr className="border-b border-gray-200">
                                                        {['Producto', 'Stock', 'Precio', 'Estado'].map(h => (
                                                            <th key={h} className="text-left text-gray-400 pb-2 font-medium pr-2">{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {prods.map(p => (
                                                        <tr key={p.id} className="border-b border-gray-100">
                                                            <td className="py-2 pr-2">
                                                                <p className="font-medium text-gray-800 truncate max-w-[130px]">{p.nombre}</p>
                                                                <p className="text-gray-400">{p.codigo ?? '—'}</p>
                                                            </td>
                                                            <td className="py-2 pr-2 text-gray-600">{p.lotes?.reduce((s, l) => s + l.cantidadDisponible, 0) ?? 0}</td>
                                                            <td className="py-2 pr-2 text-gray-600">{fmt(Number(p.precioVenta))}</td>
                                                            <td className="py-2">{estadoBadge(p.estadoProducto ?? 'NORMAL')}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Tabla Inventario por Bodega */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900">Inventario por Bodega</h3>
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5 w-48">
                            <Search className="w-3.5 h-3.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar producto..."
                                value={buscar}
                                onChange={e => setBuscar(e.target.value)}
                                className="bg-transparent text-xs text-gray-600 placeholder-gray-400 outline-none w-full"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    {['Producto', 'Categoría', 'Lote', 'Bodega', 'Stock', 'Valor Total', 'Vencimiento', 'Estado'].map(h => (
                                        <th key={h} className="text-left text-xs text-gray-400 pb-3 font-medium pr-4">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {productosFiltrados.length === 0 ? (
                                    <tr><td colSpan={8} className="py-8 text-center text-gray-400 text-sm">Sin productos</td></tr>
                                ) : productosFiltrados.map(p => {
                                    const stockTotal = p.lotes?.reduce((s, l) => s + l.cantidadDisponible, 0) ?? 0;
                                    const primerLote = p.lotes?.[0];
                                    const valorTotal = stockTotal * Number(p.precioVenta);
                                    const bodNombre = nombreBodega(p.bodegaId);
                                    return (
                                        <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="py-3 pr-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                        <Package className="w-3.5 h-3.5 text-blue-500" />
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-800 truncate max-w-[160px]">{p.nombre}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 pr-4 text-xs text-gray-500">{p.categoria?.nombre ?? '—'}</td>
                                            <td className="py-3 pr-4 text-xs font-mono text-gray-400">{primerLote?.numeroLote ?? '—'}</td>
                                            <td className="py-3 pr-4">
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colorBodega(bodNombre)}`}>
                                                    {bodNombre}
                                                </span>
                                            </td>
                                            <td className="py-3 pr-4 text-xs font-semibold text-gray-900">{stockTotal.toLocaleString()}</td>
                                            <td className="py-3 pr-4 text-xs text-gray-700">{fmt(valorTotal)}</td>
                                            <td className="py-3 pr-4 text-xs text-gray-500">
                                                {primerLote ? fmtDate(primerLote.fechaVencimiento) : '—'}
                                            </td>
                                            <td className="py-3">{estadoBadge(p.estadoProducto ?? 'NORMAL')}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
