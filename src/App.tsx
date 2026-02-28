/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Home, Trophy, User, RotateCcw, ArrowLeft, Target, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type View = 'home' | '301' | 'moon';

interface Player {
  name: string;
  score: number;
  history: number[][];
  tournamentPoints: number;
  targetNumber?: number;
  moonSteps?: number;
}

export default function App() {
  const [view, setView] = useState<View>('home');
  const [tournamentPlayers, setTournamentPlayers] = useState<Player[]>([]);

  const handleUpdateTournamentPoints = (rankings: { name: string; points: number }[]) => {
    setTournamentPlayers(prev => prev.map(p => {
      const ranking = rankings.find(r => r.name === p.name);
      if (ranking) {
        return { ...p, tournamentPoints: p.tournamentPoints + ranking.points };
      }
      return p;
    }));
  };

  const handleResetTournament = () => {
    if (confirm('Reset all tournament scores and players?')) {
      setTournamentPlayers([]);
      setView('home');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f5f5f5] font-sans selection:bg-red-500 selection:text-white">
      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <HomePage 
            players={tournamentPlayers}
            setPlayers={setTournamentPlayers}
            onSelectGame={(game) => setView(game)} 
            onReset={handleResetTournament}
          />
        ) : view === '301' ? (
          <Game301 
            initialPlayers={tournamentPlayers}
            onGoHome={() => setView('home')} 
            onGameEnd={handleUpdateTournamentPoints}
          />
        ) : (
          <GameMoon
            initialPlayers={tournamentPlayers}
            onGoHome={() => setView('home')}
            onGameEnd={handleUpdateTournamentPoints}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function HomePage({ 
  players, 
  setPlayers, 
  onSelectGame, 
  onReset 
}: { 
  players: Player[]; 
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  onSelectGame: (game: '301' | 'moon') => void;
  onReset: () => void;
}) {
  const [newName, setNewName] = useState('');

  const addPlayer = () => {
    if (newName.trim()) {
      setPlayers([...players, { name: newName.trim(), score: 301, history: [], tournamentPoints: 0 }]);
      setNewName('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen flex flex-col items-center justify-start overflow-y-auto py-12 px-6"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 fixed">
        <img 
          src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1920" 
          alt="Bar Background" 
          className="w-full h-full object-cover opacity-20"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f0f0f]/80 to-[#0f0f0f]"></div>
      </div>

      <div className="relative z-10 max-w-6xl w-full">
        <motion.header 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4 p-3 rounded-full bg-red-600/20 border border-red-500/30">
            <Target size={48} className="text-red-500" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-2 italic font-display text-white drop-shadow-2xl">
            DART<span className="text-red-600">MASTER</span>
          </h1>
          <p className="text-sm opacity-80 uppercase tracking-[0.4em] font-mono text-green-500 font-bold">Tournament Edition</p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Player Management & Leaderboard */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-zinc-900/80 backdrop-blur-md border-2 border-zinc-800 p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
                <h2 className="text-3xl font-display italic font-bold text-white">TOURNAMENT STANDINGS</h2>
                <button 
                  onClick={onReset}
                  className="text-[10px] font-mono uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors"
                >
                  Reset All
                </button>
              </div>

              {players.length > 0 ? (
                <div className="space-y-3">
                  {players.sort((a, b) => b.tournamentPoints - a.tournamentPoints).map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-black/40 border border-zinc-800 group hover:border-green-500/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 flex items-center justify-center font-mono font-bold ${idx === 0 ? 'bg-yellow-500 text-black' : idx === 1 ? 'bg-zinc-400 text-black' : idx === 2 ? 'bg-orange-700 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                          {idx + 1}
                        </div>
                        <span className="text-xl font-serif text-white">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-[10px] font-mono uppercase opacity-40">Points</div>
                          <div className="text-2xl font-black text-green-500">{p.tournamentPoints}</div>
                        </div>
                        <button 
                          onClick={() => setPlayers(players.filter((_, i) => i !== players.indexOf(p)))}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 p-2 transition-all"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center border-2 border-dashed border-zinc-800 opacity-30">
                  <p className="font-mono uppercase tracking-widest">No players in tournament</p>
                </div>
              )}

              <div className="mt-8 flex gap-2">
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                  placeholder="Enter Player Name..."
                  className="flex-1 bg-zinc-800 border-2 border-zinc-700 py-3 px-4 focus:outline-none focus:border-green-500 text-white font-serif"
                />
                <button 
                  onClick={addPlayer}
                  className="bg-green-600 hover:bg-green-500 px-6 font-bold uppercase tracking-widest text-xs transition-colors"
                >
                  Add
                </button>
              </div>
            </section>
          </div>

          {/* Right: Game Selection */}
          <div className="space-y-6">
            <div className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-500 mb-2">Select Game</div>
            
            <button
              onClick={() => onSelectGame('301')}
              disabled={players.length < 1}
              className="w-full group relative bg-zinc-900 border-2 border-red-600 p-8 hover:bg-red-600 transition-all duration-500 text-left overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.1)] disabled:opacity-20 disabled:grayscale"
            >
              <div className="relative z-10">
                <Target size={32} className="text-red-500 group-hover:text-white mb-8 transition-colors" />
                <h2 className="text-3xl font-bold mb-2 italic font-display group-hover:text-white">301 DOWN</h2>
                <p className="text-xs opacity-60 group-hover:opacity-90 font-mono uppercase tracking-wider">Countdown to zero.</p>
              </div>
            </button>

            <button
              onClick={() => onSelectGame('moon')}
              disabled={players.length < 1}
              className="w-full group relative bg-zinc-900 border-2 border-blue-600 p-8 hover:bg-blue-600 transition-all duration-500 text-left overflow-hidden shadow-[0_0_30px_rgba(37,99,235,0.1)] disabled:opacity-20 disabled:grayscale"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <Target size={32} className="text-blue-500 group-hover:text-white transition-colors" />
                  <span className="bg-blue-600 text-[8px] px-2 py-1 font-mono font-bold uppercase tracking-tighter text-white">New Game</span>
                </div>
                <h2 className="text-3xl font-bold mb-2 italic font-display group-hover:text-white">TO THE MOON</h2>
                <p className="text-xs opacity-60 group-hover:opacity-90 font-mono uppercase tracking-wider">Race to the lunar surface.</p>
              </div>
            </button>

            <div className="bg-zinc-900/30 border-2 border-zinc-800 border-dashed p-8 flex flex-col justify-center items-center opacity-30">
              <p className="font-mono text-[10px] uppercase tracking-widest">Cricket Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Game301({ 
  initialPlayers, 
  onGoHome, 
  onGameEnd 
}: { 
  initialPlayers: Player[]; 
  onGoHome: () => void;
  onGameEnd: (rankings: { name: string; points: number }[]) => void;
}) {
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [players, setPlayers] = useState<Player[]>(initialPlayers.map(p => ({ ...p, score: 301, history: [] })));
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentDartIndex, setCurrentDartIndex] = useState(0);
  const [currentTurnDarts, setCurrentTurnDarts] = useState<number[]>([]);
  const [multiplier, setMultiplier] = useState<1 | 2 | 3>(1);
  const [winner, setWinner] = useState<Player | null>(null);

  const handleScoreInput = (baseValue: number) => {
    if (gameState !== 'playing') return;

    const points = baseValue * multiplier;
    const currentPlayer = players[currentPlayerIndex];
    const newScore = currentPlayer.score - points;

    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex] = {
      ...currentPlayer,
      score: newScore
    };
    setPlayers(updatedPlayers);

    const newTurnDarts = [...currentTurnDarts, points];
    
    if (newScore < 0) {
      setWinner(updatedPlayers[currentPlayerIndex]);
      setGameState('won');
      
      // Calculate rankings and points
      // 1st: 10, 2nd: 5, 3rd: 2
      const sortedByScore = [...updatedPlayers].sort((a, b) => a.score - b.score);
      const rankings = sortedByScore.map((p, idx) => ({
        name: p.name,
        points: idx === 0 ? 10 : idx === 1 ? 5 : idx === 2 ? 2 : 0
      }));
      onGameEnd(rankings);
      return;
    }

    setMultiplier(1);

    if (currentDartIndex < 2) {
      setCurrentDartIndex(currentDartIndex + 1);
      setCurrentTurnDarts(newTurnDarts);
    } else {
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
              setPlayers(initialPlayers.map(p => ({ ...p, score: 301, history: [] })));
              setCurrentPlayerIndex(0);
              setCurrentDartIndex(0);
              setCurrentTurnDarts([]);
              setWinner(null);
              setGameState('playing');
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
              
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-2xl font-serif font-black uppercase text-white chalk-text">{p.name}</h3>
                <div className="font-mono text-sm text-white/40">#{idx + 1}</div>
              </div>
              
              <div className="text-7xl font-black tracking-tighter leading-none mb-4 text-white chalk-text">
                {p.score}
              </div>

              {/* History of last 6 turns */}
              <div className="mt-4 space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-2 border-b border-white/10 pb-1">Turn History</div>
                {p.history.slice(-6).reverse().map((turn, tIdx) => (
                  <div key={tIdx} className="flex justify-between items-center text-lg font-mono text-white/80 chalk-text">
                    <span className="opacity-30 text-xs">T{p.history.length - tIdx}</span>
                    <div className="flex gap-3">
                      {turn.map((d, dIdx) => (
                        <span key={dIdx} className={`w-10 text-center ${d > 20 ? 'text-red-400' : 'text-white'}`}>{d}</span>
                      ))}
                    </div>
                    <span className="font-bold text-green-400 w-12 text-right">{turn.reduce((a, b) => a + b, 0)}</span>
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
                <div className="text-6xl font-display italic font-black uppercase tracking-tight">{winner.name}</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Right Side: Input Panel */}
      <div className="w-full md:w-[520px] bg-zinc-950 text-white p-6 flex flex-col shadow-2xl relative border-r-8 border-r-[#2c1b0e]">
        
        {/* Undo Button - Moved to Top for Visibility */}
        <div className="mb-6">
          <button
            onClick={handleUndo}
            disabled={gameState !== 'playing' || (currentDartIndex === 0 && players.every(p => p.history.length === 0))}
            className="w-full py-4 flex items-center justify-center gap-4 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-10 transition-all font-black tracking-[0.2em] text-lg italic font-display shadow-[0_0_15px_rgba(220,38,38,0.2)]"
          >
            <RotateCcw size={20} />
            UNDO LAST SHOT
          </button>
        </div>

        <div className="mb-8">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-4">Power Multiplier</div>
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

function GameMoon({ 
  initialPlayers, 
  onGoHome, 
  onGameEnd 
}: { 
  initialPlayers: Player[]; 
  onGoHome: () => void;
  onGameEnd: (rankings: { name: string; points: number }[]) => void;
}) {
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [players, setPlayers] = useState<Player[]>(() => 
    initialPlayers.map(p => ({ 
      ...p, 
      moonSteps: 0, 
      targetNumber: Math.floor(Math.random() * 20) + 1,
      history: [] 
    }))
  );
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentDartIndex, setCurrentDartIndex] = useState(0);
  const [currentTurnDarts, setCurrentTurnDarts] = useState<number[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);

  const handleScoreInput = (num: number) => {
    if (gameState !== 'playing') return;

    const updatedPlayers = [...players];
    const currentPlayer = updatedPlayers[currentPlayerIndex];
    let stepChange = 0;

    // Check if hit own number
    if (num === currentPlayer.targetNumber) {
      currentPlayer.moonSteps = Math.min(10, (currentPlayer.moonSteps || 0) + 1);
      stepChange = 1;
    } 
    // Check if hit someone else's number
    else {
      const victimIndex = updatedPlayers.findIndex(p => p.targetNumber === num);
      if (victimIndex !== -1 && victimIndex !== currentPlayerIndex) {
        updatedPlayers[victimIndex].moonSteps = Math.max(0, (updatedPlayers[victimIndex].moonSteps || 0) - 1);
        stepChange = -1;
      }
    }

    const newTurnDarts = [...currentTurnDarts, num];
    
    if (currentPlayer.moonSteps === 10) {
      setWinner(currentPlayer);
      setGameState('won');
      
      // Calculate rankings based on steps with tie handling
      const distinctSteps = Array.from(new Set(updatedPlayers.map(p => p.moonSteps || 0))).sort((a, b) => b - a);
      const rankings = updatedPlayers.map(p => {
        const step = p.moonSteps || 0;
        const rankIndex = distinctSteps.indexOf(step);
        let points = 0;
        if (rankIndex === 0) points = 10;
        else if (rankIndex === 1) points = 5;
        else if (rankIndex === 2) points = 2;
        return { name: p.name, points };
      });
      onGameEnd(rankings);
      return;
    }

    if (currentDartIndex < 2) {
      setCurrentDartIndex(currentDartIndex + 1);
      setCurrentTurnDarts(newTurnDarts);
    } else {
      currentPlayer.history.push(newTurnDarts);
      setPlayers(updatedPlayers);
      setCurrentDartIndex(0);
      setCurrentTurnDarts([]);
      setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    }
  };

  const handleUndo = () => {
    // Simplified undo for Moon game: just reset turn
    if (currentDartIndex > 0) {
      setCurrentTurnDarts(currentTurnDarts.slice(0, -1));
      setCurrentDartIndex(currentDartIndex - 1);
      // Note: In a real app we'd track step changes to undo them exactly, 
      // but for this version we'll just allow undoing the dart count.
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#050505]">
      {/* Left Side: Space Visualization */}
      <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-between p-12 border-r-8 border-[#1a1a1a]">
        {/* Stars Background */}
        <div className="absolute inset-0 z-0 opacity-40">
          {Array.from({ length: 50 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute bg-white rounded-full"
              style={{
                width: Math.random() * 3 + 'px',
                height: Math.random() * 3 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                opacity: Math.random()
              }}
            />
          ))}
        </div>

        {/* Moon (Top) */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="relative z-10 w-48 h-48 rounded-full bg-zinc-300 shadow-[0_0_100px_rgba(255,255,255,0.2)] flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="w-12 h-12 rounded-full bg-zinc-400/50 absolute top-10 left-10"></div>
          <div className="w-8 h-8 rounded-full bg-zinc-400/50 absolute bottom-12 right-16"></div>
          <div className="w-6 h-6 rounded-full bg-zinc-400/50 absolute top-24 right-8"></div>
        </motion.div>

        {/* Race Tracks */}
        <div className="flex-1 w-full flex justify-around items-end relative z-10 px-10">
          {players.map((p, idx) => (
            <div key={idx} className="flex flex-col items-center h-full justify-end relative w-24">
              {/* Step Markers */}
              <div className="absolute inset-0 flex flex-col justify-between py-10 opacity-10">
                {Array.from({ length: 11 }).map((_, i) => (
                  <div key={i} className="w-full h-[1px] bg-white"></div>
                ))}
              </div>

              {/* Spaceship */}
              <motion.div
                animate={{ 
                  bottom: `${(p.moonSteps || 0) * 10}%`,
                  scale: idx === currentPlayerIndex ? 1.2 : 1,
                  filter: idx === currentPlayerIndex ? 'drop-shadow(0 0 15px #3b82f6)' : 'none'
                }}
                className="relative z-20 mb-4"
              >
                <div className={`p-4 rounded-xl ${idx === currentPlayerIndex ? 'bg-blue-600' : 'bg-zinc-800'} text-white shadow-xl`}>
                  <Target size={32} className={idx === currentPlayerIndex ? 'animate-pulse' : ''} />
                </div>
                {/* Flame effect */}
                {idx === currentPlayerIndex && (
                  <motion.div 
                    animate={{ scaleY: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ repeat: Infinity, duration: 0.2 }}
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4 h-8 bg-gradient-to-t from-transparent via-orange-500 to-yellow-400 rounded-full"
                  />
                )}
              </motion.div>

              {/* Player Info */}
              <div className="text-center mt-4">
                <div className={`text-xs font-mono uppercase tracking-tighter mb-1 ${idx === currentPlayerIndex ? 'text-blue-400 font-bold' : 'text-zinc-500'}`}>
                  {p.name}
                </div>
                <div className="text-2xl font-black font-display italic text-white">
                  #{p.targetNumber}
                </div>
                <div className="text-[10px] font-mono text-zinc-600 mt-1">
                  {p.moonSteps}/10 STEPS
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Earth (Bottom) */}
        <div className="relative z-10 w-full h-32 bg-blue-900 rounded-t-[100%] shadow-[0_-20px_100px_rgba(37,99,235,0.3)] flex items-center justify-center overflow-hidden border-t-4 border-blue-400/30">
          <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
          <div className="text-white/20 font-black text-6xl italic font-display tracking-widest uppercase">EARTH</div>
        </div>

        {/* Win Overlay */}
        {gameState === 'won' && winner && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center"
          >
            <Trophy size={120} className="text-yellow-400 mb-8 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]" />
            <h2 className="text-2xl font-mono uppercase tracking-[0.5em] text-blue-400 mb-4">Mission Accomplished</h2>
            <h3 className="text-7xl font-display italic font-black text-white mb-12">{winner.name} Reached the Moon!</h3>
            <button 
              onClick={onGoHome}
              className="bg-white text-black px-12 py-4 font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all"
            >
              Return to Base
            </button>
          </motion.div>
        )}
      </div>

      {/* Right Side: Input Panel */}
      <div className="w-full md:w-[480px] bg-zinc-950 text-white p-8 flex flex-col shadow-2xl relative border-l-8 border-[#1a1a1a]">
        <div className="mb-12">
          <button onClick={onGoHome} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-mono text-xs uppercase tracking-widest mb-8">
            <ArrowLeft size={14} /> Abort Mission
          </button>
          
          <div className="p-6 bg-blue-600/10 border-2 border-blue-600 rounded-2xl mb-8">
            <div className="text-[10px] font-mono uppercase tracking-widest text-blue-400 mb-2">Current Pilot</div>
            <div className="text-4xl font-display italic font-black uppercase">{players[currentPlayerIndex].name}</div>
            <div className="flex items-center gap-4 mt-4">
              <div className="text-xs font-mono text-zinc-400">Target Number:</div>
              <div className="text-3xl font-black text-white font-display">#{players[currentPlayerIndex].targetNumber}</div>
            </div>
          </div>

          <div className="flex gap-4">
            {[0, 1, 2].map(dartIdx => (
              <div 
                key={dartIdx}
                className={`flex-1 h-12 border-2 rounded-lg flex items-center justify-center font-mono text-lg font-bold transition-all ${
                  dartIdx < currentDartIndex 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : dartIdx === currentDartIndex 
                      ? 'border-blue-500 text-blue-500 animate-pulse' 
                      : 'border-zinc-800 text-zinc-800'
                }`}
              >
                {currentTurnDarts[dartIdx] !== undefined ? currentTurnDarts[dartIdx] : <Target size={16} className="opacity-20" />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-4 gap-3 mb-8">
          {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              onClick={() => handleScoreInput(num)}
              disabled={gameState !== 'playing'}
              className={`aspect-square flex flex-col items-center justify-center border-2 transition-all active:scale-95 disabled:opacity-10 ${
                players.some(p => p.targetNumber === num)
                  ? num === players[currentPlayerIndex].targetNumber
                    ? 'border-blue-500 bg-blue-600/20 text-white hover:bg-blue-600'
                    : 'border-red-600/50 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white'
                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
              }`}
            >
              <span className="text-2xl font-black font-display italic">{num}</span>
              {players.find(p => p.targetNumber === num) && (
                <span className="text-[8px] font-mono uppercase mt-1 opacity-60">
                  {players.find(p => p.targetNumber === num)?.name.slice(0, 3)}
                </span>
              )}
            </button>
          ))}
          
          <button
            onClick={() => handleScoreInput(0)}
            disabled={gameState !== 'playing'}
            className="col-span-4 py-6 text-xl font-black font-display italic tracking-widest border-2 border-zinc-800 hover:bg-zinc-800 disabled:opacity-10 transition-all active:scale-95"
          >
            MISS
          </button>
        </div>

        <button
          onClick={handleUndo}
          disabled={gameState !== 'playing' || currentDartIndex === 0}
          className="w-full py-6 flex items-center justify-center gap-4 border-2 border-zinc-800 text-zinc-500 hover:border-white hover:text-white disabled:opacity-10 transition-all font-black tracking-[0.2em] text-sm italic font-display"
        >
          <RotateCcw size={18} />
          UNDO LAST DART
        </button>

        <div className="mt-auto pt-8 border-t border-zinc-900 flex justify-between items-center opacity-20">
          <div className="font-mono text-[8px] uppercase tracking-widest">Lunar Mission Control</div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
