import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { themes } from '../theme/themeConfig';

export const LaunchPage: React.FC = () => {
    const { currentTheme } = useApp();
    const theme = themes[currentTheme];
    const navigate = useNavigate();

    useEffect(() => {
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const random = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
                ...defaults,
                particleCount,
                origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 },
                colors: theme.fireworks
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 },
                colors: theme.fireworks
            });
        }, 250);

        return () => clearInterval(interval);
    }, [theme]);

    if (!theme) return <div>Loading...</div>;

    return (
        <div className={`h-screen w-full flex flex-col items-center justify-center relative overflow-hidden ${theme.colors.background}`}>
            {/* Background gradient handled by className */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-center px-4 mb-20 z-10"
            >
                <h1
                    className={`text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-sm tracking-wide ${theme.font}`}
                    style={{ color: theme.colors.text }}
                >
                    新的一年，<br />
                    新的祝福正在生成…
                </h1>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="z-10"
            >
                <Button
                    size="lg"
                    onClick={() => navigate('/input')}
                    className="animate-pulse shadow-xl"
                >
                    进入我的新年小屋 🏠
                </Button>
            </motion.div>
        </div>
    );
};
