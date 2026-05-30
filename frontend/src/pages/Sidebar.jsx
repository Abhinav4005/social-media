import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { menuItems } from "../constant/constant";
import { Sparkles } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="sticky top-24 rounded-3xl border border-white/80 bg-white/82 p-4 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.45)] backdrop-blur-xl">
      <div className="mb-4 flex items-center gap-3 border-b border-gray-100 px-2 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-600 shadow-sm">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.22em] text-gray-400">Menu</h2>
          <p className="text-sm font-extrabold text-gray-900">Explore</p>
        </div>
      </div>

      <ul className="space-y-1.5">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <li key={index}>
              <Link to={item.path}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 transition-all duration-200 group ${isActive
                    ? "bg-gray-950 text-white shadow-lg shadow-gray-200"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-950"
                    }`}
                >
                  <div
                    className={`rounded-xl p-2 transition-all ${isActive
                      ? "bg-white/20"
                      : "bg-white text-gray-400 ring-1 ring-gray-100 group-hover:text-indigo-600"
                      }`}
                  >
                    {item.icon}
                  </div>
                  <span className={`text-sm font-extrabold tracking-tight ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-2 h-2 bg-primary-500 rounded-full"
                    />
                  )}
                </motion.div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
