import { motion } from "framer-motion";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AlertCircle, Loader2, Lock, LogIn, Mail, Sparkles } from "lucide-react";
import { signIn } from "../../../api";
import { loginFailure, loginStart, setCredentials } from "../../../store/slices/authSlice";
import AuthLayout, { authItemVariants } from "./AuthLayout";
import { getSafeRedirectUrl } from "../../../utils/security";
import { ROUTES } from "../../../constant/routes";

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const location = useLocation();

  const mutation = useMutation({
    mutationFn: (data) => signIn(data),
    onMutate: () => {
      dispatch(loginStart());
    },
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      const redirectTarget = location.state?.from || ROUTES.HOME;
      const safeTarget = getSafeRedirectUrl(redirectTarget, ROUTES.HOME);
      navigate(safeTarget);
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
        <motion.div variants={authItemVariants}>
          <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-gray-500">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50/70 pl-11 pr-4 text-sm font-semibold text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>
        </motion.div>

        <motion.div variants={authItemVariants}>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50/70 pl-11 pr-4 text-sm font-semibold text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>
        </motion.div>

        <motion.button
          variants={authItemVariants}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gray-950 text-sm font-black text-white shadow-xl shadow-gray-200 hover:bg-indigo-600 transition-all cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              <span>Sign in to account</span>
            </>
          )}
        </motion.button>
      </form>
    </AuthLayout>
  );
}
