
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { themes } from '../theme/themeConfig';
import { motion } from 'framer-motion';

export const InputPage: React.FC = () => {
    const { setUserName, setFriendName, setRelationship, currentTheme } = useApp();
    const theme = themes[currentTheme];
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: '', friend: '', rel: 'friend' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.friend) {
            alert('请填写完整信息哦~');
            return;
        }
        setUserName(form.name);
        setFriendName(form.friend);
        setRelationship(form.rel as any);
        // 将信息编码到 URL 中，方便分享
        const params = new URLSearchParams({
            u: form.name,
            f: form.friend,
            r: form.rel
        });
        navigate(`/home?${params.toString()}`);
    };

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-500 ${theme.colors.background}`}>
            {/* Form Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`w-full max-w-md p-8 rounded-3xl shadow-2xl backdrop-blur-md border border-white/20 ${theme.colors.cardBg}`}
            >
                <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: theme.colors.primary }}>
                    开启好运之旅 ✨
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="你的昵称"
                        placeholder="请输入你的名字"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />

                    <Input
                        label="Ta 的昵称"
                        placeholder="请输入朋友的名字"
                        value={form.friend}
                        onChange={(e) => setForm({ ...form, friend: e.target.value })}
                        required
                    />

                    <div className="flex flex-col gap-2">
                        <label className={`text-sm font-bold ${theme.colors.textPrimary}`}>
                            你们的关系
                        </label>
                        <div className="flex justify-between gap-2">
                            {['friend', 'lover', 'family'].map((rel) => (
                                <button
                                    key={rel}
                                    type="button"
                                    onClick={() => setForm({ ...form, rel })}
                                    style={{
                                        backgroundColor: form.rel === rel ? theme.colors.primary : 'rgba(255,255,255,0.5)',
                                        border: `2px solid ${form.rel === rel ? theme.colors.primary : '#eee'}`,
                                    }}
                                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all transform active:scale-95 ${form.rel === rel ? 'text-white' : theme.colors.textPrimary}`}
                                >
                                    {rel === 'friend' ? '朋友 🤝' : rel === 'lover' ? '恋人 ❤️' : '家人 🏠'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button type="submit" className="w-full shadow-lg" size="lg">
                            进入好运小屋 🚪
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};
