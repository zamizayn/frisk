import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Lock, User, AlertCircle } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/users/login', { email, password });
            
            if (data.role !== 'admin') {
                setError('Access denied. Admin only.');
                setLoading(false);
                return;
            }

            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminUser', JSON.stringify(data));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at top right, var(--primary) -20%, var(--bg-dark) 40%)'
        }}>
            <form 
                onSubmit={handleLogin}
                className="glass" 
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '2.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Admin Login</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Enter your credentials to access the panel.</p>
                </div>

                {error && (
                    <div style={{
                        padding: '1rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--danger)',
                        borderRadius: '8px',
                        color: 'var(--danger)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem'
                    }}>
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email Address</label>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                            type="email" 
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', paddingLeft: '2.5rem' }}
                            required
                        />
                    </div>
                </div>

                <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Password</label>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', paddingLeft: '2.5rem' }}
                            required
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={loading}
                    style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}
                >
                    {loading ? 'Authenticating...' : 'Sign In'}
                </button>
            </form>
        </div>
    );
};

export default Login;
