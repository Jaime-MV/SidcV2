import { useEffect, useState } from 'react';
import { salesService } from './sales.service';
import type { Venta } from './sales.service';

export default function SalesPage() {
    const [ventas, setVentas] = useState<Venta[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ clienteId: '', vendedorId: '', productoId: '', cantidad: '' });
    const [detalles, setDetalles] = useState<{ productoId: number; cantidad: number }[]>([]);

    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await salesService.getAll();
            setVentas(Array.isArray(res) ? res : Array.isArray(res.data) ? res.data : []);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error al cargar ventas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const addDetalle = () => {
        if (!form.productoId || !form.cantidad) return;
        setDetalles([...detalles, { productoId: parseInt(form.productoId), cantidad: parseInt(form.cantidad) }]);
        setForm({ ...form, productoId: '', cantidad: '' });
    };

    const removeDetalle = (idx: number) => {
        setDetalles(detalles.filter((_, i) => i !== idx));
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (detalles.length === 0) { setError('Agrega al menos un detalle'); return; }
        try {
            await salesService.create({
                clienteId: parseInt(form.clienteId),
                vendedorId: parseInt(form.vendedorId),
                detalles,
            });
            setForm({ clienteId: '', vendedorId: '', productoId: '', cantidad: '' });
            setDetalles([]);
            setShowForm(false);
            load();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error al crear venta');
        }
    };

    const estadoColor = (estado: string) => {
        const map: Record<string, string> = { Creada: '#3b82f6', Pagada: '#10b981', Enviada: '#8b5cf6', Cancelada: '#ef4444' };
        return map[estado] || '#6b7280';
    };

    return (
        <div>
            <div className="page-header">
                <h1>Ventas</h1>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? '✕ Cerrar' : '+ Nueva Venta'}
                </button>
            </div>

            {error && <div className="error-msg">{error}</div>}

            {showForm && (
                <form className="form-card" onSubmit={handleCreate}>
                    <h3>Nueva Venta</h3>
                    <input placeholder="ID del Cliente" type="number" value={form.clienteId} onChange={e => setForm({ ...form, clienteId: e.target.value })} required />
                    <input placeholder="ID del Vendedor" type="number" value={form.vendedorId} onChange={e => setForm({ ...form, vendedorId: e.target.value })} required />

                    <div className="detalle-row">
                        <input placeholder="ID Producto" type="number" value={form.productoId} onChange={e => setForm({ ...form, productoId: e.target.value })} />
                        <input placeholder="Cantidad" type="number" value={form.cantidad} onChange={e => setForm({ ...form, cantidad: e.target.value })} />
                        <button type="button" className="btn-secondary" onClick={addDetalle}>+ Agregar</button>
                    </div>

                    {detalles.length > 0 && (
                        <ul className="detalle-list">
                            {detalles.map((d, i) => (
                                <li key={i}>
                                    Producto #{d.productoId} × {d.cantidad}
                                    <button type="button" className="btn-remove" onClick={() => removeDetalle(i)}>✕</button>
                                </li>
                            ))}
                        </ul>
                    )}

                    <button type="submit" className="btn-primary">Registrar Venta</button>
                </form>
            )}

            {loading ? (
                <div className="loading">Cargando...</div>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr><th>ID</th><th>Cliente</th><th>Vendedor</th><th>Total</th><th>Estado</th><th>Fecha</th></tr>
                    </thead>
                    <tbody>
                        {ventas.length === 0 ? (
                            <tr><td colSpan={6} className="empty">Sin ventas registradas</td></tr>
                        ) : ventas.map(v => (
                            <tr key={v.id}>
                                <td>{v.id}</td>
                                <td>{v.cliente?.nombre || v.clienteId}</td>
                                <td>{v.vendedor?.nombre || v.vendedorId}</td>
                                <td>L {v.total?.toFixed(2)}</td>
                                <td><span className="badge" style={{ background: estadoColor(v.estado) }}>{v.estado}</span></td>
                                <td>{v.fecha ? new Date(v.fecha).toLocaleDateString() : '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
