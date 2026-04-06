import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Star, Share2, Heart, Check, ArrowLeft, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
                if (data.variants?.length > 0) {
                    setSelectedVariant(data.variants[0]);
                }
            } catch (error) {
                console.error('Error fetching product', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, quantity, selectedVariant);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }}>Loading product details...</div>;
    if (!product) return <div style={{ textAlign: 'center', padding: '10rem' }}>Product not found.</div>;

    const displayPrice = selectedVariant?.priceOverride || product.price;

    return (
        <div className="container section-padding">
            <button onClick={() => navigate(-1)} style={{ background: 'transparent', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', padding: 0 }}>
                <ArrowLeft size={18} /> Back to Collection
            </button>

            <div className="grid grid-cols-2" style={{ gap: '4rem' }}>
                {/* Image Gallery */}
                <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                            aspectRatio: '1',
                            background: '#f4f4f4',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            border: '1px solid var(--border)'
                        }}
                    >
                        {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <ShoppingBag size={80} color="#ddd" strokeWidth={1} />
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Product Info */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                {product.category?.name}
                            </span>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.5rem', letterSpacing: '-1px' }}>{product.name}</h1>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn-outline" style={{ borderRadius: '50%', padding: '0.7rem' }}><Share2 size={18} /></button>
                            <button className="btn-outline" style={{ borderRadius: '50%', padding: '0.7rem' }}><Heart size={18} /></button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', color: '#ffc107' }}>
                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill={s <= 4 ? '#ffc107' : 'none'} />)}
                        </div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>(128 Customer Reviews)</span>
                    </div>

                    <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '2rem' }}>${displayPrice}</p>

                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>{product.description}</p>

                    {/* Variants */}
                    {product.variants?.length > 0 && (
                        <div style={{ marginBottom: '2.5rem' }}>
                            <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Select Option
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                                {product.variants.map(variant => (
                                    <button
                                        key={variant.id}
                                        onClick={() => setSelectedVariant(variant)}
                                        style={{
                                            border: `2px solid ${selectedVariant?.id === variant.id ? 'var(--primary)' : 'var(--border)'}`,
                                            background: selectedVariant?.id === variant.id ? '#f0f7ff' : 'white',
                                            padding: '1rem 1.5rem',
                                            borderRadius: '12px',
                                            fontWeight: 700,
                                            color: selectedVariant?.id === variant.id ? 'var(--primary)' : 'var(--text-main)',
                                            transition: 'var(--transition)'
                                        }}
                                    >
                                        {variant.value}
                                        {variant.priceOverride && <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500 }}>+ Price Updated</div>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'var(--bg-secondary)',
                            borderRadius: '12px',
                            border: '1px solid var(--border)',
                            padding: '0.2rem'
                        }}>
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: 'transparent', color: 'var(--text-main)', padding: '0.8rem 1.2rem' }}>-</button>
                            <span style={{ width: '40px', textAlign: 'center', fontWeight: 700, fontSize: '1.1rem' }}>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} style={{ background: 'transparent', color: 'var(--text-main)', padding: '0.8rem 1.2rem' }}>+</button>
                        </div>
                        <button
                            className="btn-primary"
                            onClick={handleAddToCart}
                            style={{
                                flex: 1,
                                fontSize: '1.1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.8rem',
                                borderRadius: '12px',
                                background: added ? '#10b981' : 'var(--primary)'
                            }}
                        >
                            {added ? <><Check size={20} /> Added to Cart</> : <><ShoppingBag size={20} /> Add to Collection</>}
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '2.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <Truck size={18} color="var(--primary)" /> Free Shipping
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <ShieldCheck size={18} color="var(--primary)" /> 2 Year Warranty
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <RefreshCw size={18} color="var(--primary)" /> 30-Day Returns
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductDetails;
