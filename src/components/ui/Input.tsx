import React from 'react';
import { useApp } from '../../context/AppContext';
import { themes } from '../../theme/themeConfig';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
    const { currentTheme } = useApp();
    const theme = themes[currentTheme];

    return (
        <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-bold" style={{ color: theme.colors.text }}>
                {label}
            </label>
            <input
                className={`px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors ${theme.colors.textPrimary} ${className}`}
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderColor: theme.colors.secondary,
                }}
                {...props}
            />
        </div>
    );
};
