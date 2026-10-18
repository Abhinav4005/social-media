import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, CheckCircle2, X, FileText, AlertCircle } from "lucide-react";
import { moderationService } from "../../services/moderation.service";
import { useToast } from "../../context/ToastContext";

export default function AppealModal({ isOpen, onClose, reportId = null }) {
    const [reason, setReason] = useState("");
    const [evidence, setEvidence] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { addToast } = useToast();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason) {
            addToast?.("Please explain the reason for your appeal", "warning");
            return;
        }

        try {
            setLoading(true);
            await moderationService.submitAppeal({
                reportId,
                reason,
                evidence
            });
            setSubmitted(true);
            addToast?.("Appeal submitted successfully", "success");
        } catch (err) {
            addToast?.(err.response?.data?.message || "Failed to submit appeal", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-2xl p-6 overflow-hidden"
                >
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <Scale className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Submit Moderation Appeal</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {submitted ? (
                        <div className="py-8 text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white">Appeal Submitted</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                                Your appeal has been assigned to a senior administrator for independent review.
                            </p>
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-sm cursor-pointer"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                    Reason for Appeal
                                </label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    required
                                    rows={3}
                                    placeholder="Explain why you believe the moderation decision or restriction was mistaken..."
                                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-sm text-gray-900 dark:text-white focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                    Evidence or Clarification Link (Optional)
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://example.com/evidence-link"
                                    value={evidence}
                                    onChange={(e) => setEvidence(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-sm text-gray-900 dark:text-white focus:outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !reason}
                                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold shadow-lg shadow-purple-500/20 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    {loading ? "Submitting..." : "Submit Appeal"}
                                </button>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
