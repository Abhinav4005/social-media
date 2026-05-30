import { Sparkles } from "lucide-react";

export function AppLoader({ label = "Loading" }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.35)] rounded-[28px] p-8 text-center">
        <div className="mx-auto mb-5 w-14 h-14 rounded-2xl bg-gradient-vibrant flex items-center justify-center shadow-lg shadow-indigo-100">
          <Sparkles className="w-7 h-7 text-white animate-pulse" />
        </div>
        <div className="space-y-3">
          <div className="mx-auto h-4 w-32 rounded-full animate-shimmer" />
          <div className="mx-auto h-3 w-48 rounded-full animate-shimmer" />
        </div>
        <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-gray-400">
          {label}
        </p>
      </div>
    </div>
  );
}

export function FeedShellShimmer() {
  const PostPreview = () => (
    <div className="bg-white border border-gray-100 shadow-[0_20px_40px_-18px_rgba(15,23,42,0.15)] rounded-[28px] p-6">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-12 rounded-full animate-shimmer" />
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100/70 via-indigo-50/40 to-teal-50/30">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
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
          <div className="h-52 rounded-[28px] animate-shimmer" />
          <div className="h-40 rounded-[28px] animate-shimmer" />
        </div>
        <div className="md:col-span-2 space-y-6">
          <div className="h-32 rounded-[28px] animate-shimmer" />
          <div className="h-52 rounded-[32px] animate-shimmer" />
          <PostPreview />
          <PostPreview />
        </div>
        <div className="hidden md:block">
          <div className="h-80 rounded-[28px] animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
