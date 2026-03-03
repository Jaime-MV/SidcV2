import { useState, useEffect, useCallback } from 'react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const API = 'http://localhost:3000/api'


async function apiFetch(path: string) {
  const res = await fetch(`${API}${path}`)
  return res.json()
}

// ── Helper Components ──────────────────────────────────────────────
function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return <span className={`badge ${color}`}>{children}</span>
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    FACTURADA: 'green', PAGADA: 'green', APROBADA: 'green', ACTIVO: 'green',
    PENDIENTE: 'amber', CREDITO: 'blue', CONTADO: 'violet',
    ANULADA: 'rose', RECHAZADA: 'rose', INACTIVO: 'gray',
  }
  return <Badge color={map[status] || 'gray'}>{status}</Badge>
}

function Loading() {
  return (
    <div className="loading-state">
      <div className="spinner" />
      Cargando datos...
    </div>
  )
}

function ProgressBar({ value, max, color = '#3b82f6' }: { value: number; max: number; color?: string }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

// ── Dashboard KPI Page ──────────────────────────────────────────────
function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [topProductos, setTopProductos] = useState<any[]>([])
  const [ventasVendedor, setVentasVendedor] = useState<any[]>([])
  const [cuentasCobrar, setCuentasCobrar] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const [dash, top, vv, cc] = await Promise.all([
      apiFetch('/reportes/dashboard'),
      apiFetch('/reportes/productos-mas-vendidos?limite=5'),
      apiFetch('/reportes/ventas-por-vendedor'),
      apiFetch('/reportes/cuentas-por-cobrar'),
    ])
    setData(dash); setTopProductos(top); setVentasVendedor(vv); setCuentasCobrar(cc)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return <Loading />
  if (!data) return null

  const maxMonto = Math.max(...(ventasVendedor.map((v: any) => v.totalMonto) || [1]))

  return (
    <div>
      <div className="page-header">
        <h1>📊 Dashboard SIDC</h1>
        <p>Vista general del Sistema Integral de Distribución Comercial</p>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card blue">
          <div className="kpi-icon">🛒</div>
          <div className="kpi-value">{data.ventas?.total}</div>
          <div className="kpi-label">Total Ventas</div>
          <div className="stats-row">
            <span className="stat-up">✓ {data.ventas?.facturadas} facturadas</span>
            <span className="stat-neutral"> · {data.ventas?.pendientes} pendientes</span>
          </div>
        </div>
        <div className="kpi-card emerald">
          <div className="kpi-icon">💰</div>
          <div className="kpi-value">${data.financiero?.montoTotalVentas?.toFixed(0)}</div>
          <div className="kpi-label">Monto Total Ventas</div>
          <div className="stats-row">
            <span className="stat-up">Cobrado: ${data.financiero?.totalCobrado}</span>
          </div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-icon">⏳</div>
          <div className="kpi-value">${data.financiero?.pendienteCobro?.toFixed(0)}</div>
          <div className="kpi-label">Pendiente de Cobro</div>
        </div>
        <div className="kpi-card violet">
          <div className="kpi-icon">👥</div>
          <div className="kpi-value">{data.clientes?.total}</div>
          <div className="kpi-label">Clientes Activos</div>
          <div className="stats-row">
            <span className="stat-neutral">{data.clientes?.credito} crédito · {data.clientes?.contado} contado</span>
          </div>
        </div>
        <div className="kpi-card rose">
          <div className="kpi-icon">↩️</div>
          <div className="kpi-value">${data.financiero?.totalDevuelto}</div>
          <div className="kpi-label">Total Devoluciones</div>
        </div>
      </div>

      {/* Charts */}
      <div className="section-grid cols-2" style={{ marginBottom: 20 }}>
        {/* Top Productos */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">🏆 Productos más vendidos</span>
            <span className="panel-badge">{topProductos.length} productos</span>
          </div>
          <div className="panel-body">
            <div className="bar-chart">
              {topProductos.map((p: any, i: number) => {
                const max = topProductos[0]?.totalCantidad || 1
                return (
                  <div key={i} className="bar-item">
                    <div className="bar-label">{p.producto?.nombre || 'N/A'}</div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${(p.totalCantidad / max) * 100}%` }} />
                    </div>
                    <div className="bar-value">{p.totalCantidad} ud.</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Ventas por Vendedor */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">👔 Ventas por Vendedor</span>
          </div>
          <div className="panel-body">
            <div className="bar-chart">
              {ventasVendedor.map((v: any, i: number) => (
                <div key={i} className="bar-item">
                  <div className="bar-label">{v.vendedor?.nombre}</div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(v.totalMonto / maxMonto) * 100}%`, background: 'linear-gradient(90deg, #10b981, #06b6d4)' }} />
                  </div>
                  <div className="bar-value">${v.totalMonto}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cuentas por Cobrar */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">💳 Cuentas por Cobrar</span>
          <span className="panel-badge">{cuentasCobrar.length} clientes</span>
        </div>
        <div className="panel-body">
          <div className="credit-widget">
            {cuentasCobrar.map((c: any, i: number) => (
              <div key={i} className="credit-row">
                <div className="credit-row-header">
                  <span className="credit-name">{c.cliente?.nombre}</span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <StatusBadge status={c.riesgo === 'ALTO' ? 'ANULADA' : c.riesgo === 'MEDIO' ? 'PENDIENTE' : 'APROBADA'} />
                    <span className="credit-amount">${c.saldoPendiente} / ${c.cliente?.limiteCredito}</span>
                  </div>
                </div>
                <ProgressBar
                  value={c.saldoPendiente}
                  max={c.cliente?.limiteCredito}
                  color={c.riesgo === 'ALTO' ? '#f43f5e' : c.riesgo === 'MEDIO' ? '#f59e0b' : '#10b981'}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Generic CRUD Table Page ──────────────────────────────────────────────
function TablePage({ title, icon, endpoint, columns }: {
  title: string;
  icon: string;
  endpoint: string;
  columns: { key: string; label: string; render?: (val: any, row: any) => React.ReactNode }[]
}) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const result = await apiFetch(endpoint)
    setData(Array.isArray(result) ? result : [])
    setLoading(false)
  }, [endpoint])

  useEffect(() => { load() }, [load])

  const filtered = data.filter(row =>
    Object.values(row).some(v =>
      String(v).toLowerCase().includes(filter.toLowerCase())
    )
  )

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>{icon} {title}</h1>
          <p>Gestión de {title.toLowerCase()} — {data.length} registros encontrados</p>
        </div>
        <button className="refresh-btn" onClick={load}>↻ Actualizar</button>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">{icon} {title}</span>
          <span className="panel-badge">{filtered.length} resultados</span>
        </div>
        <div className="panel-body" style={{ paddingBottom: 0 }}>
          <div className="search-bar">
            <span>🔍</span>
            <input
              placeholder={`Buscar en ${title.toLowerCase()}...`}
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />
          </div>
        </div>
        {loading ? <Loading /> : (
          filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No hay datos disponibles</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    {columns.map(col => <th key={col.key}>{col.label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, i) => (
                    <tr key={i}>
                      {columns.map(col => (
                        <td key={col.key}>
                          {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '—')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  )
}

// ── Endpoints Explorer Page ──────────────────────────────────────────────
interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  desc: string;
  module: string;
}

const ALL_ENDPOINTS: Endpoint[] = [
  // CATEGORIAS
  { method: 'GET', path: '/api/categorias', desc: 'Listar todas las categorías', module: 'Categorías' },
  { method: 'GET', path: '/api/categorias/:id', desc: 'Obtener categoría por ID', module: 'Categorías' },
  { method: 'POST', path: '/api/categorias', desc: 'Crear nueva categoría', module: 'Categorías' },
  { method: 'PUT', path: '/api/categorias/:id', desc: 'Actualizar categoría', module: 'Categorías' },
  { method: 'DELETE', path: '/api/categorias/:id', desc: 'Desactivar categoría', module: 'Categorías' },
  // PRODUCTOS
  { method: 'GET', path: '/api/productos', desc: 'Listar productos (con filtros)', module: 'Productos' },
  { method: 'GET', path: '/api/productos/:id', desc: 'Producto con lotes', module: 'Productos' },
  { method: 'GET', path: '/api/productos/bajo-stock', desc: 'Productos con bajo stock', module: 'Productos' },
  { method: 'GET', path: '/api/productos/proximos-vencer', desc: 'Lotes próximos a vencer', module: 'Productos' },
  { method: 'POST', path: '/api/productos', desc: 'Crear producto', module: 'Productos' },
  { method: 'PUT', path: '/api/productos/:id', desc: 'Actualizar producto', module: 'Productos' },
  { method: 'DELETE', path: '/api/productos/:id', desc: 'Desactivar producto', module: 'Productos' },
  // LOTES
  { method: 'GET', path: '/api/lotes', desc: 'Listar lotes de inventario', module: 'Inventario' },
  { method: 'GET', path: '/api/lotes/:id', desc: 'Obtener lote por ID', module: 'Inventario' },
  { method: 'POST', path: '/api/lotes', desc: 'Registrar nuevo lote', module: 'Inventario' },
  { method: 'PUT', path: '/api/lotes/:id', desc: 'Actualizar lote', module: 'Inventario' },
  // CLIENTES
  { method: 'GET', path: '/api/clientes', desc: 'Listar clientes', module: 'Clientes' },
  { method: 'GET', path: '/api/clientes/:id', desc: 'Obtener cliente por ID', module: 'Clientes' },
  { method: 'GET', path: '/api/clientes/con-credito-disponible', desc: 'Clientes con crédito disponible', module: 'Clientes' },
  { method: 'POST', path: '/api/clientes', desc: 'Crear cliente', module: 'Clientes' },
  { method: 'PUT', path: '/api/clientes/:id', desc: 'Actualizar cliente', module: 'Clientes' },
  { method: 'DELETE', path: '/api/clientes/:id', desc: 'Desactivar cliente', module: 'Clientes' },
  // VENDEDORES
  { method: 'GET', path: '/api/vendedores', desc: 'Listar vendedores', module: 'Vendedores' },
  { method: 'GET', path: '/api/vendedores/:id', desc: 'Obtener vendedor', module: 'Vendedores' },
  { method: 'GET', path: '/api/vendedores/:id/rutas', desc: 'Rutas de un vendedor', module: 'Vendedores' },
  { method: 'POST', path: '/api/vendedores', desc: 'Crear vendedor', module: 'Vendedores' },
  { method: 'PUT', path: '/api/vendedores/:id', desc: 'Actualizar vendedor', module: 'Vendedores' },
  { method: 'DELETE', path: '/api/vendedores/:id', desc: 'Desactivar vendedor', module: 'Vendedores' },
  // RUTAS
  { method: 'GET', path: '/api/rutas', desc: 'Listar rutas de reparto', module: 'Rutas' },
  { method: 'GET', path: '/api/rutas/:id', desc: 'Obtener ruta con clientes', module: 'Rutas' },
  { method: 'POST', path: '/api/rutas', desc: 'Crear ruta', module: 'Rutas' },
  { method: 'PUT', path: '/api/rutas/:id', desc: 'Actualizar ruta', module: 'Rutas' },
  { method: 'DELETE', path: '/api/rutas/:id', desc: 'Eliminar ruta', module: 'Rutas' },
  // PROMOCIONES
  { method: 'GET', path: '/api/promociones', desc: 'Listar promociones', module: 'Promociones' },
  { method: 'GET', path: '/api/promociones/vigentes', desc: 'Promociones vigentes hoy', module: 'Promociones' },
  { method: 'GET', path: '/api/promociones/:id', desc: 'Obtener promoción', module: 'Promociones' },
  { method: 'POST', path: '/api/promociones', desc: 'Crear promoción', module: 'Promociones' },
  { method: 'PUT', path: '/api/promociones/:id', desc: 'Actualizar promoción', module: 'Promociones' },
  { method: 'DELETE', path: '/api/promociones/:id', desc: 'Desactivar promoción', module: 'Promociones' },
  // VENTAS
  { method: 'GET', path: '/api/ventas', desc: 'Listar ventas', module: 'Ventas' },
  { method: 'GET', path: '/api/ventas/:id', desc: 'Obtener venta con detalles', module: 'Ventas' },
  { method: 'POST', path: '/api/ventas', desc: 'Crear venta (valida inventario/crédito)', module: 'Ventas' },
  { method: 'PUT', path: '/api/ventas/:id/facturar', desc: 'Generar factura de venta', module: 'Ventas' },
  { method: 'PUT', path: '/api/ventas/:id/anular', desc: 'Anular venta', module: 'Ventas' },
  // FACTURAS
  { method: 'GET', path: '/api/facturas', desc: 'Listar facturas', module: 'Facturas' },
  { method: 'GET', path: '/api/facturas/:id', desc: 'Obtener factura con cliente', module: 'Facturas' },
  { method: 'GET', path: '/api/facturas/pendientes', desc: 'Facturas pendientes de cobro', module: 'Facturas' },
  // COBROS
  { method: 'GET', path: '/api/cobros', desc: 'Listar cobros realizados', module: 'Cobros' },
  { method: 'GET', path: '/api/cobros/:id', desc: 'Obtener cobro por ID', module: 'Cobros' },
  { method: 'GET', path: '/api/cobros/resumen', desc: 'Resumen de cobros por método', module: 'Cobros' },
  { method: 'POST', path: '/api/cobros', desc: 'Registrar cobro', module: 'Cobros' },
  // DEVOLUCIONES
  { method: 'GET', path: '/api/devoluciones', desc: 'Listar devoluciones', module: 'Devoluciones' },
  { method: 'GET', path: '/api/devoluciones/:id', desc: 'Obtener devolución', module: 'Devoluciones' },
  { method: 'GET', path: '/api/devoluciones/pendientes', desc: 'Devoluciones pendientes', module: 'Devoluciones' },
  { method: 'POST', path: '/api/devoluciones', desc: 'Registrar devolución', module: 'Devoluciones' },
  { method: 'PUT', path: '/api/devoluciones/:id/aprobar', desc: 'Aprobar devolución', module: 'Devoluciones' },
  { method: 'PUT', path: '/api/devoluciones/:id/rechazar', desc: 'Rechazar devolución', module: 'Devoluciones' },
  // REPORTES
  { method: 'GET', path: '/api/reportes/dashboard', desc: 'KPIs del dashboard', module: 'Reportes' },
  { method: 'GET', path: '/api/reportes/productos-mas-vendidos', desc: 'Top productos vendidos', module: 'Reportes' },
  { method: 'GET', path: '/api/reportes/ventas-por-vendedor', desc: 'Ventas agrupadas por vendedor', module: 'Reportes' },
  { method: 'GET', path: '/api/reportes/ventas-por-cliente', desc: 'Ventas agrupadas por cliente', module: 'Reportes' },
  { method: 'GET', path: '/api/reportes/inventario-resumen', desc: 'Resumen de inventario por bodega', module: 'Reportes' },
  { method: 'GET', path: '/api/reportes/cuentas-por-cobrar', desc: 'Cuentas por cobrar con riesgo', module: 'Reportes' },
]

function EndpointsPage() {
  const [activeModule, setActiveModule] = useState('Todos')
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null)

  const modules = ['Todos', ...Array.from(new Set(ALL_ENDPOINTS.map(e => e.module)))]

  const filtered = activeModule === 'Todos'
    ? ALL_ENDPOINTS
    : ALL_ENDPOINTS.filter(e => e.module === activeModule)

  async function testEndpoint(ep: Endpoint) {
    if (ep.path.includes(':id') || ep.method !== 'GET') return
    setActiveEndpoint(ep.path)
    setLoading(true)
    setResponse(null)
    try {
      const res = await fetch(`http://localhost:3000${ep.path}`)
      const data = await res.json()
      setResponse(data)
    } catch (e) {
      setResponse({ error: 'API no disponible. Asegúrate de que el servidor esté corriendo.' })
    }
    setLoading(false)
  }

  return (
    <div>
      <div className="page-header">
        <h1>🔗 Explorador de Endpoints</h1>
        <p>{ALL_ENDPOINTS.length} endpoints disponibles en la API SIDC</p>
      </div>

      <div className="tab-bar">
        {modules.map(m => (
          <button key={m} className={`tab-btn ${activeModule === m ? 'active' : ''}`} onClick={() => setActiveModule(m)}>
            {m} {activeModule === m && `(${filtered.length})`}
          </button>
        ))}
      </div>

      <div className="section-grid cols-2">
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">📋 Endpoints</span>
            <span className="panel-badge">{filtered.length}</span>
          </div>
          <div className="panel-body">
            <div className="endpoint-list">
              {filtered.map((ep, i) => (
                <div
                  key={i}
                  className="endpoint-item"
                  onClick={() => ep.method === 'GET' && !ep.path.includes(':') && testEndpoint(ep)}
                  style={{ opacity: ep.method !== 'GET' || ep.path.includes(':') ? 0.6 : 1, cursor: ep.method === 'GET' && !ep.path.includes(':') ? 'pointer' : 'default' }}
                  title={ep.method === 'GET' && !ep.path.includes(':') ? 'Clic para probar' : 'Requiere parámetros'}
                >
                  <span className={`method-badge ${ep.method}`}>{ep.method}</span>
                  <span className="endpoint-path">{ep.path}</span>
                  <span className="endpoint-desc">{ep.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">💻 Respuesta API</span>
            {activeEndpoint && <span className="panel-badge">{activeEndpoint}</span>}
          </div>
          <div className="panel-body">
            {loading ? <Loading /> : response ? (
              <div className="api-response">
                {JSON.stringify(response, null, 2)}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🖱️</div>
                <p>Haz clic en un endpoint GET sin parámetros para probarlo</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Inventario Page ──────────────────────────────────────────────────
function InventarioPage() {
  const [lotes, setLotes] = useState<any[]>([])
  const [resumen, setResumen] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([apiFetch('/lotes'), apiFetch('/reportes/inventario-resumen')]).then(([l, r]) => {
      setLotes(Array.isArray(l) ? l : [])
      setResumen(r)
      setLoading(false)
    })
  }, [])

  const hoy = new Date()

  function vencimientoColor(fecha: string) {
    const fv = new Date(fecha)
    const dias = Math.floor((fv.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
    if (dias < 0) return 'rose'
    if (dias < 30) return 'amber'
    return 'green'
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="page-header">
        <h1>📦 Inventario</h1>
        <p>Control de lotes, bodegas y vencimientos</p>
      </div>

      {resumen && (
        <div className="kpi-grid" style={{ marginBottom: 24 }}>
          <div className="kpi-card blue">
            <div className="kpi-icon">📋</div>
            <div className="kpi-value">{resumen.totalLotes}</div>
            <div className="kpi-label">Total de Lotes</div>
          </div>
          <div className="kpi-card rose">
            <div className="kpi-icon">⚠️</div>
            <div className="kpi-value">{resumen.lotesVencidos}</div>
            <div className="kpi-label">Lotes Vencidos</div>
          </div>
          <div className="kpi-card amber">
            <div className="kpi-icon">⏰</div>
            <div className="kpi-value">{resumen.lotesPorVencer30Dias}</div>
            <div className="kpi-label">Por vencer (30 días)</div>
          </div>
          {resumen.porBodega && Object.entries(resumen.porBodega).map(([bodega, data]: any, i) => (
            <div key={i} className="kpi-card emerald">
              <div className="kpi-icon">🏭</div>
              <div className="kpi-value">{data.totalProductos.toLocaleString()}</div>
              <div className="kpi-label">{bodega}</div>
              <div className="stats-row"><span className="stat-neutral">{data.totalLotes} lotes</span></div>
            </div>
          ))}
        </div>
      )}

      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">📦 Lotes de Inventario</span>
          <span className="panel-badge">{lotes.length} lotes</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th><th>Número Lote</th><th>Producto ID</th><th>Cantidad</th><th>Vencimiento</th><th>Estado</th><th>Bodega</th>
              </tr>
            </thead>
            <tbody>
              {lotes.map((l: any) => (
                <tr key={l.id}>
                  <td style={{ color: '#64748b' }}>#{l.id}</td>
                  <td style={{ fontFamily: 'monospace', color: '#e2e8f0' }}>{l.numero}</td>
                  <td>Prod. #{l.productoId}</td>
                  <td style={{ fontWeight: 600 }}>{l.cantidad.toLocaleString()}</td>
                  <td>{l.fechaVencimiento}</td>
                  <td>
                    {(() => {
                      const color = vencimientoColor(l.fechaVencimiento)
                      const dias = Math.floor((new Date(l.fechaVencimiento).getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
                      const label = dias < 0 ? 'VENCIDO' : dias < 30 ? `${dias}d` : 'VIGENTE'
                      return <Badge color={color}>{label}</Badge>
                    })()}
                  </td>
                  <td><Badge color="blue">{l.bodega}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Ventas Page ──────────────────────────────────────────────────────
function VentasPage() {
  const [ventas, setVentas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/ventas').then(d => {
      setVentas(Array.isArray(d) ? d : [])
      setLoading(false)
    })
  }, [])

  const total = ventas.filter((v: any) => v.estado !== 'ANULADA').reduce((s: number, v: any) => s + v.total, 0)

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>🛒 Ventas</h1>
          <p>Registro y facturación de ventas</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#10b981' }}>${total.toFixed(2)}</div>
          <div style={{ fontSize: 11, color: '#475569' }}>Monto total de ventas activas</div>
        </div>
      </div>

      {loading ? <Loading /> : (
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">🛒 Historial de Ventas</span>
            <span className="panel-badge">{ventas.length} ventas</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th><th>Cliente</th><th>Vendedor</th><th>Fecha</th><th>Tipo</th><th>Total</th><th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((v: any) => (
                  <tr key={v.id}>
                    <td style={{ color: '#64748b' }}>#{v.id}</td>
                    <td style={{ color: '#e2e8f0', fontWeight: 500 }}>{v.cliente?.nombre || 'N/A'}</td>
                    <td style={{ color: '#94a3b8' }}>{v.vendedor?.nombre || 'N/A'}</td>
                    <td>{v.fecha}</td>
                    <td><StatusBadge status={v.tipo} /></td>
                    <td style={{ fontWeight: 700, color: '#f1f5f9' }}>${v.total?.toFixed(2)}</td>
                    <td><StatusBadge status={v.estado} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Reportes Page ──────────────────────────────────────────────────
function ReportesPage() {
  const [loading, setLoading] = useState(false)

  const generarReporteMaster = async () => {
    setLoading(true)
    try {
      const [dash, topP, vv, cpc, inv] = await Promise.all([
        apiFetch('/reportes/dashboard'),
        apiFetch('/reportes/productos-mas-vendidos?limite=10'),
        apiFetch('/reportes/ventas-por-vendedor'),
        apiFetch('/reportes/cuentas-por-cobrar'),
        apiFetch('/reportes/inventario-resumen')
      ])

      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()

      // --- Funciones Auxiliares para Diseño ---
      const drawHeader = (docInstance: typeof doc, title: string, subtitle: string) => {
        docInstance.setFillColor(15, 23, 42) // Slate 900
        docInstance.rect(0, 0, pageWidth, 35, 'F')
        docInstance.setTextColor(255, 255, 255)
        docInstance.setFontSize(24)
        docInstance.setFont("helvetica", "bold")
        docInstance.text("SIDC", 14, 22)

        docInstance.setFontSize(12)
        docInstance.setFont("helvetica", "normal")
        docInstance.text("Sistema Integral de Distribución Comercial", 40, 22)

        docInstance.setTextColor(148, 163, 184) // Slate 400
        docInstance.text(title, pageWidth - 14, 18, { align: 'right' })
        docInstance.setFontSize(9)
        docInstance.text(subtitle, pageWidth - 14, 25, { align: 'right' })
      }

      const drawFooter = (docInstance: typeof doc, pageNumber: number, totalPages: number) => {
        docInstance.setDrawColor(226, 232, 240) // Slate 200
        docInstance.setLineWidth(0.5)
        docInstance.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15)
        docInstance.setFontSize(9)
        docInstance.setTextColor(100, 116, 139) // Slate 500
        docInstance.setFont("helvetica", "normal")
        docInstance.text(`Generado: ${new Date().toLocaleString()}`, 14, pageHeight - 8)
        docInstance.text(`Página ${pageNumber} de ${totalPages}`, pageWidth - 14, pageHeight - 8, { align: 'right' })
      }

      // ==========================================
      // PÁGINA 1: RESUMEN Y FINANZAS
      // ==========================================
      drawHeader(doc, "REPORTE EJECUTIVO", "Indicadores y Finanzas")

      // Título de Sección
      doc.setFontSize(14)
      doc.setTextColor(30, 41, 59) // Slate 800
      doc.setFont("helvetica", "bold")
      doc.text("1. Resumen de Desempeño Financiero", 14, 50)

      // Cajas de KPIs (Boxes)
      const kpiY = 56
      const boxW = 56

      // KPI 1: Ventas
      doc.setFillColor(239, 246, 255) // Blue 50
      doc.setDrawColor(191, 219, 254) // Blue 200
      doc.setLineWidth(0.5)
      doc.roundedRect(14, kpiY, boxW, 26, 2, 2, 'FD')
      doc.setFontSize(10)
      doc.setTextColor(30, 64, 175) // Blue 800
      doc.text("Ventas Totales", 18, kpiY + 8)
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text(dash.ventas.total.toString(), 18, kpiY + 18)
      doc.setFontSize(8)
      doc.setFont("helvetica", "normal")
      doc.text(`${dash.ventas.facturadas} facturadas`, 18, kpiY + 23)

      // KPI 2: Ingresos
      doc.setFillColor(236, 253, 245) // Emerald 50
      doc.setDrawColor(167, 243, 208) // Emerald 200
      doc.roundedRect(14 + boxW + 7, kpiY, boxW, 26, 2, 2, 'FD')
      doc.setFontSize(10)
      doc.setTextColor(6, 95, 70) // Emerald 800
      doc.text("Monto de Ventas", 14 + boxW + 11, kpiY + 8)
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text(`$${dash.financiero.montoTotalVentas.toLocaleString()}`, 14 + boxW + 11, kpiY + 18)
      doc.setFontSize(8)
      doc.setFont("helvetica", "normal")
      doc.text(`Cobrado: $${dash.financiero.totalCobrado.toLocaleString()}`, 14 + boxW + 11, kpiY + 23)

      // KPI 3: Cuentas Pendientes
      doc.setFillColor(255, 251, 235) // Amber 50
      doc.setDrawColor(253, 230, 138) // Amber 200
      doc.roundedRect(14 + (boxW + 7) * 2, kpiY, boxW, 26, 2, 2, 'FD')
      doc.setFontSize(10)
      doc.setTextColor(146, 64, 14) // Amber 800
      doc.text("Cuentas Pendientes", 14 + (boxW + 7) * 2 + 4, kpiY + 8)
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text(`$${dash.financiero.pendienteCobro.toLocaleString()}`, 14 + (boxW + 7) * 2 + 4, kpiY + 18)
      doc.setFontSize(8)
      doc.setFont("helvetica", "normal")
      doc.text(`Devoluciones: $${dash.financiero.totalDevuelto.toLocaleString()}`, 14 + (boxW + 7) * 2 + 4, kpiY + 23)

      // --- Tabla: Ventas por Vendedor ---
      doc.setFontSize(14)
      doc.setTextColor(30, 41, 59)
      doc.setFont("helvetica", "bold")
      doc.text("2. Rendimiento Comercial por Vendedor", 14, kpiY + 45)

      autoTable(doc, {
        startY: kpiY + 50,
        head: [['Vendedor', 'Ventas Realizadas', 'Ingreso Generado']],
        body: vv.map((item: any) => [
          item.vendedor?.nombre || 'Desconocido',
          item.totalVentas.toString(),
          `$${item.totalMonto.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
        ]),
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold' },
        styles: { cellPadding: 6, fontSize: 10, textColor: [51, 65, 85] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
          1: { halign: 'center' },
          2: { halign: 'right', fontStyle: 'bold' }
        }
      })

      // --- Tabla: Resumen de Inventario ---
      doc.setFontSize(14)
      doc.setTextColor(30, 41, 59)
      doc.text("3. Estado General del Inventario", 14, (doc as any).lastAutoTable.finalY + 15)

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [['Métrica de Riesgo Operativo', 'Cantidad de Lotes']],
        body: [
          ['Total de Lotes Administrados', inv.totalLotes.toString()],
          ['Lotes Expirados (Pérdida Mermada)', inv.lotesVencidos.toString()],
          ['Lotes con Riesgo de Vencimiento (próximos 30 Días)', inv.lotesPorVencer30Dias.toString()]
        ],
        theme: 'grid',
        headStyles: { fillColor: [71, 85, 105], textColor: 255, fontStyle: 'bold' },
        styles: { cellPadding: 6, fontSize: 10, textColor: [51, 65, 85] },
        columnStyles: { 1: { halign: 'right', fontStyle: 'bold' } }
      })

      // ==========================================
      // PÁGINA 2: PRODUCTOS Y RIESGO
      // ==========================================
      doc.addPage()
      drawHeader(doc, "ANÁLISIS DE PRODUCTOS", "Top Ventas y Riesgo de Cobro")

      doc.setFontSize(14)
      doc.setTextColor(30, 41, 59)
      doc.setFont("helvetica", "bold")
      doc.text("4. Top 10 Productos con Mayor Nivel de Rotación", 14, 50)

      autoTable(doc, {
        startY: 55,
        head: [['Producto', 'Código SKU', 'Unidades Desplazadas', 'Ingreso Bruto']],
        body: topP.map((item: any) => [
          item.producto?.nombre || 'Desconocido',
          item.producto?.codigo || '-',
          item.totalCantidad.toString(),
          `$${item.totalMonto.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
        ]),
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' }, // Indigo
        styles: { cellPadding: 6, fontSize: 10, textColor: [51, 65, 85] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
          2: { halign: 'center' },
          3: { halign: 'right', fontStyle: 'bold', textColor: [16, 185, 129] } // Emerald
        }
      })

      doc.setFontSize(14)
      doc.setTextColor(30, 41, 59)
      doc.setFont("helvetica", "bold")
      doc.text("5. Alerta Monitorizada de Cuentas por Cobrar (Riesgo)", 14, (doc as any).lastAutoTable.finalY + 15)

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [['Cliente Comercial', 'Deuda Acumulada', 'Límite Otorgado', '% Uso', 'Prioridad']],
        body: cpc.map((item: any) => [
          item.cliente?.nombre || 'Desconocido',
          `$${item.saldoPendiente.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
          `$${item.cliente?.limiteCredito.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
          `${item.porcentajeLimite}%`,
          item.riesgo // ALTO, MEDIO, BAJO
        ]),
        theme: 'grid',
        headStyles: { fillColor: [225, 29, 72], textColor: 255, fontStyle: 'bold' }, // Rose
        styles: { cellPadding: 6, fontSize: 10, textColor: [51, 65, 85] },
        columnStyles: {
          1: { halign: 'right' },
          2: { halign: 'right' },
          3: { halign: 'center' },
          4: { halign: 'center', fontStyle: 'bold' }
        },
        didParseCell: function (data: any) {
          if (data.column.index === 4 && data.cell.section === 'body') {
            const val = data.cell.raw
            if (val === 'ALTO') {
              data.cell.styles.textColor = [220, 38, 38] // Red 600
            } else if (val === 'MEDIO') {
              data.cell.styles.textColor = [217, 119, 6] // Amber 600
            } else {
              data.cell.styles.textColor = [5, 150, 105] // Emerald 600
            }
          }
        }
      })

      // --- Numeración y Pie de Página Final ---
      const totalPages = (doc as any).internal.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        drawFooter(doc, i, totalPages)
      }

      // Guardar PDF final
      doc.save('SIDC_Analisis_Ejecutivo_Global.pdf')

    } catch (e) {
      console.error(e)
      alert("Hubo un error generando el reporte en PDF.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>📄 Analítica y Reportes PDF</h1>
        <p>Exportación de toda la inteligencia de negocios del sistema a un documento ejecutivo.</p>
      </div>

      <div className="section-grid cols-2">
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 40 }}>📑</div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Reporte Analítico Global (PDF)</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Genera instantáneamente un PDF con el análisis y extracción de: KPIs financieros, resumen operativo de inventario,
              top de productos de alto margen, rendimiento comercial de los vendedores e indicadores de riesgo de la cartera vencida.
            </p>
          </div>
          <button
            disabled={loading}
            onClick={generarReporteMaster}
            style={{
              marginTop: 'auto',
              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-violet))',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              fontSize: 14,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              opacity: loading ? 0.7 : 1,
              borderRadius: 'var(--radius)',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? <div className="spinner" style={{ width: 14, height: 14, margin: 0, borderTopColor: 'white', marginRight: 8 }} /> : <span style={{ fontSize: 18 }}>⬇️</span>}
            {loading ? ' Extrayendo datos y Generando PDF...' : ' Descargar Informe Completo'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Sidebar Nav Config ──────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', section: 'GENERAL' },
  { id: 'reportes', label: 'Reportes PDF', icon: '📄', section: 'GENERAL' },
  { id: 'endpoints', label: 'API Endpoints', icon: '🔗', section: 'GENERAL' },
  { id: 'ventas', label: 'Ventas', icon: '🛒', section: 'MÓDULOS' },
  { id: 'facturas', label: 'Facturas', icon: '🧾', section: 'MÓDULOS' },
  { id: 'cobros', label: 'Cobros', icon: '💰', section: 'MÓDULOS' },
  { id: 'devoluciones', label: 'Devoluciones', icon: '↩️', section: 'MÓDULOS' },
  { id: 'clientes', label: 'Clientes', icon: '👥', section: 'MAESTROS' },
  { id: 'productos', label: 'Productos', icon: '📦', section: 'MAESTROS' },
  { id: 'inventario', label: 'Inventario', icon: '🏭', section: 'MAESTROS' },
  { id: 'categorias', label: 'Categorías', icon: '🗂️', section: 'MAESTROS' },
  { id: 'vendedores', label: 'Vendedores', icon: '👔', section: 'MAESTROS' },
  { id: 'rutas', label: 'Rutas', icon: '🗺️', section: 'MAESTROS' },
  { id: 'promociones', label: 'Promociones', icon: '🎁', section: 'MAESTROS' },
]

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard General',
  reportes: 'Analítica y Reportes PDF',
  endpoints: 'Explorador de API',
  ventas: 'Gestión de Ventas',
  facturas: 'Facturación',
  cobros: 'Cobros',
  devoluciones: 'Devoluciones',
  clientes: 'Clientes',
  productos: 'Productos',
  inventario: 'Inventario',
  categorias: 'Categorías',
  vendedores: 'Vendedores',
  rutas: 'Rutas',
  promociones: 'Promociones',
}

// ── Main App ──────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState('dashboard')
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking')

  useEffect(() => {
    fetch('http://localhost:3000/api')
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'))
  }, [])

  function renderPage() {
    switch (page) {
      case 'dashboard': return <DashboardPage />
      case 'reportes': return <ReportesPage />
      case 'endpoints': return <EndpointsPage />
      case 'ventas': return <VentasPage />
      case 'inventario': return <InventarioPage />

      case 'categorias': return (
        <TablePage title="Categorías" icon="🗂️" endpoint="/categorias" columns={[
          { key: 'id', label: 'ID', render: v => <span style={{ color: '#64748b' }}>#{v}</span> },
          { key: 'nombre', label: 'Nombre', render: v => <strong style={{ color: '#f1f5f9' }}>{v}</strong> },
          { key: 'descripcion', label: 'Descripción' },
          { key: 'activa', label: 'Estado', render: v => <StatusBadge status={v ? 'ACTIVO' : 'INACTIVO'} /> },
        ]} />
      )

      case 'productos': return (
        <TablePage title="Productos" icon="📦" endpoint="/productos" columns={[
          { key: 'id', label: 'ID', render: v => <span style={{ color: '#64748b' }}>#{v}</span> },
          { key: 'codigo', label: 'Código', render: v => <span style={{ fontFamily: 'monospace', color: '#94a3b8' }}>{v}</span> },
          { key: 'nombre', label: 'Nombre', render: v => <strong style={{ color: '#f1f5f9' }}>{v}</strong> },
          { key: 'precio', label: 'Precio', render: v => <span style={{ color: '#10b981', fontWeight: 600 }}>${v}</span> },
          { key: 'unidad', label: 'Unidad' },
          { key: 'activo', label: 'Estado', render: v => <StatusBadge status={v ? 'ACTIVO' : 'INACTIVO'} /> },
        ]} />
      )

      case 'clientes': return (
        <TablePage title="Clientes" icon="👥" endpoint="/clientes" columns={[
          { key: 'id', label: 'ID', render: v => <span style={{ color: '#64748b' }}>#{v}</span> },
          { key: 'nombre', label: 'Nombre', render: v => <strong style={{ color: '#f1f5f9' }}>{v}</strong> },
          { key: 'tipo', label: 'Tipo', render: v => <StatusBadge status={v} /> },
          { key: 'telefono', label: 'Teléfono' },
          { key: 'limiteCredito', label: 'Límite Crédito', render: v => v > 0 ? <span style={{ color: '#3b82f6' }}>${v}</span> : '—' },
          { key: 'saldoCredito', label: 'Saldo Crédito', render: v => v > 0 ? <span style={{ color: '#f59e0b' }}>${v}</span> : '—' },
          { key: 'activo', label: 'Estado', render: v => <StatusBadge status={v ? 'ACTIVO' : 'INACTIVO'} /> },
        ]} />
      )

      case 'vendedores': return (
        <TablePage title="Vendedores" icon="👔" endpoint="/vendedores" columns={[
          { key: 'id', label: 'ID', render: v => <span style={{ color: '#64748b' }}>#{v}</span> },
          { key: 'codigo', label: 'Código', render: v => <span style={{ fontFamily: 'monospace', color: '#94a3b8' }}>{v}</span> },
          { key: 'nombre', label: 'Nombre', render: v => <strong style={{ color: '#f1f5f9' }}>{v}</strong> },
          { key: 'email', label: 'Email' },
          { key: 'telefono', label: 'Teléfono' },
          { key: 'activo', label: 'Estado', render: v => <StatusBadge status={v ? 'ACTIVO' : 'INACTIVO'} /> },
        ]} />
      )

      case 'rutas': return (
        <TablePage title="Rutas" icon="🗺️" endpoint="/rutas" columns={[
          { key: 'id', label: 'ID', render: v => <span style={{ color: '#64748b' }}>#{v}</span> },
          { key: 'nombre', label: 'Nombre', render: v => <strong style={{ color: '#f1f5f9' }}>{v}</strong> },
          { key: 'zona', label: 'Zona' },
          { key: 'vendedor', label: 'Vendedor', render: v => v?.nombre || '—' },
          { key: 'dias', label: 'Días', render: v => Array.isArray(v) ? v.join(', ') : v },
          { key: 'clientes', label: 'Clientes', render: v => Array.isArray(v) ? <Badge color="blue">{v.length} clientes</Badge> : '—' },
        ]} />
      )

      case 'promociones': return (
        <TablePage title="Promociones" icon="🎁" endpoint="/promociones" columns={[
          { key: 'id', label: 'ID', render: v => <span style={{ color: '#64748b' }}>#{v}</span> },
          { key: 'nombre', label: 'Nombre', render: v => <strong style={{ color: '#f1f5f9' }}>{v}</strong> },
          { key: 'tipo', label: 'Tipo', render: v => <Badge color="violet">{v}</Badge> },
          { key: 'valor', label: 'Valor', render: (v, row) => row.tipo?.includes('PORCENTAJE') ? `${v}%` : `$${v}` },
          { key: 'fechaInicio', label: 'Inicio' },
          { key: 'fechaFin', label: 'Fin' },
          { key: 'vigente', label: 'Vigente', render: v => <StatusBadge status={v ? 'ACTIVO' : 'INACTIVO'} /> },
        ]} />
      )

      case 'facturas': return (
        <TablePage title="Facturas" icon="🧾" endpoint="/facturas" columns={[
          { key: 'id', label: 'ID', render: v => <span style={{ color: '#64748b' }}>#{v}</span> },
          { key: 'numero', label: 'Número', render: v => <span style={{ fontFamily: 'monospace', color: '#e2e8f0' }}>{v}</span> },
          { key: 'fecha', label: 'Fecha' },
          { key: 'tipo', label: 'Tipo', render: v => <StatusBadge status={v} /> },
          { key: 'total', label: 'Total', render: v => <span style={{ color: '#10b981', fontWeight: 700 }}>${v?.toFixed(2)}</span> },
          { key: 'estado', label: 'Estado', render: v => <StatusBadge status={v} /> },
        ]} />
      )

      case 'cobros': return (
        <TablePage title="Cobros" icon="💰" endpoint="/cobros" columns={[
          { key: 'id', label: 'ID', render: v => <span style={{ color: '#64748b' }}>#{v}</span> },
          { key: 'cliente', label: 'Cliente', render: v => v?.nombre || '—' },
          { key: 'fecha', label: 'Fecha' },
          { key: 'monto', label: 'Monto', render: v => <span style={{ color: '#10b981', fontWeight: 700 }}>${v?.toFixed(2)}</span> },
          { key: 'metodoPago', label: 'Método', render: v => <Badge color={v === 'EFECTIVO' ? 'green' : v === 'TRANSFERENCIA' ? 'blue' : 'violet'}>{v}</Badge> },
        ]} />
      )

      case 'devoluciones': return (
        <TablePage title="Devoluciones" icon="↩️" endpoint="/devoluciones" columns={[
          { key: 'id', label: 'ID', render: v => <span style={{ color: '#64748b' }}>#{v}</span> },
          { key: 'cliente', label: 'Cliente', render: v => v?.nombre || '—' },
          { key: 'fecha', label: 'Fecha' },
          { key: 'motivo', label: 'Motivo' },
          { key: 'totalDevuelto', label: 'Total', render: v => <span style={{ color: '#f59e0b', fontWeight: 700 }}>${v?.toFixed(2)}</span> },
          { key: 'estado', label: 'Estado', render: v => <StatusBadge status={v} /> },
        ]} />
      )

      default: return <DashboardPage />
    }
  }

  const sections = Array.from(new Set(NAV_ITEMS.map(n => n.section)))
  let lastSection = ''

  return (
    <div className="app-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon">🏢</div>
            <div className="logo-text">
              <span className="logo-name">SIDC</span>
              <span className="logo-sub">Distribución Comercial</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => {
            const showSection = item.section !== lastSection
            if (showSection) lastSection = item.section
            return (
              <div key={item.id}>
                {showSection && <div className="nav-section-label">{item.section}</div>}
                <div
                  id={`nav-${item.id}`}
                  className={`nav-item ${page === item.id ? 'active' : ''}`}
                  onClick={() => setPage(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </div>
              </div>
            )
          })}
        </nav>
      </aside>

      {/* MAIN */}
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <h2>{PAGE_TITLES[page] || page}</h2>
            <p>Sistema Integral de Distribución Comercial · El Salvador</p>
          </div>
          <div className="topbar-right">
            <div className={`status-pill ${apiStatus === 'offline' ? 'badge rose' : ''}`} style={
              apiStatus === 'offline' ? { background: 'rgba(244,63,94,0.1)', borderColor: 'rgba(244,63,94,0.2)', color: '#f43f5e' } : {}
            }>
              <span className="status-dot" style={apiStatus === 'offline' ? { background: '#f43f5e' } : {}} />
              API {apiStatus === 'checking' ? 'verificando...' : apiStatus === 'online' ? 'Online' : 'Offline'}
            </div>
            <button className="topbar-btn" onClick={() => window.location.reload()}>↻ Recargar</button>
          </div>
        </header>

        <main className="page-content">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}