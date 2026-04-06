import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Layers,
    ShoppingBag,
    LogOut,
    ChevronRight
} from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Products', path: '/products', icon: <Package size={20} /> },
        { name: 'Categories', path: '/categories', icon: <Layers size={20} /> },
        { name: 'Banners', path: '/banners', icon: <ShoppingBag size={20} /> }, // Using ShoppingBag as a placeholder for promo
        { name: 'Orders', path: '/orders', icon: <ShoppingBag size={20} /> },
    ];

    return (
        <aside className="sidebar glass" style={{
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            width: 'var(--sidebar-width)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 100
        }}>
            <div className="logo" style={{
                fontSize: '1.5rem',
                fontWeight: 900,
                marginBottom: '2.5rem',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem'
            }}>
                <img src="/friska_logo.jpeg" alt="Frisk Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                FRISKA<span style={{ color: 'white', fontWeight: 500, fontSize: '1.1rem' }}>ADMIN</span>
            </div>

            <nav style={{ flex: 1 }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.8rem 1.2rem',
                            borderRadius: '12px',
                            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                            background: isActive ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                            textDecoration: 'none',
                            marginBottom: '0.5rem',
                            transition: 'var(--transition)',
                            fontWeight: isActive ? 700 : 500
                        })}
                    >
                        {({ isActive }) => (
                            <>
                                {item.icon}
                                <span style={{ fontSize: '0.95rem' }}>{item.name}</span>
                                {isActive && <div style={{ width: '4px', height: '18px', background: 'var(--primary)', borderRadius: '2px', marginLeft: 'auto' }} />}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <button
                onClick={handleLogout}
                className="btn-logout"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.8rem 1.2rem',
                    color: '#ef4444',
                    background: '#fff1f1',
                    borderRadius: '12px',
                    width: '100%',
                    marginTop: 'auto',
                    border: '1px solid #fee2e2',
                    fontWeight: 700,
                    fontSize: '0.9rem'
                }}
            >
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </aside>
    );
};

export default Sidebar;
