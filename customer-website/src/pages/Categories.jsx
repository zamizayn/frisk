import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { LayoutGrid, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories');
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }}>Exploring categories...</div>;

    return (
        <div className="container section-padding">
            <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-1px' }}>Browse Collections</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Meticulously curated products grouped by expertise and performance.</p>
            </header>

            <div className="grid grid-cols-3" style={{ gap: '2.5rem' }}>
                {categories.map((category, index) => (
                    <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link to={`/shop?categoryId=${category.id}`} className="glass" style={{ 
                            display: 'block', 
                            padding: '2rem', 
                            borderRadius: '24px', 
                            textAlign: 'center',
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'var(--transition)',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            border: '1px solid var(--border)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'var(--primary)' }}></div>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f0f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                                <LayoutGrid size={28} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>{category.name}</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                                Discover our premium range of {category.name.toLowerCase()} essentials.
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 700 }}>
                                View Collection <ArrowRight size={18} />
                            </div>
                        </Link>
                    </motion.div>
                ))}

                {categories.length === 0 && (
                    <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '5rem' }}>
                        <ShoppingBag size={48} color="#ddd" style={{ margin: '0 auto 1.5rem' }} />
                        <h3>Collections arriving soon.</h3>
                        <p style={{ color: 'var(--text-muted)' }}>We're currently curating the next generation of essentials.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories;
