import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { themes } from '../../theme/themeConfig';

interface CardProps {
    title: string;
    icon: React.ReactNode;
    children?: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ title, icon, children, onClick, className = '' }) => {
    const { currentTheme } = useApp();
    const theme = themes[currentTheme];

    return (
        <motion.div
            whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            whileTap={{ scale: 0.98 }}
            className={`p-6 rounded-2xl shadow-md cursor-pointer flex flex-col items-center justify-center gap-4 text-center ${theme.colors.cardBg} ${theme.colors.textPrimary} ${className}`}
            style={{
                border: `2px solid ${theme.colors.secondary}`,
            }}
            onClick={onClick}
        >
            <div className="text-4xl text-primary">{icon}</div>
            <h3 className="text-xl font-bold">{title}</h3>
            {children}
        </motion.div>
    );
};
