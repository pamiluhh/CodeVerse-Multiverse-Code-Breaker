import React, { useState, useEffect } from 'react';
import { Target, ShoppingCart, Archive, Trophy, Award, Settings as SettingsIcon } from 'lucide-react';
import { UserProgress, LeaderboardEntry } from '../../types';
import { audio } from '../../utils/audio';
import { api } from '../../utils/api';
import { CyberBackground } from '../ui/CyberBackground';
import { StatusBar } from '../ui/StatusBar';
import { ToastContainer, ToastMessage } from '../ui/Toast';
import { MissionsHub } from './tabs/MissionsHub';
import { ShopTab } from './tabs/ShopTab';
import { InventoryTab } from './tabs/InventoryTab';
import { LeaderboardTab } from './tabs/LeaderboardTab';
import { AchievementsTab } from './tabs/AchievementsTab';
import { SettingsTab } from './tabs/SettingsTab';

interface DashboardProps {
  progress: UserProgress;
  onLogout: () => void;
  onStartGame: (worldId: number) => void;
  onResetProgress: () => void;
  onUpdateProgress: (updated: UserProgress) => void;
}

export default function Dashboard({ 
  progress, 
  onLogout, 
  onStartGame, 
  onResetProgress,
  onUpdateProgress
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'missions' | 'shop' | 'inventory' | 'leaderboard' | 'achievements' | 'settings'>('missions');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    fetchLeaderboard();

    // Auto-refresh data every 5 seconds to avoid manual reloads
    const intervalId = setInterval(async () => {
      // 1. Refresh Leaderboard
      if (activeTab === 'leaderboard') {
        fetchLeaderboard();
      }
      
      // 2. Sync own progress from backend database
      try {
        const { data, success } = await api.getProgress(progress.username);
        if (success && data) {
          if (
            data.score !== progress.score || 
            data.coins !== progress.coins || 
            data.diamonds !== progress.diamonds ||
            data.health !== progress.health
          ) {
            onUpdateProgress({
              ...progress,
              score: data.score,
              highestScore: data.score,
              coins: data.coins,
              diamonds: data.diamonds,
              health: data.health,
              completedAchievements: data.completedAchievements || progress.completedAchievements
            });
          }
        }
      } catch (err) {
        // Silently fail if backend is unreachable during polling
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [activeTab, progress]);

  const fetchLeaderboard = async () => {
    const data = await api.getLeaderboard(progress.username, progress.rank);
    setLeaderboard(data);
  };

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleToggleMusic = () => {
    const updated = {
      ...progress,
      settings: { ...progress.settings, musicEnabled: !progress.settings.musicEnabled }
    };
    onUpdateProgress(updated);
    if (!progress.settings.musicEnabled) {
      audio.setMusicEnabled(true);
    } else {
      audio.setMusicEnabled(false);
    }
  };

  const handleToggleSfx = () => {
    const updated = {
      ...progress,
      settings: { ...progress.settings, sfxEnabled: !progress.settings.sfxEnabled }
    };
    onUpdateProgress(updated);
  };

  const tabs = [
    { id: 'missions', label: 'Missions', icon: Target },
    { id: 'shop', label: 'Black Market', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory', icon: Archive },
    { id: 'leaderboard', label: 'Network', icon: Trophy },
    { id: 'achievements', label: 'Medals', icon: Award },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans p-6 overflow-hidden relative">
      <CyberBackground />
      <ToastContainer toasts={toasts} removeToast={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

      <div className="max-w-6xl mx-auto relative z-10">
        <StatusBar progress={progress} />

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 pb-2 border-b border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  audio.playBeep(400, 0.05, 'sine');
                  setActiveTab(tab.id);
                  if (tab.id === 'leaderboard') fetchLeaderboard();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider font-bold transition-all whitespace-nowrap border ${
                  isActive 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Active Tab Content */}
        {activeTab === 'missions' && <MissionsHub progress={progress} onStartGame={onStartGame} audio={audio} />}
        {activeTab === 'shop' && <ShopTab progress={progress} onUpdateProgress={onUpdateProgress} showToast={showToast} audio={audio} />}
        {activeTab === 'inventory' && <InventoryTab progress={progress} onUpdateProgress={onUpdateProgress} showToast={showToast} audio={audio} />}
        {activeTab === 'leaderboard' && <LeaderboardTab leaderboard={leaderboard} />}
        {activeTab === 'achievements' && <AchievementsTab progress={progress} />}
        {activeTab === 'settings' && (
          <SettingsTab 
            progress={progress} 
            onLogout={onLogout} 
            onResetProgress={onResetProgress}
            handleToggleMusic={handleToggleMusic}
            handleToggleSfx={handleToggleSfx}
            handlePlayBeep={() => audio.playBeep(300, 0.1, 'sawtooth')}
            audio={audio}
          />
        )}
      </div>
    </div>
  );
}
