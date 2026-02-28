/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Home, Trophy, User, RotateCcw, ArrowLeft, Target, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type View = 'home' | '301';

interface Player {
  name: string;
  score: number;
  history: number[][]; // Each element is a turn of 3 darts
}

export default function App() {
  const [view, setView] = useState<View>('home');

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f5f5f5] font-sans selection:bg-red-500 selection:text-white">
      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <HomePage onSelectGame={() => setView('301')} />
        ) : (
          <Game301 onGoHome={() => setView('home')} />
        )}
      </AnimatePresence>
    </div>
  );
}

function HomePage({ onSelectGame }: { onSelectGame: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1920" 
          alt="Bar Background" 
          className="w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f0f0f]/80 to-[#0f0f0f]"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full px-6 py-20 text-center">
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="inline-block mb-4 p-4 rounded-full bg-red-600/20 border border-red-500/30">
            <Target size={64} className="text-red-500" />
          </div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-4 italic font-serif text-white drop-shadow-2xl">
            DART<span className="text-red-600">MASTER</span>
          </h1>
          <p className="text-xl opacity-80 uppercase tracking-[0.3em] font-mono text-green-500 font-bold">The Ultimate Pub Companion</p>
        </motion.header>

        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <button
            onClick={onSelectGame}
            className="group relative bg-zinc-900 border-2 border-red-600 p-10 hover:bg-red-600 transition-all duration-500 text-left overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.2)]"
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-16">
                <Target size={48} className="text-red-500 group-hover:text-white transition-colors" />
                <ChevronRight size={32} className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
              </div>
              <h2 className="text-5xl font-bold mb-3 italic font-serif group-hover:text-white">301 DOWN</h2>
              <p className="opacity-60 group-hover:opacity-90 font-mono text-sm uppercase tracking-wider">Classic countdown. Hit the double to finish.</p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
          </button>

          <div className="bg-zinc-900/50 border-2 border-zinc-800 border-dashed p-10 flex flex-col justify-center items-center opacity-50 relative overflow-hidden">
            <div className="relative z-10 text-center">
              <p className="font-mono text-sm uppercase tracking-[0.2em] mb-4">Upcoming Games</p>
              <h3 className="text-3xl font-serif italic opacity-30">CRICKET</h3>
              <h3 className="text-3xl font-serif italic opacity-30">KILLER</h3>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <Target size={300} />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Game301({ onGoHome }: { onGoHome: () => void }) {
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'won'>('setup');
  const [playerNames, setPlayerNames] = useState<string[]>(['', '']);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentDartIndex, setCurrentDartIndex] = useState(0);
  const [currentTurnDarts, setCurrentTurnDarts] = useState<number[]>([]);
  const [multiplier, setMultiplier] = useState<1 | 2 | 3>(1);
  const [winner, setWinner] = useState<Player | null>(null);

  const handleStartGame = () => {
    const validNames = playerNames.filter(n => n.trim() !== '');
    if (validNames.length < 1) return;

    setPlayers(validNames.map(name => ({
      name,
      score: 301,
      history: []
    })));
    setGameState('playing');
  };

  const handleScoreInput = (baseValue: number) => {
    if (gameState !== 'playing') return;

    const points = baseValue * multiplier;
    const currentPlayer = players[currentPlayerIndex];
    const newScore = currentPlayer.score - points;

    // Update current player's score immediately
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex] = {
      ...currentPlayer,
      score: newScore
    };
    setPlayers(updatedPlayers);

    const newTurnDarts = [...currentTurnDarts, points];
    
    // Check for win
    if (newScore < 0) {
      setWinner(updatedPlayers[currentPlayerIndex]);
      setGameState('won');
      return;
    }

    // Reset multiplier
    setMultiplier(1);

    // Handle dart/turn progression
    if (currentDartIndex < 2) {
      setCurrentDartIndex(currentDartIndex + 1);
      setCurrentTurnDarts(newTurnDarts);
    } else {
      // End of turn
      updatedPlayers[currentPlayerIndex].history.push(newTurnDarts);
      setPlayers(updatedPlayers);
      
      setCurrentDartIndex(0);
      setCurrentTurnDarts([]);
      setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    }
  };

  const handleUndo = () => {
    if (gameState !== 'playing') return;

    const updatedPlayers = [...players];
    
    if (currentDartIndex > 0) {
      // Undo within current turn
      const lastPoints = currentTurnDarts[currentTurnDarts.length - 1];
      updatedPlayers[currentPlayerIndex] = {
        ...updatedPlayers[currentPlayerIndex],
        score: updatedPlayers[currentPlayerIndex].score + lastPoints
      };
      setPlayers(updatedPlayers);
      setCurrentTurnDarts(currentTurnDarts.slice(0, -1));
      setCurrentDartIndex(currentDartIndex - 1);
    } else {
      // Undo across turns
      const prevPlayerIndex = (currentPlayerIndex - 1 + players.length) % players.length;
      const prevPlayer = updatedPlayers[prevPlayerIndex];
      
      if (prevPlayer.history.length > 0) {
        const lastTurn = [...prevPlayer.history[prevPlayer.history.length - 1]];
        const lastPoints = lastTurn.pop()!;
        
        // Remove the last turn from history
        const newHistory = prevPlayer.history.slice(0, -1);
        
        updatedPlayers[prevPlayerIndex] = {
          ...prevPlayer,
          score: prevPlayer.score + lastPoints,
          history: newHistory
        };
        
        setPlayers(updatedPlayers);
        setCurrentPlayerIndex(prevPlayerIndex);
        setCurrentTurnDarts(lastTurn);
        setCurrentDartIndex(2);
      }
    }
  };

  if (gameState === 'setup') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center wood-texture p-6"
      >
        <div className="max-w-2xl w-full bg-zinc-900/90 backdrop-blur-md border-4 border-zinc-800 p-10 shadow-2xl relative">
          <button onClick={onGoHome} className="flex items-center gap-2 mb-10 text-red-500 hover:text-red-400 transition-colors font-mono text-sm uppercase tracking-widest">
            <ArrowLeft size={16} /> Exit to Bar
          </button>
          
          <h2 className="text-6xl font-bold mb-12 italic font-serif text-white border-b-4 border-red-600 inline-block">PLAYER SETUP</h2>
          
          <div className="space-y-6 mb-12">
            {playerNames.map((name, idx) => (
              <div key={idx} className="flex gap-4 items-center group">
                <div className="w-12 h-12 bg-red-600 text-white flex items-center justify-center font-mono text-xl font-bold shadow-lg">
                  {idx + 1}
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    const newNames = [...playerNames];
                    newNames[idx] = e.target.value;
                    setPlayerNames(newNames);
                  }}
                  placeholder={`Player ${idx + 1} Name`}
                  className="flex-1 bg-zinc-800 border-2 border-zinc-700 py-4 px-6 focus:outline-none focus:border-green-500 font-serif text-2xl italic text-white transition-all"
                />
                {playerNames.length > 1 && (
                  <button 
                    onClick={() => setPlayerNames(playerNames.filter((_, i) => i !== idx))}
                    className="text-red-500 hover:text-red-400 p-2"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            <button 
              onClick={() => setPlayerNames([...playerNames, ''])}
              className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-green-500 hover:text-green-400 mt-4 transition-colors"
            >
              <User size={16} /> Add Another Player
            </button>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full bg-green-600 text-white py-8 text-3xl font-black italic font-serif hover:bg-green-500 transition-all shadow-[0_10px_0_rgb(22,101,52)] active:translate-y-1 active:shadow-none"
          >
            LET'S PLAY!
          </button>
        </div>
      </motion.div>
    );
  }

  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden wood-texture">
      {/* Left Side: Scoreboard (Chalkboard Style) */}
      <div className="flex-1 chalkboard border-r-8 border-[#2c1b0e] flex flex-col overflow-hidden relative border-l-8 border-l-[#2c1b0e]">
        <div className="p-6 border-b border-white/10 flex justify-between items-center relative z-10">
          <button onClick={onGoHome} className="p-3 bg-white/5 hover:bg-white/20 rounded-full transition-colors text-white">
            <Home size={24} />
          </button>
          <div className="font-mono text-sm uppercase tracking-[0.3em] text-white/60 chalk-text">
            301 DOWN <span className="mx-2 text-red-500">•</span> ROUND {Math.floor(players[0].history.length + 1)}
          </div>
          <button onClick={() => {
            if(confirm('Restart game?')) {
              setGameState('setup');
              setCurrentPlayerIndex(0);
              setCurrentDartIndex(0);
              setCurrentTurnDarts([]);
              setWinner(null);
            }
          }} className="p-3 bg-white/5 hover:bg-white/20 rounded-full transition-colors text-white">
            <RotateCcw size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-12 relative z-10">
          {players.map((p, idx) => (
            <motion.div 
              key={idx} 
              initial={false}
              animate={{ 
                scale: idx === currentPlayerIndex ? 1.02 : 1,
                opacity: idx === currentPlayerIndex ? 1 : 0.4
              }}
              className={`p-8 border-4 ${idx === currentPlayerIndex ? 'border-green-500 shadow-[0_0_30px_rgba(74,222,128,0.2)]' : 'border-white/10'} bg-black/20 backdrop-blur-sm relative overflow-hidden`}
            >
              {idx === currentPlayerIndex && (
                <div className="absolute top-0 right-0 bg-green-500 text-black font-mono text-[10px] px-3 py-1 font-bold uppercase tracking-tighter">
                  Active
                </div>
              )}
              
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-4xl font-serif italic font-black uppercase text-white chalk-text">{p.name}</h3>
                <div className="font-mono text-lg text-white/40">#{idx + 1}</div>
              </div>
              
              <div className="text-9xl font-black tracking-tighter leading-none mb-8 text-white chalk-text">
                {p.score}
              </div>

              {/* History of last 6 turns */}
              <div className="mt-8 space-y-3">
                <div className="text-xs font-mono uppercase tracking-[0.2em] text-white/30 mb-4 border-b border-white/10 pb-2">Turn History</div>
                {p.history.slice(-6).reverse().map((turn, tIdx) => (
                  <div key={tIdx} className="flex justify-between items-center text-sm font-mono text-white/60 chalk-text">
                    <span className="opacity-30">T{p.history.length - tIdx}</span>
                    <div className="flex gap-4">
                      {turn.map((d, dIdx) => (
                        <span key={dIdx} className={`w-8 text-center ${d > 20 ? 'text-red-400' : 'text-white/80'}`}>{d}</span>
                      ))}
                    </div>
                    <span className="font-bold text-green-400">{turn.reduce((a, b) => a + b, 0)}</span>
                  </div>
                ))}
              </div>

              {idx === currentPlayerIndex && gameState === 'playing' && (
                <div className="mt-8 flex gap-4">
                  {[0, 1, 2].map(dartIdx => (
                    <div 
                      key={dartIdx}
                      className={`flex-1 h-16 border-2 flex items-center justify-center font-mono text-xl font-bold transition-all ${
                        dartIdx < currentDartIndex 
                          ? 'bg-white text-black border-white' 
                          : dartIdx === currentDartIndex 
                            ? 'border-green-500 text-green-500 animate-pulse bg-green-500/10' 
                            : 'border-white/10 text-white/10'
                      }`}
                    >
                      {currentTurnDarts[dartIdx] !== undefined ? currentTurnDarts[dartIdx] : <Target size={20} className="opacity-20" />}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {gameState === 'won' && winner && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="p-10 bg-green-600 text-white relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white/20 rounded-full">
                <Trophy size={64} className="text-yellow-300 drop-shadow-lg" />
              </div>
              <div>
                <div className="text-sm font-mono uppercase tracking-[0.4em] text-white/70 mb-1">Champion</div>
                <div className="text-6xl font-serif italic font-black uppercase tracking-tight">{winner.name}</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Right Side: Input Panel */}
      <div className="w-full md:w-[520px] bg-zinc-950 text-white p-8 flex flex-col shadow-2xl relative border-r-8 border-r-[#2c1b0e]">
        <div className="mb-10">
          <div className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-500 mb-6">Power Multiplier</div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map(m => (
              <button
                key={m}
                onClick={() => setMultiplier(m as 1 | 2 | 3)}
                className={`py-6 font-mono text-xl font-bold border-2 transition-all duration-300 ${
                  multiplier === m 
                    ? 'bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]' 
                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                }`}
              >
                {m === 1 ? 'X1' : m === 2 ? 'X2' : 'X3'}
                <div className="text-[10px] mt-1 opacity-60">{m === 1 ? 'SINGLE' : m === 2 ? 'DOUBLE' : 'TRIPLE'}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-4 gap-3 mb-10">
          {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              onClick={() => handleScoreInput(num)}
              disabled={gameState !== 'playing'}
              className="aspect-square flex items-center justify-center text-3xl font-black font-serif italic border-2 border-zinc-800 hover:bg-white hover:text-black hover:border-white disabled:opacity-10 transition-all active:scale-95"
            >
              {num}
            </button>
          ))}
          
          {/* Special Buttons Row 1 */}
          <button
            onClick={() => handleScoreInput(0)}
            disabled={gameState !== 'playing'}
            className="col-span-2 py-6 text-2xl font-black font-serif italic tracking-widest border-2 border-zinc-800 hover:bg-zinc-700 disabled:opacity-10 transition-all active:scale-95"
          >
            MISS
          </button>
          <button
            onClick={() => {
              setMultiplier(1);
              handleScoreInput(25);
            }}
            disabled={gameState !== 'playing'}
            className="col-span-1 py-6 text-xs font-mono font-bold uppercase border-2 border-green-600 bg-green-600/10 hover:bg-green-600 transition-all active:scale-95"
          >
            OUTER<br/>BULL
          </button>
          <button
            onClick={() => {
              setMultiplier(1);
              handleScoreInput(50);
            }}
            disabled={gameState !== 'playing'}
            className="col-span-1 py-6 text-xs font-mono font-bold uppercase border-2 border-red-600 bg-red-600/10 hover:bg-red-600 transition-all active:scale-95"
          >
            INNER<br/>BULL
          </button>

          {/* Special Buttons Row 2 */}
          <button
            onClick={handleUndo}
            disabled={gameState !== 'playing' || (currentDartIndex === 0 && players.every(p => p.history.length === 0))}
            className="col-span-4 py-8 flex items-center justify-center gap-4 border-2 border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white disabled:opacity-10 transition-all font-black tracking-[0.3em] text-xl italic font-serif"
          >
            <RotateCcw size={24} />
            UNDO LAST SHOT
          </button>
        </div>

        <div className="mt-auto pt-8 border-t border-zinc-800 flex justify-between items-center opacity-30">
          <div className="flex gap-4">
            <div className="w-4 h-4 rounded-full bg-red-600"></div>
            <div className="w-4 h-4 rounded-full bg-green-600"></div>
            <div className="w-4 h-4 rounded-full bg-white"></div>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest">DartMaster v2.0</div>
        </div>
      </div>
    </div>
  );
}
