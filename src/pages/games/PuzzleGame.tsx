import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { themes } from '../../theme/themeConfig';
import { Button } from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const IMAGES = [
    { id: 'custom-horse', url: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=800&auto=format&fit=crop", name: '吉祥小马' },
    { id: 'custom-puppy', url: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?q=80&w=800&auto=format&fit=crop", name: '可爱金毛' },
    { id: 'cat', url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop", name: '招财猫咪' },
];

export const PuzzleGame: React.FC = () => {
    const { updateScore, currentTheme } = useApp();
    const theme = themes[currentTheme];
    const navigate = useNavigate();

    const [gridSize, setGridSize] = useState(3); // Default to Normal (3x3)
    const [currentImage, setCurrentImage] = useState(IMAGES[0]);

    // Derived state for calculations
    const tileCount = gridSize * gridSize;
    const emptyTileValue = tileCount - 1;

    const [tiles, setTiles] = useState<number[]>([]);
    const [isSolved, setIsSolved] = useState(false);
    const [moves, setMoves] = useState(0);

    // Re-initialize game when settings change
    useEffect(() => {
        shuffleTiles();
    }, [gridSize, currentImage]);

    const shuffleTiles = () => {
        let array = Array.from({ length: tileCount }, (_, i) => i);

        let emptyPos = emptyTileValue;
        let lastPos = -1;

        // Shuffle logic (less steps for easier difficulty? actually same shuffling is fine, complexity comes from grid size)
        const shuffleSteps = gridSize === 2 ? 20 : 100;

        for (let i = 0; i < shuffleSteps; i++) {
            const adjacent = getAdjacentIndices(emptyPos, gridSize);
            const valid = adjacent.filter(p => p !== lastPos);
            if (valid.length === 0) continue;
            const move = valid[Math.floor(Math.random() * valid.length)];

            array[emptyPos] = array[move];
            array[move] = emptyTileValue;

            lastPos = emptyPos;
            emptyPos = move;
        }

        setTiles(array);
        setIsSolved(false);
        setMoves(0);
    };

    const getAdjacentIndices = (index: number, size: number) => {
        const row = Math.floor(index / size);
        const col = index % size;
        const neighbors = [];

        if (row > 0) neighbors.push(index - size); // Up
        if (row < size - 1) neighbors.push(index + size); // Down
        if (col > 0) neighbors.push(index - 1); // Left
        if (col < size - 1) neighbors.push(index + 1); // Right

        return neighbors;
    };

    const handleTileClick = (index: number) => {
        if (isSolved) return;

        const emptyIndex = tiles.indexOf(emptyTileValue);
        const adjacent = getAdjacentIndices(emptyIndex, gridSize);

        if (adjacent.includes(index)) {
            const newTiles = [...tiles];
            [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
            setTiles(newTiles);
            setMoves(m => m + 1);
            checkWin(newTiles);
        }
    };

    const checkWin = (currentTiles: number[]) => {
        const isWin = currentTiles.every((val, index) => val === index);
        if (isWin) {
            setIsSolved(true);
            updateScore('puzzle', true);
        }
    };

    return (
        <div className={`min-h-screen flex flex-col items-center p-6 ${theme.colors.background} overflow-y-auto`}>

            <div className="mb-4 text-center w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <Button size="sm" variant="secondary" onClick={() => navigate('/games')}>← 返回</Button>
                    <h1 className={`text-2xl font-black ${theme.font} drop-shadow-sm`} style={{ color: theme.colors.text }}>
                        新年拼图 🧩
                    </h1>
                    <div style={{ width: 60 }}></div>
                </div>

                {/* Settings Panel */}
                <div className={`p-4 rounded-2xl mb-6 shadow-sm border border-white/20 ${theme.colors.cardBg}`}>
                    <div className="flex flex-col gap-4">
                        {/* Image Selection */}
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {IMAGES.map((img) => (
                                <button
                                    key={img.id}
                                    onClick={() => setCurrentImage(img)}
                                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${currentImage.id === img.id ? 'border-yellow-500 scale-105 ring-2 ring-yellow-200' : 'border-transparent opacity-70'}`}
                                >
                                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Difficulty Selection */}
                        <div className="flex justify-center gap-4 text-sm">
                            <button
                                onClick={() => setGridSize(2)}
                                className={`px-4 py-1 rounded-full font-bold transition-colors ${gridSize === 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                            >
                                简单 (2x2)
                            </button>
                            <button
                                onClick={() => setGridSize(3)}
                                className={`px-4 py-1 rounded-full font-bold transition-colors ${gridSize === 3 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                            >
                                普通 (3x3)
                            </button>
                            <button
                                onClick={() => setGridSize(4)}
                                className={`px-4 py-1 rounded-full font-bold transition-colors ${gridSize === 4 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                            >
                                困难 (4x4)
                            </button>
                        </div>
                    </div>
                </div>

                <p className="mb-4 font-bold opacity-80" style={{ color: theme.colors.textPrimary }}>当前步数: {moves}</p>
            </div>

            {/* Puzzle Board */}
            <div
                className="relative bg-white/30 p-2 rounded-xl shadow-2xl backdrop-blur-sm transition-all"
                style={{ width: '320px', height: '320px' }}
            >
                {tiles.map((tileNumber, index) => {
                    // Safety check if tiles are not initialized yet
                    if (tileNumber === undefined) return null;

                    const isVisible = tileNumber !== emptyTileValue || isSolved;

                    const row = Math.floor(tileNumber / gridSize);
                    const col = tileNumber % gridSize;

                    // Dynamic Calculations
                    const gap = 2; // px
                    const totalGap = (gridSize - 1) * gap;
                    // const containerSize = 320 - 16; // minus padding (p-2 = 8px * 2) roughly 304px
                    // Wait, manual fix: 320px container. Padding 8px. content box ~304px.
                    // Let's rely on percentage or fixed calc
                    const cellSize = (304 - totalGap) / gridSize;

                    // Current Position in Grid
                    const curRow = Math.floor(index / gridSize);
                    const curCol = index % gridSize;

                    return (
                        <motion.div
                            key={tileNumber}
                            layout
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className={`absolute overflow-hidden rounded-md border border-white/20 cursor-pointer shadow-sm`}
                            style={{
                                width: `${cellSize}px`,
                                height: `${cellSize}px`,
                                top: `${8 + curRow * (cellSize + gap)}px`,
                                left: `${8 + curCol * (cellSize + gap)}px`, // 8px padding offset
                                opacity: isVisible ? 1 : 0.1,
                                zIndex: isVisible ? 1 : 0,
                            }}
                            onClick={() => handleTileClick(index)}
                        >
                            {isVisible && (
                                <div
                                    className="w-full h-full bg-cover"
                                    style={{
                                        backgroundColor: theme.colors.primary,
                                        backgroundImage: `url(${currentImage.url})`,
                                        backgroundSize: '304px 304px', // Match container content area
                                        backgroundPosition: `-${col * (cellSize + gap)}px -${row * (cellSize + gap)}px` // Simplified linkage
                                    }}
                                >
                                    <span className="absolute top-1 left-1 text-white/80 text-xs font-bold drop-shadow-md bg-black/20 px-1 rounded">
                                        {tileNumber + 1}
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    );
                })}

                {/* Success Overlay */}
                <AnimatePresence>
                    {isSolved && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 flex items-center justify-center z-20 bg-black/70 rounded-xl backdrop-blur-sm"
                        >
                            <div className="text-center text-white p-6">
                                <h2 className="text-3xl font-bold mb-2 text-yellow-400">🎉 拼图完成!</h2>
                                <p className="mb-6 text-sm opacity-90">太棒了！好运与你环环相扣</p>
                                <Button onClick={() => {
                                    setMoves(0);
                                    shuffleTiles();
                                }}>再玩一次</Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-8">
                <Button variant="secondary" size="sm" onClick={shuffleTiles}>重新排列 🔄</Button>
            </div>

        </div>
    );
};
