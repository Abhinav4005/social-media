import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flag, X, AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";
import { moderationService } from "../../services/moderation.service";
import { useToast } from "../../context/ToastContext";

const REPORT_REASONS = [
    { id: "SPAM", label: "Spam or Scam", desc: "Commercial spam, phishing links, or deceptive content" },
    { id: "HARASSMENT", label: "Harassment or Bullying", desc: "Targeted attacks, threats, or personal abuse" },
    { id: "HATE_SPEECH", label: "Hate Speech", desc: "Slurs, discrimination, or hate group material" },
    { id: "NUDITY", label: "Nudity or Sexual Content", desc: "Explicit adult content or non-consensual imagery" },
    { id: "VIOLENCE", label: "Violence or Dangerous Acts", desc: "Physical threats, violent extremism, or self-harm" },
    { id: "FALSE_INFO", label: "False Information", desc: "Misleading news, medical misinformation, or impersonation" },
    { id: "OTHER", label: "Other Policy Violation", desc: "Violates Community Guidelines in another way" }
];

export default function ReportModal({ isOpen, onClose, targetType = "POST", targetId, targetName }) {
    const [selectedReason, setSelectedReason] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { addToast } = useToast();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedReason) {
            addToast?.("Please select a reason for reporting", "warning");
            return;
        }

        try {
            setLoading(true);
            await moderationService.submitReport({
                targetType,
                targetId,
                reason: selectedReason,
                description
            });
            setSubmitted(true);
            addToast?.("Report submitted successfully to Safety Team", "success");
        } catch (err) {
            addToast?.(err.response?.data?.message || "Failed to submit report", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedReason("");
        setDescription("");
        setSubmitted(false);
        onClose();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative w-full max-w-lg my-auto max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-2xl p-6 overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                                <ShieldAlert className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Report {targetType}
                                </h3>
                                {targetName && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                        Target: <span className="font-semibold">{targetName}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {submitted ? (
                        <div className="py-8 text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white">Report Received</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                                Thank you for helping keep SocialHub safe. Our moderation team will review this report and take appropriate action.
                            </p>
                            <button
                                onClick={handleClose}
                                className="px-6 py-2.5 rounded-xl bg-gray-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold text-sm cursor-pointer"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                    Select a Reason
                                </label>
                                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                    {REPORT_REASONS.map((r) => (
                                        <label
                                            key={r.id}
                                            onClick={() => setSelectedReason(r.id)}
                                            className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${selectedReason === r.id
                                                ? "border-red-500 bg-red-50/50 dark:bg-red-900/10 text-red-900 dark:text-red-200"
                                                : "border-gray-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="reportReason"
                                                checked={selectedReason === r.id}
                                                onChange={() => setSelectedReason(r.id)}
                                                className="mt-1 accent-red-600"
                                            />
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{r.label}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{r.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                    Additional Details (Optional)
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    placeholder="Provide context or specific details to help moderators review..."
                                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !selectedReason}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-lg shadow-red-500/20 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    <Flag className="w-4 h-4" />
                                    <span>{loading ? "Submitting..." : "Submit Report"}</span>
                                </button>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
