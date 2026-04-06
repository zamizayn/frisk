import { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Trash2, Edit3, X, Image as ImageIcon, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';

const Banners = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', imageUrl: '', link: '', isActive: true });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const { data } = await api.get('/banners');
            setBanners(data);
        } catch (err) {
            console.error('Error fetching banners:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isEditing) {
                await api.put(`/banners/${formData.id}`, formData);
            } else {
                await api.post('/banners', formData);
            }
            fetchBanners();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this banner?')) {
            try {
                await api.delete(`/banners/${id}`);
                fetchBanners();
            } catch (err) {
                alert('Error deleting banner');
            }
        }
    };

    const toggleActive = async (banner) => {
        try {
            await api.put(`/banners/${banner.id}`, { ...banner, isActive: !banner.isActive });
            fetchBanners();
        } catch (err) {
            alert('Error toggling state');
        }
    };

    const openModal = (banner = null) => {
        if (banner) {
            setFormData(banner);
            setIsEditing(true);
        } else {
            setFormData({ title: '', description: '', imageUrl: '', link: '', isActive: true });
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
                <h1 style={{ fontSize: '1.8rem' }}>Homepage Banners</h1>
                <button className="btn-primary" onClick={() => openModal()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Add Banner
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Fetching your banners...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {banners.map(banner => (
                        <div key={banner.id} className="glass" style={{ 
                            overflow: 'hidden', 
                            border: banner.isActive ? '1px solid var(--primary)' : '1px solid var(--border)',
                            opacity: banner.isActive ? 1 : 0.6 
                        }}>
                            <div style={{ height: '180px', background: 'var(--bg-dark)', position: 'relative' }}>
                                {banner.imageUrl ? (
                                    <img src={banner.imageUrl} alt={banner.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                        <ImageIcon size={40} color="var(--text-muted)" />
                                    </div>
                                )}
                                <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => openModal(banner)} style={{ background: 'white', color: 'var(--primary)', padding: '0.4rem', borderRadius: '8px' }}>
                                        <Edit3 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(banner.id)} style={{ background: 'white', color: 'var(--danger)', padding: '0.4rem', borderRadius: '8px' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div style={{ padding: '1.2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{banner.title}</h3>
                                    <button onClick={() => toggleActive(banner)} style={{ background: 'transparent', padding: 0 }}>
                                        {banner.isActive ? <ToggleRight color="var(--primary)" size={28} /> : <ToggleLeft color="var(--text-muted)" size={28} />}
                                    </button>
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{banner.description}</p>
                                {banner.link && <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>Link: {banner.link}</div>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <form onSubmit={handleSubmit} className="glass" style={{ width: '100%', maxWidth: '500px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <h2>{isEditing ? 'Edit Banner' : 'New Promotion'}</h2>
                        {error && <div style={{ color: 'var(--danger)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertCircle size={16} /> {error}</div>}
                        
                        <div>
                            <label className="label">Title</label>
                            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%' }} required />
                        </div>
                        <div>
                            <label className="label">Description</label>
                            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', height: '80px', background: 'var(--bg-dark)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.8rem', color: 'white' }} />
                        </div>
                        <div>
                            <label className="label">Image URL</label>
                            <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} style={{ width: '100%' }} required />
                        </div>
                        <div>
                            <label className="label">Redirect Link (e.g. /shop)</label>
                            <input type="text" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} style={{ width: '100%' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="button" onClick={closeModal} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white' }}>Cancel</button>
                            <button type="submit" className="btn-primary" style={{ flex: 1 }}>{isEditing ? 'Save Changes' : 'Create Banner'}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Banners;
