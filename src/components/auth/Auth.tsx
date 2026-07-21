/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, LogIn, User } from 'lucide-react';
import { audio } from '../../utils/audio';
import { UserProgress } from '../../types';
import { CyberBackground } from '../ui/CyberBackground';
import { api } from '../../utils/api';

interface AuthProps {
  onLoginSuccess: (progress: UserProgress) => void;
}

export default function Auth({ onLoginSuccess }: AuthProps) {
  const [username, setUsername] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const handlePlayBeep = () => {
    audio.playBeep(600, 0.08, 'sine');
  };


  const createDefaultProgress = (user: string): UserProgress => ({
    username: user,
    currentWorld: 1,
    currentLevel: 1,
    coins: 100,
    diamonds: 5,
    keys: 1,
    health: 100,
    lives: 3,
    highestScore: 0,
    score: 0,
    combo: 0,
    rank: "Rookie Breaker",
    unlockedWorlds: [1],
    inventory: {
      "extra_life": 0,
      "hint": 1,
      "shield": 0,
      "time_boost": 1,
      "reveal_digit": 0,
      "double_coins": 0,
      "health_potion": 1
    },
    completedAchievements: [],
    settings: {
      musicEnabled: false,
      sfxEnabled: true,
    }
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    handlePlayBeep();
    const cleanUsername = username.trim();
    
    if (!cleanUsername) {
      setErrorMsg('Username is required. Please type your username.');
      audio.playFailure();
      return;
    }

    if (cleanUsername.length < 2) {
      setErrorMsg('Username must be at least 2 characters long.');
      audio.playFailure();
      return;
    }

    try {
      const { data, success } = await api.getProgress(cleanUsername);
      if (success && data) {
        setSuccessMsg(`Session restored. Welcome back, ${cleanUsername}.`);
        audio.playSuccess();
        
        const progress: UserProgress = createDefaultProgress(cleanUsername);
        progress.score = data.score;
        progress.highestScore = data.score;
        progress.coins = data.coins;
        progress.diamonds = data.diamonds;
        progress.health = data.health;
        progress.completedAchievements = data.completedAchievements || [];
        
        setTimeout(() => {
          localStorage.setItem('codeverse_active_user', cleanUsername);
          onLoginSuccess(progress);
        }, 1200);
      } else {
        setSuccessMsg(`New terminal registered. Welcome to the grid, ${cleanUsername}!`);
        audio.playSuccess();
        
        const newProgress = createDefaultProgress(cleanUsername);
        
        // Immediately save this new profile to the backend so they show up in the DB
        await api.saveProgress(newProgress);
        
        setTimeout(() => {
          localStorage.setItem('codeverse_active_user', cleanUsername);
          onLoginSuccess(newProgress);
        }, 1200);
      }
    } catch (err) {
      setErrorMsg('Failed to connect to backend server. Make sure python backend/app.py is running!');
      audio.playFailure();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center relative p-4 overflow-hidden font-sans">
      {/* Immersive Cyberpunk Visual Overlay & Graphics */}
      <CyberBackground />

      <div className="w-full max-w-md z-10">
        {/* Game Logo Display */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center p-3.5 bg-gradient-to-tr from-purple-600 to-indigo-500 rounded-2xl shadow-lg shadow-purple-500/20 mb-4 ring-2 ring-purple-400/30"
          >
            <Shield className="w-10 h-10 text-emerald-400 animate-pulse" />
          </motion.div>
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-emerald-400"
          >
            CODEVERSE
          </motion.h1>
          <p className="text-xs font-mono text-indigo-400 tracking-[0.25em] uppercase mt-1">
            SIGNAL DECRYPTION TERMINAL // v2.1
          </p>
        </div>

        {/* Dynamic Card Container */}
        <motion.div 
          layout
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl relative"
        >
          {/* Top subtle visual decor */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-500 rounded-t-2xl"></div>

          <h2 className="text-xl font-bold tracking-tight text-white mb-4 flex items-center gap-2">
            <LogIn className="w-5 h-5 text-purple-400" />
            <span>Terminal Connection</span>
          </h2>

          <p className="text-xs font-mono text-slate-400 mb-6 leading-relaxed">
            Enter a custom username to establish your local terminal session. If your username does not exist, a new profile will be created automatically.
          </p>

          {/* Alerts */}
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-rose-950/50 border border-rose-800 text-rose-300 rounded-lg text-sm font-mono flex items-start gap-2"
            >
              <span className="text-rose-400 select-none">🚨</span>
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-emerald-950/50 border border-emerald-800 text-emerald-300 rounded-lg text-sm font-mono flex items-start gap-2 animate-pulse"
            >
              <span className="text-emerald-400 select-none">✨</span>
              <span>{successMsg}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Breaker Codename / Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <User className="w-4 h-4 text-indigo-400" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. AGENT_ZERO"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setErrorMsg(''); }}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-lg pl-9 pr-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-indigo-500/10 border border-purple-400/20 active:translate-y-[1px] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 text-sm uppercase tracking-wider font-mono"
            >
              <LogIn className="w-4 h-4" />
              <span>Access Mainframe</span>
            </button>
          </form>

        </motion.div>
      </div>

      <div className="absolute bottom-4 text-center text-[10px] font-mono text-slate-600 max-w-xs leading-relaxed">
        SECURE CONNECTING SYSTEM // ENCRYPTED END-TO-END VIA QUANTUM PROTOCOLS
      </div>
    </div>
  );
}
