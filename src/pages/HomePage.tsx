import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { themes, type ThemeKey } from '../theme/themeConfig';
import { Card } from '../components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Gamepad2, Gift } from 'lucide-react';

export const HomePage: React.FC = () => {
    const { userName, friendName, currentTheme, setTheme, relationship, setUserName, setFriendName, setRelationship } = useApp();
    const theme = themes[currentTheme];
    const navigate = useNavigate();
    const location = useLocation();
    const [showThemeModal, setShowThemeModal] = useState(false);

    // 生成一个持久的 Key，当核心数据变化时强制组件重排/重挂载，修复交互失效问题
    const renderKey = `${userName}-${friendName}-${relationship}-${currentTheme}`;

    // 从 URL 中恢复信息
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const u = params.get('u');
        const f = params.get('f');
        const r = params.get('r');

        if (u && u !== userName) setUserName(u);
        if (f && f !== friendName) setFriendName(f);
        if (r && r !== relationship) setRelationship(r as any);
    }, [location.search, setUserName, setFriendName, setRelationship, userName, friendName, relationship]);

    const getRelationshipBadge = () => {
        switch (relationship) {
            case 'lover':
                return (
                    <motion.div
                        key="lover-badge"
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="mt-4 px-4 py-1 rounded-full bg-pink-100 text-pink-600 font-bold border border-pink-200 inline-flex items-center gap-2"
                    >
                        <span>❤️ 甜蜜恋人专用</span>
                    </motion.div>
                );
            case 'family':
                return (
                    <motion.div
                        key="family-badge"
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="mt-4 px-4 py-1 rounded-full bg-orange-100 text-orange-600 font-bold border border-orange-200 inline-flex items-center gap-2"
                    >
                        <span>🏠 温馨家人成团</span>
                    </motion.div>
                );
            case 'friend':
            default:
                return (
                    <motion.div
                        key="friend-badge"
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="mt-4 px-4 py-1 rounded-full bg-emerald-100 text-teal-700 font-bold border border-emerald-200 inline-flex items-center gap-2"
                    >
                        <span>🤝 最佳损友认证</span>
                    </motion.div>
                );
        }
    };

    return (
        <div key={renderKey} className={`min-h-screen p-6 flex flex-col items-center pt-12 ${theme.colors.background} transition-colors duration-500`}>
            <motion.header
                key={`${userName}-${friendName}`}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center mb-12"
            >
                <div className="text-sm font-bold uppercase tracking-widest mb-2 opacity-80" style={{ color: theme.colors.text }}>
                    Welcome to
                </div>
                <h1 className={`text-3xl font-black drop-shadow-sm ${theme.font}`} style={{ color: theme.colors.text }}>
                    {userName || 'User'} & {friendName || 'Friend'}<br />
                    <span className="text-2xl mt-2 block">的新年小屋 🏡</span>
                    {getRelationshipBadge()}
                </h1>
            </motion.header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                <Card
                    key={`game-${currentTheme}`}
                    title="互动小游戏"
                    icon={<Gamepad2 size={48} />}
                    onClick={() => navigate('/games')}
                    className="h-48"
                >
                    <p className="text-sm opacity-70">赢取好运分数!</p>
                </Card>

                <Card
                    key={`blessing-${currentTheme}`}
                    title="新年祝福匣"
                    icon={<Gift size={48} />}
                    onClick={() => navigate('/blessing')}
                    className="h-48"
                >
                    <p className="text-sm opacity-70">开启神秘惊喜...</p>
                </Card>

                <Card
                    key={`settings-${currentTheme}`}
                    title="更换主题"
                    icon={<Settings size={48} />}
                    onClick={() => setShowThemeModal(true)}
                    className="h-48"
                >
                    <p className="text-sm opacity-70">切换你的心情风格</p>
                </Card>
            </div>

            {/* Theme Selection Modal */}
            <AnimatePresence>
                {showThemeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowThemeModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white p-6 rounded-3xl w-80 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">选择主题风格</h2>
                            <div className="flex flex-col gap-3">
                                {Object.values(themes).map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => {
                                            setTheme(t.id as ThemeKey);
                                            setShowThemeModal(false);
                                        }}
                                        className={`p-4 rounded-xl flex items-center gap-4 transition-all hover:bg-gray-100 ${currentTheme === t.id ? 'ring-2 ring-offset-2 ring-blue-500 bg-blue-50' : 'bg-gray-50'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full shadow-inner ${t.colors.background}`}></div>
                                        <span className="font-bold text-gray-700">{t.name}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
