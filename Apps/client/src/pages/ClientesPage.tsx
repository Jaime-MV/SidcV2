import { useState, useEffect } from 'react';
import { Users, Search, Plus, Eye, AlertCircle, Filter, RefreshCw, AlertTriangle } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';
import { Header } from '../components/layout/Header';
import { Badge } from '../components/ui/Badge';
import { clientesApi, type Cliente, estadoClienteLabel, tipoClienteLabel } from '../services/api';

const fmt = (n: number) => new Intl.NumberFormat('es-SV', { style: 'currency', currency: 'USD' }).format(n);

const TIPO_COLORS: Record<string, string> = {
    SUPERMERCADO: '#3b82f6',
    FARMACIA: '#8b5cf6',
    MAYORISTA: '#f59e0b',
    TIENDA: '#10b981',
};

const tipoBadge = (tipo: string) => {
    const label = tipoClienteLabel[tipo] ?? tipo;
    if (tipo === 'SUPERMERCADO') return <Badge label={label} variant="info" />;
    if (tipo === 'FARMACIA') return <Badge label={label} variant="purple" />;
    if (tipo === 'MAYORISTA') return <Badge label={label} variant="warning" />;
    return <Badge label={label} variant="neutral" />;
};

const estadoBadge = (e: string) => {
    if (e === 'ACTIVO') return <Badge label="Activo" variant="success" />;
    if (e === 'BLOQUEADO') return <Badge label="Bloqueado" variant="danger" />;
    return <Badge label="Suspendido" variant="neutral" />;
};

