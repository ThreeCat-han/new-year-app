import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { themes } from '../../theme/themeConfig';
import { Button } from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Share2, Check } from 'lucide-react';

export const BlessingBox: React.FC = () => {
    const { userName, friendName, currentTheme } = useApp();
    const [searchParams] = useSearchParams();
    const theme = themes[currentTheme];
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('愿新的一年万事顺遂，\n好运常在，平安喜乐。');
    const [isEditing, setIsEditing] = useState(false);
    const [sharedTo, setSharedTo] = useState('');
    const [sharedFrom, setSharedFrom] = useState('');
    const [isShared, setIsShared] = useState(false);
    const [showCopyHint, setShowCopyHint] = useState(false);

    const blessings = [
        "愿你特别有钱，特别好看，\n特别温柔，特别被爱。",
        "新的一年，愿你有趣有盼，\n不负心中热爱。",
        "祝你发财，不只在今年，\n而在以后的每一年。",
        "岁岁常欢愉，年年皆胜意。",
        "所求皆如愿，所行化坦途。",
        "要陪在值得的人身边，\n一年又一年。",
        "愿你有始料不及的运气，\n和突如其来的惊喜。",
        "吃好喝好，长生不老；\n白白胖胖，充满希望。",
    ];

    useEffect(() => {
        const to = searchParams.get('to');
        const from = searchParams.get('from');
        const msg = searchParams.get('msg');

        if (to || from || msg) {
            setSharedTo(to || '');
            setSharedFrom(from || '');
            if (msg) setMessage(msg);
            setIsShared(true);
            setIsOpen(true); // Auto open if shared link
        } else {
            setSharedTo(friendName);
            setSharedFrom(userName);
        }
    }, [searchParams, friendName, userName]);

    const randomizeMessage = (e: React.MouseEvent) => {
        e.stopPropagation();
        const random = blessings[Math.floor(Math.random() * blessings.length)];
        setMessage(random);
        confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.8 },
            colors: theme.fireworks,
        });
    };

    const handleOpen = () => {
        setIsOpen(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: theme.fireworks,
        });
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        const baseUrl = window.location.origin + window.location.pathname;
        const params = new URLSearchParams();
        params.set('to', sharedTo || friendName);
        params.set('from', sharedFrom || userName);
        params.set('msg', message);

        const shareUrl = `${baseUrl}#/blessing?${params.toString()}`;

        navigator.clipboard.writeText(shareUrl).then(() => {
            setShowCopyHint(true);
            setTimeout(() => setShowCopyHint(false), 2000);
        });
    };

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${theme.colors.background}`}>
            {/* Back Button */}
            {!isShared && (
                <div className="absolute top-6 left-6 z-10">
                    <Button variant="secondary" size="sm" onClick={() => navigate('/home')}>
                        ← 返回
                    </Button>
                </div>
            )}

            <div className="relative w-full max-w-lg perspective-1000 h-[500px] flex items-center justify-center">
                <AnimatePresence>
                    {!isOpen ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1, y: [0, -20, 0] }}
                            exit={{ scale: 1.5, opacity: 0, rotate: 10 }}
                            transition={{
                                y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                            }}
                            className="w-64 h-64 cursor-pointer"
                            onClick={handleOpen}
                        >
                            <div className="w-full h-full bg-yellow-500 rounded-3xl shadow-2xl flex items-center justify-center border-4 border-yellow-300 relative group">
                                <div className="absolute inset-0 bg-yellow-400 opacity-20 rounded-3xl group-hover:opacity-10 transition-opacity"></div>
                                <span className="text-8xl drop-shadow-lg">🎁</span>
                                <div className="absolute -bottom-10 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                    点我开启
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ rotateX: 90, opacity: 0 }}
                            animate={{ rotateX: 0, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                            className={`w-full max-w-md p-8 rounded-lg shadow-2xl relative ${theme.colors.cardBg} border-2 border-yellow-200`}
                        >
                            <div className="border border-dashed border-gray-300 p-6 rounded relative">
                                <div className="text-xl font-bold mb-4 font-serif text-gray-800 flex items-baseline gap-2">
                                    To:
                                    {isEditing ? (
                                        <input
                                            value={sharedTo}
                                            onChange={(e) => setSharedTo(e.target.value)}
                                            placeholder="朋友的名字"
                                            className="text-red-500 border-b-2 border-red-200 bg-transparent outline-none w-full"
                                        />
                                    ) : (
                                        <span className="text-red-500 border-b-2 border-red-200">{sharedTo || '亲爱的朋友'}</span>
                                    )}
                                </div>

                                {isEditing ? (
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full h-32 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-200 bg-transparent text-gray-700 font-serif leading-relaxed"
                                    />
                                ) : (
                                    <p className="text-lg leading-relaxed text-gray-700 font-serif min-h-[8rem] whitespace-pre-wrap">
                                        {message}
                                    </p>
                                )}

                                <div className="mt-8 text-right font-serif text-gray-600 flex items-baseline justify-end gap-2">
                                    From:
                                    {isEditing ? (
                                        <input
                                            value={sharedFrom}
                                            onChange={(e) => setSharedFrom(e.target.value)}
                                            placeholder="你的名字"
                                            className="font-bold border-b-2 border-gray-200 bg-transparent outline-none w-32"
                                        />
                                    ) : (
                                        <span className="font-bold border-b-2 border-gray-200">{sharedFrom || '我'}</span>
                                    )}
                                </div>

                                <div className="absolute -top-4 -right-4 text-4xl transform rotate-12">🧧</div>
                                <div className="absolute -bottom-4 -left-4 text-4xl transform -rotate-12">🍊</div>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2 justify-between">
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setIsEditing(!isEditing)}
                                    >
                                        {isEditing ? '保存' : '修改内容'}
                                    </Button>
                                    {!isEditing && (
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={randomizeMessage}
                                        >
                                            换一张 ✨
                                        </Button>
                                    )}
                                </div>

                                <Button size="sm" onClick={handleShare} className="flex items-center gap-2">
                                    {showCopyHint ? <Check size={16} /> : <Share2 size={16} />}
                                    {showCopyHint ? '已复制链接' : '发送给朋友'}
                                </Button>
                            </div>
                            
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

