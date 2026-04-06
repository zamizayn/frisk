import { useState, useEffect } from 'react';
import api from '../api';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const BannerSlider = () => {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const { data } = await api.get('/banners/active');
                setBanners(data);
            } catch (error) {
                console.error('Error fetching active banners', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    useEffect(() => {
        if (banners.length > 1) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % banners.length);
            }, 6000);
            return () => clearInterval(timer);
        }
    }, [banners]);

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

    if (loading) return <div style={{ height: '70vh', background: 'var(--bg-secondary)' }}></div>;
    if (banners.length === 0) return null;

    const currentBanner = banners[currentIndex];

    return (
        <section style={{ 
            position: 'relative', 
            height: '75vh', 
            overflow: 'hidden', 
            background: 'var(--bg-secondary)',
            margin: '2rem 1.5rem',
            borderRadius: '24px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
        }}>
            <AnimatePresence mode="wait">
                <Link to={currentBanner.link || '/shop'} key={currentIndex}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `url(${currentBanner.imageUrl})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer'
                        }}
                    />
                </Link>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        style={{ position: 'absolute', left: '30px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', color: 'var(--text-main)', padding: '0.8rem', borderRadius: '50%', backdropFilter: 'blur(10px)', border: '1px solid var(--border)', zIndex: 10, cursor: 'pointer' }}
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        style={{ position: 'absolute', right: '30px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', color: 'var(--text-main)', padding: '0.8rem', borderRadius: '50%', backdropFilter: 'blur(10px)', border: '1px solid var(--border)', zIndex: 10, cursor: 'pointer' }}
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Progress Indicators */}
                    <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.6rem', zIndex: 10 }}>
                        {banners.map((_, idx) => (
                            <div
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                style={{
                                    width: idx === currentIndex ? '30px' : '10px',
                                    height: '6px',
                                    background: idx === currentIndex ? 'var(--primary)' : 'rgba(0,0,0,0.1)',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    transition: 'var(--transition)'
                                }}
                            ></div>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

export default BannerSlider;
