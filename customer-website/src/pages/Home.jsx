import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Zap, ShieldCheck, Truck, Layers } from 'lucide-react';
import api from '../api';
import { motion } from 'framer-motion';
import BannerSlider from '../components/BannerSlider';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/categories')
                ]);
                setFeaturedProducts(prodRes.data.slice(0, 4));
                setCategories(catRes.data);
            } catch (error) {
                console.error('Error fetching home data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="home-page">
            <BannerSlider />

            {/* Features Bar */}
            <section className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
                <div className="glass" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    padding: '2.5rem',
                    borderRadius: '24px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                    border: '1px solid rgba(255,255,255,0.8)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0 1rem', borderRight: '1px solid var(--border)' }}>
                        <div style={{
                            width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(0, 112, 243, 0.08)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0
                        }}><Truck size={24} /></div>
                        <div>
                            <h4 style={{ fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase' }}>Fast Shipping</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Global express delivery</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0 2rem', borderRight: '1px solid var(--border)' }}>
                        <div style={{
                            width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(0, 112, 243, 0.08)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0
                        }}><ShieldCheck size={24} /></div>
                        <div>
                            <h4 style={{ fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase' }}>Secure Pay</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>100% encrypted checkout</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0 2rem' }}>
                        <div style={{
                            width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(0, 112, 243, 0.08)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0
                        }}><Zap size={24} /></div>
                        <div>
                            <h4 style={{ fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase' }}>Guaranteed</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Premium quality standards</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="section-padding container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Discover</span>
                    <h2 style={{ fontSize: '2.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-1.5px', marginTop: '0.5rem' }}>The Collections</h2>
                    <div style={{ width: '60px', height: '4px', background: 'var(--primary)', margin: '1.5rem auto' }} />
                </div>

                <div
                    className="no-scrollbar"
                    style={{
                        display: 'flex',
                        gap: '3rem',
                        overflowX: 'auto',
                        paddingBottom: '2rem',
                        paddingLeft: '1rem',
                        paddingRight: '1rem',
                        scrollBehavior: 'smooth'
                    }}
                >
                    {categories.map(category => (
                        <Link
                            key={category.id}
                            to={`/shop?category=${category.id}`}
                            className="category-card-circle"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1.2rem',
                                transition: 'var(--transition)',
                                flexShrink: 0,
                                width: '160px'
                            }}
                        >
                            <div style={{
                                position: 'relative',
                                width: '100%',
                                aspectRatio: '1',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                background: 'var(--bg-secondary)',
                                border: '2px solid var(--bg-secondary)',
                                boxShadow: 'var(--shadow-md)',
                                padding: '4px'
                            }}>
                                <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
                                    {category.imageUrl ? (
                                        <img
                                            src={category.imageUrl}
                                            alt={category.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
                                            className="cat-img"
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)' }}>
                                            <Layers size={32} color="var(--text-muted)" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>{category.name}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Modern Promo Grid */}
            <section className="section-padding container">
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', height: '500px' }}>
                    <div
                        className="promo-banner"
                        style={{
                            position: 'relative',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            background: '#111'
                        }}
                    >
                        <div style={{ position: 'absolute', inset: 0, opacity: 0.6, background: 'url(https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=2070&auto=format&fit=crop) center/cover' }} />
                        <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem' }}>
                            <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '4px' }}>Limited Edition</span>
                            <h2 style={{ color: 'white', fontSize: '3.3rem', fontWeight: 950, marginTop: '1rem', letterSpacing: '-2px', lineHeight: 1 }}>THE SEASONAL<br />COLLECTION</h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginTop: '1.5rem', maxWidth: '400px' }}>Experience our most refined essentials yet, crafted for the modern lifestyle.</p>
                            <Link to="/shop" className="btn-primary" style={{ width: 'fit-content', marginTop: '2rem', padding: '1.2rem 3rem', borderRadius: '12px' }}>View Drop</Link>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridRows: '1fr 1fr', gap: '2rem', height: '100%' }}>
                        <div className="promo-banner" style={{ borderRadius: '24px', overflow: 'hidden', position: 'relative', background: 'var(--primary)' }}>
                            <div style={{ position: 'absolute', inset: 0, opacity: 0.3, background: 'url(https://images.unsplash.com/photo-1628102422223-9345003666d9?q=80&w=2000&auto=format&fit=crop) center/cover' }} />
                            <div style={{ position: 'relative', zIndex: 2, padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <h3 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 800 }}>New Arrivals</h3>
                                <Link to="/shop" style={{ color: 'white', fontWeight: 700, marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Shop Now <ArrowRight size={18} /></Link>
                            </div>
                        </div>
                        <div className="promo-banner" style={{ borderRadius: '24px', overflow: 'hidden', position: 'relative', background: '#f8f8f8', border: '1px solid var(--border)' }}>
                            <div style={{ position: 'relative', zIndex: 2, padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Premium Cuts</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem' }}>Indulge in our freshly sourced everyday highlights.</p>
                                <Link to="/shop" style={{ color: 'var(--primary)', fontWeight: 800, marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Explore <ArrowRight size={18} /></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-1.5px' }}>Frisk Essentials</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Handpicked selection of our most coveted pieces.</p>
                        </div>
                        <Link to="/shop" style={{ color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '2px solid var(--primary)', paddingBottom: '2px' }}>
                            Explore Collection <ArrowRight size={18} />
                        </Link>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>Curating products...</div>
                    ) : (
                        <div className="grid grid-cols-4">
                            {featuredProducts.map(product => (
                                <Link key={product.id} to={`/product/${product.id}`} className="product-card glass" style={{
                                    padding: '1rem',
                                    borderRadius: '16px',
                                    background: 'white',
                                    transition: 'var(--transition)',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        aspectRatio: '1',
                                        background: '#f4f4f4',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        marginBottom: '1rem',
                                        position: 'relative'
                                    }}>
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                                <ShoppingBag size={40} color="#ccc" />
                                            </div>
                                        )}
                                    </div>
                                    <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.2rem' }}>{product.name}</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.8rem' }}>{product.category?.name}</p>
                                    <p style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.2rem' }}>${product.price}</p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Our Story Section */}
            <section className="section-padding container">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '6rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100%', height: '100%', border: '4px solid var(--primary)', borderRadius: '32px', zIndex: -1 }} />
                        <div style={{ height: '600px', borderRadius: '32px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                            <img src="https://images.unsplash.com/photo-1541830820230-90879bc4edf8?q=80&w=2000&auto=format&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    </div>
                    <div>
                        <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.85rem' }}>The Frisk Philosophy</span>
                        <h2 style={{ fontSize: '3.8rem', fontWeight: 900, marginTop: '1.5rem', letterSpacing: '-2.5px', lineHeight: 1.1 }}>Bred for Quality,<br />Curated for You.</h2>
                        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginTop: '2.5rem', lineHeight: 1.7 }}>
                            At Frisk, we believe that premium quality shouldn't be an exception. Founded on the principles of transparency and excellence, we source only the finest essentials from around the world.
                        </p>
                        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginTop: '1.5rem', lineHeight: 1.7 }}>
                            Every product in our collection undergoes a rigorous selection process to ensure it meets our exacting standards. From our fresh poultry drops to our lifestyle essentials, we bring you the ultimate curation of quality.
                        </p>
                        <div style={{ display: 'flex', gap: '4rem', marginTop: '4rem' }}>
                            <div>
                                <h4 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1.5px' }}>100%</h4>
                                <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', marginTop: '0.5rem' }}>Freshly Sourced</p>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1.5px' }}>50k+</h4>
                                <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', marginTop: '0.5rem' }}>Happy Customers</p>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1.5px' }}>Free</h4>
                                <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', marginTop: '0.5rem' }}>Express Delivery</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="section-padding container" style={{ marginBottom: '4rem' }}>
                <div className="glass" style={{
                    background: '#090909',
                    padding: '6rem',
                    borderRadius: '40px',
                    textAlign: 'center',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.15)'
                }}>
                    <div style={{ position: 'absolute', top: '-150px', right: '-150px', width: '400px', height: '400px', borderRadius: '50%', background: 'var(--primary)', filter: 'blur(120px)', opacity: 0.25 }} />
                    <div style={{ position: 'absolute', bottom: '-150px', left: '-150px', width: '400px', height: '400px', borderRadius: '50%', background: 'var(--primary)', filter: 'blur(120px)', opacity: 0.15 }} />

                    <div style={{ position: 'relative', zIndex: 2, maxWidth: '700px', margin: '0 auto' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.8rem' }}>The Community</span>
                        <h2 style={{ fontSize: '3.5rem', fontWeight: 950, letterSpacing: '-2px', marginTop: '1rem' }}>Join the Inner Circle</h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem', marginTop: '1.5rem', fontWeight: 400 }}>
                            Unlock priority access to limited collections, exclusive recipes, and premium lifestyle insights.
                        </p>

                        <form style={{ display: 'flex', gap: '1rem', marginTop: '3.5rem' }} onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Your premium email address"
                                style={{
                                    flex: 1,
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    color: 'white',
                                    padding: '1.4rem 1.8rem',
                                    borderRadius: '16px',
                                    fontSize: '1rem'
                                }}
                            />
                            <button className="btn-primary" style={{ padding: '0 3rem', borderRadius: '16px', fontWeight: 800, fontSize: '1rem' }}>Subscribe Now</button>
                        </form>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginTop: '2rem' }}>
                            Secured by Frisk® Encrypted Infrastructure. No spam, ever.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
