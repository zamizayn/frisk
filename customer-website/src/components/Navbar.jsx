import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, LogOut, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { cartCount, cartTotal } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

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
        width: '100%'
      }}>
        {/* Logo */}
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-1px' }}>
          SHOP<span style={{ color: 'var(--text-main)' }}>MAX</span>
        </Link>

        {/* Links - Desktop */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="desktop-menu">
          <Link to="/shop" style={{ fontWeight: 500, fontSize: '0.95rem' }}>Shop All</Link>
          <Link to="/categories" style={{ fontWeight: 500, fontSize: '0.95rem' }}>Categories</Link>
        </div>

        {/* Icons */}
        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigate('/shop')}>
             <Search size={22} strokeWidth={1.5} />
          </div>

          <Link to="/cart" style={{ position: 'relative' }}>
            <ShoppingCart size={22} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: 'var(--primary)',
                color: 'white',
                fontSize: '0.7rem',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Link to="/profile">
                    <User size={22} strokeWidth={1.5} />
                </Link>
                <button onClick={logout} style={{ background: 'transparent', padding: 0, color: 'var(--text-muted)' }}>
                    <LogOut size={20} strokeWidth={1.5} />
                </button>
            </div>
          ) : (
            <Link to="/login">
              <User size={22} strokeWidth={1.5} />
            </Link>
          )}

          <button style={{ display: 'none' }} className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
             {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
