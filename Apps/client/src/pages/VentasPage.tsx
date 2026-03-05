import { useState, useEffect } from 'react';
import { FileText, ShoppingCart, TrendingUp, Clock, XCircle, Plus, Search, Filter, Download, Eye, RefreshCw, AlertTriangle, X, Save, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Header } from '../components/layout/Header';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { ventasApi, dashboardApi, clientesApi, rutasApi, inventarioApi, type Factura, type ResumenMensual, type Cliente, type Vendedor, type Producto, estadoFacturaLabel } from '../services/api';

const fmt = (n: number) => new Intl.NumberFormat('es-SV', { style: 'currency', currency: 'USD' }).format(n);

// ─── Modal Nueva Venta ────────────────────────────────────────────────────────
interface DetalleItem { productoId: number; cantidad: number; nombre: string; precio: number; }

function NuevaVentaModal({ open, onClose, onSaved, clientes, vendedores, productos }: {
    open: boolean; onClose: () => void; onSaved: () => void;
    clientes: Cliente[]; vendedores: Vendedor[]; productos: Producto[];
}) {
    const [clienteId, setClienteId] = useState('');
    const [vendedorId, setVendedorId] = useState('');
    const [detalles, setDetalles] = useState<DetalleItem[]>([]);
    const [productoSel, setProductoSel] = useState('');
    const [cantidadSel, setCantidadSel] = useState('1');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) {
            setClienteId(''); setVendedorId(''); setDetalles([]);
            setProductoSel(''); setCantidadSel('1'); setError(null);
        }
    }, [open]);

    const agregarProducto = () => {
        if (!productoSel) return;
        const prod = productos.find(p => p.id === parseInt(productoSel));
        if (!prod) return;
        const cant = parseInt(cantidadSel) || 1;
        const exists = detalles.find(d => d.productoId === prod.id);
        if (exists) {
            setDetalles(detalles.map(d => d.productoId === prod.id ? { ...d, cantidad: d.cantidad + cant } : d));
        } else {
            setDetalles([...detalles, { productoId: prod.id, cantidad: cant, nombre: prod.nombre, precio: Number(prod.precioVenta) }]);
        }
        setProductoSel(''); setCantidadSel('1');
    };

    const quitarProducto = (id: number) => setDetalles(detalles.filter(d => d.productoId !== id));

    const totalVenta = detalles.reduce((s, d) => s + d.precio * d.cantidad, 0);

    const handleSave = async () => {
        if (!clienteId) { setError('Selecciona un cliente'); return; }
        if (!vendedorId) { setError('Selecciona un vendedor'); return; }
        if (detalles.length === 0) { setError('Agrega al menos un producto'); return; }
        setSaving(true); setError(null);
        try {
            await ventasApi.createVenta({
                clienteId: parseInt(clienteId),
                vendedorId: parseInt(vendedorId),
                detalles: detalles.map(d => ({ productoId: d.productoId, cantidad: d.cantidad })),
            });
            onSaved();
            onClose();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error al crear la venta');
        } finally { setSaving(false); }
    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-gray-900">Nueva Venta</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><X className="w-4 h-4 text-gray-500" /></button>
                </div>
                <div className="p-6 space-y-5">
                    {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">{error}</div>}

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Cliente *</label>
                            <select value={clienteId} onChange={e => setClienteId(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400">
                                <option value="">Seleccionar cliente...</option>
                                {clientes.filter(c => c.estado === 'ACTIVO').map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Vendedor *</label>
                            <select value={vendedorId} onChange={e => setVendedorId(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400">
                                <option value="">Seleccionar vendedor...</option>
                                {vendedores.filter(v => v.activo).map(v => <option key={v.id} value={v.id}>{v.nombre}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Agregar productos */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="text-xs font-semibold text-gray-700 mb-3">Agregar Productos</h3>
                        <div className="flex gap-2">
                            <select value={productoSel} onChange={e => setProductoSel(e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white">
                                <option value="">Seleccionar producto...</option>
                                {productos.map(p => <option key={p.id} value={p.id}>{p.nombre} — {fmt(Number(p.precioVenta))}</option>)}
                            </select>
                            <input type="number" min="1" value={cantidadSel} onChange={e => setCantidadSel(e.target.value)} className="w-20 border border-gray-200 rounded-lg px-2 py-2 text-sm text-center outline-none focus:border-blue-400 bg-white" placeholder="Cant." />
                            <button onClick={agregarProducto} disabled={!productoSel} className="px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Tabla de detalle */}
                    {detalles.length > 0 && (
                        <div className="border border-gray-100 rounded-xl overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="text-left text-xs text-gray-400 py-2 px-3 font-medium">Producto</th>
                                        <th className="text-center text-xs text-gray-400 py-2 font-medium">Cant.</th>
                                        <th className="text-right text-xs text-gray-400 py-2 px-3 font-medium">Precio</th>
                                        <th className="text-right text-xs text-gray-400 py-2 px-3 font-medium">Subtotal</th>
                                        <th className="w-8"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detalles.map(d => (
                                        <tr key={d.productoId} className="border-b border-gray-50">
                                            <td className="py-2.5 px-3 text-xs text-gray-800">{d.nombre}</td>
                                            <td className="py-2.5 text-center text-xs text-gray-600">{d.cantidad}</td>
                                            <td className="py-2.5 px-3 text-right text-xs text-gray-600">{fmt(d.precio)}</td>
                                            <td className="py-2.5 px-3 text-right text-xs font-medium text-gray-900">{fmt(d.precio * d.cantidad)}</td>
                                            <td className="py-2.5 pr-2">
                                                <button onClick={() => quitarProducto(d.productoId)} className="p-1 rounded text-gray-300 hover:text-red-500 transition-colors">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-blue-50">
                                        <td colSpan={3} className="py-2.5 px-3 text-xs font-semibold text-gray-700">Total</td>
                                        <td className="py-2.5 px-3 text-right text-sm font-bold text-blue-700">{fmt(totalVenta)}</td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
                    <button onClick={handleSave} disabled={saving || detalles.length === 0} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors">
                        <Save className="w-3.5 h-3.5" />{saving ? 'Procesando...' : 'Crear Venta'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function VentasPage() {
    const [facturas, setFacturas] = useState<Factura[]>([]);
    const [ventas, setVentas] = useState<ResumenMensual[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [vendedores, setVendedores] = useState<Vendedor[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filterEstado, setFilterEstado] = useState('Todos');
    const [modalOpen, setModalOpen] = useState(false);

    const loadData = async () => {
        setLoading(true); setError(null);
        try {
            const [facturasData, ventasData, clientesData, vendedoresData, productosData] = await Promise.all([
                ventasApi.getFacturas(1, 200),
                dashboardApi.getVentasMensuales(),
                clientesApi.getClientes(1, 200),
                rutasApi.getVendedores(),
                inventarioApi.getProductos(1, 200),
            ]);
            setFacturas(facturasData.items);
            setVentas(ventasData);
            setClientes(clientesData.items);
            setVendedores(vendedoresData);
            setProductos(productosData.items);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error al cargar ventas');
        } finally { setLoading(false); }
    };

    useEffect(() => { loadData(); }, []);

    const filtered = facturas.filter(f => {
        const clienteNombre = f.venta?.cliente?.nombre ?? '';
        const vendedor = f.venta?.vendedor?.nombre ?? '';
        const matchSearch = f.numeroFactura.toLowerCase().includes(search.toLowerCase()) ||
            clienteNombre.toLowerCase().includes(search.toLowerCase()) ||
            vendedor.toLowerCase().includes(search.toLowerCase());
        const estadoLabel = estadoFacturaLabel[f.estado] ?? f.estado;
        const matchEstado = filterEstado === 'Todos' || estadoLabel === filterEstado;
        return matchSearch && matchEstado;
    });

    const totalPendiente = facturas.filter(f => f.estado === 'CREADA' || f.estado === 'PAGADA_PARCIALMENTE').reduce((s, f) => s + Number(f.total), 0);
    const totalVencido = facturas.filter(f => f.estado === 'VENCIDA').reduce((s, f) => s + Number(f.total), 0);
    const totalCobrado = facturas.filter(f => f.estado === 'PAGADA').reduce((s, f) => s + Number(f.total), 0);

    const estadoBadge = (e: string) => {
        const label = estadoFacturaLabel[e] ?? e;
        if (e === 'PAGADA') return <Badge label={label} variant="success" />;
        if (e === 'CREADA' || e === 'PAGADA_PARCIALMENTE') return <Badge label={label} variant="warning" />;
        if (e === 'VENCIDA') return <Badge label={label} variant="danger" />;
        return <Badge label={label} variant="neutral" />;
    };

    if (loading) return (
        <div className="flex flex-col h-full">
            <Header title="Ventas & Facturación" subtitle="Cargando..." />
            <div className="flex-1 flex items-center justify-center"><RefreshCw className="w-8 h-8 text-blue-500 animate-spin" /></div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col h-full">
            <Header title="Ventas & Facturación" subtitle="Error" onRefresh={loadData} />
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
            <NuevaVentaModal open={modalOpen} onClose={() => setModalOpen(false)} onSaved={loadData}
                clientes={clientes} vendedores={vendedores} productos={productos} />
            <Header title="Ventas & Facturación" subtitle="Gestión de ventas, facturas y estados de cobro" onRefresh={loadData} />
            <div className="flex-1 p-6 space-y-5 overflow-y-auto">

                {/* ===== STAT CARDS ===== */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Ventas del Mes" value={fmt(ventas[ventas.length - 1]?.ventas ?? 0)} icon={ShoppingCart} iconColor="text-blue-600" iconBg="bg-blue-100" />
                    <StatCard
                        title="Por Cobrar"
                        value={fmt(totalPendiente)}
                        subtitle={`${facturas.filter(f => f.estado === 'CREADA' || f.estado === 'PAGADA_PARCIALMENTE').length} facturas`}
                        icon={Clock}
                        iconColor="text-amber-600"
                        iconBg="bg-amber-100"
                    />
                    <StatCard
                        title="Cobrado"
                        value={fmt(totalCobrado)}
                        subtitle={`${facturas.filter(f => f.estado === 'PAGADA').length} facturas`}
                        icon={TrendingUp}
                        iconColor="text-emerald-600"
                        iconBg="bg-emerald-100"
                    />
                    <StatCard
                        title="Facturas Vencidas"
                        value={fmt(totalVencido)}
                        subtitle={`${facturas.filter(f => f.estado === 'VENCIDA').length} facturas`}
                        icon={XCircle}
                        iconColor="text-red-600"
                        iconBg="bg-red-100"
                        alert={facturas.some(f => f.estado === 'VENCIDA')}
                    />
                </div>

                {/* ===== GRÁFICO MENSUAL ===== */}
                {ventas.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-medium text-gray-900 mb-4">Historial de Ventas Mensual</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={ventas} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="mesLabel" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                                <Tooltip formatter={(v: number | undefined) => [fmt(v ?? 0), '']} contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                <Bar dataKey="ventas" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Ventas" />
                                <Bar dataKey="devoluciones" fill="#f87171" radius={[4, 4, 0, 0]} name="Devoluciones" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* ===== TABLA ===== */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <h3 className="font-medium text-gray-900">Registro de Facturas</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-52">
                                <Search className="w-3.5 h-3.5 text-gray-400" />
                                <input type="text" placeholder="Buscar factura, cliente..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-xs text-gray-600 placeholder-gray-400 outline-none w-full" />
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Filter className="w-3.5 h-3.5 text-gray-400" />
                                <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)} className="bg-gray-100 rounded-lg px-3 py-2 text-xs text-gray-600 outline-none">
                                    <option value="Todos">Todos</option>
                                    <option>Pagada</option>
                                    <option>Pendiente</option>
                                    <option>Parcial</option>
                                    <option>Vencida</option>
                                    <option>Anulada</option>
                                </select>
                            </div>
                            <button className="flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                                <Download className="w-3.5 h-3.5" />Exportar
                            </button>
                            <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 bg-blue-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                <Plus className="w-3.5 h-3.5" />Nueva Venta
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left text-xs text-gray-400 pb-3 font-medium">Factura</th>
                                    <th className="text-left text-xs text-gray-400 pb-3 font-medium">Cliente</th>
                                    <th className="text-left text-xs text-gray-400 pb-3 font-medium">Vendedor</th>
                                    <th className="text-center text-xs text-gray-400 pb-3 font-medium">Fecha</th>
                                    <th className="text-center text-xs text-gray-400 pb-3 font-medium">Vencimiento</th>
                                    <th className="text-right text-xs text-gray-400 pb-3 font-medium">Total</th>
                                    <th className="text-center text-xs text-gray-400 pb-3 font-medium">Estado</th>
                                    <th className="text-center text-xs text-gray-400 pb-3 font-medium">Acc.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={8} className="py-8 text-center text-gray-400 text-sm">No se encontraron facturas</td></tr>
                                ) : filtered.map(f => (
                                    <tr key={f.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${f.estado === 'VENCIDA' ? 'bg-red-50/30' : ''}`}>
                                        <td className="py-3">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-3.5 h-3.5 text-blue-400" />
                                                <span className="text-xs text-blue-600 font-medium">{f.numeroFactura}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 text-xs text-gray-700 max-w-[140px]"><span className="truncate block">{f.venta?.cliente?.nombre ?? '—'}</span></td>
                                        <td className="py-3 text-xs text-gray-500">{f.venta?.vendedor?.nombre ?? '—'}</td>
                                        <td className="py-3 text-xs text-gray-500 text-center">{new Date(f.fechaEmision).toLocaleDateString('es-SV')}</td>
                                        <td className="py-3 text-xs text-gray-500 text-center">{f.fechaVencimiento ? new Date(f.fechaVencimiento).toLocaleDateString('es-SV') : '—'}</td>
                                        <td className="py-3 text-xs text-gray-900 font-medium text-right">{fmt(Number(f.total))}</td>
                                        <td className="py-3 text-center">{estadoBadge(f.estado)}</td>
                                        <td className="py-3 text-center">
                                            <button className="p-1 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">{filtered.length} registros</p>
                </div>
            </div>
        </div>
    );
}
