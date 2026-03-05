import { useEffect, useState } from 'react';
import { Tag, Plus, TrendingUp, Calendar, RefreshCw, AlertTriangle } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Badge } from '../components/ui/Badge';
import { promocionesApi, type Promocion, estadoPromocionLabel } from '../services/api';

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

function PromoCard({ p }: { p: Promocion }) {
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
            </div>

            <p className="text-xs text-gray-500 mb-3 leading-relaxed">{p.descripcion ?? '—'}</p>

            <div className="flex flex-wrap items-center gap-1.5 mb-4">
                {tipoBadge(p.tipo)}
                {p.canal && canalBadge(p.canal)}
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    -{p.porcentajeDesc}%
                </span>
            </div>

            {/* Barra de presupuesto */}
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

export default function PromocionesPage() {
    const [promociones, setPromociones] = useState<Promocion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true); setError(null);
        try { setPromociones(await promocionesApi.getPromociones()); }
        catch (e: unknown) { setError(e instanceof Error ? e.message : 'Error al cargar promociones'); }
        finally { setLoading(false); }
    };
    useEffect(() => { loadData(); }, []);

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
                {activas.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-gray-900">Promociones Activas</h2>
                            <button className="flex items-center gap-1.5 bg-blue-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                <Plus className="w-3.5 h-3.5" />Nueva Promoción
                            </button>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {activas.map(p => <PromoCard key={p.id} p={p} />)}
                        </div>
                    </section>
                )}

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
                                        <span>Presupuesto: {fmt(Number(p.presupuesto))}</span>
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
