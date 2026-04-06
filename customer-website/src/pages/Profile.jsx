import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Package, Clock, MapPin, DollarSign, ChevronRight, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/myorders');
                setOrders(data);
            } catch (error) {
                console.error('Error fetching profile orders', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }}>Loading your collection profile...</div>;

    return (
        <div className="container section-padding">
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '4rem' }}>
                {/* Sidebar */}
                <aside>
                    <div className="glass" style={{ padding: '2rem', borderRadius: '24px', textAlign: 'center' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <User size={40} color="var(--primary)" />
                        </div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.2rem' }}>{user?.username}</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{user?.email}</p>
                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', textAlign: 'left' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>Orders Completed: {orders.filter(o => o.status === 'completed').length}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pending Orders: {orders.filter(o => o.status === 'pending').length}</div>
                        </div>
                    </div>
                </aside>

                {/* Orders Content */}
                <main>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2.5rem', letterSpacing: '-1px' }}>Your Orders</h1>

                    {orders.length === 0 ? (
                        <div className="glass" style={{ padding: '4rem', textAlign: 'center' }}>
                            <Package size={48} color="#ddd" style={{ margin: '0 auto 1rem' }} />
                            <h3>No Orders Found</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Start building your collection today.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {orders.map(order => (
                                <motion.div 
                                    key={order.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="glass" 
                                    style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                        <div style={{ background: '#f0f7ff', padding: '0.8rem', borderRadius: '12px' }}>
                                            <Package size={24} color="var(--primary)" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Order #{order.id.slice(0, 8)}</div>
                                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                <span style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}><Clock size={14} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                                                <span style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}><DollarSign size={14} /> ${order.totalAmount}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <span style={{ 
                                            padding: '0.4rem 1rem', 
                                            borderRadius: '20px', 
                                            fontSize: '0.75rem', 
                                            fontWeight: 800, 
                                            textTransform: 'uppercase', 
                                            background: order.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0, 112, 243, 0.1)',
                                            color: order.status === 'completed' ? '#10b981' : 'var(--primary)'
                                        }}>
                                            {order.status}
                                        </span>
                                        <ChevronRight size={20} color="var(--text-muted)" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Profile;
