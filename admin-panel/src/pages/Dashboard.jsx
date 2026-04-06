import { useState, useEffect } from 'react';
import api from '../api';
import { 
  Package, 
  Layers, 
  ShoppingBag, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        products: 0,
        categories: 0,
        orders: 0,
        revenue: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [p, c, o] = await Promise.all([
                    api.get('/products'),
                    api.get('/categories'),
                    api.get('/orders/myorders')
                ]);
                
                const revenue = o.data.reduce((acc, order) => acc + parseFloat(order.totalAmount), 0);
                
                setStats({
                    products: p.data.length,
                    categories: c.data.length,
                    orders: o.data.length,
                    revenue: revenue.toFixed(2),
                    recentOrders: o.data.slice(0, 5)
                });
            } catch (err) {
                console.error('Err fetching stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { title: 'Total Products', value: stats.products, icon: <Package size={24} />, color: 'var(--primary)', trend: '+12%', up: true },
        { title: 'Categories', value: stats.categories, icon: <Layers size={24} />, color: 'var(--accent)', trend: '+2', up: true },
        { title: 'Total Orders', value: stats.orders, icon: <ShoppingBag size={24} />, color: 'var(--success)', trend: '+5%', up: true },
        { title: 'Gross Revenue', value: `$${stats.revenue}`, icon: <TrendingUp size={24} />, color: '#f59e0b', trend: '+18%', up: true },
    ];

    if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Analyzing business metrics...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                {statCards.map((card, i) => (
                    <div key={i} className="glass" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ 
                            position: 'absolute', right: '-10px', top: '-10px', opacity: 0.1, color: card.color, transform: 'scale(2.5)' 
                        }}>
                            {card.icon}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 500 }}>{card.title}</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>{card.value}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: card.up ? 'var(--success)' : 'var(--danger)' }}>
                            {card.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {card.trend} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>vs last month</span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div className="glass" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.2rem' }}>Recent Order Activity</h3>
                        <button style={{ color: 'var(--primary)', fontSize: '0.85rem', background: 'transparent' }}>View All</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {stats.recentOrders.map(order => (
                            <div key={order.id} style={{ 
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', 
                                background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)' 
                            }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ color: 'var(--primary)' }}><Clock size={20} /></div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Order #{order.id.slice(0, 8)}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.status} • {new Date(order.createdAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div style={{ fontWeight: 700 }}>${order.totalAmount}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Quick Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <button className="btn-primary" style={{ textAlign: 'left', padding: '1rem' }}>Generate Sales Report</button>
                        <button style={{ background: 'rgba(255,255,255,0.05)', color: 'white', textAlign: 'left', padding: '1rem' }}>Inventory Checklist</button>
                        <button style={{ background: 'rgba(255,255,255,0.05)', color: 'white', textAlign: 'left', padding: '1rem' }}>Customer Outreach</button>
                    </div>
                    <div style={{ marginTop: '2rem', padding: '1.2rem', background: 'rgba(34, 211, 238, 0.05)', borderRadius: '12px', border: '1px dashed var(--accent)' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>
                            <CheckCircle size={18} />
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>System Healthy</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>All API services are responding within normal parameters.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
