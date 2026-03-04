import { useEffect, useState } from 'react';
import { inventoryService } from './inventory.service';
import type { Categoria, Producto } from './inventory.service';

export default function InventoryPage() {
    const [tab, setTab] = useState<'categorias' | 'productos'>('categorias');
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form states
    const [catForm, setCatForm] = useState({ nombre: '', descripcion: '' });
    const [prodForm, setProdForm] = useState({ nombre: '', descripcion: '', codigoBarras: '', precioBase: '', categoriaId: '' });
    const [showForm, setShowForm] = useState(false);

    const loadCategorias = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await inventoryService.getCategorias();
            setCategorias(Array.isArray(data) ? data : []);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error al cargar categorías');
        } finally {
            setLoading(false);
        }
    };

    const loadProductos = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await inventoryService.getProductos();
            setProductos(Array.isArray(res) ? res : Array.isArray(res.data) ? res.data : []);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error al cargar productos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tab === 'categorias') loadCategorias();
        else loadProductos();
    }, [tab]);

    const handleCreateCategoria = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await inventoryService.createCategoria({ nombre: catForm.nombre, descripcion: catForm.descripcion || undefined });
            setCatForm({ nombre: '', descripcion: '' });
            setShowForm(false);
            loadCategorias();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error al crear categoría');
        }
    };

    const handleCreateProducto = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await inventoryService.createProducto({
                nombre: prodForm.nombre,
                descripcion: prodForm.descripcion || undefined,
                codigoBarras: prodForm.codigoBarras || undefined,
                precioBase: parseFloat(prodForm.precioBase),
                categoriaId: parseInt(prodForm.categoriaId),
            });
            setProdForm({ nombre: '', descripcion: '', codigoBarras: '', precioBase: '', categoriaId: '' });
            setShowForm(false);
            loadProductos();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error al crear producto');
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Inventario</h1>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? '✕ Cerrar' : '+ Nuevo'}
                </button>
            </div>

            <div className="tabs">
                <button className={`tab ${tab === 'categorias' ? 'active' : ''}`} onClick={() => { setTab('categorias'); setShowForm(false); }}>
                    Categorías
                </button>
                <button className={`tab ${tab === 'productos' ? 'active' : ''}`} onClick={() => { setTab('productos'); setShowForm(false); }}>
                    Productos
                </button>
            </div>

            {error && <div className="error-msg">{error}</div>}

            {showForm && tab === 'categorias' && (
                <form className="form-card" onSubmit={handleCreateCategoria}>
                    <h3>Nueva Categoría</h3>
                    <input placeholder="Nombre" value={catForm.nombre} onChange={e => setCatForm({ ...catForm, nombre: e.target.value })} required />
                    <input placeholder="Descripción (opcional)" value={catForm.descripcion} onChange={e => setCatForm({ ...catForm, descripcion: e.target.value })} />
                    <button type="submit" className="btn-primary">Guardar</button>
                </form>
            )}

            {showForm && tab === 'productos' && (
                <form className="form-card" onSubmit={handleCreateProducto}>
                    <h3>Nuevo Producto</h3>
                    <input placeholder="Nombre" value={prodForm.nombre} onChange={e => setProdForm({ ...prodForm, nombre: e.target.value })} required />
                    <input placeholder="Descripción (opcional)" value={prodForm.descripcion} onChange={e => setProdForm({ ...prodForm, descripcion: e.target.value })} />
                    <input placeholder="Código de barras (opcional)" value={prodForm.codigoBarras} onChange={e => setProdForm({ ...prodForm, codigoBarras: e.target.value })} />
                    <input placeholder="Precio base" type="number" step="0.01" value={prodForm.precioBase} onChange={e => setProdForm({ ...prodForm, precioBase: e.target.value })} required />
                    <select value={prodForm.categoriaId} onChange={e => setProdForm({ ...prodForm, categoriaId: e.target.value })} required>
                        <option value="">Seleccionar categoría</option>
                        {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                    <button type="submit" className="btn-primary">Guardar</button>
                </form>
            )}

            {loading ? (
                <div className="loading">Cargando...</div>
            ) : tab === 'categorias' ? (
                <table className="data-table">
                    <thead>
                        <tr><th>ID</th><th>Nombre</th><th>Descripción</th></tr>
                    </thead>
                    <tbody>
                        {categorias.length === 0 ? (
                            <tr><td colSpan={3} className="empty">Sin categorías registradas</td></tr>
                        ) : categorias.map(c => (
                            <tr key={c.id}><td>{c.id}</td><td>{c.nombre}</td><td>{c.descripcion || '—'}</td></tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Categoría</th></tr>
                    </thead>
                    <tbody>
                        {productos.length === 0 ? (
                            <tr><td colSpan={4} className="empty">Sin productos registrados</td></tr>
                        ) : productos.map(p => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.nombre}</td>
                                <td>L {p.precioBase?.toFixed(2)}</td>
                                <td>{p.categoria?.nombre || p.categoriaId}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
