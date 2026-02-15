import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { LaunchPage } from './pages/LaunchPage';
import { InputPage } from './pages/InputPage'; // Assuming these exist
import { HomePage } from './pages/HomePage';
import { GameHub } from './pages/games/GameHub';
import { CatchGame } from './pages/games/CatchGame';
import { PuzzleGame } from './pages/games/PuzzleGame';
import { BlessingBox } from './pages/blessings/BlessingBox';

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LaunchPage />} />
          <Route path="/test" element={<div>Test Page</div>} />
          {/* Add basic error element if possible */}
          <Route path="/input" element={<InputPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/games" element={<GameHub />} />
          <Route path="/games/catch" element={<CatchGame />} />
          <Route path="/games/puzzle" element={<PuzzleGame />} />
          <Route path="/blessing" element={<BlessingBox />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
