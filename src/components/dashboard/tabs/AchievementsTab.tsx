import React from 'react';
import { motion } from 'motion/react';
import { Award } from 'lucide-react';
import { UserProgress } from '../../../types';
import { ACHIEVEMENTS } from '../../../data/achievements';

interface AchievementsTabProps {
  progress: UserProgress;
}

export const AchievementsTab: React.FC<AchievementsTabProps> = ({ progress }) => {
  return (
    <motion.div 
      key="achievements"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400" />
          <span>Breach Medals</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = progress.completedAchievements.includes(ach.id);
            
            return (
              <div 
                key={ach.id}
                className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${
                  isUnlocked 
                    ? 'bg-slate-900 border-indigo-900/60 shadow-lg shadow-indigo-500/5' 
                    : 'bg-slate-950 border-slate-900 opacity-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl border ${
                  isUnlocked 
                    ? 'bg-indigo-950/50 border-indigo-700 text-indigo-200' 
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                  {ach.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm font-bold ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>{ach.title}</h4>
                    {isUnlocked && (
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-900 px-1 py-0.5 rounded font-bold">UNLOCKED</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-normal">{ach.description}</p>
                  <div className="text-[10px] font-mono text-amber-400 mt-1.5 flex items-center gap-1">
                    <span>REWARD:</span>
                    <span>🪙 {ach.rewardCoins}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
