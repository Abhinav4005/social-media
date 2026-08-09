import { Sparkles } from "lucide-react";

export function AppLoader({ label = "Preparing your session" }) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50/90 dark:bg-[#0b0f19]/95 backdrop-blur-2xl transition-colors duration-300 select-none p-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="relative w-full max-w-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl rounded-3xl p-8 text-center overflow-hidden">
        <div className="relative mx-auto mb-6 w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 animate-spin opacity-75 blur-sm" style={{ animationDuration: '4s' }} />
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-7 h-7 text-white animate-pulse" />
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-1">
          Social Hub
        </h3>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
          {label}
        </p>

        <div className="mt-6 w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function FeedShellShimmer() {
  const PostPreview = () => (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm rounded-3xl p-6 transition-colors duration-300">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-12 rounded-full animate-shimmer shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-36 rounded-full animate-shimmer" />
          <div className="h-3 w-24 rounded-full animate-shimmer" />
        </div>
      </div>
      <div className="space-y-3 mb-5">
        <div className="h-4 w-full rounded-full animate-shimmer" />
        <div className="h-4 w-5/6 rounded-full animate-shimmer" />
      </div>
      <div className="h-56 w-full rounded-2xl animate-shimmer" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] transition-colors duration-300">
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="h-10 w-40 rounded-2xl animate-shimmer" />
          <div className="hidden md:block h-11 w-96 rounded-2xl animate-shimmer" />
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl animate-shimmer" />
            <div className="h-10 w-10 rounded-full animate-shimmer" />
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 pb-10 px-4">
        <div className="hidden md:block space-y-3">
          <div className="h-52 rounded-3xl animate-shimmer" />
          <div className="h-40 rounded-3xl animate-shimmer" />
        </div>
        <div className="md:col-span-2 space-y-6">
          <div className="h-32 rounded-3xl animate-shimmer" />
          <div className="h-52 rounded-3xl animate-shimmer" />
          <PostPreview />
          <PostPreview />
        </div>
        <div className="hidden md:block">
          <div className="h-80 rounded-3xl animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
