import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, LogOut, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../api';

const Navbar = () => {
  const { cartCount } = useCart();
  const { logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
      } catch (err) {
        console.error('Navbar category fetch error', err);
      }
    };
    fetchCats();
  }, []);

  return (
    <nav className="glass" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 'var(--navbar-height)',
      display: 'flex',
      alignItems: 'center',
      zIndex: 1000,
      borderBottom: '1px solid var(--border)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        gap: '2rem'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none', flexShrink: 0 }}>
          <img src="/friska_logo.jpeg" alt="Friska Logo" style={{ height: '42px', width: 'auto', borderRadius: '6px' }} />
          <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.5px', textTransform: 'uppercase' }}>
            FRISKA
          </span>
        </Link>

        {/* Categories - Direct in Topbar */}
        <div style={{ 
            display: 'flex', 
            gap: '1.5rem', 
            alignItems: 'center', 
            flex: 1, 
            overflowX: 'auto', 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            padding: '0 1rem'
        }} className="desktop-menu no-scrollbar">
          <Link to="/shop" style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap', color: 'var(--primary)' }}>Shop All</Link>
          {categories.map(cat => (
            <Link 
                key={cat.id} 
                to={`/shop?categoryId=${cat.id}`}
                style={{ 
                    fontWeight: 600, 
                    fontSize: '0.85rem', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.5px', 
                    whiteSpace: 'nowrap',
                    color: 'var(--text-main)',
                    opacity: 0.8,
                    transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => e.target.style.opacity = 1}
                onMouseLeave={(e) => e.target.style.opacity = 0.8}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigate('/shop')}>
            <Search size={20} strokeWidth={2} />
          </div>

          <Link to="/cart" style={{ position: 'relative' }}>
            <ShoppingCart size={20} strokeWidth={2} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: 'var(--primary)',
                color: 'white',
                fontSize: '0.65rem',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link to="/profile">
                <User size={20} strokeWidth={2} />
              </Link>
              <button onClick={logout} style={{ background: 'transparent', padding: 0, color: 'var(--text-muted)' }}>
                <LogOut size={18} strokeWidth={2} />
              </button>
            </div>
          ) : (
            <Link to="/login">
              <User size={20} strokeWidth={2} />
            </Link>
          )}

          <button className="mobile-menu-btn" style={{ display: 'none' }} onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
