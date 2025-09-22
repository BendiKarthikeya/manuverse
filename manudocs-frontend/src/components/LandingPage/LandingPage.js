import React, { useState, useEffect } from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import BackedBySection from './BackedBySection';
import Footer from './Footer';

const LandingPage = ({ onPageChange, user, onLogout }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkDevice = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkDevice();
        window.addEventListener('resize', checkDevice);

        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Header - Always visible with user state */}
            <Header
                onPageChange={onPageChange}
                user={user}
                onLogout={onLogout}
            />

            {/* Rest of landing page */}
            <HeroSection isMobile={isMobile} onPageChange={onPageChange} user={user} />
            <BackedBySection />
            <Footer />
        </div>
    );
};

export default LandingPage;
