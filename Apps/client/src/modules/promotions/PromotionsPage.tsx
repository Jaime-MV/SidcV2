import { useEffect, useState } from 'react';
import { promotionsService } from './promotions.service';
import type { Promocion } from './promotions.service';

export default function PromotionsPage() {
    const [promos, setPromos] = useState<Promocion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        nombre: '', descripcion: '', fechaInicio: '', fechaFin: '', porcentajeDesc: '', productoIds: '',
    });

    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await promotionsService.getAll();
            setPromos(Array.isArray(data) ? data : []);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error al cargar promociones');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const ids = form.productoIds.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
            await promotionsService.create({
                nombre: form.nombre,
                descripcion: form.descripcion || undefined,
                fechaInicio: form.fechaInicio,
                fechaFin: form.fechaFin,
                porcentajeDesc: parseFloat(form.porcentajeDesc),
                productoIds: ids,
            });
            setForm({ nombre: '', descripcion: '', fechaInicio: '', fechaFin: '', porcentajeDesc: '', productoIds: '' });
            setShowForm(false);
            load();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error al crear promoción');
        }
    };

    const handleToggle = async (id: number) => {
        try {
            await promotionsService.toggle(id);
            load();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error al cambiar estado');
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Promociones</h1>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? '✕ Cerrar' : '+ Nueva'}
                </button>
            </div>

            {error && <div className="error-msg">{error}</div>}

            {showForm && (
                <form className="form-card" onSubmit={handleCreate}>
                    <h3>Nueva Promoción</h3>
                    <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
                    <input placeholder="Descripción (opcional)" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
                    <label className="form-label">Fecha inicio</label>
                    <input type="date" value={form.fechaInicio} onChange={e => setForm({ ...form, fechaInicio: e.target.value })} required />
                    <label className="form-label">Fecha fin</label>
                    <input type="date" value={form.fechaFin} onChange={e => setForm({ ...form, fechaFin: e.target.value })} required />
                    <input placeholder="% Descuento" type="number" step="0.01" value={form.porcentajeDesc} onChange={e => setForm({ ...form, porcentajeDesc: e.target.value })} required />
                    <input placeholder="IDs de productos (ej: 1,2,3)" value={form.productoIds} onChange={e => setForm({ ...form, productoIds: e.target.value })} required />
                    <button type="submit" className="btn-primary">Guardar</button>
                </form>
            )}

            {loading ? (
                <div className="loading">Cargando...</div>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr><th>ID</th><th>Nombre</th><th>Descuento</th><th>Inicio</th><th>Fin</th><th>Estado</th><th>Acción</th></tr>
                    </thead>
                    <tbody>
                        {promos.length === 0 ? (
                            <tr><td colSpan={7} className="empty">Sin promociones registradas</td></tr>
                        ) : promos.map(p => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.nombre}</td>
                                <td>{p.porcentajeDesc}%</td>
                                <td>{new Date(p.fechaInicio).toLocaleDateString()}</td>
                                <td>{new Date(p.fechaFin).toLocaleDateString()}</td>
                                <td>
                                    <span className={`badge ${p.activa ? 'badge-active' : 'badge-inactive'}`}>
                                        {p.activa ? 'Activa' : 'Inactiva'}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-small" onClick={() => handleToggle(p.id)}>
                                        {p.activa ? 'Desactivar' : 'Activar'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
