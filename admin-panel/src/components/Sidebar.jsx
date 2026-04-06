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
                fontWeight: 800,
                marginBottom: '2.5rem',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'var(--primary)',
                    borderRadius: '8px'
                }}></div>
                Admin<span style={{ color: 'white' }}>Lite</span>
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
                            padding: '0.8rem 1rem',
                            borderRadius: '10px',
                            color: isActive ? 'white' : 'var(--text-muted)',
                            background: isActive ? 'linear-gradient(90deg, var(--primary) 0%, transparent 100%)' : 'transparent',
                            textDecoration: 'none',
                            marginBottom: '0.5rem',
                            transition: 'var(--transition)'
                        })}
                    >
                        {item.icon}
                        <span style={{ fontWeight: 500 }}>{item.name}</span>
                        <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
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
                    padding: '0.8rem 1rem',
                    color: '#ef4444',
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '10px',
                    width: '100%',
                    marginTop: 'auto',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                }}
            >
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </aside>
    );
};

export default Sidebar;
