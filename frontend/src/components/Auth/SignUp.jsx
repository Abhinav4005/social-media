import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Loader2, Lock, Mail, User, UserPlus } from "lucide-react";
import { signUp } from "../../api";
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
      title="Create your account"
      subtitle="Start your profile and join the conversations already happening."
      icon={<UserPlus className="w-6 h-6" />}
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkTo="/signin"
      eyebrow="New profile"
    >
      {message && (
        <motion.div
          variants={authItemVariants}
          className={`mb-5 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${
            isSuccess
              ? "border-green-100 bg-green-50 text-green-700"
              : "border-red-100 bg-red-50 text-red-700"
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          )}
          <span>{message}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.label variants={authItemVariants} className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-gray-400">Full name</span>
          <div className="relative">
            <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              className="h-13 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 text-[15px] font-semibold text-gray-950 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 placeholder:text-gray-400"
            />
          </div>
        </motion.label>

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
              placeholder="Create a password"
              required
              className="h-13 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 text-[15px] font-semibold text-gray-950 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 placeholder:text-gray-400"
            />
          </div>
        </motion.label>

        <motion.p variants={authItemVariants} className="text-xs font-semibold leading-5 text-gray-400">
          By continuing, you agree to keep your account secure and use Social Hub respectfully.
        </motion.p>

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
              Creating
            </>
          ) : (
            <>
              <UserPlus className="h-5 w-5" />
              Create account
            </>
          )}
        </motion.button>
      </form>
    </AuthLayout>
  );
}
