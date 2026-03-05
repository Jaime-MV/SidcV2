import { useEffect, useState } from 'react';
import { RotateCcw, RefreshCw, AlertTriangle, Plus, CheckCircle2, Clock, XCircle, FileText, X, Save } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Badge } from '../components/ui/Badge';
import { ventasApi, type Devolucion, type Venta, type Producto, estadoDevolucionLabel } from '../services/api';

const fmt = (n: number) => new Intl.NumberFormat('es-SV', { style: 'currency', currency: 'USD' }).format(n);

// ─── Modal Nueva Devolución ───────────────────────────────────────────────────
function NuevaDevolucionModal({ open, onClose, onSaved, ventas, productos }: {
    open: boolean; onClose: () => void; onSaved: () => void;
    ventas: Venta[]; productos: Producto[];
}) {
    const [ventaId, setVentaId] = useState('');
    const [productoId, setProductoId] = useState('');
    const [cantidad, setCantidad] = useState('1');
    const [motivo, setMotivo] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) { setVentaId(''); setProductoId(''); setCantidad('1'); setMotivo(''); setError(null); }
    }, [open]);

    const handleSave = async () => {
        if (!ventaId) { setError('Selecciona una venta'); return; }
        if (!productoId) { setError('Selecciona el producto a devolver'); return; }
        if (!motivo.trim()) { setError('Describe el motivo de la devolución'); return; }
        if (parseInt(cantidad) < 1) { setError('La cantidad debe ser mayor a 0'); return; }
        setSaving(true); setError(null);
        try {
            await ventasApi.createDevolucion({
                ventaId: parseInt(ventaId),
                productoId: parseInt(productoId),
                cantidad: parseInt(cantidad),
                motivo: motivo.trim(),
            });
            onSaved();
            onClose();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error al registrar la devolución');
        } finally { setSaving(false); }
    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-gray-900">Nueva Devolución</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><X className="w-4 h-4 text-gray-500" /></button>
                </div>
                <div className="p-6 space-y-4">
                    {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">{error}</div>}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Venta Origen *</label>
                        <select value={ventaId} onChange={e => setVentaId(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400">
                            <option value="">Seleccionar venta...</option>
                            {ventas.map(v => (
                                <option key={v.id} value={v.id}>
                                    {v.factura?.numeroFactura ?? `VTA-${v.id}`} — {v.cliente?.nombre ?? '?'} — {new Date(v.fecha).toLocaleDateString('es-SV')}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Producto a Devolver *</label>
                        <select value={productoId} onChange={e => setProductoId(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400">
                            <option value="">Seleccionar producto...</option>
                            {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Cantidad *</label>
                        <input type="number" min="1" value={cantidad} onChange={e => setCantidad(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Motivo *</label>
                        <textarea value={motivo} onChange={e => setMotivo(e.target.value)} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none" placeholder="Describe el motivo de la devolución (producto defectuoso, vencido, entrega incorrecta...)" />
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                        <p className="text-xs text-blue-700">La devolución quedará en estado <strong>Pendiente</strong> hasta que sea revisada y aprobada.</p>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors">
                        <Save className="w-3.5 h-3.5" />{saving ? 'Registrando...' : 'Registrar Devolución'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DevolucionesPage() {
    const [devoluciones, setDevoluciones] = useState<Devolucion[]>([]);
    const [ventas, setVentas] = useState<Venta[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const loadData = async () => {
        setLoading(true); setError(null);
        try {
            const [devData, ventasData, prodData] = await Promise.all([
                ventasApi.getDevoluciones(1, 200),
                ventasApi.getVentas(1, 200),
                import('../services/api').then(m => m.inventarioApi.getProductos(1, 200)),
            ]);
            setDevoluciones(devData.items);
            setVentas(ventasData.items);
            setProductos(prodData.items);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error al cargar devoluciones');
        } finally { setLoading(false); }
    };
    useEffect(() => { loadData(); }, []);

    const total = devoluciones.length;
    const aprobadas = devoluciones.filter(d => d.estado === 'APROBADA').length;
    const pendientes = devoluciones.filter(d => d.estado === 'PENDIENTE').length;
    const rechazadas = devoluciones.filter(d => d.estado === 'RECHAZADA').length;
    const totalMonto = devoluciones.filter(d => d.estado === 'APROBADA').reduce((s, d) => s + Number(d.monto), 0);

    const estadoBadge = (e: string) => {
        const label = estadoDevolucionLabel[e] ?? e;
        if (e === 'APROBADA') return <Badge label={label} variant="success" />;
        if (e === 'PENDIENTE' || e === 'PROCESADA') return <Badge label={label} variant="warning" />;
        return <Badge label={label} variant="danger" />;
    };

    if (loading) return <div className="flex flex-col h-full"><Header title="Devoluciones" subtitle="Cargando..." /><div className="flex-1 flex items-center justify-center"><RefreshCw className="w-8 h-8 text-blue-500 animate-spin" /></div></div>;
    if (error) return <div className="flex flex-col h-full"><Header title="Devoluciones" subtitle="Error" onRefresh={loadData} /><div className="flex-1 flex items-center justify-center p-8"><div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md"><AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" /><p className="text-red-700">{error}</p><button onClick={loadData} className="mt-3 bg-red-600 text-white text-sm px-4 py-2 rounded-lg">Reintentar</button></div></div></div>;

    return (
        <div className="flex flex-col h-full">
            <NuevaDevolucionModal open={modalOpen} onClose={() => setModalOpen(false)} onSaved={loadData} ventas={ventas} productos={productos} />
            <Header title="Devoluciones" subtitle="Registro y gestión de devoluciones de ventas previas" onRefresh={loadData} />
            <div className="flex-1 p-6 space-y-5 overflow-y-auto">

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-500">Total Devoluciones</p>
                        <p className="text-2xl font-semibold text-gray-900 mt-1">{total}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Este mes</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-emerald-100">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-gray-500">Aprobadas</p>
                                <p className="text-2xl font-semibold text-emerald-600 mt-1">{aprobadas}</p>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1" />
                        </div>
                    </div>
                    <div className={`rounded-xl p-5 shadow-sm border ${pendientes > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-gray-500">Pendientes Revisión</p>
                                <p className={`text-2xl font-semibold mt-1 ${pendientes > 0 ? 'text-amber-600' : 'text-gray-900'}`}>{pendientes}</p>
                            </div>
                            <Clock className={`w-5 h-5 mt-1 ${pendientes > 0 ? 'text-amber-500' : 'text-gray-400'}`} />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-gray-500">Monto Total Notas</p>
                                <p className="text-2xl font-semibold text-gray-900 mt-1">{fmt(totalMonto)}</p>
                                <p className="text-xs text-gray-400 mt-0.5">Créditos emitidos</p>
                            </div>
                            <FileText className="w-5 h-5 text-blue-400 mt-1" />
                        </div>
                    </div>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <RotateCcw className="w-4 h-4 text-blue-500" />
                            <h3 className="font-medium text-gray-900">Registro de Devoluciones</h3>
                        </div>
                        <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 bg-blue-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            <Plus className="w-3.5 h-3.5" />Nueva Devolución
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    {['ID', 'Factura', 'Cliente', 'Fecha', 'Producto', 'Cantidad', 'Motivo', 'Monto', 'Estado'].map(h => (
                                        <th key={h} className="text-left text-xs text-gray-400 pb-3 font-medium pr-4">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {devoluciones.length === 0 ? (
                                    <tr><td colSpan={9} className="py-8 text-center text-gray-400 text-sm">No hay devoluciones registradas</td></tr>
                                ) : devoluciones.map(d => (
                                    <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="py-3 pr-4 text-xs font-mono text-gray-500">{d.codigo ?? `DEV-${d.id}`}</td>
                                        <td className="py-3 pr-4 text-xs text-blue-600 font-medium">{d.venta?.factura?.numeroFactura ?? '—'}</td>
                                        <td className="py-3 pr-4 text-xs text-gray-800 max-w-[120px]"><span className="truncate block">{d.venta?.cliente?.nombre ?? '—'}</span></td>
                                        <td className="py-3 pr-4 text-xs text-gray-500">{new Date(d.fecha).toLocaleDateString('es-SV')}</td>
                                        <td className="py-3 pr-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                    <RotateCcw className="w-3 h-3 text-gray-500" />
                                                </div>
                                                <span className="text-xs text-gray-700 truncate max-w-[110px]">{d.producto?.nombre ?? '—'}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 pr-4 text-xs text-gray-700 font-medium">{d.cantidad} uds</td>
                                        <td className="py-3 pr-4 text-xs text-gray-500 max-w-[120px]"><span className="truncate block">{d.motivo}</span></td>
                                        <td className="py-3 pr-4 text-xs font-semibold text-gray-900">{fmt(Number(d.monto))}</td>
                                        <td className="py-3">{estadoBadge(d.estado)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {rechazadas > 0 && (
                        <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                            <XCircle className="w-3 h-3 text-red-400" />
                            <span>{rechazadas} devolución(es) rechazada(s)</span>
                        </div>
                    )}
                </div>

                {/* Política */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <RotateCcw className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-blue-800 mb-2">Política de Devoluciones SIDC</p>
                            <ul className="text-xs text-blue-700 space-y-1">
                                <li>• Solo se aceptan devoluciones de ventas previas registradas en el sistema</li>
                                <li>• Productos vencidos o dañados requieren evidencia fotográfica</li>
                                <li>• Las notas de crédito se aplicarán en la próxima factura del cliente</li>
                                <li>• El plazo máximo para solicitar devolución es de 15 días desde la entrega</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
