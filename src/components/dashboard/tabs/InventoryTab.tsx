import React from 'react';
import { motion } from 'motion/react';
import { Archive } from 'lucide-react';
import { UserProgress } from '../../../types';
import { SHOP_ITEMS } from '../../../data/shop';
import { WORLDS } from '../../../data/worlds';

interface InventoryTabProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  audio: any;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({ progress, onUpdateProgress, showToast, audio }) => {
  return (
    <motion.div 
      key="inventory"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Archive className="w-5 h-5 text-emerald-400" />
          <span>Terminal Storage & Items</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Combat Supplies & Boosters */}
          <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-xl space-y-4">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">Active Supplies & Tools</h4>
            
            <div className="space-y-3">
              {Object.entries(progress.inventory).map(([key, amount]) => {
                const itemMeta = SHOP_ITEMS.find(s => s.id === key);
                if (!itemMeta) return null;

                return (
                  <div key={key} className="flex items-center justify-between p-2.5 bg-slate-900/60 border border-slate-800/80 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{itemMeta.icon}</span>
                      <div>
                        <div className="text-xs font-semibold text-slate-200">{itemMeta.name}</div>
                        <div className="text-[10px] text-slate-400">{itemMeta.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-slate-200">QTY: {amount as number}</div>
                      {key === 'health_potion' && (amount as number) > 0 && (
                        <button
                          onClick={() => {
                            audio.playSuccess();
                            if (progress.health >= 100) {
                              showToast("Signal health is already fully saturated.", "error");
                              return;
                            }
                            const updatedInv = { ...progress.inventory };
                            updatedInv[key] -= 1;
                            const updated = {
                              ...progress,
                              health: Math.min(100, progress.health + 50),
                              inventory: updatedInv
                            };
                            onUpdateProgress(updated);
                            showToast("Infused Nano Medkit! Signal Health restored by +50.", "success");
                          }}
                          className="text-[10px] text-emerald-400 font-mono underline hover:text-emerald-300 mt-1 block cursor-pointer"
                        >
                          Consume Medkit
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vault Collectibles & Relics */}
          <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-xl space-y-4">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">Acquired Multiverse Sector Keys</h4>
            
            <div className="grid grid-cols-2 gap-2">
              {WORLDS.slice(0, 12).map((world) => {
                const hasCollected = progress.currentWorld > world.id;
                return (
                  <div 
                    key={world.id}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 transition-all ${
                      hasCollected 
                        ? 'bg-indigo-950/20 border-indigo-900/60' 
                        : 'bg-slate-900/20 border-slate-850 opacity-40'
                    }`}
                  >
                    <span className="text-2xl">{hasCollected ? world.rewardIcon : '🔒'}</span>
                    <div className="text-[10px] font-semibold text-slate-200 leading-tight">
                      {hasCollected ? world.rewardItem : 'Locked'}
                    </div>
                    <div className="text-[9px] font-mono text-slate-500 uppercase">
                      {hasCollected ? `From W${world.id}` : `World ${world.id}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};
