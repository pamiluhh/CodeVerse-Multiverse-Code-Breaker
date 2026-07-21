import React from 'react';
import { motion } from 'motion/react';
import { Trophy } from 'lucide-react';
import { LeaderboardEntry } from '../../../types';

interface LeaderboardTabProps {
  leaderboard: LeaderboardEntry[];
}

export const LeaderboardTab: React.FC<LeaderboardTabProps> = ({ leaderboard }) => {
  return (
    <motion.div 
      key="leaderboard"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl"
    >
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-amber-400" />
        <span>High Score Network</span>
      </h3>
      
      <div className="overflow-hidden border border-slate-800 rounded-xl bg-slate-950/40">
        <table className="w-full text-left font-mono text-sm border-collapse">
          <thead>
            <tr className="bg-slate-900 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
              <th className="p-4">Rank</th>
              <th className="p-4">User Handle</th>
              <th className="p-4">Completed Sectors</th>
              <th className="p-4 text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, idx) => (
              <tr 
                key={entry.username}
                className={`border-b border-slate-800/60 last:border-b-0 transition-colors ${
                  entry.isPlayer 
                    ? 'bg-purple-950/20 hover:bg-purple-950/30' 
                    : 'hover:bg-slate-900/50'
                }`}
              >
                <td className="p-4 font-bold text-white">
                  #{idx + 1} {idx === 0 && '👑'} {idx === 1 && '🥈'} {idx === 2 && '🥉'}
                </td>
                <td className="p-4 flex items-center gap-2">
                  <span className={entry.isPlayer ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                    @{entry.username}
                  </span>
                  {entry.isPlayer && (
                    <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1 py-0.5 rounded border border-emerald-800 uppercase font-mono font-bold">You</span>
                  )}
                </td>
                <td className="p-4 text-slate-400">
                  {entry.world === 13 ? 'The Overlord Core' : `World ${entry.world}`}
                </td>
                <td className="p-4 text-right text-indigo-300 font-bold">
                  {entry.score.toLocaleString()} PTS
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
