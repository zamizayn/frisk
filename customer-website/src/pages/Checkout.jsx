import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api';
import { ShoppingBag, CreditCard, Truck, ShieldCheck, CheckCircle, ArrowRight, X } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [address, setAddress] = useState({
        fullName: '',
        email: '',
        street: '',
        city: '',
        zip: '',
        country: 'USA'
    });

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const orderData = {
                items: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    variantId: item.variant?.id
                })),
                address: `${address.fullName}, ${address.street}, ${address.city}, ${address.zip}, ${address.country}`,
            };

            await api.post('/orders', orderData);
            setSuccess(true);
            clearCart();
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#0070f3', '#ffffff', '#000000']
            });
        } catch (error) {
            alert('Checkout failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="container section-padding" style={{ textAlign: 'center', maxWidth: '600px' }}>
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <div style={{ color: 'var(--success)', marginBottom: '1.5rem' }}><CheckCircle size={80} style={{ margin: '0 auto' }} /></div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Order Confirmed!</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
                        Thank you for your purchase. We've received your order and are preparing it for shipment.
                    </p>
                    <button onClick={() => navigate('/shop')} className="btn-primary" style={{ padding: '1rem 2rem' }}>
                        Continue Shopping
                    </button>
                </motion.div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="container section-padding" style={{ textAlign: 'center' }}>
                <ShoppingBag size={64} style={{ margin: '0 auto 1.5rem', color: '#ddd' }} />
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Your Cart is Empty</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Browse our curated collection and select your precision essentials.</p>
                <button onClick={() => navigate('/shop')} className="btn-primary" style={{ padding: '1rem 2.5rem' }}>
                    Shop Collection
                </button>
            </div>
        );
    }

    return (
        <div className="container section-padding">
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '3rem', letterSpacing: '-1px' }}>Checkout</h1>
            
            <div className="grid grid-cols-2" style={{ gap: '5rem', alignItems: 'flex-start' }}>
                {/* Shipping Form */}
                <form onSubmit={handleCheckout}>
                    <div className="glass" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <Truck size={22} color="var(--primary)" /> Shipping Information
                        </h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem' }}>
                            <div>
                                <label className="label">Full Name</label>
                                <input type="text" required value={address.fullName} onChange={(e) => setAddress({...address, fullName: e.target.value})} />
                            </div>
                            <div>
                                <label className="label">Email Address</label>
                                <input type="email" required value={address.email} onChange={(e) => setAddress({...address, email: e.target.value})} />
                            </div>
                            <div>
                                <label className="label">Street Address</label>
                                <input type="text" required value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label className="label">City</label>
                                    <input type="text" required value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} />
                                </div>
                                <div>
                                    <label className="label">ZIP Code</label>
                                    <input type="text" required value={address.zip} onChange={(e) => setAddress({...address, zip: e.target.value})} />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <CreditCard size={22} color="var(--primary)" /> Payment Method
                            </h3>
                            <div className="glass" style={{ padding: '1.2rem', borderColor: 'var(--primary)', background: '#f0f7ff', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '4px solid var(--primary)', background: 'white' }}></div>
                                <div style={{ flex: 1, fontWeight: 700 }}>Cash on Delivery</div>
                                <ShieldCheck size={18} color="var(--primary)" />
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.8rem' }}>
                                For this demonstration, only COD is active. Encrypted Payment logic ready for Stripe/PayPal.
                            </p>
                        </div>

                        <button 
                            type="submit" 
                            className="btn-primary" 
                            disabled={loading}
                            style={{ 
                                width: '100%', 
                                padding: '1.2rem', 
                                marginTop: '2.5rem', 
                                fontSize: '1.1rem',
                                opacity: loading ? 0.7 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.8rem'
                            }}
                        >
                            {loading ? 'Processing Transaction...' : <>Complete Purchase <ArrowRight size={20} /></>}
                        </button>
                    </div>
                </form>

                {/* Order Summary Sidebar */}
                <div style={{ position: 'sticky', top: '100px' }}>
                    <div className="glass" style={{ padding: '2rem', borderRadius: '24px', background: 'var(--bg-secondary)', border: 'none' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Order Summary</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '1.5rem' }}>
                            {cartItems.map(item => (
                                <div key={`${item.id}-${item.variant?.id}`} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ width: '60px', height: '60px', background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                        <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{item.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {item.variant?.value || 'Standard'} x {item.quantity}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 800 }}>
                                        ${((item.variant?.priceOverride || item.price) * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                <span>Shipping</span>
                                <span style={{ color: 'var(--success)', fontWeight: 700 }}>FREE</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid var(--border)', fontSize: '1.4rem', fontWeight: 900 }}>
                                <span>Total</span>
                                <span style={{ color: 'var(--primary)' }}>${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
