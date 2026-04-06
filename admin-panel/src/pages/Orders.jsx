import { useState, useEffect } from 'react';
import api from '../api';
import { ShoppingBag, Eye, Calendar, MapPin, DollarSign, Package, CheckCircle, RefreshCcw } from 'lucide-react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/myorders');
            setOrders(data);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus) => {
        setUpdating(true);
        try {
            await api.put(`/orders/${selectedOrder.id}/status`, { status: newStatus });
            // Update local state
            setSelectedOrder({ ...selectedOrder, status: newStatus });
            fetchOrders();
        } catch (err) {
            alert('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'var(--success)';
            case 'pending': return 'var(--accent)';
            case 'cancelled': return 'var(--danger)';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <div className="page-container">
            <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Customer Orders</h1>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Fetching orders...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: selectedOrder ? '1fr 400px' : '1fr', gap: '1.5rem', transition: 'var(--transition)' }}>
                    <div className="glass" style={{ overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    <th style={{ padding: '1.2rem' }}>Order ID</th>
                                    <th style={{ padding: '1.2rem' }}>Date</th>
                                    <th style={{ padding: '1.2rem' }}>Status</th>
                                    <th style={{ padding: '1.2rem' }}>Total</th>
                                    <th style={{ padding: '1.2rem', textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id} style={{ 
                                        borderBottom: '1px solid var(--border)',
                                        background: selectedOrder?.id === order.id ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                                        cursor: 'pointer'
                                    }} onClick={() => setSelectedOrder(order)}>
                                        <td style={{ padding: '1.2rem', fontSize: '0.9rem' }}>
                                            <div style={{ fontWeight: 600 }}>{order.id.slice(0, 13)}...</div>
                                        </td>
                                        <td style={{ padding: '1.2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{formatDate(order.createdAt)}</td>
                                        <td style={{ padding: '1.2rem' }}>
                                            <span style={{ 
                                                padding: '0.3rem 0.6rem', 
                                                background: `rgba(${getStatusColor(order.status) === 'var(--success)' ? '16, 185, 129' : '34, 211, 238'}, 0.1)`, 
                                                color: getStatusColor(order.status), 
                                                borderRadius: '20px', 
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                textTransform: 'uppercase'
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.2rem', fontWeight: 700 }}>${order.totalAmount}</td>
                                        <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                                            <button style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '0.4rem' }}>
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {selectedOrder && (
                        <div className="glass" style={{ padding: '1.5rem', alignSelf: 'start', position: 'sticky', top: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.2rem' }}>Order Management</h3>
                                <button onClick={() => setSelectedOrder(null)} style={{ background: 'transparent', color: 'var(--text-muted)' }}>Close</button>
                            </div>

                            {/* Status Update Dropdown */}
                            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>Change Order Status</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <select 
                                        value={selectedOrder.status}
                                        onChange={(e) => updateStatus(e.target.value)}
                                        disabled={updating}
                                        style={{ flex: 1, padding: '0.6rem', background: 'var(--bg-dark)' }}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    {updating && <RefreshCcw size={18} className="spin" style={{ margin: 'auto' }} />}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ padding: '0.6rem', background: 'var(--bg-dark)', borderRadius: '8px' }}><Calendar size={20} color="var(--primary)" /></div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date</div>
                                        <div style={{ fontWeight: 600 }}>{formatDate(selectedOrder.createdAt)}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ padding: '0.6rem', background: 'var(--bg-dark)', borderRadius: '8px' }}><MapPin size={20} color="var(--accent)" /></div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Address</div>
                                        <div style={{ fontWeight: 600 }}>{selectedOrder.address}</div>
                                    </div>
                                </div>

                                <div style={{ margin: '1rem 0', padding: '1rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-muted)' }}>ORDER ITEMS</div>
                                    {selectedOrder.items?.map(item => (
                                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                            <div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.product?.name || 'Item'}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                                            </div>
                                            <div style={{ fontWeight: 600 }}>${(item.quantity * item.price).toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Total</div>
                                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>${selectedOrder.totalAmount}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Orders;
