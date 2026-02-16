import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { type ThemeKey } from '../theme/themeConfig';

interface AppState {
    userName: string;
    friendName: string;
    relationship: 'friend' | 'lover' | 'family';
    currentTheme: ThemeKey;
    scores: {
        catchLuck: number;
        puzzleCompleted: boolean;
    };
}

interface AppContextType extends AppState {
    setUserName: (name: string) => void;
    setFriendName: (name: string) => void;
    setRelationship: (rel: 'friend' | 'lover' | 'family') => void;
    setTheme: (theme: ThemeKey) => void;
    updateScore: (game: 'catchLuck' | 'puzzle', value: number | boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getInitialState = (): AppState => {
    // 1. 尝试从 URL Hash 获取 (优先级最高，用于分享链接)
    const hash = window.location.hash;
    const queryString = hash.includes('?') ? hash.split('?')[1] : '';
    const params = new URLSearchParams(queryString);

    const u = params.get('u');
    const f = params.get('f');
    const r = params.get('r');

    // 2. 尝试从 LocalStorage 获取
    const persisted = localStorage.getItem('happy_new_year_app_state');
    const savedState = persisted ? JSON.parse(persisted) : null;

    return {
        userName: u || savedState?.userName || '',
        friendName: f || savedState?.friendName || '',
        relationship: (r as any) || savedState?.relationship || 'friend',
        currentTheme: savedState?.currentTheme || 'warm',
        scores: savedState?.scores || {
            catchLuck: 0,
            puzzleCompleted: false,
        },
    };
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AppState>(getInitialState());

    // 每次状态改变时持久化到 LocalStorage
    React.useEffect(() => {
        localStorage.setItem('happy_new_year_app_state', JSON.stringify(state));
    }, [state]);

    const setUserName = (name: string) => setState(prev => ({ ...prev, userName: name }));
    const setFriendName = (name: string) => setState(prev => ({ ...prev, friendName: name }));
    const setRelationship = (rel: 'friend' | 'lover' | 'family') => setState(prev => ({ ...prev, relationship: rel }));
    const setTheme = (theme: ThemeKey) => setState(prev => ({ ...prev, currentTheme: theme }));

    const updateScore = (game: 'catchLuck' | 'puzzle', value: number | boolean) => {
        setState(prev => {
            let newValue = value;
            if (game === 'catchLuck' && typeof value === 'number') {
                newValue = Math.max(prev.scores.catchLuck, value);
            }
            return {
                ...prev,
                scores: {
                    ...prev.scores,
                    [game === 'catchLuck' ? 'catchLuck' : 'puzzleCompleted']: newValue,
                },
            };
        });
    };

    return (
        <AppContext.Provider value={{ ...state, setUserName, setFriendName, setRelationship, setTheme, updateScore }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
