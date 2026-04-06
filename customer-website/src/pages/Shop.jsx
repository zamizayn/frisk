import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Search, ShoppingBag, Filter, X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchData();
    }, [search, categoryId, minPrice, maxPrice]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams();
            if (search) query.append('search', search);
            if (categoryId) query.append('categoryId', categoryId);
            if (minPrice) query.append('minPrice', minPrice);
            if (maxPrice) query.append('maxPrice', maxPrice);

            const [prodRes, catRes] = await Promise.all([
                api.get(`/products?${query.toString()}`),
                api.get('/categories')
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch (error) {
            console.error('Error fetching shop data', error);
        } finally {
            setLoading(false);
        }
    };

    const resetFilters = () => {
        setSearch('');
        setCategoryId('');
        setMinPrice('');
        setMaxPrice('');
    };

    return (
        <div className="shop-page container section-padding">
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>The Collection</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Meticulously designed products for the precision-oriented user.</p>
            </header>

            <div style={{ display: 'flex', gap: '3rem' }}>
                {/* Desktop Filters Sidebar */}
                <aside style={{ width: '260px', flexShrink: 0 }} className="desktop-filters">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                        <SlidersHorizontal size={20} /> FILTERS
                    </h3>

                    <div style={{ marginBottom: '2.5rem' }}>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Category</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }}>
                                <input 
                                    type="radio" 
                                    name="category" 
                                    checked={categoryId === ''} 
                                    onChange={() => setCategoryId('')} 
                                    style={{ width: '18px', height: '18px' }}
                                />
                                <span style={{ fontSize: '0.95rem' }}>All Categories</span>
                            </label>
                            {categories.map(cat => (
                                <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }}>
                                    <input 
                                        type="radio" 
                                        name="category" 
                                        checked={categoryId == cat.id} 
                                        onChange={() => setCategoryId(cat.id)} 
                                        style={{ width: '18px', height: '18px' }}
                                    />
                                    <span style={{ fontSize: '0.95rem' }}>{cat.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '2.5rem' }}>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Price Range</h4>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input 
                                type="number" 
                                placeholder="Min" 
                                value={minPrice} 
                                onChange={(e) => setMinPrice(e.target.value)} 
                                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', fontSize: '0.85rem', padding: '0.6rem' }}
                            />
                            <span style={{ color: 'var(--border)' }}>-</span>
                            <input 
                                type="number" 
                                placeholder="Max" 
                                value={maxPrice} 
                                onChange={(e) => setMaxPrice(e.target.value)} 
                                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', fontSize: '0.85rem', padding: '0.6rem' }}
                            />
                        </div>
                    </div>

                    <button 
                        onClick={resetFilters} 
                        style={{ width: '100%', padding: '0.8rem', background: 'transparent', border: '1px solid var(--border)', fontSize: '0.9rem', color: 'var(--text-muted)' }}
                    >
                        Reset All Filters
                    </button>
                </aside>

                <main style={{ flex: 1 }}>
                    {/* Search Bar Top */}
                    <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
                        <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                            type="text" 
                            placeholder="Find your next essential..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', fontSize: '1.1rem', background: 'white', border: '1px solid var(--border)', borderRadius: '12px' }}
                        />
                    </div>

                    {loading ? (
                         <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)', fontSize: '1.2rem' }}>Browsing inventory...</div>
                    ) : (
                        <div className="grid grid-cols-3">
                            <AnimatePresence>
                                {products.map(product => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        key={product.id}
                                    >
                                        <Link to={`/product/${product.id}`} className="product-card" style={{ display: 'block' }}>
                                            <div style={{ 
                                                aspectRatio: '1', 
                                                background: '#f4f4f4', 
                                                borderRadius: '16px', 
                                                overflow: 'hidden', 
                                                marginBottom: '1rem',
                                                transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                            }}>
                                                {product.imageUrl ? (
                                                    <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.4s transform' }} className="card-img" />
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                                        <ShoppingBag size={48} color="#ddd" strokeWidth={1} />
                                                    </div>
                                                )}
                                            </div>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.2rem' }}>{product.name}</h3>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.6rem' }}>{product.category?.name}</p>
                                            <p style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>${product.price}</p>
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {products.length === 0 && (
                                <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '5rem' }}>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No matches found.</h3>
                                    <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or search terms.</p>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Shop;