export default function ClientesPage() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filterTipo, setFilterTipo] = useState('Todos');
    const [filterEstado, setFilterEstado] = useState('Todos');

    const loadData = async () => {
        setLoading(true); setError(null);
        try {
            const data = await clientesApi.getClientes(1, 200);
            setClientes(data.items);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error al cargar clientes');
        } finally { setLoading(false); }
    };

    useEffect(() => { loadData(); }, []);

    const filtered = clientes.filter(c => {
        const tipoLabel = tipoClienteLabel[c.tipo] ?? c.tipo;
        const estadoLabel = estadoClienteLabel[c.estado] ?? c.estado;
        const matchSearch = c.nombre.toLowerCase().includes(search.toLowerCase()) ||
            (c.ruta?.nombre ?? '').toLowerCase().includes(search.toLowerCase());
        const matchTipo = filterTipo === 'Todos' || tipoLabel === filterTipo;
        const matchEstado = filterEstado === 'Todos' || estadoLabel === filterEstado;
        return matchSearch && matchTipo && matchEstado;
    });

    const totalLimite = clientes.reduce((s, c) => s + Number(c.limiteCredito), 0);
    const totalExposicion = clientes.reduce((s, c) => s + Number(c.saldoActual), 0);
    const bloqueados = clientes.filter(c => c.estado === 'BLOQUEADO').length;
    const utilizacion = totalLimite > 0 ? Math.round((totalExposicion / totalLimite) * 100) : 0;

    // Distribución por tipo para RadialBar
    const tiposCount = Object.entries(
        clientes.reduce<Record<string, number>>((acc, c) => { acc[c.tipo] = (acc[c.tipo] ?? 0) + 1; return acc; }, {})
    ).map(([tipo, count], i) => ({ tipo, count, fill: Object.values(TIPO_COLORS)[i % 4], value: count * 20 }));

    if (loading) return (
        <div className="flex flex-col h-full">
            <Header title="Clientes & Crédito" subtitle="Cargando..." />
            <div className="flex-1 flex items-center justify-center"><RefreshCw className="w-8 h-8 text-blue-500 animate-spin" /></div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col h-full">
            <Header title="Clientes & Crédito" subtitle="Error" onRefresh={loadData} />
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
            <Header title="Clientes & Crédito" subtitle="Gestión de cartera, límites de crédito y estados de cuenta" onRefresh={loadData} />
            <div className="flex-1 p-6 space-y-5 overflow-y-auto">

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-500">Clientes Registrados</p>
                        <p className="text-2xl font-semibold text-gray-900 mt-1">{clientes.length}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{clientes.filter(c => c.estado === 'ACTIVO').length} activos</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-500">Crédito Total Otorgado</p>
                        <p className="text-2xl font-semibold text-gray-900 mt-1">{fmt(totalLimite)}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Límite consolidado</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-500">Exposición Actual</p>
                        <p className="text-2xl font-semibold text-blue-600 mt-1">{fmt(totalExposicion)}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{utilizacion}% del límite utilizado</p>
                    </div>
                    <div className={`rounded-xl p-5 shadow-sm border ${bloqueados > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}>
                        <p className="text-xs text-gray-500">Clientes Bloqueados</p>
                        <p className="text-2xl font-semibold text-red-600 mt-1">{bloqueados}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Por límite de crédito</p>
                    </div>
                </div>

                {/* Charts row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Clientes cerca del límite */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <h3 className="font-medium text-gray-900">Clientes Cerca del Límite de Crédito</h3>
                        </div>
                        <div className="space-y-3">
                            {clientes
                                .filter(c => Number(c.limiteCredito) > 0)
                                .sort((a, b) => (Number(b.saldoActual) / Number(b.limiteCredito)) - (Number(a.saldoActual) / Number(a.limiteCredito)))
                                .slice(0, 6)
                                .map(c => {
                                    const pct = Math.round((Number(c.saldoActual) / Number(c.limiteCredito)) * 100);
                                    const barColor = pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-blue-500';
                                    const textColor = pct >= 100 ? 'text-red-600' : pct >= 80 ? 'text-amber-600' : 'text-blue-600';
                                    return (
                                        <div key={c.id} className="flex items-center gap-3">
                                            <div className="w-32 flex-shrink-0">
                                                <p className="text-xs text-gray-700 font-medium truncate">{c.nombre}</p>
                                                <p className="text-xs text-gray-400">{tipoClienteLabel[c.tipo] ?? c.tipo}</p>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-gray-500">{fmt(Number(c.saldoActual))}</span>
                                                    <span className="text-gray-400">/ {fmt(Number(c.limiteCredito))}</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2">
                                                    <div className={`h-2 rounded-full ${barColor} transition-all`} style={{ width: `${Math.min(pct, 100)}%` }}></div>
                                                </div>
                                            </div>
                                            <span className={`text-xs font-medium w-10 text-right flex-shrink-0 ${textColor}`}>{pct}%</span>
                                            <div className="flex-shrink-0">{estadoBadge(c.estado)}</div>
                                        </div>
                                    );
                                })}
                            {clientes.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Sin clientes registrados</p>}
                        </div>
                    </div>

                    {/* Tipos de cliente - RadialBar */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-medium text-gray-900 mb-4">Tipos de Cliente</h3>
                        {tiposCount.length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={160}>
                                    <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={tiposCount}>
                                        <RadialBar dataKey="value" cornerRadius={4} />
                                        <Tooltip formatter={(v, name) => [tiposCount.find(t => t.tipo === name)?.count || v, name]} contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                                    </RadialBarChart>
                                </ResponsiveContainer>
                                <div className="space-y-2 mt-1">
                                    {tiposCount.map(t => (
                                        <div key={t.tipo} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.fill }}></div>
                                                <span className="text-gray-600">{tipoClienteLabel[t.tipo] ?? t.tipo}</span>
                                            </div>
                                            <span className="text-gray-800 font-medium">{t.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Sin datos</div>}
                    </div>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <h3 className="font-medium text-gray-900">Directorio de Clientes</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-48">
                                <Search className="w-3.5 h-3.5 text-gray-400" />
                                <input type="text" placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-xs outline-none w-full text-gray-600 placeholder-gray-400" />
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Filter className="w-3.5 h-3.5 text-gray-400" />
                                <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)} className="bg-gray-100 rounded-lg px-2 py-2 text-xs text-gray-600 outline-none">
                                    <option value="Todos">Todos</option>
                                    <option>Supermercado</option>
                                    <option>Farmacia</option>
                                    <option>Mayorista</option>
                                    <option>Tienda</option>
                                </select>
                                <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)} className="bg-gray-100 rounded-lg px-2 py-2 text-xs text-gray-600 outline-none">
                                    <option value="Todos">Todos</option>
                                    <option>Activo</option>
                                    <option>Bloqueado</option>
                                </select>
                            </div>
                            <button className="flex items-center gap-1.5 bg-blue-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                <Plus className="w-3.5 h-3.5" />Nuevo Cliente
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    {['Cliente', 'Tipo', 'Ruta', 'Límite Crédito', 'Saldo / %', 'Días Créd.', 'Última Compra', 'Estado', 'Acc.'].map(h => (
                                        <th key={h} className="text-left text-xs text-gray-400 pb-3 font-medium pr-3">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={9} className="py-8 text-center text-gray-400 text-sm">No se encontraron clientes</td></tr>
                                ) : filtered.map(c => {
                                    const pct = Number(c.limiteCredito) > 0 ? Math.round((Number(c.saldoActual) / Number(c.limiteCredito)) * 100) : 0;
                                    return (
                                        <tr key={c.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${c.estado === 'BLOQUEADO' ? 'bg-red-50/30' : ''}`}>
                                            <td className="py-3 pr-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                        <Users className="w-3.5 h-3.5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-800 font-medium max-w-[130px] truncate">{c.nombre}</p>
                                                        <p className="text-xs text-gray-400">{c.telefono ?? '—'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 pr-3">{tipoBadge(c.tipo)}</td>
                                            <td className="py-3 pr-3 text-xs text-gray-500 max-w-[100px] truncate">{c.ruta?.nombre ?? '—'}</td>
                                            <td className="py-3 pr-3 text-xs text-gray-700 font-medium">{fmt(Number(c.limiteCredito))}</td>
                                            <td className="py-3 pr-3">
                                                <p className={`text-xs font-medium ${pct >= 100 ? 'text-red-600' : pct >= 80 ? 'text-amber-600' : 'text-gray-800'}`}>{fmt(Number(c.saldoActual))}</p>
                                                <p className="text-xs text-gray-400">{pct}% utilizado</p>
                                            </td>
                                            <td className="py-3 pr-3 text-xs text-gray-500">{c.diasCredito === 0 ? 'Contado' : `${c.diasCredito}d`}</td>
                                            <td className="py-3 pr-3 text-xs text-gray-500">{c.ultimaCompra ? new Date(c.ultimaCompra).toLocaleDateString('es-SV') : '—'}</td>
                                            <td className="py-3 pr-3">{estadoBadge(c.estado)}</td>
                                            <td className="py-3 text-center">
                                                <button className="p-1 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">{filtered.length} clientes encontrados</p>
                </div>
            </div>
        </div>
    );
}
