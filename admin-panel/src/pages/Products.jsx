import { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Trash2, Edit3, X, Search, AlertCircle, ShoppingCart, ChevronDown, Package } from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Filters
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    
    // Form state
    const [formData, setFormData] = useState({ 
        name: '', description: '', price: '', stock: '', categoryId: '', imageUrl: '',
        variants: []
    });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, [search, categoryId, minPrice, maxPrice]); // Refetch on filter change

    const fetchData = async () => {
        try {
            // Include filters in query
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
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const addVariant = () => {
        setFormData({
            ...formData,
            variants: [...formData.variants, { name: 'Size', value: '', sku: '', stock: 0, priceOverride: '' }]
        });
    };

    const removeVariant = (index) => {
        const newVariants = formData.variants.filter((_, i) => i !== index);
        setFormData({ ...formData, variants: newVariants });
    };

    const updateVariant = (index, field, val) => {
        const newVariants = [...formData.variants];
        newVariants[index][field] = val;
        setFormData({ ...formData, variants: newVariants });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isEditing) {
                await api.put(`/products/${formData.id}`, formData);
            } else {
                await api.post('/products', formData);
            }
            fetchData();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this product permanently?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchData();
            } catch (err) {
                alert('Error deleting product');
            }
        }
    };

    const openModal = (prod = null) => {
        if (prod) {
            setFormData({ 
                ...prod, 
                categoryId: prod.categoryId || '',
                variants: prod.variants || []
            });
            setIsEditing(true);
        } else {
            setFormData({ name: '', description: '', price: '', stock: '', categoryId: '', imageUrl: '', variants: [] });
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setError('');
    };

    return (
        <div className="page-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.8rem' }}>Product Inventory</h1>
                <button className="btn-primary" onClick={() => openModal()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Add Product
                </button>
            </div>

            {/* Filter Bar */}
            <div className="glass" style={{ padding: '1.2rem', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: '100%', paddingLeft: '2.5rem', background: 'var(--bg-dark)' }}
                    />
                </div>
                <select 
                    value={categoryId} 
                    onChange={(e) => setCategoryId(e.target.value)}
                    style={{ background: 'var(--bg-dark)' }}
                >
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input 
                    type="number" 
                    placeholder="Min Price" 
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    style={{ background: 'var(--bg-dark)' }}
                />
                <input 
                    type="number" 
                    placeholder="Max Price" 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    style={{ background: 'var(--bg-dark)' }}
                />
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Updating inventory...</div>
            ) : (
                <div className="glass" style={{ overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                <th style={{ padding: '1.2rem' }}>Product</th>
                                <th style={{ padding: '1.2rem' }}>Category</th>
                                <th style={{ padding: '1.2rem' }}>Variations</th>
                                <th style={{ padding: '1.2rem' }}>Base Price</th>
                                <th style={{ padding: '1.2rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(prod => (
                                <tr key={prod.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1.2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '40px', height: '40px', background: 'var(--bg-dark)', borderRadius: '8px', overflow: 'hidden' }}>
                                                {prod.imageUrl ? (
                                                    <img src={prod.imageUrl} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <ShoppingCart size={20} style={{ margin: '10px', color: 'var(--text-muted)' }} />
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{prod.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Stock: {prod.stock}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>{prod.category?.name || '-'}</td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            {prod.variants?.length > 0 ? `${prod.variants.length} variations` : 'Standard'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.2rem', fontWeight: 700, color: 'var(--accent)' }}>${prod.price}</td>
                                    <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button onClick={() => openModal(prod)} style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '0.4rem' }}>
                                                <Edit3 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(prod.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.4rem' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Main Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <form onSubmit={handleSubmit} className="glass" style={{ width: '100%', maxWidth: '800px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
                            <button type="button" onClick={closeModal} style={{ background: 'transparent', color: 'var(--text-muted)' }}><X /></button>
                        </div>

                        {error && <div style={{ color: 'var(--danger)', fontSize: '0.9rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.8rem', borderRadius: '8px' }}><AlertCircle size={18} /> {error}</div>}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label className="label">Product Name</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%' }} required />
                            </div>
                            <div>
                                <label className="label">Base Price ($)</label>
                                <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} style={{ width: '100%' }} required />
                            </div>
                            <div>
                                <label className="label">Base Stock</label>
                                <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} style={{ width: '100%' }} required />
                            </div>
                            <div>
                                <label className="label">Category</label>
                                <select value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} style={{ width: '100%' }} required>
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label">Image URL</label>
                                <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} style={{ width: '100%' }} />
                            </div>
                        </div>

                        {/* Variants Section */}
                        <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.1rem' }}>Product Variants</h3>
                                <button type="button" onClick={addVariant} style={{ background: 'rgba(34, 211, 238, 0.1)', color: 'var(--accent)', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                                    <Plus size={14} /> Add Variant
                                </button>
                            </div>

                            {formData.variants.map((v, idx) => (
                                <div key={idx} className="glass" style={{ padding: '1rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr) auto', gap: '0.8rem', alignItems: 'flex-end' }}>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Type (e.g. Size)</label>
                                            <input type="text" value={v.name} onChange={(e) => updateVariant(idx, 'name', e.target.value)} style={{ padding: '0.5rem', width: '100%' }} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Value (e.g. Red)</label>
                                            <input type="text" value={v.value} onChange={(e) => updateVariant(idx, 'value', e.target.value)} style={{ padding: '0.5rem', width: '100%' }} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SKU</label>
                                            <input type="text" value={v.sku} onChange={(e) => updateVariant(idx, 'sku', e.target.value)} style={{ padding: '0.5rem', width: '100%' }} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Price Over.</label>
                                            <input type="number" value={v.priceOverride} onChange={(e) => updateVariant(idx, 'priceOverride', e.target.value)} style={{ padding: '0.5rem', width: '100%' }} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stock</label>
                                            <input type="number" value={v.stock} onChange={(e) => updateVariant(idx, 'stock', e.target.value)} style={{ padding: '0.5rem', width: '100%' }} />
                                        </div>
                                        <button type="button" onClick={() => removeVariant(idx)} style={{ color: 'var(--danger)', padding: '0.5rem', background: 'transparent' }}><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="button" onClick={closeModal} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white' }}>Cancel</button>
                            <button type="submit" className="btn-primary" style={{ flex: 1 }}>{isEditing ? 'Save Changes' : 'Create Product'}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Products;
