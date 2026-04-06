import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { ChevronRight, Layers, Package, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        // Fetch subcategories for each
        const catsWithSubs = await Promise.all(data.map(async (cat) => {
            try {
                const subRes = await api.get(`/subcategories/category/${cat.id}`);
                return { ...cat, subcategories: subRes.data };
            } catch (e) {
                return { ...cat, subcategories: [] };
            }
        }));
        setCategories(catsWithSubs);
      } catch (error) {
        console.error('Error fetching categories', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="categories-page container section-padding">
      <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-2px', marginBottom: '1rem' }}>
          Frisk <span style={{ color: 'var(--primary)' }}>Collections</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Explore our meticulously curated taxonomies of design and function.
        </p>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>Classifying collections...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          {categories.map((category, idx) => (
            <motion.section 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                key={category.id} 
                style={{ borderBottom: '1px solid var(--border)', paddingBottom: '4rem' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem' }}>
                {/* Category Info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                    <Layers size={24} />
                    <span style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Master Collection</span>
                  </div>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>{category.name}</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                    {category.description || `The ${category.name} collection features our most distinct and sought-after assets, curated for those who demand excellence.`}
                  </p>
                  <Link to={`/shop?categoryId=${category.id}`} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    View All {category.name} <ArrowRight size={18} />
                  </Link>
                </div>

                {/* SubCategories Grid */}
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2rem', color: 'var(--text-main)' }}>Sub-Collections</h3>
                  {category.subcategories && category.subcategories.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                      {category.subcategories.map(sub => (
                        <Link 
                            to={`/shop?categoryId=${category.id}&subCategoryId=${sub.id}`} 
                            key={sub.id} 
                            className="glass"
                            style={{ 
                                padding: '1.5rem', 
                                borderRadius: '16px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '1.2rem',
                                textDecoration: 'none',
                                color: 'inherit',
                                border: '1px solid var(--border)',
                                transition: 'all 0.3s'
                            }}
                        >
                          <div style={{ width: '50px', height: '50px', background: 'var(--bg-dark)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {sub.imageUrl ? <img src={sub.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} /> : <Package size={24} color="var(--text-muted)" />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{sub.name}</h4>
                            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>Explore Category</span>
                          </div>
                          <ChevronRight size={20} color="var(--border)" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="glass" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', borderRadius: '16px' }}>
                      No sub-collections available for this master collection yet.
                    </div>
                  )}
                </div>
              </div>
            </motion.section>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
