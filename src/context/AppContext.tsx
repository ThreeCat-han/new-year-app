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

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AppState>({
        userName: '',
        friendName: '',
        relationship: 'friend',
        currentTheme: 'warm',
        scores: {
            catchLuck: 0,
            puzzleCompleted: false,
        },
    });

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
