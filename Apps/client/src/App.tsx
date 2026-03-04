import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import InventoryPage from './modules/inventory/InventoryPage';
import ClientsPage from './modules/clients/ClientsPage';
import SalesPage from './modules/sales/SalesPage';
import PromotionsPage from './modules/promotions/PromotionsPage';
import LogisticsPage from './modules/logistics/LogisticsPage';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<InventoryPage />} />
                    <Route path="/clientes" element={<ClientsPage />} />
                    <Route path="/ventas" element={<SalesPage />} />
                    <Route path="/promociones" element={<PromotionsPage />} />
                    <Route path="/logistica" element={<LogisticsPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
