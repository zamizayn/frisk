import Sidebar from './Sidebar';
import { Navigate } from 'react-router-dom';

const Layout = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    const user = JSON.parse(localStorage.getItem('adminUser') || '{}');

    if (!token || user.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content">
                <header style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Welcome back,</p>
                        <h2 style={{ fontSize: '1.5rem' }}>{user.username || 'Admin'}</h2>
                    </div>
                    <div className="glass" style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        color: 'var(--primary)'
                    }}>
                        {user.username?.charAt(0).toUpperCase() || 'A'}
                    </div>
                </header>
                {children}
            </main>
        </div>
    );
};

export default Layout;
