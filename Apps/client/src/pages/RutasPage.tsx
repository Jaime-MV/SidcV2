import { useEffect, useState } from 'react';
import { Truck, MapPin, Clock, CheckCircle2, Users, Package, AlertCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Header } from '../components/layout/Header';
import { Badge } from '../components/ui/Badge';
import { rutasApi, type Ruta, estadoRutaLabel } from '../services/api';

const estadoBadge = (e: string) => {
    if (e === 'EN_RUTA') return <Badge label="En Ruta" variant="info" />;
    if (e === 'COMPLETADA') return <Badge label="Completada" variant="success" />;
    if (e === 'PENDIENTE') return <Badge label="Pendiente" variant="neutral" />;
    return <Badge label="Cancelada" variant="danger" />;
};

const estadoIcono = (e: string) => {
    if (e === 'EN_RUTA') return <Truck className="w-4 h-4 text-blue-500 animate-pulse" />;
    if (e === 'COMPLETADA') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (e === 'PENDIENTE') return <Clock className="w-4 h-4 text-gray-400" />;
    return <AlertCircle className="w-4 h-4 text-red-500" />;
};

export default function RutasPage() {
    const [rutas, setRutas] = useState<Ruta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true); setError(null);
        try { setRutas(await rutasApi.getRutas()); }
        catch (e: unknown) { setError(e instanceof Error ? e.message : 'Error'); }
        finally { setLoading(false); }
    };
    useEffect(() => { loadData(); }, []);

    const enRuta = rutas.filter(r => r.estado === 'EN_RUTA').length;
    const completadas = rutas.filter(r => r.estado === 'COMPLETADA').length;
    const pendientes = rutas.filter(r => r.estado === 'PENDIENTE').length;
    const totalHoy = rutas.reduce((s, r) => s + (r.entregasHoy ?? 0), 0);
    const totalComp = rutas.reduce((s, r) => s + (r.entregasCompletadas ?? 0), 0);

    const entregasChart = rutas.map(r => ({
        ruta: r.nombre.length > 10 ? r.nombre.substring(0, 10) + '…' : r.nombre,
        completadas: r.entregasCompletadas ?? 0,
        pendientes: Math.max(0, (r.entregasHoy ?? 0) - (r.entregasCompletadas ?? 0)),
    }));

    if (loading) return <div className="flex flex-col h-full"><Header title="Rutas & Reparto" subtitle="Cargando..." /><div className="flex-1 flex items-center justify-center"><RefreshCw className="w-8 h-8 text-blue-500 animate-spin" /></div></div>;
    if (error) return <div className="flex flex-col h-full"><Header title="Rutas & Reparto" subtitle="Error" onRefresh={loadData} /><div className="flex-1 flex items-center justify-center p-8"><div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md"><AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" /><p className="text-red-700">{error}</p><button onClick={loadData} className="mt-3 bg-red-600 text-white text-sm px-4 py-2 rounded-lg">Reintentar</button></div></div></div>;

    return (
        <div className="flex flex-col h-full">
            <Header title="Rutas & Reparto" subtitle="Monitoreo en tiempo real de rutas de distribución" onRefresh={loadData} />
            <div className="flex-1 p-6 space-y-5 overflow-y-auto">

                {/* Summary */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50/50 rounded-xl p-5 shadow-sm border border-blue-100">
                        <p className="text-xs text-gray-500">En Ruta Ahora</p>
                        <p className="text-2xl font-semibold text-blue-600 mt-1">{enRuta}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Vendedores activos</p>
                    </div>
                    <div className="bg-emerald-50/50 rounded-xl p-5 shadow-sm border border-emerald-100">
                        <p className="text-xs text-gray-500">Rutas Completadas</p>
                        <p className="text-2xl font-semibold text-emerald-600 mt-1">{completadas}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Finalizadas hoy</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-500">Rutas Pendientes</p>
                        <p className="text-2xl font-semibold text-gray-600 mt-1">{pendientes}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Por iniciar</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-500">Entregas del Día</p>
                        <p className="text-2xl font-semibold text-gray-900 mt-1">{totalComp}/{totalHoy}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{totalHoy > 0 ? Math.round((totalComp / totalHoy) * 100) : 0}% completado</p>
                    </div>
                </div>

                {/* Grid de tarjetas de rutas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rutas.length === 0 ? (
                        <div className="col-span-3 bg-white rounded-xl p-8 text-center text-gray-400">Sin rutas configuradas</div>
                    ) : rutas.map(r => {
                        const entH = r.entregasHoy ?? 0;
                        const entC = r.entregasCompletadas ?? 0;
                        const pct = entH > 0 ? Math.round((entC / entH) * 100) : 0;
                        const barColor = r.estado === 'COMPLETADA' ? 'bg-emerald-500' : r.estado === 'EN_RUTA' ? 'bg-blue-500' : 'bg-gray-300';
                        const cardBorder = r.estado === 'EN_RUTA' ? 'border-blue-200 bg-blue-50/20' : r.estado === 'COMPLETADA' ? 'border-emerald-200 bg-emerald-50/20' : 'border-gray-100';
                        return (
                            <div key={r.id} className={`bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-shadow ${cardBorder}`}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-start gap-2.5">
                                        {estadoIcono(r.estado)}
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{r.nombre}</p>
                                            <p className="text-xs text-gray-500">{r.codigo ?? `R-${r.id}`} · {r.departamento ?? '—'}</p>
                                        </div>
                                    </div>
                                    {estadoBadge(r.estado)}
                                </div>
                                <div className="mb-3">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-500">Entregas</span>
                                        <span className="text-gray-700 font-medium">{entC}/{entH} ({pct}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className={`h-2 rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }}></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div className="flex items-center gap-1.5 text-gray-600"><Users className="w-3.5 h-3.5 text-gray-400" /><span className="truncate">{r.vendedor?.nombre ?? '—'}</span></div>
                                    <div className="flex items-center gap-1.5 text-gray-600"><MapPin className="w-3.5 h-3.5 text-gray-400" /><span>{r.clientesTotal ?? 0} clientes</span></div>
                                    <div className="flex items-center gap-1.5 text-gray-600"><Package className="w-3.5 h-3.5 text-gray-400" /><span className="truncate">{r.vehiculo?.split(' ')[0] ?? '—'}</span></div>
                                    <div className="flex items-center gap-1.5 text-gray-600"><Clock className="w-3.5 h-3.5 text-gray-400" /><span>{r.horaInicio ?? '—'} – {r.horaFin ?? '—'}</span></div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                                    <span>~{r.kmEstimados ?? 0} km estimados</span>
                                    <button className="text-blue-500 hover:text-blue-700 transition-colors">Ver detalle →</button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Stacked bar: entregas por ruta */}
                {entregasChart.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-medium text-gray-900 mb-4">Entregas por Ruta · Hoy</h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={entregasChart} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="ruta" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                                <Bar dataKey="completadas" name="Completadas" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
                                <Bar dataKey="pendientes" name="Pendientes" fill="#e2e8f0" radius={[4, 4, 0, 0]} stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Tabla detallada */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h3 className="font-medium text-gray-900 mb-4">Asignaciones de Ruta</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    {['Ruta', 'Vendedor', 'Vehículo', 'Clientes', 'Entregas Hoy', 'Completadas', 'Km Est.', 'Horario', 'Estado'].map(h => (
                                        <th key={h} className="text-left text-xs text-gray-400 pb-3 font-medium pr-3">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rutas.map(r => (
                                    <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="py-3 pr-3"><p className="text-xs font-medium text-gray-800">{r.nombre}</p><p className="text-xs text-gray-400">{r.codigo ?? `R-${r.id}`}</p></td>
                                        <td className="py-3 pr-3 text-xs text-gray-700">{r.vendedor?.nombre ?? '—'}</td>
                                        <td className="py-3 pr-3 text-xs text-gray-500">{r.vehiculo ?? '—'}</td>
                                        <td className="py-3 pr-3 text-xs text-gray-500">{r.clientesTotal ?? 0}</td>
                                        <td className="py-3 pr-3 text-xs text-gray-500">{r.entregasHoy ?? 0}</td>
                                        <td className="py-3 pr-3">
                                            <span className={`text-xs font-medium ${r.entregasCompletadas === r.entregasHoy && (r.entregasHoy ?? 0) > 0 ? 'text-emerald-600' : 'text-blue-600'}`}>
                                                {r.entregasCompletadas ?? 0}
                                            </span>
                                        </td>
                                        <td className="py-3 pr-3 text-xs text-gray-500">{r.kmEstimados ?? 0} km</td>
                                        <td className="py-3 pr-3 text-xs text-gray-500">{r.horaInicio ?? '—'}–{r.horaFin ?? '—'}</td>
                                        <td className="py-3">{estadoBadge(r.estado)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
