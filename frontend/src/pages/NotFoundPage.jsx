import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, AlertCircle, Search } from 'lucide-react';
import { ROUTES } from '../constant/routes';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      {/* Dynamic Background Accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-lg w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200/80 dark:border-slate-700/80 text-center relative z-10 animate-fade-in">
        {/* Animated Badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-3xl mb-6 shadow-inner ring-8 ring-indigo-500/10 dark:ring-indigo-500/20 transform hover:scale-105 transition-transform duration-300">
          <AlertCircle className="w-10 h-10 stroke-[2]" />
        </div>

        <span className="block text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
          Error 404
        </span>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
          Page Not Found
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={ROUTES.HOME}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all duration-200 gap-2 group"
          >
            <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            Back to Home
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300 dark:active:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-sm transition-all duration-200 gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Previous Page
          </button>
        </div>

        {/* Subtle Helper Search Link */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Looking for content?</span>
          <Link
            to={ROUTES.SEARCH}
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
          >
            <Search className="w-3.5 h-3.5" />
            Search Social Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
