import { useEffect, useState } from 'react';
import { clientsService } from './clients.service';
import type { Cliente } from './clients.service';

export default function ClientsPage() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        nombre: '', identificacion: '', direccion: '', telefono: '', email: '', limiteCredito: '', diasCredito: '',
    });

    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await clientsService.getAll();
            setClientes(Array.isArray(res) ? res : 'items' in res ? res.items : []);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error al cargar clientes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await clientsService.create({
                nombre: form.nombre,
                identificacion: form.identificacion,
                direccion: form.direccion,
                telefono: form.telefono || undefined,
                email: form.email || undefined,
                limiteCredito: form.limiteCredito ? parseFloat(form.limiteCredito) : 0,
                diasCredito: form.diasCredito ? parseInt(form.diasCredito) : 0,
                tipo: 'TIENDA',
                estado: 'ACTIVO',
            });
            setForm({ nombre: '', identificacion: '', direccion: '', telefono: '', email: '', limiteCredito: '', diasCredito: '' });
            setShowForm(false);
            load();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error al crear cliente');
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Clientes</h1>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? '✕ Cerrar' : '+ Nuevo'}
                </button>
            </div>

            {error && <div className="error-msg">{error}</div>}

            {showForm && (
                <form className="form-card" onSubmit={handleCreate}>
                    <h3>Nuevo Cliente</h3>
                    <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
                    <input placeholder="Identificación" value={form.identificacion} onChange={e => setForm({ ...form, identificacion: e.target.value })} required />
                    <input placeholder="Dirección" value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} required />
                    <input placeholder="Teléfono (opcional)" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
                    <input placeholder="Email (opcional)" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    <input placeholder="Límite de crédito (opcional)" type="number" step="0.01" value={form.limiteCredito} onChange={e => setForm({ ...form, limiteCredito: e.target.value })} />
                    <input placeholder="Días de crédito (opcional)" type="number" value={form.diasCredito} onChange={e => setForm({ ...form, diasCredito: e.target.value })} />
                    <button type="submit" className="btn-primary">Guardar</button>
                </form>
            )}

            {loading ? (
                <div className="loading">Cargando...</div>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr><th>ID</th><th>Nombre</th><th>Identificación</th><th>Dirección</th><th>Teléfono</th><th>Email</th></tr>
                    </thead>
                    <tbody>
                        {clientes.length === 0 ? (
                            <tr><td colSpan={6} className="empty">Sin clientes registrados</td></tr>
                        ) : clientes.map(c => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.nombre}</td>
                                <td>{c.identificacion}</td>
                                <td>{c.direccion}</td>
                                <td>{c.telefono || '—'}</td>
                                <td>{c.email || '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
