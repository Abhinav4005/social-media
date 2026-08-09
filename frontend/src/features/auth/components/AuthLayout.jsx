import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Heart, MessageCircle, ShieldCheck, Sparkles, Users } from "lucide-react";

const previewPosts = [
  { name: "Aarav", action: "shared a launch update", stat: "2.4k" },
  { name: "Maya", action: "started a creator circle", stat: "814" },
  { name: "Noah", action: "posted from Mumbai", stat: "326" },
];

export const authContainerVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, staggerChildren: 0.07, ease: "easeOut" },
  },
};

export const authItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function AuthLayout({
  children,
  title,
  subtitle,
  icon,
  footerText,
  footerLinkText,
  footerLinkTo,
  eyebrow = "Social Hub",
}) {
  return (
    <div className="min-h-[100svh] bg-[#f6f8fb] text-gray-950 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.16),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(20,184,166,0.14),transparent_28%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_48%,#f0fdfa_100%)]" />

      <main className="relative min-h-[100svh] grid lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden lg:flex flex-col justify-between px-12 xl:px-20 py-10">
          <Link to="/" className="flex items-center gap-3 w-fit transition-transform hover:scale-[1.02]">
            <img src="/connecta-logo-full.png" alt="Connecta" className="h-16 object-contain" />
          </Link>

          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="space-y-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-indigo-600 shadow-sm">
                  <ShieldCheck className="w-4 h-4" />
                  Trusted conversations
                </span>
                <h1 className="text-5xl xl:text-6xl font-black tracking-tight leading-[0.96] text-gray-950">
                  Share what matters with people who matter.
                </h1>
                <p className="text-lg text-gray-500 leading-8 max-w-lg">
                  A focused social space for posts, stories, chat, and calls without the noisy first impression.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-lg">
                {[
                  ["18k", "members"],
                  ["42k", "posts"],
                  ["99%", "uptime"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-white/80 bg-white/65 px-5 py-4 shadow-sm">
                    <p className="text-2xl font-black text-gray-950">{value}</p>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
            Secure login · Real-time chat · Stories
          </div>
        </section>

        <section className="relative flex items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
          <div className="absolute hidden lg:block left-[-120px] top-1/2 -translate-y-1/2 w-[300px] rounded-[28px] border border-white/80 bg-white/70 p-4 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-400">Live feed</p>
                <p className="text-sm font-extrabold text-gray-900">Community pulse</p>
              </div>
              <Users className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="space-y-3">
              {previewPosts.map((post) => (
                <div key={post.name} className="rounded-2xl bg-white p-3 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-vibrant text-white text-xs font-black flex items-center justify-center">
                      {post.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-black text-gray-900">{post.name}</p>
                      <p className="text-xs text-gray-400 truncate">{post.action}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs font-bold text-gray-400">
                    <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-red-400" /> {post.stat}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5 text-indigo-400" /> active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            variants={authContainerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-[430px] rounded-[28px] border border-white/80 bg-white/88 backdrop-blur-2xl shadow-[0_32px_90px_-42px_rgba(15,23,42,0.55)] p-6 sm:p-8"
          >
            <motion.div variants={authItemVariants} className="mb-8">
              <div className="mb-6 flex items-center justify-between">
                <Link to="/" className="lg:hidden flex items-center gap-2">
                  <img src="/connecta-logo-icon.png" alt="Connecta" className="h-9 w-9 object-contain" />
                  <span className="font-black tracking-tight bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Connecta</span>
                </Link>
                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-teal-700">
                  <Check className="w-3.5 h-3.5" />
                  {eyebrow}
                </span>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-gray-950 text-white flex items-center justify-center shadow-xl shadow-gray-200 mb-5">
                {icon}
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-950">{title}</h2>
              <p className="mt-3 text-sm sm:text-base font-medium text-gray-500 leading-7">{subtitle}</p>
            </motion.div>

            {children}

            <motion.p variants={authItemVariants} className="mt-7 text-center text-sm font-semibold text-gray-500">
              {footerText}{" "}
              <Link to={footerLinkTo} className="font-black text-gray-950 hover:text-indigo-600 transition-colors">
                {footerLinkText}
              </Link>
            </motion.p>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
