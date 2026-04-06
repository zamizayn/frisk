import { useState, useEffect } from 'react';
import api from '../api';
import {
    Plus, Trash2, Edit3, X, Search, AlertCircle, ChevronDown, ChevronRight,
    Layers, Image as ImageIcon
} from 'lucide-react';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCategories, setExpandedCategories] = useState({});

    // Modals
    const [isCatModalOpen, setIsCatModalOpen] = useState(false);
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);

    // Form states
    const [catForm, setCatForm] = useState({ name: '', description: '', imageUrl: '' });
    const [subForm, setSubForm] = useState({ name: '', imageUrl: '', categoryId: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            // Updated backend includes subcategories in some endpoints or we fetch them separately
            // For now, let's fetch categories and subcategories separately or rely on nested include if implemented
            const { data } = await api.get('/categories');

            // Fetch subcategories for each category to ensure we have them
            const catsWithSubs = await Promise.all(data.map(async (cat) => {
                const subRes = await api.get(`/subcategories/category/${cat.id}`);
                return { ...cat, subcategories: subRes.data };
            }));

            setCategories(catsWithSubs);
        } catch (err) {
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    };

    // Category Actions
    const handleCatSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isEditing) {
                await api.put(`/categories/${catForm.id}`, catForm);
            } else {
                await api.post('/categories', catForm);
            }
            fetchCategories();
            closeCatModal();
        } catch (err) {
            setError(err.response?.data?.message || 'Action failed');
        }
    };

    const handleCatDelete = async (id) => {
        if (window.confirm('Delete category? This will also delete all subcategories.')) {
            try {
                await api.delete(`/categories/${id}`);
                fetchCategories();
            } catch (err) {
                alert('Error deleting category');
            }
        }
    };

    // SubCategory Actions
    const handleSubSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isEditing) {
                await api.put(`/subcategories/${subForm.id}`, subForm);
            } else {
                await api.post('/subcategories', subForm);
            }
            fetchCategories();
            closeSubModal();
        } catch (err) {
            setError(err.response?.data?.message || 'Action failed');
        }
    };

    const handleSubDelete = async (id) => {
        if (window.confirm('Delete this subcategory?')) {
            try {
                await api.delete(`/subcategories/${id}`);
                fetchCategories();
            } catch (err) {
                alert('Error deleting subcategory');
            }
        }
    };

    // Modal Helpers
    const openCatModal = (cat = null) => {
        if (cat) {
            setCatForm({ ...cat, imageUrl: cat.imageUrl || '' });
            setIsEditing(true);
        } else {
            setCatForm({ name: '', description: '', imageUrl: '' });
            setIsEditing(false);
        }
        setIsCatModalOpen(true);
    };

    const closeCatModal = () => {
        setIsCatModalOpen(false);
        setCatForm({ name: '', description: '', imageUrl: '' });
        setError('');
    };

    const openSubModal = (categoryId, sub = null) => {
        if (sub) {
            setSubForm(sub);
            setIsEditing(true);
        } else {
            setSubForm({ name: '', imageUrl: '', categoryId });
            setIsEditing(false);
        }
        setIsSubModalOpen(true);
    };

    const closeSubModal = () => {
        setIsSubModalOpen(false);
        setSubForm({ name: '', imageUrl: '', categoryId: '' });
        setError('');
    };

    const toggleExpand = (id) => {
        setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.8rem' }}>Collection Architecture</h1>
                <button className="btn-primary" onClick={() => openCatModal()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Add Category
                </button>
            </div>

            <div className="glass" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Search size={20} style={{ color: 'var(--text-muted)' }} />
                <input
                    type="text"
                    placeholder="Search master categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ background: 'transparent', border: 'none', width: '100%', fontSize: '1rem', color: '#1e293b' }}
                />
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Synchronizing collections...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredCategories.map(cat => (
                        <div key={cat.id} className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                            {/* Category Row */}
                            <div style={{
                                padding: '1.2rem',
                                display: 'flex',
                                alignItems: 'center',
                                background: expandedCategories[cat.id] ? 'var(--bg-dark)' : 'transparent',
                                borderBottom: expandedCategories[cat.id] ? '1px solid var(--border)' : 'none'
                            }}>
                                <button onClick={() => toggleExpand(cat.id)} style={{ background: 'transparent', padding: '0.4rem', color: 'var(--text-muted)' }}>
                                    {expandedCategories[cat.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                </button>

                                <div style={{ width: '48px', height: '48px', background: 'var(--bg-dark)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem', marginLeft: '0.5rem' }}>
                                    {cat.imageUrl ? <img src={cat.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} /> : <ImageIcon size={20} color="var(--text-muted)" />}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{cat.name}</h3>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cat.description || 'No description'}</p>
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => openSubModal(cat.id)} className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <Plus size={14} /> SubCategory
                                    </button>
                                    <button onClick={() => openCatModal(cat)} style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '0.4rem' }}>
                                        <Edit3 size={16} />
                                    </button>
                                    <button onClick={() => handleCatDelete(cat.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.4rem' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* SubCategories List */}
                            {expandedCategories[cat.id] && (
                                <div style={{ padding: '0.5rem 1.2rem 1.2rem 3.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                        {cat.subcategories && cat.subcategories.length > 0 ? (
                                            cat.subcategories.map(sub => (
                                                <div key={sub.id} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    padding: '0.8rem',
                                                    background: 'white',
                                                    borderRadius: '12px',
                                                    border: '1px solid var(--border)',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                                                }}>
                                                    <div style={{ width: '32px', height: '32px', background: 'var(--bg-dark)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
                                                        {sub.imageUrl ? <img src={sub.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} /> : <Layers size={16} color="var(--text-muted)" />}
                                                    </div>
                                                    <span style={{ fontWeight: 500, flex: 1 }}>{sub.name}</span>
                                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                        <button onClick={() => openSubModal(cat.id, sub)} style={{ background: 'transparent', color: 'var(--text-muted)', padding: '0.3rem' }}>
                                                            <Edit3 size={14} />
                                                        </button>
                                                        <button onClick={() => handleSubDelete(sub.id)} style={{ background: 'transparent', color: 'var(--danger)', padding: '0.3rem', opacity: 0.7 }}>
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', background: 'var(--bg-dark)', borderRadius: '12px' }}>
                                                No subcategories in this collection.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Category Modal */}
            {isCatModalOpen && (
                <div className="modal-overlay">
                    <form onSubmit={handleCatSubmit} className="glass modal-content" style={{ width: '100%', maxWidth: '500px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h2>{isEditing ? 'Edit Category' : 'New Category'}</h2>
                        {error && <div className="error-alert"><AlertCircle size={18} /> {error}</div>}
                        <div>
                            <label className="label">Category Name</label>
                            <input type="text" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} style={{ width: '100%' }} required />
                        </div>
                        <div>
                            <label className="label">Description</label>
                            <textarea value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} style={{ width: '100%', minHeight: '80px' }} />
                        </div>
                        <div>
                            <label className="label">Image URL (Optional)</label>
                            <input type="text" value={catForm.imageUrl} onChange={(e) => setCatForm({ ...catForm, imageUrl: e.target.value })} style={{ width: '100%' }} placeholder="https://..." />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="button" onClick={closeCatModal} className="btn-secondary">Cancel</button>
                            <button type="submit" className="btn-primary" style={{ flex: 1 }}>{isEditing ? 'Update' : 'Create'}</button>
                        </div>
                    </form>
                </div>
            )}

            {/* SubCategory Modal */}
            {isSubModalOpen && (
                <div className="modal-overlay">
                    <form onSubmit={handleSubSubmit} className="glass modal-content" style={{ width: '100%', maxWidth: '500px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h2>{isEditing ? 'Edit SubCategory' : 'New SubCategory'}</h2>
                        {error && <div className="error-alert"><AlertCircle size={18} /> {error}</div>}
                        <div>
                            <label className="label">SubCategory Name</label>
                            <input type="text" value={subForm.name} onChange={(e) => setSubForm({ ...subForm, name: e.target.value })} style={{ width: '100%' }} required />
                        </div>
                        <div>
                            <label className="label">Image URL (Optional)</label>
                            <input type="text" value={subForm.imageUrl} onChange={(e) => setSubForm({ ...subForm, imageUrl: e.target.value })} style={{ width: '100%' }} placeholder="https://..." />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="button" onClick={closeSubModal} className="btn-secondary">Cancel</button>
                            <button type="submit" className="btn-primary" style={{ flex: 1 }}>{isEditing ? 'Update' : 'Create'}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Categories;
