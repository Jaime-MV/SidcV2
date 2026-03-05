import { useEffect, useState } from 'react';
import { Tag, Plus, TrendingUp, Calendar, RefreshCw, AlertTriangle, X, Save, Power } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Badge } from '../components/ui/Badge';
import { promocionesApi, inventarioApi, type Promocion, type Producto, estadoPromocionLabel } from '../services/api';

const fmt = (n: number) => new Intl.NumberFormat('es-SV', { style: 'currency', currency: 'USD' }).format(n);

function calcDiasRestantes(fechaFin: string) {
    return Math.ceil((new Date(fechaFin).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

const estadoBadge = (e: string) => {
    const label = estadoPromocionLabel[e] ?? e;
    if (e === 'ACTIVA') return <Badge label={label} variant="success" />;
    if (e === 'PROXIMA') return <Badge label={label} variant="info" />;
    return <Badge label={label} variant="neutral" />;
};

const tipoBadge = (t: string) => {
    if (t === 'VOLUMEN') return <Badge label="Volumen" variant="purple" />;
    if (t === 'DESCUENTO') return <Badge label="Descuento" variant="info" />;
    if (t === 'COMBO') return <Badge label="Combo" variant="warning" />;
    if (t === 'ESPECIAL') return <Badge label="Especial" variant="warning" />;
    return <Badge label={t} variant="neutral" />;
};

const canalBadge = (c: string) => {
    const colors: Record<string, string> = {
        'Supermercados': 'bg-blue-100 text-blue-700',
        'Todos': 'bg-green-100 text-green-700',
        'Tiendas': 'bg-purple-100 text-purple-700',
        'Mayoristas': 'bg-amber-100 text-amber-700',
        'Farmacias': 'bg-pink-100 text-pink-700',
    };
    const cls = colors[c] ?? 'bg-gray-100 text-gray-600';
    return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{c}</span>;
};

// ─── Modal Nueva Promoción ────────────────────────────────────────────────────
function NuevaPromocionModal({ open, onClose, onSaved, productos }: {
    open: boolean; onClose: () => void; onSaved: () => void; productos: Producto[];
}) {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [tipo, setTipo] = useState('DESCUENTO');
    const [canal, setCanal] = useState('Todos');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [porcentajeDesc, setPorcentajeDesc] = useState('10');
    const [presupuesto, setPresupuesto] = useState('0');
    const [productosSeleccionados, setProductosSeleccionados] = useState<number[]>([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) {
            setNombre(''); setDescripcion(''); setTipo('DESCUENTO'); setCanal('Todos');
            setFechaInicio(''); setFechaFin(''); setPorcentajeDesc('10'); setPresupuesto('0');
            setProductosSeleccionados([]); setError(null);
        }
    }, [open]);

    const toggleProducto = (id: number) => {
        setProductosSeleccionados(sel =>
            sel.includes(id) ? sel.filter(s => s !== id) : [...sel, id]
        );
    };

    const handleSave = async () => {
        if (!nombre.trim()) { setError('El nombre es requerido'); return; }
        if (!fechaInicio) { setError('La fecha de inicio es requerida'); return; }
        if (!fechaFin) { setError('La fecha de fin es requerida'); return; }
        if (productosSeleccionados.length === 0) { setError('Selecciona al menos un producto'); return; }
        setSaving(true); setError(null);
        try {
            await promocionesApi.createPromocion({
                nombre: nombre.trim(),
                descripcion: descripcion.trim() || undefined,
                fechaInicio,
                fechaFin,
                porcentajeDesc: parseFloat(porcentajeDesc) || 0,
                activa: new Date(fechaInicio) <= new Date() && new Date(fechaFin) >= new Date(),
                productoIds: productosSeleccionados,
            });
            onSaved();
            onClose();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error al crear la promoción');
        } finally { setSaving(false); }
    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-gray-900">Nueva Promoción</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><X className="w-4 h-4 text-gray-500" /></button>
                </div>
                <div className="p-6 space-y-4">
                    {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">{error}</div>}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Nombre *</label>
                            <input value={nombre} onChange={e => setNombre(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="Ej: Oferta de verano" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Descripción</label>
                            <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none" placeholder="Descripción de la promoción..." />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Tipo</label>
                            <select value={tipo} onChange={e => setTipo(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400">
                                <option value="DESCUENTO">Descuento</option>
                                <option value="VOLUMEN">Volumen</option>
                                <option value="COMBO">Combo</option>
                                <option value="ESPECIAL">Especial</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Canal</label>
                            <select value={canal} onChange={e => setCanal(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400">
                                <option>Todos</option>
                                <option>Supermercados</option>
                                <option>Tiendas</option>
                                <option>Mayoristas</option>
                                <option>Farmacias</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Fecha Inicio *</label>
                            <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Fecha Fin *</label>
                            <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Descuento (%)</label>
                            <input type="number" min="0" max="100" step="0.5" value={porcentajeDesc} onChange={e => setPorcentajeDesc(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Presupuesto ($)</label>
                            <input type="number" min="0" step="0.01" value={presupuesto} onChange={e => setPresupuesto(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
                        </div>
                    </div>

                    {/* Selección de productos */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-2">Productos aplicables * <span className="text-gray-400 font-normal">({productosSeleccionados.length} seleccionados)</span></label>
                        <div className="border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                            {productos.map(p => (
                                <label key={p.id} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0">
                                    <input type="checkbox" checked={productosSeleccionados.includes(p.id)} onChange={() => toggleProducto(p.id)} className="rounded" />
                                    <span className="text-xs text-gray-700 flex-1 truncate">{p.nombre}</span>
                                    <span className="text-xs text-gray-400">{fmt(Number(p.precioVenta))}</span>
                                </label>
                            ))}
                            {productos.length === 0 && <p className="text-xs text-gray-400 text-center py-4">Sin productos disponibles</p>}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors">
                        <Save className="w-3.5 h-3.5" />{saving ? 'Creando...' : 'Crear Promoción'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Promo Card ───────────────────────────────────────────────────────────────
function PromoCard({ p, onToggle }: { p: Promocion; onToggle: () => void }) {
    const gastadoPct = Number(p.presupuesto) > 0
        ? Math.round((Number(p.gastado) / Number(p.presupuesto)) * 100) : 0;
    const diasRestantes = calcDiasRestantes(p.fechaFin);
    const barColor = gastadoPct > 85 ? 'bg-red-500' : gastadoPct > 60 ? 'bg-amber-500' : 'bg-emerald-500';

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Tag className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-gray-900 text-sm">{p.nombre}</h3>
                            {estadoBadge(p.estado)}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{p.codigo ?? `PROM-${p.id}`}</p>
                    </div>
                </div>
                <button
                    onClick={onToggle}
                    title={p.activa ? 'Desactivar' : 'Activar'}
                    className={`p-1.5 rounded-lg transition-colors ${p.activa ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                    <Power className="w-4 h-4" />
                </button>
            </div>

            <p className="text-xs text-gray-500 mb-3 leading-relaxed">{p.descripcion ?? '—'}</p>

            <div className="flex flex-wrap items-center gap-1.5 mb-4">
                {tipoBadge(p.tipo)}
                {p.canal && canalBadge(p.canal)}
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    -{p.porcentajeDesc}%
                </span>
            </div>

            <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Presupuesto</span>
                    <span className="font-medium text-gray-700">
                        {fmt(Number(p.gastado))} / {fmt(Number(p.presupuesto))}
                    </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                        className={`h-1.5 rounded-full ${barColor} transition-all`}
                        style={{ width: `${Math.min(gastadoPct, 100)}%` }}
                    ></div>
                </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-50">
                <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{p.usos} usos</span>
                </div>
                <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {p.estado === 'ACTIVA'
                        ? <span className={diasRestantes <= 5 ? 'text-red-500 font-medium' : ''}>
                            {diasRestantes}d restantes · vence {new Date(p.fechaFin).toLocaleDateString('es-SV')}
                        </span>
                        : <span>Fin: {new Date(p.fechaFin).toLocaleDateString('es-SV')}</span>
                    }
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PromocionesPage() {
    const [promociones, setPromociones] = useState<Promocion[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const loadData = async () => {
        setLoading(true); setError(null);
        try {
            const [promos, prods] = await Promise.all([
                promocionesApi.getPromociones(),
                inventarioApi.getProductos(1, 200),
            ]);
            setPromociones(promos);
            setProductos(prods.items);
        } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Error al cargar promociones'); }
        finally { setLoading(false); }
    };
    useEffect(() => { loadData(); }, []);

    const handleToggle = async (id: number) => {
        try {
            await promocionesApi.toggleActiva(id);
            loadData();
        } catch (e: unknown) { console.error(e); }
    };

    const activas = promociones.filter(p => p.estado === 'ACTIVA');
    const proximas = promociones.filter(p => p.estado === 'PROXIMA');
    const expiradas = promociones.filter(p => p.estado === 'EXPIRADA');

    const totalUsos = promociones.reduce((s, p) => s + Number(p.usos), 0);
    const totalPresupuesto = promociones.reduce((s, p) => s + Number(p.presupuesto), 0);
    const totalGastado = promociones.reduce((s, p) => s + Number(p.gastado), 0);
    const pctEjecutado = totalPresupuesto > 0 ? Math.round((totalGastado / totalPresupuesto) * 100) : 0;

    if (loading) return <div className="flex flex-col h-full"><Header title="Promociones" subtitle="Cargando..." /><div className="flex-1 flex items-center justify-center"><RefreshCw className="w-8 h-8 text-blue-500 animate-spin" /></div></div>;
    if (error) return <div className="flex flex-col h-full"><Header title="Promociones" subtitle="Error" onRefresh={loadData} /><div className="flex-1 flex items-center justify-center p-8"><div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md"><AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" /><p className="text-red-700">{error}</p><button onClick={loadData} className="mt-3 bg-red-600 text-white text-sm px-4 py-2 rounded-lg">Reintentar</button></div></div></div>;

    return (
        <div className="flex flex-col h-full">
            <NuevaPromocionModal open={modalOpen} onClose={() => setModalOpen(false)} onSaved={loadData} productos={productos} />
            <Header title="Promociones" subtitle="Control de campañas, descuentos y promociones por canal" onRefresh={loadData} />
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">

                {/* KPI cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-500">Promociones Activas</p>
                        <p className="text-2xl font-semibold text-emerald-600 mt-1">{activas.length}</p>
                        <p className="text-xs text-gray-400 mt-0.5">En vigor ahora mismo</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-500">Próximas</p>
                        <p className="text-2xl font-semibold text-blue-600 mt-1">{proximas.length}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Por iniciar</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-500">Total Usos</p>
                        <p className="text-2xl font-semibold text-gray-900 mt-1">{totalUsos.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Aplicaciones registradas</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-500">Presupuesto Ejecutado</p>
                        <p className="text-2xl font-semibold text-gray-900 mt-1">{pctEjecutado}%</p>
                        <p className="text-xs text-gray-400 mt-0.5">{fmt(totalGastado)} / {fmt(totalPresupuesto)}</p>
                    </div>
                </div>

                {/* Sección Activas */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-gray-900">Promociones Activas</h2>
                        <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 bg-blue-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            <Plus className="w-3.5 h-3.5" />Nueva Promoción
                        </button>
                    </div>
                    {activas.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {activas.map(p => <PromoCard key={p.id} p={p} onToggle={() => handleToggle(p.id)} />)}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-24 bg-white rounded-xl border border-gray-100 text-gray-400 text-sm">
                            No hay promociones activas
                        </div>
                    )}
                </section>

                {/* Sección Próximas */}
                {proximas.length > 0 && (
                    <section>
                        <h2 className="font-semibold text-gray-900 mb-4">Próximas Promociones</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {proximas.map(p => (
                                <div key={p.id} className="bg-white rounded-xl border border-blue-100 bg-blue-50/30 p-5 hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <Tag className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-gray-900 text-sm">{p.nombre}</h3>
                                                <Badge label="Próxima" variant="info" />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">{p.descripcion}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {tipoBadge(p.tipo)}
                                        {p.canal && canalBadge(p.canal)}
                                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">-{p.porcentajeDesc}%</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-blue-100">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>Inicio: {new Date(p.fechaInicio).toLocaleDateString('es-SV')}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>Fin: {new Date(p.fechaFin).toLocaleDateString('es-SV')}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Sección Expiradas */}
                {expiradas.length > 0 && (
                    <section>
                        <h2 className="font-semibold text-gray-900 mb-3">Promociones Expiradas</h2>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/50">
                                        {['Nombre', 'Tipo', 'Canal', 'Descuento', 'Usos', 'Vigencia', 'Presupuesto', 'Est.'].map(h => (
                                            <th key={h} className="text-left text-xs text-gray-400 py-3 px-4 font-medium">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {expiradas.map(p => (
                                        <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors opacity-75">
                                            <td className="py-3 px-4">
                                                <p className="text-xs font-medium text-gray-700">{p.nombre}</p>
                                                <p className="text-xs text-gray-400">{p.codigo ?? `PROM-${p.id}`}</p>
                                            </td>
                                            <td className="py-3 px-4">{tipoBadge(p.tipo)}</td>
                                            <td className="py-3 px-4">{p.canal ? canalBadge(p.canal) : '—'}</td>
                                            <td className="py-3 px-4"><span className="text-xs font-bold text-gray-600">-{p.porcentajeDesc}%</span></td>
                                            <td className="py-3 px-4 text-xs text-gray-600">{Number(p.usos).toLocaleString()}</td>
                                            <td className="py-3 px-4 text-xs text-gray-500">
                                                {new Date(p.fechaInicio).toLocaleDateString('es-SV')} → {new Date(p.fechaFin).toLocaleDateString('es-SV')}
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="text-xs text-gray-700">{fmt(Number(p.gastado))}</p>
                                                <p className="text-xs text-gray-400">/ {fmt(Number(p.presupuesto))}</p>
                                            </td>
                                            <td className="py-3 px-4"><Badge label="Expirada" variant="neutral" /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {promociones.length === 0 && (
                    <div className="flex items-center justify-center h-48 bg-white rounded-xl border border-gray-100 text-gray-400 text-sm">
                        No hay promociones registradas aún
                    </div>
                )}
            </div>
        </div>
    );
}
