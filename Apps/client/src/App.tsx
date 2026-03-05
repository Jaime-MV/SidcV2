import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import Overview from './pages/Overview';
import InventarioPage from './pages/InventarioPage';
import ClientesPage from './pages/ClientesPage';
import VentasPage from './pages/VentasPage';
import RutasPage from './pages/RutasPage';
import CobrosPage from './pages/CobrosPage';
import PromocionesPage from './pages/PromocionesPage';
import DevolucionesPage from './pages/DevolucionesPage';
import BodegasPage from './pages/BodegasPage';
import ReportesPage from './pages/ReportesPage';
import './index.css';

function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-full p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <span className="text-3xl">🔍</span>
            </div>
            <h2 className="text-gray-700 mb-2 text-xl font-semibold">Módulo no encontrado</h2>
            <p className="text-gray-400 text-sm">La página que buscas no existe o está en desarrollo.</p>
            <a href="/" className="mt-4 text-blue-600 text-sm hover:text-blue-700">← Volver al Dashboard</a>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <div className="flex h-screen bg-gray-50 overflow-hidden">
                <Sidebar />
                <main className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto">
                        <Routes>
                            <Route path="/" element={<Overview />} />
                            <Route path="/ventas" element={<VentasPage />} />
                            <Route path="/inventario" element={<InventarioPage />} />
                            <Route path="/clientes" element={<ClientesPage />} />
                            <Route path="/rutas" element={<RutasPage />} />
                            <Route path="/cobros" element={<CobrosPage />} />
                            <Route path="/promociones" element={<PromocionesPage />} />
                            <Route path="/devoluciones" element={<DevolucionesPage />} />
                            <Route path="/bodegas" element={<BodegasPage />} />
                            <Route path="/reportes" element={<ReportesPage />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
