import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Zap, ShieldCheck, Truck } from 'lucide-react';
import api from '../api';
import { motion } from 'framer-motion';
import BannerSlider from '../components/BannerSlider';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/products');
        setFeaturedProducts(data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching featured products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="home-page">
      <BannerSlider />

      {/* Features */}
      <section className="section-padding container">
        <div className="grid grid-cols-3" style={{ gap: '3rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}><Truck size={32} style={{ margin: '0 auto' }} /></div>
            <h3 style={{ marginBottom: '0.5rem' }}>Fast Shipping</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Express delivery worldwide on all premium orders over $100.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}><ShieldCheck size={32} style={{ margin: '0 auto' }} /></div>
            <h3 style={{ marginBottom: '0.5rem' }}>Secure Checkout</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fully encrypted payment processing for your peace of mind.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}><Zap size={32} style={{ margin: '0 auto' }} /></div>
            <h3 style={{ marginBottom: '0.5rem' }}>Quality Guaranteed</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Every product is hand-picked and tested for the highest standards.</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Featured Products</h2>
              <p style={{ color: 'var(--text-muted)' }}>The best of contemporary design and tech.</p>
            </div>
            <Link to="/shop" style={{ color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              View All <ArrowRight size={18} />
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
    </div>
  );
};

export default Home;
