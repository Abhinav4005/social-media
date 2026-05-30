import { motion } from "framer-motion";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Loader2, Lock, LogIn, Mail, Sparkles } from "lucide-react";
import { signIn } from "../../api";
import { loginFailure, loginStart, setCredentials } from "../../store/slices/authSlice";
import AuthLayout, { authItemVariants } from "./AuthLayout";

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to open your feed, messages, stories, and calls."
      icon={<Sparkles className="w-6 h-6" />}
      footerText="Don't have an account?"
      footerLinkText="Create one"
      footerLinkTo="/signup"
      eyebrow="Member access"
    >
      {error && (
        <motion.div
          variants={authItemVariants}
          className="mb-5 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.label variants={authItemVariants} className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-gray-400">Email</span>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="h-13 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 text-[15px] font-semibold text-gray-950 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 placeholder:text-gray-400"
            />
          </div>
        </motion.label>

        <motion.label variants={authItemVariants} className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-gray-400">Password</span>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="h-13 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 text-[15px] font-semibold text-gray-950 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 placeholder:text-gray-400"
            />
          </div>
        </motion.label>

        <motion.div variants={authItemVariants} className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">
            Forgot password?
          </Link>
        </motion.div>

        <motion.button
          variants={authItemVariants}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="mt-2 flex h-13 w-full items-center justify-center gap-3 rounded-2xl bg-gray-950 text-sm font-black uppercase tracking-[0.12em] text-white shadow-xl shadow-gray-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Signing in
            </>
          ) : (
            <>
              <LogIn className="h-5 w-5" />
              Sign in
            </>
          )}
        </motion.button>
      </form>
    </AuthLayout>
  );
}
