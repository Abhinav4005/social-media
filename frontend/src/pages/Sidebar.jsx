import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { menuItems } from "../constant/constant";

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-2 sticky top-24 border border-gray-100">
      <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
        <span className="text-2xl">📱</span>
        Menu
      </h2>
      <ul className="space-y-1">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <li key={index}>
              <Link to={item.path}>
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 ${isActive
                      ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg"
                      : "hover:bg-primary-50 text-gray-700"
                    }`}
                >
                  <div
                    className={`p-2 rounded-lg transition-all ${isActive
                        ? "bg-white/20"
                        : "bg-primary-100 text-primary-600"
                      }`}
                  >
                    {item.icon}
                  </div>
                  <span className={`font-medium ${isActive ? "font-semibold" : ""}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-2 h-2 bg-white rounded-full"
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
