import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { themes } from '../../theme/themeConfig';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    ...props
}) => {
    const { currentTheme } = useApp();
    const theme = themes[currentTheme];

    const baseStyles = 'rounded-full font-bold shadow-lg transition-transform active:scale-95 flex items-center justify-center';

    const sizeStyles = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    const variants = {
        primary: {
            backgroundColor: theme.colors.primary,
            color: '#fff',
        },
        secondary: {
            backgroundColor: theme.colors.secondary,
            color: theme.colors.text,
        },
        outline: {
            backgroundColor: 'transparent',
            border: `2px solid ${theme.colors.primary}`,
            color: theme.colors.primary,
        },
        ghost: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            color: theme.colors.primary,
        },
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${baseStyles} ${sizeStyles[size]} ${className}`}
            style={variants[variant]}
            {...props}
        >
            {children}
        </motion.button>
    );
};
