
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { themes } from '../../theme/themeConfig';
import { Button } from '../../components/ui/Button';

// Game Constants
const GAME_DURATION = 20;
const ITEM_SPAWN_RATE = 600;
const FALL_SPEED = 6;

type ItemType = 'redpacket' | 'coin' | 'orange' | 'bomb';

interface GameItem {
    id: number;
    x: number;
    y: number;
    type: ItemType;
}

export const CatchGame: React.FC = () => {
    const { updateScore, currentTheme } = useApp();
    const theme = themes[currentTheme];
    const navigate = useNavigate();

    // Game State
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    // Refs for Loop
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const playerX = useRef(window.innerWidth / 2);
    const items = useRef<GameItem[]>([]);
    const reqRef = useRef<number | undefined>(undefined);
    const lastSpawn = useRef(0);
    const scoreRef = useRef(0); // Use ref for instantaneous access in loop

    // Controls
    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isPlaying) return;
        const touch = e.touches[0];
        playerX.current = touch.clientX;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isPlaying) return;
        playerX.current = e.clientX;
    };

    // Game Loop
    const loop = (timestamp: number) => {
        if (!isPlaying && !canvasRef.current) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Spawn
        if (timestamp - lastSpawn.current > ITEM_SPAWN_RATE) {
            const types: ItemType[] = ['redpacket', 'coin', 'orange', 'bomb', 'redpacket'];
            const type = types[Math.floor(Math.random() * types.length)];
            items.current.push({
                id: Date.now(),
                x: Math.random() * (canvas.width - 60) + 30,
                y: -50,
                type
            });
            lastSpawn.current = timestamp;
        }

        // Draw Player (Basket)
        const basketW = 80;
        const basketH = 50;
        ctx.fillStyle = theme.colors.primary;
        ctx.beginPath();
        ctx.roundRect(playerX.current - basketW / 2, canvas.height - basketH - 20, basketW, basketH, 10);
        ctx.fill();
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🧺', playerX.current, canvas.height - 35);

        // Update & Draw Items
        items.current.forEach((item, index) => {
            item.y += FALL_SPEED;

            // Draw Item
            let emoji = '';
            switch (item.type) {
                case 'redpacket': emoji = '🧧'; break;
                case 'coin': emoji = '💰'; break;
                case 'orange': emoji = '🍊'; break;
                case 'bomb': emoji = '💣'; break;
            }
            ctx.font = '32px Arial';
            ctx.fillText(emoji, item.x, item.y);

            // Collision Detection
            const caught =
                item.y > canvas.height - 100 &&
                item.y < canvas.height - 20 &&
                Math.abs(item.x - playerX.current) < 50;

            if (caught) {
                if (item.type === 'bomb') {
                    scoreRef.current = Math.max(0, scoreRef.current - 10);
                } else {
                    scoreRef.current += 10;
                }
                setScore(scoreRef.current); // Sync for UI
                items.current.splice(index, 1);
            } else if (item.y > canvas.height) {
                items.current.splice(index, 1);
            }
        });

        if (isPlaying) {
            reqRef.current = requestAnimationFrame(loop);
        }
    };

    // Start Game
    const startGame = () => {
        scoreRef.current = 0;
        setScore(0);
        setTimeLeft(GAME_DURATION);
        setIsPlaying(true);
        setGameOver(false);
        items.current = [];
        lastSpawn.current = 0;
    };

    useEffect(() => {
        if (isPlaying) {
            reqRef.current = requestAnimationFrame(loop);
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setIsPlaying(false);
                        setGameOver(true);
                        clearInterval(timer);
                        cancelAnimationFrame(reqRef.current!);
                        updateScore('catchLuck', scoreRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => {
                cancelAnimationFrame(reqRef.current!);
                clearInterval(timer);
            };
        }
    }, [isPlaying]);

    // Initial Canvas Size
    useEffect(() => {
        const resize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
        };
        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    return (
        <div className="relative w-full h-screen overflow-hidden bg-gray-900 touch-none select-none">
            <canvas
                ref={canvasRef}
                className="block w-full h-full"
                onTouchMove={handleTouchMove}
                onMouseMove={handleMouseMove}
            />

            {/* HUD */}
            <div className="absolute top-6 left-6 right-6 flex justify-between z-10 pointer-events-none">
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-bold border border-white/30">
                    🏆 {score}
                </div>
                <div className={`px-4 py-2 rounded-full font-bold border border-white/30 ${timeLeft <= 5 ? 'bg-red-500/80 animate-pulse' : 'bg-white/20'} text-white`}>
                    ⏱️ {timeLeft}s
                </div>
            </div>

            {/* Overlays */}
            {(!isPlaying) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-20 p-4">
                    <div className="bg-white w-full max-w-sm p-8 rounded-3xl text-center shadow-2xl relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-full h-2 ${theme.colors.background}`}></div>

                        <h2 className="text-3xl font-black mb-2 text-gray-800">
                            {gameOver ? '⏰ 时间到!' : 'ready? Go!'}
                        </h2>

                        {gameOver ? (
                            <div className="mb-8">
                                <p className="text-gray-500 mb-2">本局得分</p>
                                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
                                    {score}
                                </div>
                                <p className="text-sm text-gray-400 mt-2">
                                    {score > 100 ? '太强了！你是接财神转世吗？🤑' : '手速还需要练练哦~ 😉'}
                                </p>
                            </div>
                        ) : (
                            <p className="text-gray-500 mb-8">
                                左右滑动接住掉落的宝物<br />不要接炸弹哦！
                            </p>
                        )}

                        <div className="flex flex-col gap-3">
                            <Button onClick={startGame} size="lg" className="w-full">
                                {gameOver ? '再来一局' : '开始游戏'}
                            </Button>
                            <Button variant="outline" onClick={() => navigate('/games')} className="w-full">
                                返回大厅
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
