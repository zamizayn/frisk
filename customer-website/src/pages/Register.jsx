import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, ArrowRight, AlertCircle, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container section-padding" style={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass" 
                style={{ width: '100%', maxWidth: '450px', padding: '3rem', borderRadius: '32px', border: '1px solid var(--border)' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-1px' }}>Join ShopMax</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Experience the pinnacle of digital lifestyle.</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(255, 0, 0, 0.05)', color: 'var(--danger)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem' }}>
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div>
                        <label className="label">Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input 
                                type="text" 
                                required 
                                value={formData.username} 
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
                                style={{ paddingLeft: '2.5rem' }}
                                placeholder="John Doe"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input 
                                type="email" 
                                required 
                                value={formData.email} 
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                                style={{ paddingLeft: '2.5rem' }}
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input 
                                type="password" 
                                required 
                                value={formData.password} 
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                                style={{ paddingLeft: '2.5rem' }}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn-primary" 
                        disabled={loading}
                        style={{ padding: '1rem', marginTop: '1rem', borderRadius: '12px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}
                    >
                        {loading ? 'Creating Account...' : <>Create Account <UserPlus size={18} /></>}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign In</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
