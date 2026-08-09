import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Loader2, Lock, Mail, User, UserPlus } from "lucide-react";
import { signUp } from "../../../api";
import AuthLayout, { authItemVariants } from "./AuthLayout";

export default function SignUp() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await signUp(formData);
      setMessage("Account created. Redirecting to sign in...");
      setTimeout(() => {
        navigate("/signin");
      }, 1200);
    } catch (err) {
      setMessage("Registration failed. Please check your details and try again.");
      setLoading(false);
    }
  };

  const isSuccess = message.includes("created");

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join Connecta to connect with friends, share stories, and chat."
      icon={<UserPlus className="w-6 h-6" />}
      footerText="Already registered?"
      footerLinkText="Sign in"
      footerLinkTo="/signin"
      eyebrow="Join Community"
    >
      {message && (
        <motion.div
          variants={authItemVariants}
          className={`mb-5 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${
            isSuccess
              ? "border-emerald-100 bg-emerald-50 text-emerald-700"
              : "border-red-100 bg-red-50 text-red-700"
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
          )}
          <span>{message}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div variants={authItemVariants}>
          <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-gray-500">
            Full name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Aarav Sharma"
              className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50/70 pl-11 pr-4 text-sm font-semibold text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>
        </motion.div>

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
          <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-gray-500">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
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
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              <span>Create account</span>
            </>
          )}
        </motion.button>
      </form>
    </AuthLayout>
  );
}
