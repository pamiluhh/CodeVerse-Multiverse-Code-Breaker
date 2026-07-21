import React from 'react';
import { Shield, Coins, Gem, Heart, Zap } from 'lucide-react';
import { UserProgress } from '../../types';

interface StatusBarProps {
  progress: UserProgress;
}

export const StatusBar: React.FC<StatusBarProps> = ({ progress }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl mb-6">
      <div className="flex items-center gap-3">
        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
          <Shield className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Active Node</div>
          <div className="font-bold text-white tracking-tight flex items-center gap-2">
            <span>{progress.username}</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-purple-950/50 text-purple-400 border border-purple-900 uppercase">
              {progress.rank}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
            <Coins className="w-3 h-3 text-amber-400" /> Coins
          </div>
          <div className="font-bold text-amber-400 font-mono text-lg">{progress.coins}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
            <Gem className="w-3 h-3 text-cyan-400" /> Diamonds
          </div>
          <div className="font-bold text-cyan-400 font-mono text-lg">{progress.diamonds}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
            <Heart className="w-3 h-3 text-rose-400" /> Health
          </div>
          <div className="font-bold text-rose-400 font-mono text-lg">{progress.health}%</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
            <Zap className="w-3 h-3 text-emerald-400" /> High Score
          </div>
          <div className="font-bold text-emerald-400 font-mono text-lg">{progress.highestScore}</div>
        </div>
      </div>
    </div>
  );
};
