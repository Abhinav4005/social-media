import React from 'react';

/**
 * Glassmorphic Animated Page Loader
 * Used as <Suspense> fallback during lazy route transitions.
 */
export const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0f0f14]/90 backdrop-blur-md">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        <div className="absolute w-10 h-10 rounded-full border-4 border-emerald-500/20 border-b-emerald-500 animate-spin-reverse" />
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-indigo-400 animate-pulse">
        Loading...
      </p>
    </div>
  );
};

export default PageLoader;
