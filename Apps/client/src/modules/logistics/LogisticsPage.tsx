import { useEffect, useState } from 'react';
import { logisticsService } from './logistics.service';
import type { Vendedor, Ruta } from './logistics.service';

export default function LogisticsPage() {
    const [tab, setTab] = useState<'vendedores' | 'rutas'>('vendedores');
    const [vendedores, setVendedores] = useState<Vendedor[]>([]);
    const [rutas, setRutas] = useState<Ruta[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    const [vendForm, setVendForm] = useState({ nombre: '', telefono: '' });
    const [rutaForm, setRutaForm] = useState({ nombre: '', descripcion: '', vendedorId: '' });

    const loadVendedores = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await logisticsService.getVendedores();
            setVendedores(Array.isArray(data) ? data : []);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error al cargar vendedores');
        } finally {
            setLoading(false);
        }
    };

    const loadRutas = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await logisticsService.getRutas();
            setRutas(Array.isArray(data) ? data : []);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error al cargar rutas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tab === 'vendedores') loadVendedores();
        else loadRutas();
    }, [tab]);

    const handleCreateVendedor = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await logisticsService.createVendedor({ nombre: vendForm.nombre, telefono: vendForm.telefono || undefined });
            setVendForm({ nombre: '', telefono: '' });
            setShowForm(false);
            loadVendedores();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error al crear vendedor');
        }
    };

    const handleCreateRuta = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await logisticsService.createRuta({
                nombre: rutaForm.nombre,
                descripcion: rutaForm.descripcion || undefined,
                vendedorId: parseInt(rutaForm.vendedorId),
            });
            setRutaForm({ nombre: '', descripcion: '', vendedorId: '' });
            setShowForm(false);
            loadRutas();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error al crear ruta');
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Logística</h1>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? '✕ Cerrar' : '+ Nuevo'}
                </button>
            </div>

            <div className="tabs">
                <button className={`tab ${tab === 'vendedores' ? 'active' : ''}`} onClick={() => { setTab('vendedores'); setShowForm(false); }}>
                    Vendedores
                </button>
                <button className={`tab ${tab === 'rutas' ? 'active' : ''}`} onClick={() => { setTab('rutas'); setShowForm(false); }}>
                    Rutas
                </button>
            </div>

            {error && <div className="error-msg">{error}</div>}

            {showForm && tab === 'vendedores' && (
                <form className="form-card" onSubmit={handleCreateVendedor}>
                    <h3>Nuevo Vendedor</h3>
                    <input placeholder="Nombre" value={vendForm.nombre} onChange={e => setVendForm({ ...vendForm, nombre: e.target.value })} required />
                    <input placeholder="Teléfono (opcional)" value={vendForm.telefono} onChange={e => setVendForm({ ...vendForm, telefono: e.target.value })} />
                    <button type="submit" className="btn-primary">Guardar</button>
                </form>
            )}

            {showForm && tab === 'rutas' && (
                <form className="form-card" onSubmit={handleCreateRuta}>
                    <h3>Nueva Ruta</h3>
                    <input placeholder="Nombre" value={rutaForm.nombre} onChange={e => setRutaForm({ ...rutaForm, nombre: e.target.value })} required />
                    <input placeholder="Descripción (opcional)" value={rutaForm.descripcion} onChange={e => setRutaForm({ ...rutaForm, descripcion: e.target.value })} />
                    <select value={rutaForm.vendedorId} onChange={e => setRutaForm({ ...rutaForm, vendedorId: e.target.value })} required>
                        <option value="">Seleccionar vendedor</option>
                        {vendedores.map(v => <option key={v.id} value={v.id}>{v.nombre}</option>)}
                    </select>
                    <button type="submit" className="btn-primary">Guardar</button>
                </form>
            )}

            {loading ? (
                <div className="loading">Cargando...</div>
            ) : tab === 'vendedores' ? (
                <table className="data-table">
                    <thead>
                        <tr><th>ID</th><th>Nombre</th><th>Teléfono</th><th>Estado</th></tr>
                    </thead>
                    <tbody>
                        {vendedores.length === 0 ? (
                            <tr><td colSpan={4} className="empty">Sin vendedores registrados</td></tr>
                        ) : vendedores.map(v => (
                            <tr key={v.id}>
                                <td>{v.id}</td>
                                <td>{v.nombre}</td>
                                <td>{v.telefono || '—'}</td>
                                <td>
                                    <span className={`badge ${v.activo ? 'badge-active' : 'badge-inactive'}`}>
                                        {v.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Vendedor</th></tr>
                    </thead>
                    <tbody>
                        {rutas.length === 0 ? (
                            <tr><td colSpan={4} className="empty">Sin rutas registradas</td></tr>
                        ) : rutas.map(r => (
                            <tr key={r.id}>
                                <td>{r.id}</td>
                                <td>{r.nombre}</td>
                                <td>{r.descripcion || '—'}</td>
                                <td>{r.vendedor?.nombre || r.vendedorId}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
