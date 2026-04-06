import { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Trash2, Edit3, X, Search, AlertCircle, ShoppingCart, ChevronDown, Package, Layers } from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Filters
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [subCategoryId, setSubCategoryId] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    
    // Form state
    const [formData, setFormData] = useState({ 
        name: '', description: '', price: '', stock: '', categoryId: '', subCategoryId: '', imageUrl: '',
        variants: []
    });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, [search, categoryId, subCategoryId, minPrice, maxPrice]); // Refetch on filter change

    const fetchData = async () => {
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
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch subcategories when category changes in form or filter
    const fetchSubCategories = async (catId) => {
        if (!catId) {
            setSubCategories([]);
            return;
        }
        try {
            const { data } = await api.get(`/subcategories/category/${catId}`);
            setSubCategories(data);
        } catch (err) {
            console.error('Error fetching subcategories:', err);
        }
    };

    const handleCategoryChange = (e) => {
        const id = e.target.value;
        setCategoryId(id);
        setSubCategoryId(''); // Reset subcategory filter
    };

    const handleFormCategoryChange = (e) => {
        const id = e.target.value;
        setFormData({ ...formData, categoryId: id, subCategoryId: '' });
        fetchSubCategories(id);
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
                subCategoryId: prod.subCategoryId || '',
                variants: prod.variants || []
            });
            if (prod.categoryId) fetchSubCategories(prod.categoryId);
            setIsEditing(true);
        } else {
            setFormData({ name: '', description: '', price: '', stock: '', categoryId: '', subCategoryId: '', imageUrl: '', variants: [] });
            setSubCategories([]);
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
            <div className="glass" style={{ padding: '1.2rem', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: '100%', paddingLeft: '2.5rem', background: '#ffffff' }}
                    />
                </div>
                <select 
                    value={categoryId} 
                    onChange={handleCategoryChange}
                    style={{ background: '#ffffff' }}
                >
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select 
                    value={subCategoryId} 
                    onChange={(e) => setSubCategoryId(e.target.value)}
                    style={{ background: '#ffffff' }}
                    disabled={!categoryId}
                >
                    <option value="">All SubCategories</option>
                    {/* In a real filter we might want all subcategories or just relevant ones */}
                    {/* For now, we'll keep it simple: fetch subcategories when category is selected */}
                </select>
                <input 
                    type="number" 
                    placeholder="Min Price" 
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    style={{ background: '#ffffff' }}
                />
                <input 
                    type="number" 
                    placeholder="Max Price" 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    style={{ background: '#ffffff' }}
                />
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Updating inventory...</div>
            ) : (
                <div className="glass" style={{ overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'var(--bg-dark)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                <th style={{ padding: '1.2rem' }}>Product</th>
                                <th style={{ padding: '1.2rem' }}>Collection / Sub</th>
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
                                            <div style={{ width: '48px', height: '48px', background: 'var(--bg-dark)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                                {prod.imageUrl ? (
                                                    <img src={prod.imageUrl} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <ShoppingCart size={22} style={{ margin: '13px', color: 'var(--text-muted)' }} />
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{prod.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Stock: {prod.stock}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <div style={{ fontWeight: 500 }}>{prod.category?.name || '-'}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{prod.subcategory?.name || 'Standard'}</div>
                                    </td>
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
                <div className="modal-overlay">
                    <form onSubmit={handleSubmit} className="modal-content" style={{ width: '100%', maxWidth: '800px', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Package size={24} /> {isEditing ? 'Edit Frisk Product' : 'Add New Frisk Product'}
                            </h2>
                            <button type="button" onClick={closeModal} style={{ background: 'transparent', color: 'var(--text-muted)' }}><X /></button>
                        </div>

                        {error && <div className="error-alert"><AlertCircle size={18} /> {error}</div>}

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
                                <label className="label">Master Category</label>
                                <select value={formData.categoryId} onChange={handleFormCategoryChange} style={{ width: '100%' }} required>
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label">SubCategory</label>
                                <select value={formData.subCategoryId} onChange={(e) => setFormData({ ...formData, subCategoryId: e.target.value })} style={{ width: '100%' }} disabled={!formData.categoryId}>
                                    <option value="">None / Standard</option>
                                    {subCategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label className="label">Image URL</label>
                                <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} style={{ width: '100%' }} />
                            </div>
                        </div>

                        {/* Variants Section */}
                        <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <Layers size={18} /> Product Variants
                                </h3>
                                <button type="button" onClick={addVariant} style={{ background: 'rgba(34, 211, 238, 0.1)', color: 'var(--accent)', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                                    <Plus size={14} /> Add Variant
                                </button>
                            </div>

                            {formData.variants.map((v, idx) => (
                                <div key={idx} style={{ padding: '1rem', marginBottom: '1rem', background: 'var(--bg-dark)', borderRadius: '12px', border: '1px solid var(--border)' }}>
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
                            <button type="button" onClick={closeModal} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                            <button type="submit" className="btn-primary" style={{ flex: 1 }}>{isEditing ? 'Update ' : 'Create '} Asset</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Products;
