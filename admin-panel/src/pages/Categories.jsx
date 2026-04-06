import { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Trash2, Edit3, X, Check, Search, AlertCircle } from 'lucide-react';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Form state
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/categories');
            setCategories(data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isEditing) {
                // Backend lacks updateCategory endpoint, would add if needed
                // await api.put(`/categories/${formData.id}`, formData);
            } else {
                await api.post('/categories', formData);
            }
            fetchCategories();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure? This may affect products in this category.')) {
            try {
                // await api.delete(`/categories/${id}`);
                // fetchCategories();
                alert('Delete functionality depends on backend implementation');
            } catch (err) {
                alert('Error deleting category');
            }
        }
    };

    const openModal = (cat = null) => {
        if (cat) {
            setFormData(cat);
            setIsEditing(true);
        } else {
            setFormData({ name: '', description: '' });
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', description: '' });
        setError('');
    };

    const filteredCategories = categories.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.8rem' }}>Categories Management</h1>
                <button className="btn-primary" onClick={() => openModal()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Add Category
                </button>
            </div>

            <div className="glass" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Search size={20} style={{ color: 'var(--text-muted)' }} />
                <input 
                    type="text" 
                    placeholder="Search categories..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ background: 'transparent', border: 'none', width: '100%', fontSize: '1rem' }}
                />
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading categories...</div>
            ) : (
                <div className="glass" style={{ overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                <th style={{ padding: '1.2rem' }}>ID</th>
                                <th style={{ padding: '1.2rem' }}>Name</th>
                                <th style={{ padding: '1.2rem' }}>Description</th>
                                <th style={{ padding: '1.2rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.map(cat => (
                                <tr key={cat.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1.2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>#{cat.id}</td>
                                    <td style={{ padding: '1.2rem', fontWeight: 600 }}>{cat.name}</td>
                                    <td style={{ padding: '1.2rem', color: 'var(--text-muted)' }}>{cat.description || 'No description'}</td>
                                    <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button onClick={() => openModal(cat)} style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '0.4rem' }}>
                                                <Edit3 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(cat.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.4rem' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredCategories.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No categories found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <form 
                        onSubmit={handleSubmit}
                        className="glass" 
                        style={{ width: '100%', maxWidth: '500px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2>{isEditing ? 'Edit Category' : 'New Category'}</h2>
                            <button type="button" onClick={closeModal} style={{ background: 'transparent', color: 'var(--text-muted)' }}><X /></button>
                        </div>

                        {error && (
                            <div style={{ color: 'var(--danger)', fontSize: '0.9rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.8rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <AlertCircle size={18} /> {error}
                            </div>
                        )}

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Category Name</label>
                            <input 
                                type="text" 
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                style={{ width: '100%' }}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Description</label>
                            <textarea 
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                style={{ width: '100%', minHeight: '100px' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="button" onClick={closeModal} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white' }}>Cancel</button>
                            <button type="submit" className="btn-primary" style={{ flex: 1 }}>{isEditing ? 'Update' : 'Create'} Category</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Categories;
