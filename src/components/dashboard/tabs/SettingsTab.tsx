import React from 'react';
import { motion } from 'motion/react';
import { Settings, LogOut } from 'lucide-react';
import { UserProgress } from '../../../types';

interface SettingsTabProps {
  progress: UserProgress;
  onLogout: () => void;
  onResetProgress: () => void;
  handleToggleMusic: () => void;
  handleToggleSfx: () => void;
  handlePlayBeep: () => void;
  audio: any; // Ideally typed if audio.ts had a class export
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ 
  progress, onLogout, onResetProgress, handleToggleMusic, handleToggleSfx, handlePlayBeep, audio 
}) => {
  return (
    <motion.div 
      key="settings"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-xl mx-auto space-y-6"
    >
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Settings className="w-5 h-5 text-slate-400" />
        <span>System Settings</span>
      </h3>

      <div className="space-y-4">
        <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">Audio Channels</h4>
        
        <div className="flex items-center justify-between p-3 bg-slate-950/40 border border-slate-850 rounded-lg">
          <div>
            <div className="text-sm font-semibold text-slate-200">Background Ambient Music</div>
            <div className="text-xs text-slate-400">Looping chiptune cyberpunk soundtrack.</div>
          </div>
          <button
            onClick={handleToggleMusic}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider font-bold cursor-pointer border transition-all ${
              progress.settings.musicEnabled
                ? 'bg-purple-900/30 border-purple-500 text-purple-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            {progress.settings.musicEnabled ? 'ACTIVE' : 'MUTED'}
          </button>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-950/40 border border-slate-850 rounded-lg">
          <div>
            <div className="text-sm font-semibold text-slate-200">System Sound Effects (SFX)</div>
            <div className="text-xs text-slate-400">Auditory feedback on keys, ciphers, and game triggers.</div>
          </div>
          <button
            onClick={handleToggleSfx}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider font-bold cursor-pointer border transition-all ${
              progress.settings.sfxEnabled
                ? 'bg-emerald-900/30 border-emerald-500 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            {progress.settings.sfxEnabled ? 'ACTIVE' : 'MUTED'}
          </button>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-800/60">
        <h4 className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">Dangerous Procedures</h4>
        
        <div className="p-4 bg-rose-950/10 border border-rose-900/30 rounded-xl space-y-3">
          <div className="text-xs text-rose-300">
            WARNING: Clicking the wipe button below forfeits all your progress, inventory, high score, coins, and unlocks immediately. This protocol cannot be restored.
          </div>
          <button
            onClick={() => {
              if (confirm("Are you absolutely sure you want to completely erase all saved breaker progress?")) {
                audio.playExplosion();
                onResetProgress();
              }
            }}
            className="bg-rose-900 hover:bg-rose-850 text-white text-xs font-mono uppercase tracking-wider py-2 px-4 rounded-lg cursor-pointer transition-colors"
          >
            Purge All Breaker Save Progress
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
        <span className="text-xs font-mono text-slate-500">Designation Signature: Node_{progress.username.toUpperCase()}</span>
        <button
          onClick={() => {
            handlePlayBeep();
            onLogout();
          }}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 font-mono cursor-pointer transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Node</span>
        </button>
      </div>
    </motion.div>
  );
};
