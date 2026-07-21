import React from 'react';
import { motion } from 'motion/react';
import { Target, Lock } from 'lucide-react';
import { UserProgress } from '../../../types';
import { WORLDS } from '../../../data/worlds';

interface MissionsHubProps {
  progress: UserProgress;
  onStartGame: (worldId: number) => void;
  audio: any;
}

export const MissionsHub: React.FC<MissionsHubProps> = ({ progress, onStartGame, audio }) => {
  return (
    <motion.div 
      key="missions"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Target className="w-64 h-64" />
        </div>
        
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 relative z-10">
          <Target className="w-5 h-5 text-rose-400" />
          <span>Active Operations</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
          {WORLDS.map((world) => {
            const isUnlocked = progress.unlockedWorlds.includes(world.id);
            const isCompleted = progress.currentWorld > world.id;
            
            return (
              <div 
                key={world.id}
                onClick={() => {
                  if (isUnlocked) {
                    audio.playSuccess();
                    onStartGame(world.id);
                  } else {
                    audio.playFailure();
                  }
                }}
                className={`relative group rounded-xl border p-5 transition-all duration-300 ${
                  isUnlocked 
                    ? `bg-slate-900 border-slate-700 hover:border-${world.primaryColor}-500/50 cursor-pointer shadow-lg hover:shadow-${world.primaryColor}-500/10` 
                    : 'bg-slate-950/50 border-slate-800 opacity-50 cursor-not-allowed'
                }`}
              >
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 bg-slate-950/40 rounded-xl backdrop-blur-[1px]">
                    <Lock className="w-8 h-8 text-slate-500" />
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-3">
                  <div className={`text-3xl filter ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                    {world.rewardIcon}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Sector</span>
                    <span className={`text-lg font-bold font-mono ${isUnlocked ? 'text-white' : 'text-slate-600'}`}>
                      {world.id.toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
                
                <h4 className={`font-bold mb-1 truncate ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                  {world.name}
                </h4>
                
                <p className="text-xs text-slate-400 line-clamp-2 h-8 leading-relaxed mb-4">
                  {world.mission}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className={`text-[9px] font-mono uppercase px-2 py-1 rounded border ${
                    isCompleted 
                      ? 'bg-emerald-950/50 text-emerald-400 border-emerald-900' 
                      : isUnlocked 
                        ? 'bg-rose-950/50 text-rose-400 border-rose-900'
                        : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}>
                    {isCompleted ? 'CLEARED' : isUnlocked ? 'ACTIVE' : 'LOCKED'}
                  </span>
                  
                  {isUnlocked && (
                    <span className={`text-[10px] font-mono text-${world.primaryColor}-400 group-hover:underline`}>
                      Initiate Breach &rarr;
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
