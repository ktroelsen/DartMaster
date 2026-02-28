/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Home, Trophy, User, RotateCcw, ArrowLeft, Target, ChevronRight, Rocket, Ghost, Orbit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type View = 'home' | '301' | 'moon' | 'around' | 'football' | 'asteroids';

interface Player {
  name: string;
  score: number;
  history: any[][];
  tournamentPoints: number;
  targetNumber?: number;
  moonSteps?: number;
  aroundNumber?: number;
  footballGoals?: number;
  asteroidsHits?: Record<number, number>;
  asteroidsScore?: number;
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
    setTournamentPlayers([]);
    setView('home');
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
        ) : view === 'moon' ? (
          <GameMoon
            initialPlayers={tournamentPlayers}
            onGoHome={() => setView('home')}
            onGameEnd={handleUpdateTournamentPoints}
          />
        ) : view === 'around' ? (
          <GameAround
            initialPlayers={tournamentPlayers}
            onGoHome={() => setView('home')}
            onGameEnd={handleUpdateTournamentPoints}
          />
        ) : view === 'asteroids' ? (
          <GameAsteroids
            initialPlayers={tournamentPlayers}
            onGoHome={() => setView('home')}
            onGameEnd={handleUpdateTournamentPoints}
          />
        ) : (
          <GameFootball
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
  onSelectGame: (game: '301' | 'moon' | 'around' | 'football' | 'asteroids') => void;
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
                  {[...players].sort((a, b) => b.tournamentPoints - a.tournamentPoints).map((p, idx) => (
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
                          onClick={() => setPlayers(players.filter(player => player.name !== p.name))}
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
              className="w-full group relative bg-zinc-900 border-2 border-yellow-500 p-8 hover:bg-yellow-500 transition-all duration-500 text-left overflow-hidden shadow-[0_0_30px_rgba(234,179,8,0.1)] disabled:opacity-20 disabled:grayscale"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <Target size={32} className="text-yellow-500 group-hover:text-white transition-colors" />
                  <span className="bg-yellow-600 text-[8px] px-2 py-1 font-mono font-bold uppercase tracking-tighter text-white">New Game</span>
                </div>
                <h2 className="text-3xl font-bold mb-2 italic font-display group-hover:text-white">TO THE MOON</h2>
                <p className="text-xs opacity-60 group-hover:opacity-90 font-mono uppercase tracking-wider">Race to the lunar surface.</p>
              </div>
            </button>

            <button
              onClick={() => onSelectGame('around')}
              disabled={players.length < 1}
              className="w-full group relative bg-zinc-900 border-2 border-blue-600 p-8 hover:bg-blue-600 transition-all duration-500 text-left overflow-hidden shadow-[0_0_30px_rgba(37,99,235,0.1)] disabled:opacity-20 disabled:grayscale"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <Target size={32} className="text-blue-500 group-hover:text-white transition-colors" />
                  <span className="bg-blue-600 text-[8px] px-2 py-1 font-mono font-bold uppercase tracking-tighter text-white">New Game</span>
                </div>
                <h2 className="text-3xl font-bold mb-2 italic font-display group-hover:text-white">AROUND THE WORLD</h2>
                <p className="text-xs opacity-60 group-hover:opacity-90 font-mono uppercase tracking-wider">Hit 1-20 in order. 7 rounds to finish.</p>
              </div>
            </button>

            <button
              onClick={() => onSelectGame('football')}
              disabled={players.length < 1}
              className="w-full group relative bg-zinc-900 border-2 border-emerald-500 p-8 hover:bg-emerald-500 transition-all duration-500 text-left overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.1)] disabled:opacity-20 disabled:grayscale"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <Target size={32} className="text-emerald-500 group-hover:text-white transition-colors" />
                  <span className="bg-emerald-600 text-[8px] px-2 py-1 font-mono font-bold uppercase tracking-tighter text-white">New Game</span>
                </div>
                <h2 className="text-3xl font-bold mb-2 italic font-display group-hover:text-white">FOOTBALL</h2>
                <p className="text-xs opacity-60 group-hover:opacity-90 font-mono uppercase tracking-wider">Pass the ball and score goals. 7 rounds of action.</p>
              </div>
            </button>

            <button
              onClick={() => onSelectGame('asteroids')}
              disabled={players.length < 1}
              className="w-full group relative bg-zinc-900 border-2 border-zinc-500 p-8 hover:bg-zinc-500 transition-all duration-500 text-left overflow-hidden shadow-[0_0_30px_rgba(113,113,122,0.1)] disabled:opacity-20 disabled:grayscale"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <Target size={32} className="text-zinc-500 group-hover:text-white transition-colors" />
                  <span className="bg-zinc-600 text-[8px] px-2 py-1 font-mono font-bold uppercase tracking-tighter text-white">New Game</span>
                </div>
                <h2 className="text-3xl font-bold mb-2 italic font-display group-hover:text-white">ASTEROIDS</h2>
                <p className="text-xs opacity-60 group-hover:opacity-90 font-mono uppercase tracking-wider">4 rounds. Hit numbers to clear space debris.</p>
              </div>
            </button>
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
  const [hasFinished, setHasFinished] = useState(false);

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
    const isLastPlayer = currentPlayerIndex === players.length - 1;
    const isTurnOver = currentDartIndex === 2 || newScore <= 0;

    // Check if this player finished
    let someoneFinished = hasFinished || newScore <= 0;
    if (newScore <= 0 && !hasFinished) {
      setHasFinished(true);
    }

    if (isTurnOver) {
      // End of turn logic
      updatedPlayers[currentPlayerIndex].history.push(newTurnDarts);
      
      if (isLastPlayer && someoneFinished) {
        // End of round and someone has finished - Game Over
        const sortedByScore = [...updatedPlayers].sort((a, b) => a.score - b.score);
        setWinner(sortedByScore[0]);
        setGameState('won');
        
        const rankings = sortedByScore.map((p, idx) => ({
          name: p.name,
          points: idx === 0 ? 10 : idx === 1 ? 5 : idx === 2 ? 2 : 0
        }));
        onGameEnd(rankings);
      } else {
        // Move to next player
        setMultiplier(1);
        setCurrentDartIndex(0);
        setCurrentTurnDarts([]);
        setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
      }
    } else {
      // Continue turn
      setMultiplier(1);
      setCurrentDartIndex(currentDartIndex + 1);
      setCurrentTurnDarts(newTurnDarts);
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
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#050505]">
      {/* Left Side: Scoreboard */}
      <div className="flex-1 relative overflow-hidden flex flex-col border-r-8 border-[#1a1a1a]">
        <div className="p-8 border-b border-white/5 flex justify-center items-center relative z-10">
          <div className="text-center">
            <div className="text-xs font-mono uppercase tracking-[0.5em] text-red-500 mb-1">Championship Series</div>
            <h2 className="text-4xl font-display italic font-black text-white">301 DOWN <span className="text-red-500">•</span> ROUND {Math.floor(players[0].history.length + 1)}</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-12 grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10 content-start">
          {players.map((p, idx) => (
            <motion.div 
              key={idx} 
              initial={false}
              animate={{ 
                scale: idx === currentPlayerIndex ? 1.02 : 1,
                opacity: idx === currentPlayerIndex ? 1 : 0.5
              }}
              className={`p-8 border-2 transition-all duration-500 ${idx === currentPlayerIndex ? 'border-red-600 bg-red-600/5 shadow-[0_0_40px_rgba(220,38,38,0.15)]' : 'border-white/5 bg-black/40'} relative overflow-hidden h-fit rounded-2xl`}
            >
              {idx === currentPlayerIndex && (
                <div className="absolute top-0 right-0 bg-red-600 text-white font-mono text-[10px] px-4 py-1 font-bold uppercase tracking-widest">
                  Active
                </div>
              )}
              
              {p.score <= 0 && (
                <div className="absolute top-0 left-0 bg-green-600 text-white font-mono text-[10px] px-4 py-1 font-bold uppercase tracking-widest">
                  Finished
                </div>
              )}
              
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-2xl font-display italic font-black uppercase text-white truncate pr-4">{p.name}</h3>
                <div className="font-mono text-xs text-zinc-600">PLAYER {idx + 1}</div>
              </div>
              
              <div className="text-7xl font-display italic font-black tracking-tighter leading-none mb-8 text-white">
                {p.score}
              </div>

              {/* History of last 3 turns */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2 border-b border-white/5 pb-2">Recent Performance</div>
                {p.history.slice(-3).reverse().map((turn, tIdx) => (
                  <div key={tIdx} className="flex justify-between items-center text-sm font-mono text-zinc-400">
                    <span className="opacity-40 text-[10px]">TURN {p.history.length - tIdx}</span>
                    <div className="flex gap-3">
                      {turn.map((d, dIdx) => (
                        <span key={dIdx} className={`w-10 text-center font-bold ${d > 20 ? 'text-red-500' : 'text-white'}`}>{d}</span>
                      ))}
                    </div>
                    <span className="font-black text-white w-12 text-right">-{turn.reduce((a, b) => a + b, 0)}</span>
                  </div>
                ))}
              </div>

              {idx === currentPlayerIndex && gameState === 'playing' && (
                <div className="mt-10 flex gap-4">
                  {[0, 1, 2].map(dartIdx => (
                    <div 
                      key={dartIdx}
                      className={`flex-1 h-16 border-2 rounded-xl flex items-center justify-center font-mono text-xl font-bold transition-all ${
                        dartIdx < currentDartIndex 
                          ? 'bg-red-600 border-red-500 text-white' 
                          : dartIdx === currentDartIndex 
                            ? 'border-red-500 text-red-500 animate-pulse bg-red-500/5' 
                            : 'border-zinc-800 text-zinc-800'
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

        {/* Win Overlay */}
        {gameState === 'won' && winner && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center overflow-y-auto"
          >
            <Trophy size={80} className="text-yellow-400 mb-6 drop-shadow-[0_0_40px_rgba(234,179,8,0.4)]" />
            <h2 className="text-xl font-mono uppercase tracking-[0.5em] text-red-500 mb-2">Championship Winner</h2>
            <h3 className="text-6xl font-display italic font-black text-white mb-10">{winner.name}</h3>
            
            <div className="w-full max-w-2xl mb-12 bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden">
              <div className="grid grid-cols-4 gap-4 p-6 border-b border-zinc-800 text-xs font-mono uppercase tracking-widest text-zinc-500 bg-zinc-900/80">
                <div className="text-left">Pos</div>
                <div className="text-left">Player</div>
                <div className="text-right">Remaining</div>
                <div className="text-right">Gap</div>
              </div>
              {[...players].sort((a, b) => a.score - b.score).map((p, i, arr) => {
                const score = p.score;
                const winnerScore = arr[0].score;
                const gap = i === 0 ? '-' : `+${score - winnerScore}`;
                
                return (
                  <div key={p.name} className={`grid grid-cols-4 gap-4 p-6 border-b border-zinc-900/50 items-center ${p.name === winner.name ? 'bg-red-500/5' : ''}`}>
                    <div className="text-left font-mono text-zinc-400">#{i + 1}</div>
                    <div className="text-left font-display italic font-bold text-white text-xl">{p.name}</div>
                    <div className="text-right font-mono text-2xl font-black text-white">{score}</div>
                    <div className="text-right font-mono text-zinc-500">{gap}</div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={onGoHome}
              className="bg-red-600 text-white px-12 py-4 font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)] rounded-full"
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
          
          <div className="p-6 bg-red-600/10 border-2 border-red-600 rounded-2xl mb-8">
            <div className="text-[10px] font-mono uppercase tracking-widest text-red-400 mb-2">Active Player</div>
            <div className="text-4xl font-display italic font-black uppercase">{players[currentPlayerIndex].name}</div>
            <div className="flex items-center gap-4 mt-4">
              <div className="text-xs font-mono text-zinc-400">Current Score:</div>
              <div className="text-3xl font-black text-white font-display">{players[currentPlayerIndex].score}</div>
            </div>
          </div>

          <div className="flex gap-4">
            {[0, 1, 2].map(dartIdx => (
              <div 
                key={dartIdx}
                className={`flex-1 h-16 border-2 rounded-xl flex items-center justify-center font-mono text-xl font-bold transition-all ${
                  dartIdx < currentDartIndex 
                    ? 'bg-red-600 border-red-500 text-white' 
                    : dartIdx === currentDartIndex 
                      ? 'border-red-500 text-red-500 animate-pulse' 
                      : 'border-zinc-800 text-zinc-800'
                }`}
              >
                {currentTurnDarts[dartIdx] !== undefined ? currentTurnDarts[dartIdx] : <Target size={20} className="opacity-20" />}
              </div>
            ))}
          </div>
        </div>

        {/* Multiplier Toggles */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((m) => (
            <button
              key={m}
              onClick={() => setMultiplier(m as 1 | 2 | 3)}
              className={`py-4 font-black font-display italic text-2xl border-2 transition-all ${
                multiplier === m 
                  ? 'bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]' 
                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'
              }`}
            >
              {m === 1 ? 'SINGLE' : m === 2 ? 'DOUBLE' : 'TRIPLE'}
            </button>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-4 gap-3 mb-8">
          {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              onClick={() => handleScoreInput(num)}
              disabled={gameState !== 'playing'}
              className="aspect-square flex flex-col items-center justify-center border-2 border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 transition-all active:scale-95 disabled:opacity-10"
            >
              <span className="text-2xl font-black font-display italic">{num}</span>
            </button>
          ))}
          
          <button
            onClick={() => handleScoreInput(0)}
            disabled={gameState !== 'playing'}
            className="col-span-4 py-6 text-xl font-black font-display italic tracking-widest border-2 border-zinc-800 hover:bg-zinc-800 disabled:opacity-10 transition-all active:scale-95"
          >
            MISS
          </button>

          <button
            onClick={() => {
              setMultiplier(1);
              handleScoreInput(25);
            }}
            disabled={gameState !== 'playing'}
            className="col-span-2 py-4 text-xs font-mono font-bold uppercase border-2 border-zinc-800 hover:border-red-500 hover:text-red-500 transition-all active:scale-95"
          >
            Outer Bull (25)
          </button>
          <button
            onClick={() => {
              setMultiplier(1);
              handleScoreInput(50);
            }}
            disabled={gameState !== 'playing'}
            className="col-span-2 py-4 text-xs font-mono font-bold uppercase border-2 border-zinc-800 hover:border-red-500 hover:text-red-500 transition-all active:scale-95"
          >
            Inner Bull (50)
          </button>
        </div>

        <button
          onClick={handleUndo}
          disabled={gameState !== 'playing' || (currentDartIndex === 0 && players.every(p => p.history.length === 0))}
          className="w-full py-6 flex items-center justify-center gap-4 border-2 border-zinc-800 text-zinc-500 hover:border-white hover:text-white disabled:opacity-10 transition-all font-black tracking-[0.2em] text-sm italic font-display"
        >
          <RotateCcw size={18} />
          UNDO LAST DART
        </button>

        <div className="mt-auto pt-8 border-t border-zinc-900 flex justify-between items-center opacity-20">
          <div className="font-mono text-[8px] uppercase tracking-widest">DartMaster Championship</div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-red-600"></div>
            <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
          </div>
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
  const [round, setRound] = useState(1);
  const MAX_ROUNDS = 7;

  const handleScoreInput = (num: number) => {
    if (gameState !== 'playing') return;

    const updatedPlayers = [...players];
    const currentPlayer = updatedPlayers[currentPlayerIndex];

    // Check if hit own number
    if (num === currentPlayer.targetNumber) {
      currentPlayer.moonSteps = Math.min(10, (currentPlayer.moonSteps || 0) + 1);
    } 
    // Check if hit someone else's number
    else {
      const victimIndex = updatedPlayers.findIndex(p => p.targetNumber === num);
      if (victimIndex !== -1 && victimIndex !== currentPlayerIndex) {
        updatedPlayers[victimIndex].moonSteps = Math.max(0, (updatedPlayers[victimIndex].moonSteps || 0) - 1);
      }
    }

    const newTurnDarts = [...currentTurnDarts, num];
    
    if (currentDartIndex < 2) {
      setCurrentDartIndex(currentDartIndex + 1);
      setCurrentTurnDarts(newTurnDarts);
    } else {
      // End of turn
      currentPlayer.history.push(newTurnDarts);
      setPlayers(updatedPlayers);
      setCurrentDartIndex(0);
      setCurrentTurnDarts([]);
      
      const nextPlayerIdx = (currentPlayerIndex + 1) % players.length;
      if (nextPlayerIdx === 0) {
        // End of round
        if (round >= MAX_ROUNDS || updatedPlayers.some(p => p.moonSteps === 10)) {
          // Game Over
          const sortedByProgress = [...updatedPlayers].sort((a, b) => (b.moonSteps || 0) - (a.moonSteps || 0));
          setWinner(sortedByProgress[0]);
          setGameState('won');
          
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
        } else {
          setRound(round + 1);
          setCurrentPlayerIndex(0);
        }
      } else {
        setCurrentPlayerIndex(nextPlayerIdx);
      }
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
        <div className="relative z-20 text-center mb-8">
          <div className="text-xs font-mono uppercase tracking-[0.5em] text-yellow-400 mb-2">Lunar Mission</div>
          <h2 className="text-5xl font-display italic font-black text-white">ROUND {round}<span className="text-yellow-400">/{MAX_ROUNDS}</span></h2>
        </div>

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
                  filter: idx === currentPlayerIndex ? 'drop-shadow(0 0 15px #eab308)' : 'none'
                }}
                className="relative z-20 mb-4"
              >
                <div className={`p-4 rounded-xl ${idx === currentPlayerIndex ? 'bg-yellow-500' : 'bg-zinc-800'} text-white shadow-xl`}>
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
                <div className={`text-xs font-mono uppercase tracking-tighter mb-1 ${idx === currentPlayerIndex ? 'text-yellow-400 font-bold' : 'text-zinc-500'}`}>
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
        <div className="relative z-10 w-full h-32 bg-yellow-900/20 rounded-t-[100%] shadow-[0_-20px_100px_rgba(234,179,8,0.3)] flex items-center justify-center overflow-hidden border-t-4 border-yellow-400/30">
          <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
          <div className="text-white/20 font-black text-6xl italic font-display tracking-widest uppercase">EARTH</div>
        </div>

        {/* Win Overlay */}
        {gameState === 'won' && winner && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center overflow-y-auto"
          >
            <Trophy size={80} className="text-yellow-400 mb-6 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]" />
            <h2 className="text-xl font-mono uppercase tracking-[0.5em] text-yellow-400 mb-2">Mission Accomplished</h2>
            <h3 className="text-6xl font-display italic font-black text-white mb-10">{winner.name} Reached the Moon!</h3>
            
            <div className="w-full max-w-2xl mb-12 bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden">
              <div className="grid grid-cols-4 gap-4 p-6 border-b border-zinc-800 text-xs font-mono uppercase tracking-widest text-zinc-500 bg-zinc-900/80">
                <div className="text-left">Pos</div>
                <div className="text-left">Player</div>
                <div className="text-right">Steps Left</div>
                <div className="text-right">Gap</div>
              </div>
              {[...players].sort((a, b) => (a.moonSteps || 0) - (b.moonSteps || 0)).map((p, i, arr) => {
                const score = p.moonSteps || 0;
                const winnerScore = arr[0].moonSteps || 0;
                const gap = i === 0 ? '-' : `+${score - winnerScore}`;
                
                return (
                  <div key={p.name} className={`grid grid-cols-4 gap-4 p-6 border-b border-zinc-900/50 items-center ${p.name === winner.name ? 'bg-yellow-500/5' : ''}`}>
                    <div className="text-left font-mono text-zinc-400">#{i + 1}</div>
                    <div className="text-left font-display italic font-bold text-white text-xl">{p.name}</div>
                    <div className="text-right font-mono text-2xl font-black text-white">{score}</div>
                    <div className="text-right font-mono text-zinc-500">{gap}</div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={onGoHome}
              className="bg-white text-black px-12 py-4 font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-white transition-all rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)]"
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
          
          <div className="p-6 bg-yellow-600/10 border-2 border-yellow-600 rounded-2xl mb-8">
            <div className="text-[10px] font-mono uppercase tracking-widest text-yellow-400 mb-2">Current Pilot</div>
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
                    ? 'bg-yellow-600 border-yellow-500 text-white' 
                    : dartIdx === currentDartIndex 
                      ? 'border-yellow-500 text-yellow-500 animate-pulse' 
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
                    ? 'border-yellow-500 bg-yellow-600/20 text-white hover:bg-yellow-600'
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
            <div className="w-2 h-2 rounded-full bg-yellow-600"></div>
            <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GameAround({ 
  initialPlayers, 
  onGoHome, 
  onGameEnd 
}: { 
  initialPlayers: Player[]; 
  onGoHome: () => void;
  onGameEnd: (rankings: { name: string; points: number }[]) => void;
}) {
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [players, setPlayers] = useState<Player[]>(() => {
    // Randomize starting player
    const shuffled = [...initialPlayers].sort(() => Math.random() - 0.5);
    return shuffled.map(p => ({ ...p, aroundNumber: 1, history: [] }));
  });
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentDartIndex, setCurrentDartIndex] = useState(0);
  const [currentTurnDarts, setCurrentTurnDarts] = useState<string[]>([]);
  const [multiplier, setMultiplier] = useState<1 | 2 | 3>(1);
  const [winner, setWinner] = useState<Player | null>(null);
  const [round, setRound] = useState(1);
  const MAX_ROUNDS = 7;

  const handleScoreInput = (num: number) => {
    if (gameState !== 'playing') return;

    const currentPlayer = players[currentPlayerIndex];
    const target = currentPlayer.aroundNumber || 1;
    let hits = 0;
    let dartLabel = num === 0 ? 'MISS' : `${num}`;

    if (num === target) {
      hits = multiplier;
      if (multiplier === 2) dartLabel = `D${num}`;
      if (multiplier === 3) dartLabel = `T${num}`;
    } else if (num !== 0) {
      // Hit a number but not the target
      if (multiplier === 2) dartLabel = `D${num}`;
      if (multiplier === 3) dartLabel = `T${num}`;
    }

    const nextNumber = Math.min(20, target + hits);
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex] = {
      ...currentPlayer,
      aroundNumber: nextNumber
    };
    setPlayers(updatedPlayers);

    const newTurnDarts = [...currentTurnDarts, dartLabel];
    setMultiplier(1);

    if (currentDartIndex < 2) {
      setCurrentDartIndex(currentDartIndex + 1);
      setCurrentTurnDarts(newTurnDarts);
    } else {
      // End of turn
      updatedPlayers[currentPlayerIndex].history.push([]); // Just to track turns
      setPlayers(updatedPlayers);
      setCurrentDartIndex(0);
      setCurrentTurnDarts([]);
      
      const nextPlayerIdx = (currentPlayerIndex + 1) % players.length;
      if (nextPlayerIdx === 0) {
        // End of round
        if (round >= MAX_ROUNDS || updatedPlayers.some(p => p.aroundNumber === 20)) {
          // Game Over
          const sortedByProgress = [...updatedPlayers].sort((a, b) => (b.aroundNumber || 0) - (a.aroundNumber || 0));
          setWinner(sortedByProgress[0]);
          setGameState('won');
          
          const distinctProgress = Array.from(new Set(updatedPlayers.map(p => p.aroundNumber || 0))).sort((a, b) => b - a);
          const rankings = updatedPlayers.map(p => {
            const prog = p.aroundNumber || 0;
            const rankIndex = distinctProgress.indexOf(prog);
            let points = 0;
            if (rankIndex === 0) points = 10;
            else if (rankIndex === 1) points = 5;
            else if (rankIndex === 2) points = 2;
            return { name: p.name, points };
          });
          onGameEnd(rankings);
        } else {
          setRound(round + 1);
          setCurrentPlayerIndex(0);
        }
      } else {
        setCurrentPlayerIndex(nextPlayerIdx);
      }
    }
  };

  const handleUndo = () => {
    if (currentDartIndex > 0) {
      setCurrentDartIndex(currentDartIndex - 1);
      setCurrentTurnDarts(currentTurnDarts.slice(0, -1));
    }
  };

  const dartboardNumbers = [1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5, 20];
  const currentTarget = players[currentPlayerIndex].aroundNumber || 1;

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#050505]">
      {/* Left Side: Visualization */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-12 overflow-hidden">
        {/* Background Globe Effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-blue-500/20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-blue-500/10"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-px bg-blue-500/10 rotate-45"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-px bg-blue-500/10 -rotate-45"></div>
        </div>

        <div className="relative z-10 text-center mb-12">
          <div className="text-xs font-mono uppercase tracking-[0.5em] text-blue-500 mb-2">Global Expedition</div>
          <h2 className="text-6xl font-display italic font-black text-white">ROUND {round}<span className="text-blue-500">/{MAX_ROUNDS}</span></h2>
        </div>

        {/* The Globe / Dartboard */}
        <div className="relative w-[400px] h-[400px] md:w-[500px] md:h-[500px]">
          {/* Globe Sphere */}
          <div className="absolute inset-0 rounded-full bg-blue-900 border-4 border-zinc-800 shadow-[0_0_100px_rgba(37,99,235,0.2)] overflow-hidden">
            {/* Earth Landmasses (Abstract) */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-40">
              <path d="M20,40 C30,30 40,30 50,40 S70,50 80,40 S90,60 80,70 S60,80 40,75 S10,60 20,40" fill="#60a5fa" />
              <path d="M70,15 C80,10 90,15 95,25 S85,40 75,35 S65,20 70,15" fill="#60a5fa" />
              <path d="M15,15 C25,10 35,15 30,25 S20,35 10,30 S5,20 15,15" fill="#60a5fa" />
              <path d="M40,85 C50,80 60,85 65,95 S55,105 45,100 S35,90 40,85" fill="#60a5fa" />
            </svg>

            {/* Latitude/Longitude Lines */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white"></div>
              <div className="absolute left-0 right-0 top-1/2 h-px bg-white"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1/2 border-y border-white rounded-[100%]"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-full border-x border-white rounded-[100%]"></div>
            </div>

            {/* Dartboard Segments */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full rotate-[9deg]">
              {dartboardNumbers.map((num, i) => {
                const angle = i * 18;
                const isTarget = num === currentTarget;
                
                // Calculate text position
                const textAngle = (angle + 9) * (Math.PI / 180);
                const tx = 50 + 42 * Math.sin(textAngle);
                const ty = 50 - 42 * Math.cos(textAngle);

                return (
                  <g key={num}>
                    <path
                      d="M 50 50 L 50 0 A 50 50 0 0 1 65.45 2.45 Z"
                      transform={`rotate(${angle} 50 50)`}
                      className={`transition-all duration-500 ${isTarget ? 'fill-blue-400 opacity-60 animate-pulse' : 'fill-transparent stroke-white/10 stroke-[0.2]'}`}
                    />
                    <text 
                      x={tx} 
                      y={ty} 
                      fontSize="3" 
                      fill="white" 
                      textAnchor="middle" 
                      dominantBaseline="middle" 
                      className="font-mono font-bold opacity-40 select-none pointer-events-none"
                      transform={`rotate(${-9} ${tx} ${ty})`}
                    >
                      {num}
                    </text>
                  </g>
                );
              })}
              <circle cx="50" cy="50" r="10" className="fill-black/40 stroke-blue-500/20 stroke-1" />
            </svg>
          </div>

          {/* Target Indicator */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-black font-display text-4xl px-6 py-2 italic font-black shadow-lg">
            TARGET: {currentTarget}
          </div>

          {/* Player Progress Rings */}
          {players.map((p, i) => (
            <div 
              key={i}
              className="absolute inset-0 pointer-events-none"
              style={{ padding: `${i * 15}px` }}
            >
              <div 
                className={`w-full h-full rounded-full border-2 transition-all duration-1000 ${i === currentPlayerIndex ? 'border-blue-500 opacity-100' : 'border-white/10 opacity-30'}`}
                style={{ 
                  clipPath: `conic-gradient(from 0deg, white ${(p.aroundNumber || 1) / 20 * 360}deg, transparent 0deg)`
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Player List / Progress */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          {players.map((p, i) => (
            <div 
              key={i} 
              className={`p-4 border-2 transition-all ${i === currentPlayerIndex ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-800 bg-black/40'}`}
            >
              <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">{p.name}</div>
              <div className="flex justify-between items-end">
                <div className="text-3xl font-display italic font-black text-white">{p.aroundNumber}/20</div>
                <div className="w-12 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${((p.aroundNumber || 1) / 20) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {gameState === 'won' && winner && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center overflow-y-auto"
          >
            <Trophy size={80} className="text-yellow-400 mb-6 drop-shadow-[0_0_30px_rgba(234,179,8,0.4)]" />
            <h2 className="text-xl font-mono uppercase tracking-[0.5em] text-blue-500 mb-2">World Champion</h2>
            <h3 className="text-6xl font-display italic font-black text-white mb-10">{winner.name}</h3>
            
            <div className="w-full max-w-2xl mb-12 bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden">
              <div className="grid grid-cols-4 gap-4 p-6 border-b border-zinc-800 text-xs font-mono uppercase tracking-widest text-zinc-500 bg-zinc-900/80">
                <div className="text-left">Pos</div>
                <div className="text-left">Player</div>
                <div className="text-right">Progress</div>
                <div className="text-right">Gap</div>
              </div>
              {[...players].sort((a, b) => (b.aroundNumber || 1) - (a.aroundNumber || 1)).map((p, i, arr) => {
                const score = p.aroundNumber || 1;
                const winnerScore = arr[0].aroundNumber || 1;
                const gap = i === 0 ? '-' : `-${winnerScore - score}`;
                
                return (
                  <div key={p.name} className={`grid grid-cols-4 gap-4 p-6 border-b border-zinc-900/50 items-center ${p.name === winner.name ? 'bg-blue-500/5' : ''}`}>
                    <div className="text-left font-mono text-zinc-400">#{i + 1}</div>
                    <div className="text-left font-display italic font-bold text-white text-xl">{p.name}</div>
                    <div className="text-right font-mono text-2xl font-black text-white">{score}/20</div>
                    <div className="text-right font-mono text-zinc-500">{gap}</div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={onGoHome}
              className="bg-blue-600 text-white px-12 py-4 font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded-full shadow-[0_0_30px_rgba(37,99,235,0.3)]"
            >
              Return Home
            </button>
          </motion.div>
        )}
      </div>

      {/* Right Side: Input Panel */}
      <div className="w-full md:w-[480px] bg-zinc-950 text-white p-8 flex flex-col shadow-2xl relative border-l-8 border-zinc-900">
        <div className="mb-12">
          <button onClick={onGoHome} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-mono text-xs uppercase tracking-widest mb-8">
            <ArrowLeft size={14} /> Abandon Mission
          </button>
          
          <div className="p-6 bg-blue-600/10 border-2 border-blue-600 rounded-2xl mb-8">
            <div className="text-[10px] font-mono uppercase tracking-widest text-blue-400 mb-2">Current Player</div>
            <div className="text-4xl font-display italic font-black uppercase">{players[currentPlayerIndex].name}</div>
            <div className="flex items-center gap-4 mt-4">
              <div className="text-xs font-mono text-zinc-400">Next Target:</div>
              <div className="text-3xl font-black text-white font-display">#{currentTarget}</div>
            </div>
          </div>

          <div className="flex gap-4">
            {[0, 1, 2].map(dartIdx => (
              <div 
                key={dartIdx}
                className={`flex-1 h-16 border-2 rounded-xl flex items-center justify-center font-mono text-xl font-bold transition-all ${
                  dartIdx < currentDartIndex 
                    ? 'bg-blue-600 border-blue-500 text-black' 
                    : dartIdx === currentDartIndex 
                      ? 'border-blue-500 text-blue-500 animate-pulse' 
                      : 'border-zinc-800 text-zinc-800'
                }`}
              >
                {currentTurnDarts[dartIdx] !== undefined ? currentTurnDarts[dartIdx] : <Target size={20} className="opacity-20" />}
              </div>
            ))}
          </div>
        </div>

        {/* Multiplier Toggles */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((m) => (
            <button
              key={m}
              onClick={() => setMultiplier(m as 1 | 2 | 3)}
              className={`py-4 font-black font-display italic text-2xl border-2 transition-all ${
                multiplier === m 
                  ? 'bg-blue-600 border-blue-500 text-black shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'
              }`}
            >
              {m === 1 ? 'SINGLE' : m === 2 ? 'DOUBLE' : 'TRIPLE'}
            </button>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-4 gap-3 mb-8">
          {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              onClick={() => handleScoreInput(num)}
              disabled={gameState !== 'playing'}
              className={`aspect-square flex flex-col items-center justify-center border-2 transition-all active:scale-95 disabled:opacity-10 ${
                num === currentTarget
                  ? 'border-blue-500 bg-blue-600/20 text-white hover:bg-blue-600 hover:text-black'
                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
              }`}
            >
              <span className="text-2xl font-black font-display italic">{num}</span>
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
      </div>
    </div>
  );
}

type FootballNode = 'goalL' | 'posL' | 'posTL' | 'posBL' | 'posC' | 'posTR' | 'posBR' | 'posR' | 'goalR';

const FOOTBALL_CONNECTIONS: Record<FootballNode, { target: FootballNode; weight: number }[]> = {
  goalL: [{ target: 'posL', weight: 1 }],
  posL: [{ target: 'goalL', weight: 1 }, { target: 'posTL', weight: 1 }, { target: 'posBL', weight: 1 }],
  posTL: [{ target: 'posL', weight: 1 }, { target: 'posC', weight: 1 }, { target: 'posTR', weight: 2 }],
  posBL: [{ target: 'posL', weight: 1 }, { target: 'posC', weight: 1 }, { target: 'posBR', weight: 2 }],
  posC: [{ target: 'posTL', weight: 1 }, { target: 'posBL', weight: 1 }, { target: 'posTR', weight: 1 }, { target: 'posBR', weight: 1 }],
  posTR: [{ target: 'posTL', weight: 2 }, { target: 'posC', weight: 1 }, { target: 'posR', weight: 1 }],
  posBR: [{ target: 'posBL', weight: 2 }, { target: 'posC', weight: 1 }, { target: 'posR', weight: 1 }],
  posR: [{ target: 'posTR', weight: 1 }, { target: 'posBR', weight: 1 }, { target: 'goalR', weight: 1 }],
  goalR: [{ target: 'posR', weight: 1 }]
};

const NODE_POSITIONS: Record<FootballNode, { x: number; y: number; label: string }> = {
  goalL: { x: 5, y: 50, label: 'GOAL L' },
  posL: { x: 20, y: 50, label: 'DEF L' },
  posTL: { x: 35, y: 25, label: 'MID TL' },
  posBL: { x: 35, y: 75, label: 'MID BL' },
  posC: { x: 50, y: 50, label: 'CENTER' },
  posTR: { x: 65, y: 25, label: 'MID TR' },
  posBR: { x: 65, y: 75, label: 'MID BR' },
  posR: { x: 80, y: 50, label: 'DEF R' },
  goalR: { x: 95, y: 50, label: 'GOAL R' }
};

function GameFootball({ 
  initialPlayers, 
  onGoHome, 
  onGameEnd 
}: { 
  initialPlayers: Player[]; 
  onGoHome: () => void;
  onGameEnd: (rankings: { name: string; points: number }[]) => void;
}) {
  const [gameState, setGameState] = useState<'playing' | 'penalties' | 'won'>('playing');
  const [players, setPlayers] = useState<Player[]>(() => {
    const shuffled = [...initialPlayers].sort(() => Math.random() - 0.5);
    return shuffled.map(p => ({ ...p, footballGoals: 0, history: [] }));
  });
  const [nodeNumbers, setNodeNumbers] = useState<Record<FootballNode, number>>(() => {
    const nums = Array.from({ length: 20 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    return {
      goalL: nums[0],
      posL: nums[1],
      posTL: nums[2],
      posBL: nums[3],
      posC: nums[4],
      posTR: nums[5],
      posBR: nums[6],
      posR: nums[7],
      goalR: nums[8]
    };
  });
  const [ballPos, setBallPos] = useState<FootballNode>('posC');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentDartIndex, setCurrentDartIndex] = useState(0);
  const [currentTurnDarts, setCurrentTurnDarts] = useState<string[]>([]);
  const [multiplier, setMultiplier] = useState<1 | 2 | 3>(1);
  const [round, setRound] = useState(1);
  const [partialHits, setPartialHits] = useState<Record<string, number>>({});
  const [winner, setWinner] = useState<Player | null>(null);
  const [penaltyRound, setPenaltyRound] = useState(1);
  const [penaltyScores, setPenaltyScores] = useState<number[]>([0, 0]);
  const [showGoalAnimation, setShowGoalAnimation] = useState(false);
  const [goalText, setGoalText] = useState('GOAL!!!');

  const MAX_ROUNDS = 7;

  const handleScoreInput = (num: number) => {
    if (gameState === 'won') return;

    const updatedPlayers = [...players];
    const currentPlayer = updatedPlayers[currentPlayerIndex];
    const dartLabel = num === 0 ? 'MISS' : multiplier === 2 ? `D${num}` : multiplier === 3 ? `T${num}` : `${num}`;
    
    if (gameState === 'playing') {
      // Normal gameplay
      const possibleMoves = FOOTBALL_CONNECTIONS[ballPos];
      const targetMove = possibleMoves.find(m => nodeNumbers[m.target] === num);

      if (targetMove) {
        if (targetMove.weight === 1 || multiplier > 1) {
          // Direct move
          setBallPos(targetMove.target);
          setPartialHits({});
          
          // Check for goal
          const isGoalR = targetMove.target === 'goalR';
          const isGoalL = targetMove.target === 'goalL';

          if (isGoalR || isGoalL) {
            let isOwnGoal = false;
            let scoringPlayerIdx = currentPlayerIndex;

            if (players.length > 1) {
              if (isGoalR && currentPlayerIndex === 1) {
                isOwnGoal = true;
                scoringPlayerIdx = 0;
              } else if (isGoalL && currentPlayerIndex === 0) {
                isOwnGoal = true;
                scoringPlayerIdx = 1;
              }
            }

            // Update score for the scoring player
            updatedPlayers[scoringPlayerIdx].footballGoals = (updatedPlayers[scoringPlayerIdx].footballGoals || 0) + 1;
            
            setGoalText(isOwnGoal ? 'OHH NO - OWN GOAL' : 'GOAL!!!');
            setShowGoalAnimation(true);
            
            setTimeout(() => {
              setShowGoalAnimation(false);
              setBallPos('posC');
            }, 2500);
          }
        } else {
          // Weight 2 move (Single hit)
          const currentHits = partialHits[targetMove.target] || 0;
          if (currentHits === 1) {
            setBallPos(targetMove.target);
            setPartialHits({});
          } else {
            setPartialHits({ [targetMove.target]: 1 });
          }
        }
      }
    } else if (gameState === 'penalties') {
      // Penalty Shootout
      const targetGoal = currentPlayerIndex === 0 ? 'goalR' : 'goalL';
      if (num === nodeNumbers[targetGoal]) {
        const newPenaltyScores = [...penaltyScores];
        newPenaltyScores[currentPlayerIndex]++;
        setPenaltyScores(newPenaltyScores);
        currentPlayer.footballGoals = (currentPlayer.footballGoals || 0) + 1;
      }
    }

    const newTurnDarts = [...currentTurnDarts, dartLabel];
    setMultiplier(1);

    if (currentDartIndex < 2) {
      setCurrentDartIndex(currentDartIndex + 1);
      setCurrentTurnDarts(newTurnDarts);
    } else {
      // End of turn
      currentPlayer.history.push([]); // Track turns
      setPlayers(updatedPlayers);
      setCurrentDartIndex(0);
      setCurrentTurnDarts([]);
      
      const nextPlayerIdx = (currentPlayerIndex + 1) % players.length;
      if (nextPlayerIdx === 0) {
        // End of round
        if (gameState === 'playing') {
          if (round >= MAX_ROUNDS) {
            // Check for tie
            const goals = updatedPlayers.map(p => p.footballGoals || 0);
            if (goals.length > 1 && goals[0] === goals[1]) {
              setGameState('penalties');
            } else {
              finishGame(updatedPlayers);
            }
          } else {
            setRound(round + 1);
            setCurrentPlayerIndex(0);
          }
        } else if (gameState === 'penalties') {
          // Check penalty result
          if (penaltyScores[0] !== penaltyScores[1]) {
            finishGame(updatedPlayers);
          } else {
            setPenaltyRound(penaltyRound + 1);
            setCurrentPlayerIndex(0);
          }
        }
      } else {
        setCurrentPlayerIndex(nextPlayerIdx);
      }
    }
  };

  const finishGame = (finalPlayers: Player[]) => {
    const sorted = [...finalPlayers].sort((a, b) => (b.footballGoals || 0) - (a.footballGoals || 0));
    setWinner(sorted[0]);
    setGameState('won');
    
    const distinctGoals = Array.from(new Set(finalPlayers.map(p => p.footballGoals || 0))).sort((a, b) => b - a);
    const rankings = finalPlayers.map(p => {
      const g = p.footballGoals || 0;
      const rankIndex = distinctGoals.indexOf(g);
      let points = 0;
      if (rankIndex === 0) points = 10;
      else if (rankIndex === 1) points = 5;
      else if (rankIndex === 2) points = 2;
      return { name: p.name, points };
    });
    onGameEnd(rankings);
  };

  const handleUndo = () => {
    if (currentDartIndex > 0) {
      setCurrentDartIndex(currentDartIndex - 1);
      setCurrentTurnDarts(currentTurnDarts.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#051a05]">
      {/* Left Side: Field Visualization */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-8 overflow-hidden">
        {/* Grass Texture Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
        
        {/* Field Boundary */}
        <div className="relative w-full max-w-4xl aspect-[1.6/1] border-4 border-white/40 rounded-sm bg-emerald-900/40 shadow-2xl overflow-hidden">
          {/* Field Markings */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Center Line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-white/30"></div>
            {/* Center Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-4 border-white/30 rounded-full"></div>
            {/* Penalty Areas */}
            <div className="absolute top-1/4 bottom-1/4 left-0 w-32 border-4 border-white/30 border-l-0"></div>
            <div className="absolute top-1/4 bottom-1/4 right-0 w-32 border-4 border-white/30 border-r-0"></div>
          </div>

          {/* Connections (Lines) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {Object.entries(FOOTBALL_CONNECTIONS).map(([fromNode, targets]) => {
              const from = NODE_POSITIONS[fromNode as FootballNode];
              return targets.map((t, idx) => {
                const to = NODE_POSITIONS[t.target];
                return (
                  <line 
                    key={`${fromNode}-${t.target}-${idx}`}
                    x1={`${from.x}%`} y1={`${from.y}%`}
                    x2={`${to.x}%`} y2={`${to.y}%`}
                    stroke="white"
                    strokeWidth={t.weight === 2 ? "4" : "1"}
                    strokeOpacity={t.weight === 2 ? "0.4" : "0.2"}
                    strokeDasharray={t.weight === 2 ? "8,4" : "none"}
                  />
                );
              });
            })}
          </svg>

          {/* Nodes (Boxes) */}
          {Object.entries(NODE_POSITIONS).map(([node, pos]) => {
            const isBallHere = ballPos === node;
            const num = nodeNumbers[node as FootballNode];
            const isPossibleMove = gameState === 'playing' && FOOTBALL_CONNECTIONS[ballPos].some(m => m.target === node);
            const isPenaltyTarget = gameState === 'penalties' && ((currentPlayerIndex === 0 && node === 'goalR') || (currentPlayerIndex === 1 && node === 'goalL'));

            return (
              <motion.div
                key={node}
                className={`absolute w-16 h-20 -translate-x-1/2 -translate-y-1/2 border-2 flex flex-col items-center justify-center transition-all duration-500 ${
                  isBallHere 
                    ? 'bg-white border-white scale-110 z-30 shadow-[0_0_30px_rgba(255,255,255,0.5)]' 
                    : isPossibleMove || isPenaltyTarget
                      ? 'bg-emerald-500/20 border-emerald-400 animate-pulse z-20' 
                      : 'bg-black/40 border-white/20 z-10'
                }`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <div className={`text-xs font-mono uppercase tracking-tighter mb-1 ${isBallHere ? 'text-black' : 'text-white/40'}`}>{pos.label}</div>
                <div className={`text-3xl font-display italic font-black ${isBallHere ? 'text-black' : 'text-white'}`}>{num}</div>
                {partialHits[node] === 1 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-[10px] font-bold text-black border-2 border-white">1/2</div>
                )}
              </motion.div>
            );
          })}

          {/* Soccer Ball */}
          <motion.div
            animate={{ 
              left: `${NODE_POSITIONS[ballPos].x}%`, 
              top: `${NODE_POSITIONS[ballPos].y}%`,
              rotate: 360
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 z-40 drop-shadow-2xl pointer-events-none"
          >
            <div className="w-full h-full bg-white rounded-full border-2 border-black flex items-center justify-center overflow-hidden">
              <div className="w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-black rotate-45"></div>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {showGoalAnimation && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                className="absolute inset-0 z-[60] flex items-center justify-center pointer-events-none"
              >
                <div className={`text-black px-12 py-6 font-display italic font-black text-7xl md:text-9xl shadow-2xl animate-pulse border-8 border-black transform -rotate-12 ${goalText.includes('OWN') ? 'bg-red-500' : 'bg-yellow-400'}`}>
                  {goalText}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Game Info Overlay */}
        <div className="mt-12 flex gap-12 items-center">
          <div className="text-center">
            <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">Round</div>
            <div className="text-5xl font-display italic font-black text-white">{gameState === 'penalties' ? 'PENALTIES' : `${round}/${MAX_ROUNDS}`}</div>
          </div>
          <div className="flex items-center gap-8 bg-black/40 border-2 border-white/10 p-6 rounded-2xl">
            {players.map((p, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`text-[10px] font-mono uppercase mb-1 ${i === currentPlayerIndex ? 'text-emerald-400' : 'text-zinc-500'}`}>{p.name}</div>
                <div className="text-4xl font-display italic font-black text-white">{p.footballGoals || 0}</div>
              </div>
            ))}
          </div>
        </div>

        {gameState === 'won' && winner && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center overflow-y-auto"
          >
            <Trophy size={80} className="text-yellow-400 mb-6 drop-shadow-[0_0_30px_rgba(234,179,8,0.4)]" />
            <h2 className="text-xl font-mono uppercase tracking-[0.5em] text-emerald-500 mb-2">Match Winner</h2>
            <h3 className="text-6xl font-display italic font-black text-white mb-10">{winner.name}</h3>
            
            <div className="w-full max-w-2xl mb-12 bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden">
              <div className="grid grid-cols-4 gap-4 p-6 border-b border-zinc-800 text-xs font-mono uppercase tracking-widest text-zinc-500 bg-zinc-900/80">
                <div className="text-left">Pos</div>
                <div className="text-left">Player</div>
                <div className="text-right">Goals</div>
                <div className="text-right">Gap</div>
              </div>
              {[...players].sort((a, b) => (b.footballGoals || 0) - (a.footballGoals || 0)).map((p, i, arr) => {
                const score = p.footballGoals || 0;
                const winnerScore = arr[0].footballGoals || 0;
                const gap = i === 0 ? '-' : `-${winnerScore - score}`;
                
                return (
                  <div key={p.name} className={`grid grid-cols-4 gap-4 p-6 border-b border-zinc-900/50 items-center ${p.name === winner.name ? 'bg-emerald-500/5' : ''}`}>
                    <div className="text-left font-mono text-zinc-400">#{i + 1}</div>
                    <div className="text-left font-display italic font-bold text-white text-xl">{p.name}</div>
                    <div className="text-right font-mono text-2xl font-black text-white">{score}</div>
                    <div className="text-right font-mono text-zinc-500">{gap}</div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={onGoHome}
              className="bg-emerald-600 text-white px-12 py-4 font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded-full shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            >
              Return Home
            </button>
          </motion.div>
        )}
      </div>

      {/* Right Side: Input Panel */}
      <div className="w-full md:w-[480px] bg-zinc-950 text-white p-8 flex flex-col shadow-2xl relative border-l-8 border-emerald-900">
        <div className="mb-12">
          <button onClick={onGoHome} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-mono text-xs uppercase tracking-widest mb-8">
            <ArrowLeft size={14} /> Abandon Match
          </button>
          
          <div className="p-6 bg-emerald-600/10 border-2 border-emerald-600 rounded-2xl mb-8">
            <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 mb-2">Active Player</div>
            <div className="text-4xl font-display italic font-black uppercase">{players[currentPlayerIndex].name}</div>
            <div className="flex items-center gap-4 mt-4">
              <div className="text-xs font-mono text-zinc-400">Target Goal:</div>
              <div className="text-3xl font-black text-white font-display">{currentPlayerIndex === 0 ? 'GOAL R' : 'GOAL L'}</div>
            </div>
          </div>

          <div className="flex gap-4">
            {[0, 1, 2].map(dartIdx => (
              <div 
                key={dartIdx}
                className={`flex-1 h-16 border-2 rounded-xl flex items-center justify-center font-mono text-xl font-bold transition-all ${
                  dartIdx < currentDartIndex 
                    ? 'bg-emerald-600 border-emerald-500 text-black' 
                    : dartIdx === currentDartIndex 
                      ? 'border-emerald-500 text-emerald-500 animate-pulse' 
                      : 'border-zinc-800 text-zinc-800'
                }`}
              >
                {currentTurnDarts[dartIdx] !== undefined ? currentTurnDarts[dartIdx] : <Target size={20} className="opacity-20" />}
              </div>
            ))}
          </div>
        </div>

        {/* Multiplier Toggles */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((m) => (
            <button
              key={m}
              onClick={() => setMultiplier(m as 1 | 2 | 3)}
              disabled={showGoalAnimation}
              className={`py-4 font-black font-display italic text-2xl border-2 transition-all ${
                multiplier === m 
                  ? 'bg-emerald-600 border-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'
              }`}
            >
              {m === 1 ? 'SINGLE' : m === 2 ? 'DOUBLE' : 'TRIPLE'}
            </button>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-4 gap-3 mb-8">
          {Array.from({ length: 20 }, (_, i) => i + 1).map(num => {
            const isPossibleMove = gameState === 'playing' && FOOTBALL_CONNECTIONS[ballPos].some(m => nodeNumbers[m.target] === num);
            const isPenaltyTarget = gameState === 'penalties' && ((currentPlayerIndex === 0 && num === nodeNumbers['goalR']) || (currentPlayerIndex === 1 && num === nodeNumbers['goalL']));

            return (
              <button
                key={num}
                onClick={() => handleScoreInput(num)}
                disabled={gameState === 'won' || showGoalAnimation}
                className={`aspect-square flex flex-col items-center justify-center border-2 transition-all active:scale-95 disabled:opacity-10 ${
                  isPossibleMove || isPenaltyTarget
                    ? 'border-emerald-500 bg-emerald-600/20 text-white hover:bg-emerald-600 hover:text-black'
                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                }`}
              >
                <span className="text-2xl font-black font-display italic">{num}</span>
              </button>
            );
          })}
          
          <button
            onClick={() => handleScoreInput(0)}
            disabled={gameState === 'won' || showGoalAnimation}
            className="col-span-4 py-6 text-xl font-black font-display italic tracking-widest border-2 border-zinc-800 hover:bg-zinc-800 disabled:opacity-10 transition-all active:scale-95"
          >
            MISS
          </button>
        </div>

        <button
          onClick={handleUndo}
          disabled={gameState === 'won' || currentDartIndex === 0 || showGoalAnimation}
          className="w-full py-6 flex items-center justify-center gap-4 border-2 border-zinc-800 text-zinc-500 hover:border-white hover:text-white disabled:opacity-10 transition-all font-black tracking-[0.2em] text-sm italic font-display"
        >
          <RotateCcw size={18} />
          UNDO LAST DART
        </button>
      </div>
    </div>
  );
}

function GameAsteroids({ 
  initialPlayers, 
  onGoHome, 
  onGameEnd 
}: { 
  initialPlayers: Player[]; 
  onGoHome: () => void;
  onGameEnd: (rankings: { name: string; points: number }[]) => void;
}) {
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [players, setPlayers] = useState<Player[]>(() => {
    const shuffled = [...initialPlayers].sort(() => Math.random() - 0.5);
    return shuffled.map(p => ({ 
      ...p, 
      asteroidsHits: {}, 
      asteroidsScore: 0,
      history: [] 
    }));
  });
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentDartIndex, setCurrentDartIndex] = useState(0);
  const [currentTurnDarts, setCurrentTurnDarts] = useState<string[]>([]);
  const [multiplier, setMultiplier] = useState<1 | 2 | 3>(1);
  const [winner, setWinner] = useState<Player | null>(null);
  const [round, setRound] = useState(1);
  const [bullseyeActive, setBullseyeActive] = useState(false);
  const MAX_ROUNDS = 4;

  const dartboardNumbers = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
  
  const getAdjacent = (num: number) => {
    const idx = dartboardNumbers.indexOf(num);
    if (idx === -1) return [];
    const prev = dartboardNumbers[(idx - 1 + 20) % 20];
    const next = dartboardNumbers[(idx + 1) % 20];
    return [prev, next];
  };

  const calculatePoints = (num: number, hitsToAdd: number, playerHits: Record<number, number>) => {
    let points = 0;
    let currentHits = playerHits[num] || 0;
    
    for (let i = 0; i < hitsToAdd; i++) {
      if (currentHits === 0) {
        points += 1;
        currentHits++;
      } else if (currentHits === 1) {
        points += 3;
        currentHits++;
      } else if (currentHits === 2) {
        points += 5;
        currentHits++;
      } else {
        break;
      }
    }
    return { points, newHits: currentHits };
  };

  const handleScoreInput = (num: number) => {
    if (gameState !== 'playing') return;

    const updatedPlayers = [...players];
    const currentPlayer = updatedPlayers[currentPlayerIndex];
    const playerHits = { ...(currentPlayer.asteroidsHits || {}) };
    let totalPointsGained = 0;
    let dartLabel = num === 0 ? 'MISS' : (multiplier === 2 ? `D${num}` : multiplier === 3 ? `T${num}` : `${num}`);

    if (num === 25 || num === 50) {
      setBullseyeActive(true);
      dartLabel = num === 50 ? 'BULL' : 'OUTER';
    } else if (num !== 0) {
      const targets = bullseyeActive ? [num, ...getAdjacent(num)] : [num];
      
      targets.forEach(targetNum => {
        const { points, newHits } = calculatePoints(targetNum, multiplier, playerHits);
        totalPointsGained += points;
        playerHits[targetNum] = newHits;
      });
      
      if (bullseyeActive) setBullseyeActive(false);
    }

    if (round === MAX_ROUNDS) {
      totalPointsGained *= 2;
    }

    currentPlayer.asteroidsScore = (currentPlayer.asteroidsScore || 0) + totalPointsGained;
    currentPlayer.asteroidsHits = playerHits;

    const newTurnDarts = [...currentTurnDarts, dartLabel];
    setMultiplier(1);

    if (currentDartIndex < 2) {
      setCurrentDartIndex(currentDartIndex + 1);
      setCurrentTurnDarts(newTurnDarts);
    } else {
      currentPlayer.history.push(newTurnDarts);
      setPlayers(updatedPlayers);
      setCurrentDartIndex(0);
      setCurrentTurnDarts([]);
      
      const nextPlayerIdx = (currentPlayerIndex + 1) % players.length;
      if (nextPlayerIdx === 0) {
        if (round >= MAX_ROUNDS) {
          const sortedByScore = [...updatedPlayers].sort((a, b) => (b.asteroidsScore || 0) - (a.asteroidsScore || 0));
          setWinner(sortedByScore[0]);
          setGameState('won');
          
          const distinctScores = Array.from(new Set(updatedPlayers.map(p => p.asteroidsScore || 0))).sort((a, b) => b - a);
          const rankings = updatedPlayers.map(p => {
            const score = p.asteroidsScore || 0;
            const rankIndex = distinctScores.indexOf(score);
            let points = 0;
            if (rankIndex === 0) points = 10;
            else if (rankIndex === 1) points = 5;
            else if (rankIndex === 2) points = 2;
            return { name: p.name, points };
          });
          onGameEnd(rankings);
        } else {
          setRound(round + 1);
          setCurrentPlayerIndex(0);
        }
      } else {
        setCurrentPlayerIndex(nextPlayerIdx);
      }
    }
  };

  const handleUndo = () => {
    if (currentDartIndex > 0) {
      setCurrentDartIndex(currentDartIndex - 1);
      setCurrentTurnDarts(currentTurnDarts.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Left Side: Visualization */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-12 overflow-hidden">
        {/* Background Stars */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 100 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute bg-white rounded-full"
              style={{
                width: Math.random() * 2 + 'px',
                height: Math.random() * 2 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                opacity: Math.random()
              }}
            />
          ))}
        </div>

        <div className="absolute top-12 left-12 z-10 text-left">
          <div className="text-xs font-mono uppercase tracking-[0.5em] text-zinc-500 mb-2">Asteroid Belt</div>
          <h2 className="text-6xl font-display italic font-black text-white">ROUND {round}<span className="text-zinc-500">/{MAX_ROUNDS}</span></h2>
          <div className="mt-10 flex flex-col gap-6 text-4xl font-mono text-zinc-400 uppercase tracking-widest">
            <span className="flex items-center gap-6"><span className="text-6xl">👽</span> <span className="text-zinc-600">=</span> <span className="text-white font-black">1P</span></span>
            <span className="flex items-center gap-6"><span className="text-6xl">🚀</span> <span className="text-zinc-600">=</span> <span className="text-white font-black">3P</span></span>
            <span className="flex items-center gap-6"><span className="text-6xl">🪐</span> <span className="text-zinc-600">=</span> <span className="text-white font-black">5P</span></span>
          </div>
        </div>

        {/* The Asteroid / Dartboard */}
        <div className="relative w-[400px] h-[400px] md:w-[550px] md:h-[550px] flex items-center justify-center">
          {round === MAX_ROUNDS && (
            <div className="absolute z-30 pointer-events-none text-yellow-500/40 font-display italic font-black text-3xl md:text-5xl uppercase tracking-[0.2em] text-center select-none leading-[0.9] animate-pulse drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]">
              DOUBLE<br/>POINTS<br/>ROUND
            </div>
          )}
          {/* Asteroid Sphere */}
          <div className="absolute inset-0 rounded-full bg-zinc-900 border-4 border-zinc-800 shadow-[0_0_100px_rgba(255,255,255,0.05)] overflow-hidden">
            {/* Craters (Abstract) */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-30">
              <circle cx="30" cy="30" r="10" fill="#333" />
              <circle cx="70" cy="40" r="15" fill="#333" />
              <circle cx="40" cy="70" r="8" fill="#333" />
              <circle cx="80" cy="80" r="12" fill="#333" />
              <path d="M10,50 Q30,40 50,50 T90,50" fill="none" stroke="#222" strokeWidth="0.5" />
            </svg>

            {/* Dartboard Segments */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-9">
              {dartboardNumbers.map((num, i) => {
                const angle = i * 18;
                const hits = players[currentPlayerIndex].asteroidsHits?.[num] || 0;
                
                // Calculate text position
                const textAngle = (angle + 9) * (Math.PI / 180);
                const tx = 50 + 42 * Math.sin(textAngle);
                const ty = 50 - 42 * Math.cos(textAngle);

                return (
                  <g key={num}>
                    <path
                      d="M 50 50 L 50 0 A 50 50 0 0 1 65.45 2.45 Z"
                      transform={`rotate(${angle} 50 50)`}
                      className={`transition-all duration-500 ${hits >= 3 ? 'fill-zinc-800 opacity-20' : 'fill-transparent stroke-white/5 stroke-[0.1]'}`}
                    />
                    <text 
                      x={tx} 
                      y={ty} 
                      fontSize="3.5" 
                      fill="white" 
                      textAnchor="middle" 
                      dominantBaseline="middle" 
                      className={`font-mono font-bold select-none pointer-events-none ${hits >= 3 ? 'opacity-10' : 'opacity-40'}`}
                      transform={`rotate(${9} ${tx} ${ty})`}
                    >
                      {num}
                    </text>
                  </g>
                );
              })}
              <circle cx="50" cy="50" r="8" className={`fill-black/40 stroke-zinc-700 stroke-1 ${bullseyeActive ? 'stroke-yellow-500 animate-pulse' : ''}`} />
            </svg>
          </div>

          {/* Icons Layer (Outside the overflow-hidden asteroid) */}
          <svg viewBox="0 0 160 160" className="absolute -inset-[30%] w-[160%] h-[160%] pointer-events-none -rotate-9">
            {dartboardNumbers.map((num, i) => {
              const angle = i * 18;
              const hits = players[currentPlayerIndex].asteroidsHits?.[num] || 0;
              const textAngle = (angle + 9) * (Math.PI / 180);
              
              const cx = 80;
              const cy = 80;

              const explosionExit = {
                scale: [1, 2.5, 0],
                opacity: [0.8, 1, 0],
                rotate: [0, 20, 40],
                filter: ["blur(0px)", "blur(2px)", "blur(8px)"],
              };

              return (
                <g key={`icons-${num}`}>
                  <AnimatePresence>
                    {hits < 1 && (
                      <motion.text 
                        key={`alien-${num}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.8 }}
                        exit={explosionExit}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        x={cx + 54 * Math.sin(textAngle)} 
                        y={cy - 54 * Math.cos(textAngle)} 
                        fontSize="4.5" 
                        fill="white" 
                        textAnchor="middle" 
                        dominantBaseline="middle"
                      >
                        👽
                      </motion.text>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {hits < 2 && (
                      <motion.text 
                        key={`ship-${num}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.8 }}
                        exit={explosionExit}
                        transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
                        x={cx + 62 * Math.sin(textAngle)} 
                        y={cy - 62 * Math.cos(textAngle)} 
                        fontSize="4.5" 
                        fill="white" 
                        textAnchor="middle" 
                        dominantBaseline="middle"
                      >
                        🚀
                      </motion.text>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {hits < 3 && (
                      <motion.text 
                        key={`planet-${num}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.8 }}
                        exit={explosionExit}
                        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                        x={cx + 70 * Math.sin(textAngle)} 
                        y={cy - 70 * Math.cos(textAngle)} 
                        fontSize="4.5" 
                        fill="white" 
                        textAnchor="middle" 
                        dominantBaseline="middle"
                      >
                        🪐
                      </motion.text>
                    )}
                  </AnimatePresence>
                </g>
              );
            })}
          </svg>

          {/* Bullseye Indicator */}
          {bullseyeActive && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-yellow-500 text-black font-mono text-xs px-4 py-1 font-bold uppercase tracking-widest shadow-lg animate-bounce">
              BULLSEYE ACTIVE: SPLASH DAMAGE
            </div>
          )}
        </div>

        {/* Player List / Scores (Vertical on the right) */}
        <div className="absolute top-12 right-12 z-10 flex flex-col gap-6 w-72">
          {players.map((p, i) => (
            <div 
              key={i} 
              className={`p-6 border-2 transition-all rounded-2xl ${i === currentPlayerIndex ? 'border-zinc-400 bg-zinc-400/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]' : 'border-zinc-800 bg-black/40'}`}
            >
              <div className="text-xl font-mono uppercase tracking-[0.2em] text-zinc-400 mb-2 font-bold">{p.name}</div>
              <div className="flex justify-between items-end">
                <div className="text-6xl font-display italic font-black text-white">{p.asteroidsScore || 0}</div>
                <div className="text-xl font-mono text-zinc-600 font-bold">PTS</div>
              </div>
            </div>
          ))}
        </div>

        {gameState === 'won' && winner && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center overflow-y-auto"
          >
            <Trophy size={80} className="text-yellow-400 mb-6 drop-shadow-[0_0_30px_rgba(234,179,8,0.4)]" />
            <h2 className="text-xl font-mono uppercase tracking-[0.5em] text-zinc-500 mb-2">Asteroid Ace</h2>
            <h3 className="text-6xl font-display italic font-black text-white mb-10">{winner.name}</h3>
            
            <div className="w-full max-w-2xl mb-12 bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden">
              <div className="grid grid-cols-4 gap-4 p-6 border-b border-zinc-800 text-xs font-mono uppercase tracking-widest text-zinc-500 bg-zinc-900/80">
                <div className="text-left">Pos</div>
                <div className="text-left">Player</div>
                <div className="text-right">Score</div>
                <div className="text-right">Gap</div>
              </div>
              {[...players].sort((a, b) => (b.asteroidsScore || 0) - (a.asteroidsScore || 0)).map((p, i, arr) => {
                const score = p.asteroidsScore || 0;
                const leaderScore = arr[0].asteroidsScore || 0;
                const gap = i === 0 ? '-' : `-${leaderScore - score}`;
                
                return (
                  <div key={p.name} className={`grid grid-cols-4 gap-4 p-6 border-b border-zinc-900/50 items-center ${p.name === winner.name ? 'bg-yellow-500/5' : ''}`}>
                    <div className="text-left font-mono text-zinc-400">#{i + 1}</div>
                    <div className="text-left font-display italic font-bold text-white text-xl">{p.name}</div>
                    <div className="text-right font-mono text-2xl font-black text-white">{score}</div>
                    <div className="text-right font-mono text-zinc-500">{gap}</div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={onGoHome}
              className="bg-zinc-100 text-black px-12 py-4 font-black uppercase tracking-widest hover:bg-white transition-all rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              Return Home
            </button>
          </motion.div>
        )}
      </div>

      {/* Right Side: Input Panel */}
      <div className="w-full md:w-[480px] bg-zinc-950 text-white p-8 flex flex-col shadow-2xl relative border-l-8 border-zinc-900">
        <div className="mb-12">
          <button onClick={onGoHome} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-mono text-xs uppercase tracking-widest mb-8">
            <ArrowLeft size={14} /> Abandon Mission
          </button>
          
          <div className="p-8 bg-zinc-600/10 border-2 border-zinc-600 rounded-2xl mb-10">
            <div className="text-sm font-mono uppercase tracking-[0.3em] text-zinc-400 mb-4">Current Pilot</div>
            <div className="text-6xl font-display italic font-black uppercase mb-6">{players[currentPlayerIndex].name}</div>
            <div className="flex items-center gap-6 pt-6 border-t border-zinc-800">
              <div className="text-base font-mono text-zinc-500 uppercase tracking-widest">Total Score:</div>
              <div className="text-5xl font-black text-white font-display italic">{players[currentPlayerIndex].asteroidsScore || 0}</div>
            </div>
          </div>

          <div className="flex gap-6">
            {[0, 1, 2].map(dartIdx => (
              <div 
                key={dartIdx}
                className={`flex-1 h-24 border-2 rounded-2xl flex items-center justify-center font-mono text-3xl font-bold transition-all ${
                  dartIdx < currentDartIndex 
                    ? 'bg-zinc-600 border-zinc-500 text-black' 
                    : dartIdx === currentDartIndex 
                      ? 'border-zinc-500 text-zinc-500 animate-pulse' 
                      : 'border-zinc-800 text-zinc-800'
                }`}
              >
                {currentTurnDarts[dartIdx] !== undefined ? currentTurnDarts[dartIdx] : <Target size={32} className="opacity-20" />}
              </div>
            ))}
          </div>
        </div>

        {/* Multiplier Toggles */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((m) => (
            <button
              key={m}
              onClick={() => setMultiplier(m as 1 | 2 | 3)}
              className={`py-4 font-black font-display italic text-2xl border-2 transition-all ${
                multiplier === m 
                  ? 'bg-zinc-100 border-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'
              }`}
            >
              {m === 1 ? 'SINGLE' : m === 2 ? 'DOUBLE' : 'TRIPLE'}
            </button>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-4 gap-3 mb-8">
          {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              onClick={() => handleScoreInput(num)}
              disabled={gameState !== 'playing'}
              className={`aspect-square flex flex-col items-center justify-center border-2 transition-all active:scale-95 disabled:opacity-10 ${
                (players[currentPlayerIndex].asteroidsHits?.[num] || 0) >= 3
                  ? 'border-zinc-900 bg-zinc-900/50 text-zinc-700'
                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
              }`}
            >
              <span className="text-2xl font-black font-display italic">{num}</span>
            </button>
          ))}
          
          <button
            onClick={() => handleScoreInput(25)}
            disabled={gameState !== 'playing'}
            className="col-span-2 py-6 text-xl font-black font-display italic tracking-widest border-2 border-zinc-800 hover:bg-zinc-800 disabled:opacity-10 transition-all active:scale-95"
          >
            BULL
          </button>
          
          <button
            onClick={() => handleScoreInput(0)}
            disabled={gameState !== 'playing'}
            className="col-span-2 py-6 text-xl font-black font-display italic tracking-widest border-2 border-zinc-800 hover:bg-zinc-800 disabled:opacity-10 transition-all active:scale-95"
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
      </div>
    </div>
  );
}
