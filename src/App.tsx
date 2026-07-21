/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, AlertCircle } from 'lucide-react';
import { audio } from './utils/audio';
import { UserProgress, UserAccount } from './types';
import Auth from './components/auth/Auth';
import Dashboard from './components/dashboard/Dashboard';
import WorldGame from './components/game/WorldGame';
import { CyberBackground } from './components/ui/CyberBackground';
import { api } from './utils/api';

export default function App() {
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [activeWorldId, setActiveWorldId] = useState<number | null>(null);
  const [showGameIntro, setShowGameIntro] = useState<boolean>(true);

  // Load progress and user context on boot
  useEffect(() => {
    const loggedInUser = localStorage.getItem('codeverse_active_user');
    if (loggedInUser) {
      setActiveUser(loggedInUser);
      // Fetch local fallback first for speed
      const rawAccounts = localStorage.getItem('codeverse_accounts');
      let localProgress = null;
      if (rawAccounts) {
        const accounts: UserAccount[] = JSON.parse(rawAccounts);
        const match = accounts.find(a => a.username.toLowerCase() === loggedInUser.toLowerCase());
        if (match) {
          localProgress = match.progress;
          setProgress(localProgress);
          audio.setSfxEnabled(localProgress.settings.sfxEnabled);
        }
      }
      
      // Auto-sync with backend to get the freshest data without reloading
      api.getProgress(loggedInUser).then(({ data, success }) => {
        if (success && data && localProgress) {
          setProgress({
            ...localProgress,
            score: data.score,
            highestScore: data.score,
            coins: data.coins,
            diamonds: data.diamonds,
            health: data.health,
            completedAchievements: data.completedAchievements || localProgress.completedAchievements
          });
        }
      });
    }
  }, []);

  const handleLoginSuccess = (userProgress: UserProgress) => {
    setActiveUser(userProgress.username);
    setProgress(userProgress);
    audio.setSfxEnabled(userProgress.settings.sfxEnabled);
    if (userProgress.settings.musicEnabled) {
      audio.setMusicEnabled(true);
    }
  };

  const handleLogout = () => {
    audio.setMusicEnabled(false);
    localStorage.removeItem('codeverse_active_user');
    setActiveUser(null);
    setProgress(null);
    setActiveWorldId(null);
    setShowGameIntro(true);
  };

  const handleUpdateProgress = (updated: UserProgress) => {
    setProgress(updated);
    // Sync to local accounts array
    const rawAccounts = localStorage.getItem('codeverse_accounts');
    if (rawAccounts && activeUser) {
      const accounts: UserAccount[] = JSON.parse(rawAccounts);
      const idx = accounts.findIndex(a => a.username.toLowerCase() === activeUser.toLowerCase());
      if (idx !== -1) {
        accounts[idx].progress = updated;
        localStorage.setItem('codeverse_accounts', JSON.stringify(accounts));
      }
    }

    // Save to backend database
    api.saveProgress(updated).catch(err => console.error('Failed to save to database:', err));
  };

  const handleResetProgress = () => {
    if (!activeUser) return;
    const freshProgress: UserProgress = {
      username: activeUser,
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
    };
    handleUpdateProgress(freshProgress);
    setActiveWorldId(null);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen relative font-sans">
      
      {/* Primary routing layer */}
      {!activeUser || !progress ? (
        <Auth onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          {/* Intro Overlay Card */}
          <AnimatePresence>
            {showGameIntro && (
              <motion.div 
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden"
              >
                {/* Immersive Cyberpunk Visual Overlay & Graphics */}
                <CyberBackground />
                
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="max-w-md w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6 relative z-10"
                >
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-500 rounded-t-3xl"></div>
                  
                  <div className="inline-flex items-center justify-center p-4 bg-gradient-to-tr from-purple-600 to-indigo-500 rounded-2xl shadow-lg ring-1 ring-purple-400/20">
                    <Shield className="w-8 h-8 text-emerald-400" />
                  </div>

                  <h2 className="text-3.5xl font-extrabold text-white tracking-tight">CodeVerse</h2>
                  <p className="text-xs font-mono text-indigo-400 uppercase tracking-widest">// MULTIVERSE SECURITY CORE</p>

                  <div className="text-sm text-slate-300 leading-relaxed text-left p-4 bg-slate-950/60 border border-slate-850 rounded-xl space-y-3 font-sans">
                    <div className="font-bold text-white flex items-center gap-1.5 text-xs font-mono">
                      <AlertCircle className="w-4 h-4 text-emerald-400" />
                      <span>THE BREACH INCIDENT</span>
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm">
                      An anonymous network intrusion has compromised twelve vital core servers. The grids are scrambled behind encrypted mathematical frequency walls.
                    </p>
                    <p className="text-slate-300 text-xs sm:text-sm">
                      Establish a terminal connection, isolate the signals, and decode each server core before your link drops.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      audio.playSuccess();
                      setShowGameIntro(false);
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl cursor-pointer shadow-lg active:translate-y-[1px] transition-all font-mono uppercase tracking-wider text-xs"
                  >
                    Connect Terminal
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {activeWorldId !== null ? (
            <WorldGame 
              worldId={activeWorldId} 
              progress={progress} 
              onExit={() => setActiveWorldId(null)}
              onUpdateProgress={handleUpdateProgress}
            />
          ) : (
            <Dashboard 
              progress={progress}
              onLogout={handleLogout}
              onStartGame={(wId) => setActiveWorldId(wId)}
              onResetProgress={handleResetProgress}
              onUpdateProgress={handleUpdateProgress}
            />
          )}
        </>
      )}
    </div>
  );
}
