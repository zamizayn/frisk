import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';
import { Search, ShoppingBag, SlidersHorizontal, ChevronRight, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters from URL or State
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '');
    const [subCategoryId, setSubCategoryId] = useState(searchParams.get('subCategoryId') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

    useEffect(() => {
        fetchData();
        // Update URL params
        const params = {};
        if (search) params.search = search;
        if (categoryId) params.categoryId = categoryId;
        if (subCategoryId) params.subCategoryId = subCategoryId;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        setSearchParams(params);
    }, [search, categoryId, subCategoryId, minPrice, maxPrice]);

    useEffect(() => {
        if (categoryId) {
            fetchSubCategories(categoryId);
        } else {
            setSubCategories([]);
            setSubCategoryId('');
        }
    }, [categoryId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams();
            if (search) query.append('search', search);
            if (categoryId) query.append('categoryId', categoryId);
            if (subCategoryId) query.append('subCategoryId', subCategoryId);
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

    const fetchSubCategories = async (catId) => {
        try {
            const { data } = await api.get(`/subcategories/category/${catId}`);
            setSubCategories(data);
        } catch (err) {
            console.error('Error fetching subcategories', err);
        }
    };

    const resetFilters = () => {
        setSearch('');
        setCategoryId('');
        setSubCategoryId('');
        setMinPrice('');
        setMaxPrice('');
    };

    return (
        <div className="shop-page container section-padding">
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '-1.5px' }}>The Frisk Collection</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Meticulously designed products for the precision-oriented user.</p>
            </header>

            <div style={{ display: 'flex', gap: '3rem' }}>
                {/* Desktop Filters Sidebar */}
                <aside style={{ width: '280px', flexShrink: 0 }} className="desktop-filters">
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 800 }}>
                            <SlidersHorizontal size={18} /> FILTERS
                        </h3>

                        <div style={{ marginBottom: '2rem' }}>
                            <h4 style={{ fontSize: '0.8rem', marginBottom: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700 }}>Master Collection</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div 
                                    onClick={() => setCategoryId('')}
                                    style={{ 
                                        padding: '0.6rem 0.8rem', 
                                        borderRadius: '8px', 
                                        cursor: 'pointer',
                                        background: !categoryId ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                        color: !categoryId ? 'var(--primary)' : 'var(--text-main)',
                                        fontSize: '0.95rem',
                                        fontWeight: !categoryId ? 700 : 500,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    All Collections
                                </div>
                                {categories.map(cat => (
                                    <div key={cat.id}>
                                        <div 
                                            onClick={() => setCategoryId(cat.id)}
                                            style={{ 
                                                padding: '0.6rem 0.8rem', 
                                                borderRadius: '8px', 
                                                cursor: 'pointer',
                                                background: categoryId == cat.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                                color: categoryId == cat.id ? 'var(--primary)' : 'var(--text-main)',
                                                fontSize: '0.95rem',
                                                fontWeight: categoryId == cat.id ? 700 : 500,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between'
                                            }}
                                        >
                                            {cat.name}
                                            {categoryId == cat.id && <ChevronRight size={16} />}
                                        </div>
                                        
                                        {/* SubCategories Nested */}
                                        {categoryId == cat.id && subCategories.length > 0 && (
                                            <div style={{ marginLeft: '1.5rem', marginTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', borderLeft: '1px solid var(--border)' }}>
                                                {subCategories.map(sub => (
                                                    <div 
                                                        key={sub.id}
                                                        onClick={() => setSubCategoryId(sub.id)}
                                                        style={{ 
                                                            padding: '0.4rem 0.8rem', 
                                                            cursor: 'pointer',
                                                            color: subCategoryId == sub.id ? 'var(--accent)' : 'var(--text-muted)',
                                                            fontSize: '0.85rem',
                                                            fontWeight: subCategoryId == sub.id ? 700 : 400
                                                        }}
                                                    >
                                                        {sub.name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h4 style={{ fontSize: '0.8rem', marginBottom: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700 }}>Price Range</h4>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <input 
                                    type="number" 
                                    placeholder="Min" 
                                    value={minPrice} 
                                    onChange={(e) => setMinPrice(e.target.value)} 
                                    style={{ background: 'var(--bg-dark)', border: '1px solid var(--border)', fontSize: '0.85rem', padding: '0.6rem', width: '100%', borderRadius: '8px' }}
                                />
                                <input 
                                    type="number" 
                                    placeholder="Max" 
                                    value={maxPrice} 
                                    onChange={(e) => setMaxPrice(e.target.value)} 
                                    style={{ background: 'var(--bg-dark)', border: '1px solid var(--border)', fontSize: '0.85rem', padding: '0.6rem', width: '100%', borderRadius: '8px' }}
                                />
                            </div>
                        </div>

                        <button 
                            onClick={resetFilters} 
                            style={{ width: '100%', padding: '0.8rem', background: 'transparent', border: '1px solid var(--border)', fontSize: '0.9rem', color: 'var(--text-muted)', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            Reset Selection
                        </button>
                    </div>
                </aside>

                <main style={{ flex: 1 }}>
                    {/* Search Bar Top */}
                    <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
                        <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                            type="text" 
                            placeholder="Search Frisk inventory..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', fontSize: '1.1rem', background: 'white', border: '1px solid var(--border)', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                        />
                    </div>

                    {loading ? (
                         <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)', fontSize: '1.2rem' }}>Browsing inventory...</div>
                    ) : (
                        <div className="grid grid-cols-3">
                            <AnimatePresence mode='popLayout'>
                                {products.map(product => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        key={product.id}
                                    >
                                        <Link to={`/product/${product.id}`} className="product-card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                                            <div className="glass" style={{ 
                                                aspectRatio: '1', 
                                                background: '#fff', 
                                                borderRadius: '20px', 
                                                overflow: 'hidden', 
                                                marginBottom: '1.2rem',
                                                border: '1px solid var(--border)',
                                                position: 'relative'
                                            }}>
                                                {product.imageUrl ? (
                                                    <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                                        <ShoppingBag size={48} color="#eee" strokeWidth={1} />
                                                    </div>
                                                )}
                                                {product.subcategory && (
                                                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.9)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', backdropFilter: 'blur(4px)' }}>
                                                        {product.subcategory.name}
                                                    </div>
                                                )}
                                            </div>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.3rem' }}>{product.name}</h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                                                <Layers size={14} color="var(--text-muted)" />
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{product.category?.name}</p>
                                            </div>
                                            <p style={{ fontWeight: 900, fontSize: '1.3rem', color: 'var(--primary)' }}>${product.price}</p>
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {products.length === 0 && (
                                <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '5rem' }}>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 800 }}>No results in Frisk Inventory.</h3>
                                    <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or search terms.</p>
                                    <button onClick={resetFilters} className="btn-primary" style={{ marginTop: '2rem' }}>Clear All Filters</button>
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
