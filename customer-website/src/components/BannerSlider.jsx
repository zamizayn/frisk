import { useState, useEffect } from 'react';
import api from '../api';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
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

    // Auto-slide logic
    useEffect(() => {
        if (banners.length > 1) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % banners.length);
            }, 6000); // 6 seconds per slide
            return () => clearInterval(timer);
        }
    }, [banners]);

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

    if (loading) return <div style={{ height: '70vh', background: '#f8f9fa' }}></div>;
    if (banners.length === 0) return null;

    const currentBanner = banners[currentIndex];

    return (
        <section style={{ position: 'relative', height: '80vh', overflow: 'hidden', background: '#000' }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%), url(${currentBanner.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <div className="container">
                        <div style={{ maxWidth: '600px', color: 'white' }}>
                            <motion.h1 
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.1, letterSpacing: '-2px' }}
                            >
                                {currentBanner.title}
                            </motion.h1>
                            <motion.p 
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                style={{ fontSize: '1.2rem', marginBottom: '2.5rem', opacity: 0.9, lineHeight: 1.6 }}
                            >
                                {currentBanner.description}
                            </motion.p>
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Link to={currentBanner.link || '/shop'} className="btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '0.8rem', borderRadius: '12px' }}>
                                    Experience Now <ArrowRight size={22} />
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {banners.length > 1 && (
                <>
                    <button 
                        onClick={prevSlide}
                        style={{ position: 'absolute', left: '30px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', color: 'white', padding: '1rem', borderRadius: '50%', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button 
                        onClick={nextSlide}
                        style={{ position: 'absolute', right: '30px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', color: 'white', padding: '1rem', borderRadius: '50%', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Progress Indicators */}
                    <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.8rem' }}>
                        {banners.map((_, idx) => (
                            <div 
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                style={{ 
                                    width: idx === currentIndex ? '40px' : '10px', 
                                    height: '10px', 
                                    background: idx === currentIndex ? 'var(--primary)' : 'rgba(255,255,255,0.3)', 
                                    borderRadius: '5px',
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
