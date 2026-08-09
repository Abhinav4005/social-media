import React from 'react';
import { Sparkles } from 'lucide-react';

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50/80 dark:bg-[#0b0f19]/80 backdrop-blur-xl transition-colors duration-300 select-none">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-600 dark:border-indigo-400/20 dark:border-t-indigo-400 animate-spin" />
        <div className="absolute w-10 h-10 rounded-2xl bg-indigo-600/10 dark:bg-indigo-400/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
        </div>
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 animate-pulse">
        Loading Page...
      </p>
    </div>
  );
};

export default PageLoader;
