import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, ShoppingCart, Package, Users, Truck,
    DollarSign, Tag, RotateCcw, Warehouse, Settings,
    ChevronLeft, ChevronRight, Bell, AlertTriangle,
} from 'lucide-react';

const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/ventas', label: 'Ventas & Facturación', icon: ShoppingCart },
    { path: '/inventario', label: 'Inventario', icon: Package },
    { path: '/clientes', label: 'Clientes & Crédito', icon: Users },
    { path: '/rutas', label: 'Rutas & Reparto', icon: Truck },
    { path: '/cobros', label: 'Cobros', icon: DollarSign },
    { path: '/promociones', label: 'Promociones', icon: Tag },
    { path: '/devoluciones', label: 'Devoluciones', icon: RotateCcw },
    { path: '/bodegas', label: 'Bodegas', icon: Warehouse },
];

const alerts = [
    { message: '3 productos próximos a vencer', type: 'warning' },
    { message: '2 cobros vencidos pendientes', type: 'error' },
    { message: 'Stock crítico en 2 productos', type: 'warning' },
];

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    return (
        <aside className={`relative flex flex-col h-screen bg-slate-900 text-white transition-all duration-300 ease-in-out flex-shrink-0 ${collapsed ? 'w-16' : 'w-64'}`}>
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700">
                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="w-4 h-4 text-white" />
                </div>
                {!collapsed && (
                    <div className="overflow-hidden">
                        <p className="text-white font-semibold leading-tight text-sm">SIDC</p>
                        <p className="text-slate-400 text-xs leading-tight">Distribución Comercial</p>
                    </div>
                )}
            </div>

            {/* Collapse button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-16 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors z-10"
            >
                {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
            </button>

            {/* Alerts Banner */}
            {!collapsed && (
                <div className="mx-3 mt-3 bg-amber-900/40 border border-amber-600/40 rounded-lg p-2">
                    <div className="flex items-center gap-1.5 mb-1">
                        <Bell className="w-3 h-3 text-amber-400" />
                        <span className="text-amber-400 text-xs font-medium">{alerts.length} alertas activas</span>
                    </div>
                    {alerts.map((a, i) => (
                        <div key={i} className="flex items-start gap-1.5 mt-1">
                            <AlertTriangle className={`w-3 h-3 mt-0.5 flex-shrink-0 ${a.type === 'error' ? 'text-red-400' : 'text-amber-400'}`} />
                            <span className="text-slate-300 text-xs leading-tight">{a.message}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 px-2 py-3 overflow-y-auto">
                {!collapsed && <p className="px-2 py-1 text-slate-500 text-xs uppercase tracking-wider mb-1">Módulos</p>}
                <ul className="space-y-0.5">
                    {navItems.map(({ path, label, icon: Icon }) => {
                        const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
                        return (
                            <li key={path}>
                                <NavLink
                                    to={path}
                                    className={`flex items-center gap-3 px-2 py-2.5 rounded-lg transition-all duration-150 group ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                                    title={collapsed ? label : undefined}
                                >
                                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                                    {!collapsed && <span className="text-sm truncate">{label}</span>}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Bottom section */}
            <div className="px-2 pb-3 border-t border-slate-700 pt-3">
                <NavLink
                    to="/configuracion"
                    className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                    title={collapsed ? 'Configuración' : undefined}
                >
                    <Settings className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="text-sm">Configuración</span>}
                </NavLink>
                <div className={`flex items-center gap-2 px-2 py-2 mt-1 rounded-lg bg-slate-800 ${collapsed ? 'justify-center' : ''}`}>
                    <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-semibold">AM</span>
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <p className="text-slate-200 text-xs font-medium truncate">Admin SIDC</p>
                            <p className="text-slate-500 text-xs truncate">admin@sidc.sv</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
