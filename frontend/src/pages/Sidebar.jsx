import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { menuItems } from "../constant/constant";
import { Sparkles } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-8 space-y-3 sticky top-28 border border-white/60">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 bg-indigo-50/50 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/50">
          <Sparkles className="w-5 h-5" />
        </div>
        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Menu</h2>
      </div>

      <ul className="space-y-2">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <li key={index}>
              <Link to={item.path}>
                <motion.div
                  whileHover={{ scale: 1.02, x: 6 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 relative group ${isActive
                    ? "bg-gray-900 text-white shadow-xl"
                    : "hover:bg-indigo-50/50 text-gray-500 hover:text-indigo-600"
                    }`}
                >
                  <div
                    className={`p-2 rounded-xl transition-all ${isActive
                      ? "bg-white/20"
                      : "bg-gray-50 text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                      }`}
                  >
                    {item.icon}
                  </div>
                  <span className={`font-black text-[11px] uppercase tracking-[0.15em] ${isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 bg-indigo-400 rounded-full"
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
