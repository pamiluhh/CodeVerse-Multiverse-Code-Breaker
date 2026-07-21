import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type ToastMessage = {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
};

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            className={`px-4 py-3 rounded-lg shadow-xl border text-sm font-bold flex items-center gap-2 max-w-xs pointer-events-auto cursor-pointer
              ${t.type === 'success' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 
                t.type === 'error' ? 'bg-rose-950 text-rose-400 border-rose-800' : 
                'bg-indigo-950 text-indigo-400 border-indigo-800'}`}
            onClick={() => removeToast(t.id)}
          >
            <span>
              {t.type === 'success' ? '✓' : t.type === 'error' ? '⚠️' : 'ℹ️'}
            </span>
            <span>{t.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
