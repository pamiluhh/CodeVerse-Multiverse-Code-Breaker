import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart } from 'lucide-react';
import { UserProgress } from '../../../types';
import { SHOP_ITEMS } from '../../../data/shop';

interface ShopTabProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  audio: any;
}

export const ShopTab: React.FC<ShopTabProps> = ({ progress, onUpdateProgress, showToast, audio }) => {
  return (
    <motion.div 
      key="shop"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-indigo-400" />
          <span>Black Market Terminal</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SHOP_ITEMS.map(item => {
            const canAfford = item.costType === 'coins' 
              ? progress.coins >= item.cost 
              : progress.diamonds >= item.cost;
              
            return (
              <div key={item.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-indigo-500/50 transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-2xl bg-slate-900 p-2 rounded-lg">{item.icon}</span>
                    <div className={`text-xs font-mono font-bold px-2 py-1 rounded flex items-center gap-1 ${
                      canAfford ? 'bg-slate-900 text-slate-300' : 'bg-rose-950/30 text-rose-400'
                    }`}>
                      {item.costType === 'coins' ? '🪙' : '💎'} {item.cost}
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-200 text-sm">{item.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>
                
                <button
                  disabled={!canAfford}
                  onClick={() => {
                    if (!canAfford) {
                      audio.playFailure();
                      showToast(`Insufficient ${item.costType} to purchase ${item.name}`, "error");
                      return;
                    }
                    audio.playSuccess();
                    const updated = { ...progress };
                    if (item.costType === 'coins') updated.coins -= item.cost;
                    if (item.costType === 'diamonds') updated.diamonds -= item.cost;
                    
                    if (!updated.inventory[item.id]) updated.inventory[item.id] = 0;
                    updated.inventory[item.id] += 1;
                    
                    onUpdateProgress(updated);
                    showToast(`Acquired ${item.name} from the Black Market!`, "success");
                  }}
                  className={`w-full py-2 rounded-lg text-xs font-mono uppercase tracking-wider font-bold transition-all border ${
                    canAfford 
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400 cursor-pointer shadow-lg shadow-indigo-500/20' 
                      : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? 'Synthesize' : 'Insufficient Funds'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
