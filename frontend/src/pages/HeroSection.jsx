import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function HeroSection({ isAuthenticated, user }) {
  return (
    <section className="relative h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
          className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 1.5 }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto text-center px-6 py-20 flex flex-col justify-center h-full">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg"
        >
          {isAuthenticated
            ? `Welcome back, ${user?.name || "Friend"} 👋`
            : "Share. Connect. Grow 🚀"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-xl md:text-2xl mb-10 text-gray-100 max-w-2xl mx-auto"
        >
          {isAuthenticated
            ? "Ready to share something amazing with your community today?"
            : "A modern social platform to connect with people, share posts, and engage with your community."}
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex gap-6 justify-center flex-wrap"
        >
          {isAuthenticated ? (
            <>
              <Link
                to="/feed"
                className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transform transition duration-300"
              >
                Go to Feed
              </Link>
              <Link
                to="/create-post"
                className="bg-indigo-900 px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transform transition duration-300"
              >
                Create Post
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transform transition duration-300"
              >
                Get Started
              </Link>
              <Link
                to="/signin"
                className="bg-indigo-900 px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transform transition duration-300"
              >
                Sign In
              </Link>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
