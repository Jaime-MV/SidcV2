import { NavLink, Outlet } from 'react-router-dom';

const links = [
    { to: '/', label: 'Inventario', icon: '📦' },
    { to: '/clientes', label: 'Clientes', icon: '👥' },
    { to: '/ventas', label: 'Ventas', icon: '💳' },
    { to: '/promociones', label: 'Promociones', icon: '🏷️' },
    { to: '/logistica', label: 'Logística', icon: '🚚' },
];

export default function Layout() {
    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-brand">SIDC</div>
                <nav className="sidebar-nav">
                    {links.map(l => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            end={l.to === '/'}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{l.icon}</span>
                            <span className="nav-label">{l.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>
            <main className="content">
                <Outlet />
            </main>
        </div>
    );
}
