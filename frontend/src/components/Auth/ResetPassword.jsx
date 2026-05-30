import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, Eye, EyeOff, KeyRound, Loader2, Lock } from "lucide-react";
import { resetPassword } from "../../api";
import AuthLayout, { authItemVariants } from "./AuthLayout";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitMutation = useMutation({
    mutationFn: () => resetPassword(token, formData.newPassword, formData.confirmPassword),
    onSuccess: () => {
      setFormData({ newPassword: "", confirmPassword: "" });
      navigate("/signin");
    },
    onError: () => {
      setFormData({ newPassword: "", confirmPassword: "" });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMutation.mutate();
  };

  const missingToken = !token;
  const passwordMismatch =
    formData.confirmPassword.length > 0 && formData.newPassword !== formData.confirmPassword;
  const submitDisabled = submitMutation.isPending || missingToken || passwordMismatch;

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose a strong password to protect your Social Hub account."
      icon={<KeyRound className="w-6 h-6" />}
      footerText="Already reset it?"
      footerLinkText="Sign in"
      footerLinkTo="/signin"
      eyebrow="Secure reset"
    >
      {missingToken && (
        <motion.div
          variants={authItemVariants}
          className="mb-5 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>This reset link is missing a token. Request a new password reset email.</span>
        </motion.div>
      )}

      {submitMutation.isError && (
        <motion.div
          variants={authItemVariants}
          className="mb-5 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>We could not reset your password. The link may be expired or already used.</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.label variants={authItemVariants} className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-gray-400">New password</span>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type={showNew ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              placeholder="Enter new password"
              onChange={handleChange}
              required
              minLength={6}
              disabled={missingToken}
              className="h-13 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-12 text-[15px] font-semibold text-gray-950 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowNew((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              aria-label={showNew ? "Hide password" : "Show password"}
            >
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </motion.label>

        <motion.label variants={authItemVariants} className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-gray-400">Confirm password</span>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              placeholder="Re-enter password"
              onChange={handleChange}
              required
              minLength={6}
              disabled={missingToken}
              className={`h-13 w-full rounded-2xl border bg-white pl-12 pr-12 text-[15px] font-semibold text-gray-950 outline-none transition focus:ring-4 placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-400 ${
                passwordMismatch
                  ? "border-red-200 focus:border-red-300 focus:ring-red-100"
                  : "border-gray-200 focus:border-indigo-300 focus:ring-indigo-100"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {passwordMismatch && (
            <span className="mt-2 block text-xs font-semibold text-red-600">Passwords do not match.</span>
          )}
        </motion.label>

        <motion.p variants={authItemVariants} className="text-xs font-semibold leading-5 text-gray-400">
          Use at least 6 characters. A longer password with mixed words is safer.
        </motion.p>

        <motion.button
          variants={authItemVariants}
          whileHover={{ y: submitDisabled ? 0 : -1 }}
          whileTap={{ scale: submitDisabled ? 1 : 0.98 }}
          type="submit"
          disabled={submitDisabled}
          className="mt-2 flex h-13 w-full items-center justify-center gap-3 rounded-2xl bg-gray-950 text-sm font-black uppercase tracking-[0.12em] text-white shadow-xl shadow-gray-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitMutation.isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Resetting
            </>
          ) : (
            <>
              <KeyRound className="h-5 w-5" />
              Reset password
            </>
          )}
        </motion.button>
      </form>

      {missingToken && (
        <motion.div variants={authItemVariants} className="mt-5 text-center">
          <Link to="/forgot-password" className="text-xs font-black uppercase tracking-[0.14em] text-gray-400 hover:text-indigo-600">
            Request a new link
          </Link>
        </motion.div>
      )}
    </AuthLayout>
  );
};

export default ResetPassword;
