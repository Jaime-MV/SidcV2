import { useState, useEffect } from 'react';
import { DollarSign, AlertTriangle, CheckCircle2, Clock, Search, Filter, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Header } from '../components/layout/Header';
import { Badge } from '../components/ui/Badge';
import { clientesApi, type Cobro, estadoCobroLabel } from '../services/api';

const fmt = (n: number) => new Intl.NumberFormat('es-SV', { style: 'currency', currency: 'USD' }).format(n);

export default function CobrosPage() {
    const [cobros, setCobros] = useState<Cobro[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filterEstado, setFilterEstado] = useState('Todos');

    const loadData = async () => {
        setLoading(true); setError(null);
        try {
            const data = await clientesApi.getCobros(1, 200);
            setCobros(data.items);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error al cargar cobros');
        } finally { setLoading(false); }
    };
    useEffect(() => { loadData(); }, []);

    const filtered = cobros.filter(c => {
        const nombre = c.cliente?.nombre ?? '';
        const factura = c.factura?.numeroFactura ?? '';
        const label = estadoCobroLabel[c.estado] ?? c.estado;
        return (nombre.toLowerCase().includes(search.toLowerCase()) || factura.toLowerCase().includes(search.toLowerCase()))
            && (filterEstado === 'Todos' || label === filterEstado);
    });

    const totalCobrado = cobros.filter(c => c.estado === 'COBRADO').reduce((s, c) => s + Number(c.monto), 0);
    const totalPendiente = cobros.filter(c => c.estado === 'PENDIENTE').reduce((s, c) => s + Number(c.monto), 0);
    const totalVencido = cobros.filter(c => c.estado === 'VENCIDO').reduce((s, c) => s + Number(c.monto), 0);

    const resumenData = [
        { name: 'Cobrado', value: totalCobrado, color: '#10b981' },
        { name: 'Pendiente', value: totalPendiente, color: '#f59e0b' },
        { name: 'Vencido', value: totalVencido, color: '#ef4444' },
    ].filter(d => d.value > 0);

    const vendedorMap: Record<string, { pendiente: number; cobrado: number }> = {};
    cobros.forEach(c => {
        const venta = (c.factura as unknown as { venta?: { vendedor?: { nombre?: string } } })?.venta;
        const nombre = venta?.vendedor?.nombre ?? 'N/A';
        const short = nombre.split(' ').map((p: string, i: number) => i === 0 ? p[0] + '.' : p).join(' ');
        if (!vendedorMap[short]) vendedorMap[short] = { pendiente: 0, cobrado: 0 };
        if (c.estado !== 'COBRADO') vendedorMap[short].pendiente += Number(c.monto);
        else vendedorMap[short].cobrado += Number(c.monto);
    });
    const vendedorData = Object.entries(vendedorMap).map(([vendedor, v]) => ({ vendedor, ...v }));

    const estadoBadge = (e: string) => {
        const label = estadoCobroLabel[e] ?? e;
        if (e === 'COBRADO') return <Badge label={label} variant="success" />;
        if (e === 'PENDIENTE') return <Badge label={label} variant="warning" />;
        return <Badge label={label} variant="danger" />;
    };

    if (loading) return <div className="flex flex-col h-full"><Header title="Cobros" subtitle="Cargando..." /><div className="flex-1 flex items-center justify-center"><RefreshCw className="w-8 h-8 text-blue-500 animate-spin" /></div></div>;
    if (error) return <div className="flex flex-col h-full"><Header title="Cobros" subtitle="Error" onRefresh={loadData} /><div className="flex-1 flex items-center justify-center p-8"><div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md"><AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" /><p className="text-red-700">{error}</p><button onClick={loadData} className="mt-3 bg-red-600 text-white text-sm px-4 py-2 rounded-lg">Reintentar</button></div></div></div>;

    return (
        <div className="flex flex-col h-full">
            <Header title="Cobros" subtitle="Seguimiento de cuentas por cobrar y gestión de pagos" onRefresh={loadData} />
            <div className="flex-1 p-6 space-y-5 overflow-y-auto">
                {/* Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
                        <div><p className="text-xs text-gray-500">Total Pendiente</p><p className="text-2xl font-semibold text-amber-600 mt-1">{fmt(totalPendiente)}</p><p className="text-xs text-gray-400 mt-0.5">{cobros.filter(c => c.estado === 'PENDIENTE').length} cuentas</p></div>
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600" /></div>
                    </div>
                    <div className="bg-red-50 rounded-xl p-5 shadow-sm border border-red-200 flex items-start justify-between">
                        <div><p className="text-xs text-gray-500">Cobros Vencidos</p><p className="text-2xl font-semibold text-red-600 mt-1">{fmt(totalVencido)}</p><p className="text-xs text-gray-400 mt-0.5">{cobros.filter(c => c.estado === 'VENCIDO').length} facturas</p></div>
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
                        <div><p className="text-xs text-gray-500">Cobrado (Mes)</p><p className="text-2xl font-semibold text-emerald-600 mt-1">{fmt(totalCobrado)}</p><p className="text-xs text-gray-400 mt-0.5">{cobros.filter(c => c.estado === 'COBRADO').length} pagos</p></div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-medium text-gray-900 mb-4">Distribución de Cartera</h3>
                        {resumenData.length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={160}>
                                    <PieChart><Pie data={resumenData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">{resumenData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip formatter={(v: number) => [fmt(v), '']} contentStyle={{ fontSize: '12px', borderRadius: '8px' }} /></PieChart>
                                </ResponsiveContainer>
                                <div className="space-y-2 mt-2">{resumenData.map(d => (<div key={d.name} className="flex items-center justify-between text-xs"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></div><span className="text-gray-600">{d.name}</span></div><span className="text-gray-800 font-medium">{fmt(d.value)}</span></div>))}</div>
                            </>
                        ) : <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Sin datos</div>}
                    </div>
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-medium text-gray-900 mb-4">Cartera por Vendedor</h3>
                        {vendedorData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={vendedorData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="vendedor" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip formatter={(v: number) => [fmt(v), '']} contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                    <Bar dataKey="pendiente" name="Pendiente" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="cobrado" name="Cobrado" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Sin datos</div>}
                    </div>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <h3 className="font-medium text-gray-900">Registro de Cobros</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-48"><Search className="w-3.5 h-3.5 text-gray-400" /><input type="text" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-xs outline-none w-full" /></div>
                            <div className="flex items-center gap-1.5"><Filter className="w-3.5 h-3.5 text-gray-400" /><select value={filterEstado} onChange={e => setFilterEstado(e.target.value)} className="bg-gray-100 rounded-lg px-2 py-2 text-xs text-gray-600 outline-none"><option value="Todos">Todos</option><option>Cobrado</option><option>Pendiente</option><option>Vencido</option></select></div>
                            <button className="flex items-center gap-1.5 bg-blue-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"><DollarSign className="w-3.5 h-3.5" />Registrar Pago</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead><tr className="border-b border-gray-100">{['ID Cobro', 'Factura', 'Cliente', 'Monto', 'Fecha', 'Días Vencido', 'Método', 'Estado'].map(h => <th key={h} className="text-left text-xs text-gray-400 pb-3 font-medium pr-3">{h}</th>)}</tr></thead>
                            <tbody>
                                {filtered.length === 0 ? <tr><td colSpan={8} className="py-8 text-center text-gray-400 text-sm">Sin cobros</td></tr>
                                    : filtered.map(c => (
                                        <tr key={c.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${c.estado === 'VENCIDO' ? 'bg-red-50/30' : ''}`}>
                                            <td className="py-3 pr-3 text-xs text-gray-500 font-mono">{c.codigo ?? `COB-${c.id}`}</td>
                                            <td className="py-3 pr-3 text-xs text-blue-600 font-medium">{c.factura?.numeroFactura ?? '—'}</td>
                                            <td className="py-3 pr-3 text-xs text-gray-700 max-w-[130px]"><span className="truncate block">{c.cliente?.nombre ?? '—'}</span></td>
                                            <td className="py-3 pr-3 text-xs text-gray-900 font-semibold">{fmt(Number(c.monto))}</td>
                                            <td className="py-3 pr-3 text-xs text-gray-500">{new Date(c.fecha).toLocaleDateString('es-SV')}</td>
                                            <td className="py-3 pr-3">{(c.diasVencido ?? 0) > 0 ? <span className="text-xs text-red-600 font-medium">{c.diasVencido}d</span> : <span className="text-xs text-gray-400">—</span>}</td>
                                            <td className="py-3 pr-3 text-xs text-gray-500">{c.metodoPago ? <span className="bg-gray-100 px-2 py-0.5 rounded-full">{c.metodoPago}</span> : <span className="text-gray-300">—</span>}</td>
                                            <td className="py-3">{estadoBadge(c.estado)}</td>
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
