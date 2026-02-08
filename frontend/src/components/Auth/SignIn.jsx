import { motion } from "framer-motion";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, ArrowRight, Sparkles } from "lucide-react";
import { signIn } from "../../api";
import { loginStart, setCredentials, loginFailure } from "../../store/slices/authSlice";
import Button from "../UI/Button";

export default function SignIn() {
  const initialState = {
    email: "",
    password: "",
  };
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const mutation = useMutation({
    mutationFn: (data) => signIn(data),
    onMutate: () => {
      dispatch(loginStart());
    },
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      navigate("/");
    },
    onError: (error) => {
      dispatch(loginFailure(error.message || "Sign In failed"));
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: 'var(--gradient-hero)' }}>

      {/* Dynamic Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500 rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500 rounded-full blur-[150px] opacity-10" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20">
          <motion.div variants={itemVariants} className="text-center mb-10">
            <div className="inline-flex p-4 bg-white/10 rounded-2xl mb-4 border border-white/10">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-extrabold text-white tracking-tighter mb-2">
              Welcome Back
            </h2>
            <p className="text-white/60 font-medium">Please enter your details to sign in.</p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/20 backdrop-blur-md border border-red-500/30 p-4 rounded-2xl mb-6 text-red-200 text-sm font-bold text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants}>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/10 transition-all cursor-text font-medium"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/10 transition-all cursor-text font-medium"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-bold text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                Forgot Password?
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-white text-gray-900 font-bold rounded-2xl shadow-xl shadow-black/20 hover:bg-gray-100 disabled:opacity-50 transition-all flex items-center justify-center gap-3 cursor-pointer border-none outline-none appearance-none"
              >
                {loading ? "AUTHENTICATING..." : <><LogIn size={20} /> SIGN IN</>}
              </motion.button>
            </motion.div>
          </form>

          <motion.p variants={itemVariants} className="text-center mt-10 text-white/60 font-medium">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-white font-bold hover:underline underline-offset-4 cursor-pointer"
            >
              Sign Up For Free
            </Link>
          </motion.p>
        </div>

        {/* Footer info */}
        <motion.div variants={itemVariants} className="mt-8 flex items-center justify-center gap-6 text-white/20 font-bold text-xs tracking-[0.2em] uppercase">
          <span>Secure Login</span>
          <span className="w-1.5 h-1.5 bg-white/10 rounded-full" />
          <span>Privacy First</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
