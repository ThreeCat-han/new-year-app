import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { themes } from '../../theme/themeConfig';
import { Button } from '../../components/ui/Button';
import { motion } from 'framer-motion';
import { Trophy, Puzzle } from 'lucide-react';

export const GameHub: React.FC = () => {
    const { currentTheme, scores } = useApp();
    const theme = themes[currentTheme];
    const navigate = useNavigate();

    return (
        <div className={`min-h-screen flex flex-col items-center p-6 pt-12 ${theme.colors.background}`}>
            <h1 className={`text-3xl font-black text-center mb-12 ${theme.font} drop-shadow-sm`} style={{ color: theme.colors.text }}>
                互动小游戏 🎮
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* Game 1: Catch Luck */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`rounded-3xl p-8 shadow-xl relative overflow-hidden group cursor-pointer ${theme.colors.cardBg}`}
                    onClick={() => navigate('/games/catch')}
                >
                    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                        <Trophy size={120} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 z-10 relative text-gray-800">1. 接住好运 🧧</h2>
                    <p className="text-gray-600 mb-6 relative z-10">
                        接住掉落的红包与金币，避开杂物！<br />
                        <span className="text-xs opacity-70">限时 20 秒挑战</span>
                    </p>
                    <div className="flex justify-between items-center relative z-10">
                        <span className="font-bold text-yellow-600 text-lg">最高分: {scores.catchLuck}</span>
                        <Button size="sm">开始挑战</Button>
                    </div>
                </motion.div>

                {/* Game 2: Puzzle */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`rounded-3xl p-8 shadow-xl relative overflow-hidden group cursor-pointer ${theme.colors.cardBg}`}
                    onClick={() => navigate('/games/puzzle')}
                >
                    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                        <Puzzle size={120} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 z-10 relative text-gray-800">2. 新年拼图 🧩</h2>
                    <p className="text-gray-600 mb-6 relative z-10">
                        完成 3x3 拼图，解锁好运祝福语。<br />
                        <span className="text-xs opacity-70">考验眼力与手速</span>
                    </p>
                    <div className="flex justify-between items-center relative z-10">
                        <span className={`font-bold text-lg ${scores.puzzleCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                            {scores.puzzleCompleted ? '已完成 ✅' : '未完成'}
                        </span>
                        <Button size="sm" variant={scores.puzzleCompleted ? 'outline' : 'primary'}>
                            {scores.puzzleCompleted ? '再次挑战' : '开始拼图'}
                        </Button>
                    </div>
                </motion.div>
            </div>

            <div className="mt-12">
                <Button variant="secondary" onClick={() => navigate('/home')}>
                    返回小屋
                </Button>
            </div>
        </div>
    );
};
