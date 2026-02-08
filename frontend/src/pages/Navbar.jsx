import { Bell, MessagesSquare, Search, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth)

  const getInitials = (name = "") => {
    return (
      name
        .split(" ")
        .map((n) => n[0]?.toUpperCase())
        .join("")
        .slice(0, 2))
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary-600">
          MySocial
        </Link>

        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-80"
          onClick={() => navigate("/search-page")}
        >
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search users or posts..."
            className="bg-transparent outline-none ml-2 text-sm w-full"
          />
        </div>

        <div className="flex items-center gap-6">
          <Link to="/notifications">
            <Bell className="w-6 h-6 text-gray-600 hover:text-primary-600" />
          </Link>
          <Link to="/profile">
            {user ? (
              <motion.div
                // whileHover={{ scale: 1.08 }}
                className="w-10 h-10 rounded-full text-white text-3xl font-bold flex items-center justify-center shadow-2xl border-4 border-white cursor-pointer transition-all"
                style={{ background: 'var(--gradient-vibrant)' }}
              >
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(user.name)
                )}
              </motion.div>
            ) : (<User className="w-6 h-6 text-gray-600 hover:text-primary-600" />)}
          </Link>
          <Link to="/chat">
            <MessagesSquare className="w-6 h-6 text-gray-600 hover:text-primary-600" />
          </Link>
        </div>
      </div>
    </nav>
  );
}