
export const themes = {
    warm: {
        id: 'warm',
        name: '暖心新年',
        colors: {
            primary: '#D32F2F', // Deep Red
            secondary: '#FFD700', // Gold
            background: 'bg-gradient-to-br from-red-500 via-orange-400 to-yellow-300',
            text: '#FFF5E6',
            accent: '#FFB800',
            cardBg: 'bg-white/90',
            textPrimary: 'text-red-900',
        },
        fireworks: ['#FFD700', '#FF4D4D', '#FFF5E6'],
        font: 'font-sans',
    },
    pixel: {
        id: 'pixel',
        name: '像素新年',
        colors: {
            primary: '#FF0044', // Pixel Red
            secondary: '#00FF99', // Pixel Green
            background: 'bg-zinc-900', // Dark background
            text: '#FFFFFF',
            accent: '#00CCFF', // Pixel Blue
            cardBg: 'bg-gray-800',
            textPrimary: 'text-white',
        },
        fireworks: ['#FF0044', '#00FF99', '#00CCFF', '#FFFF00'],
        font: 'font-mono',
    },
    healing: {
        id: 'healing',
        name: '温馨治愈',
        colors: {
            primary: '#FF9AA2', // Pastel Red
            secondary: '#B5EAD7', // Pastel Green
            background: 'bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100',
            text: '#6B7280',
            accent: '#FFDAC1', // Peach
            cardBg: 'bg-white/80',
            textPrimary: 'text-gray-700',
        },
        fireworks: ['#FFB7B2', '#E2F0CB', '#FFDAC1', '#FFFFD1'],
        font: 'font-serif',
    },
};

export type ThemeKey = keyof typeof themes;
export type Theme = typeof themes[ThemeKey];
