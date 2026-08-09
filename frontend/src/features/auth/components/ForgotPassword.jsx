import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, Loader2, Mail, ShieldQuestion } from "lucide-react";
import { forgotPassword } from "../../../api";
import AuthLayout, { authItemVariants } from "./AuthLayout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const sendMutation = useMutation({
    mutationFn: () => forgotPassword(email),
    onSuccess: () => {
      setEmail("");
    },
    onError: () => {
      setEmail("");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMutation.mutate();
  };

  return (
    <AuthLayout
      title="Recover access"
      subtitle="Enter your email and we will send a secure password reset link."
      icon={<ShieldQuestion className="w-6 h-6" />}
      footerText="Remembered your password?"
      footerLinkText="Sign in"
      footerLinkTo="/signin"
      eyebrow="Account recovery"
    >
      {sendMutation.isSuccess && (
        <motion.div
          variants={authItemVariants}
          className="mb-5 flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>Reset link sent. Check your inbox for the next step.</span>
        </motion.div>
      )}

      {sendMutation.isError && (
        <motion.div
          variants={authItemVariants}
          className="mb-5 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>We could not send the reset link. Please try again.</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.label variants={authItemVariants} className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-gray-400">Email</span>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="you@example.com"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-13 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 text-[15px] font-semibold text-gray-950 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 placeholder:text-gray-400"
            />
          </div>
        </motion.label>

        <motion.p variants={authItemVariants} className="text-xs font-semibold leading-5 text-gray-400">
          For your security, reset links expire after a short time. Use the newest email if you request more than one.
        </motion.p>

        <motion.button
          variants={authItemVariants}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={sendMutation.isPending}
          className="mt-2 flex h-13 w-full items-center justify-center gap-3 rounded-2xl bg-gray-950 text-sm font-black uppercase tracking-[0.12em] text-white shadow-xl shadow-gray-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {sendMutation.isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Sending
            </>
          ) : (
            <>
              <Mail className="h-5 w-5" />
              Send reset link
            </>
          )}
        </motion.button>
      </form>

      <motion.div variants={authItemVariants} className="mt-5 text-center">
        <Link to="/signup" className="text-xs font-black uppercase tracking-[0.14em] text-gray-400 hover:text-indigo-600">
          Need a new account?
        </Link>
      </motion.div>
    </AuthLayout>
  );
};

export default ForgotPassword;
