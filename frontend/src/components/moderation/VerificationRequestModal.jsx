import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShieldCheck, X, Upload, FileText } from "lucide-react";
import { moderationService } from "../../services/moderation.service";
import { useToast } from "../../context/ToastContext";

export default function VerificationRequestModal({ isOpen, onClose }) {
    const [badgeType, setBadgeType] = useState("BLUE_CHECK");
    const [documentType, setDocumentType] = useState("GOVT_ID");
    const [documentUrl, setDocumentUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { addToast } = useToast();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!documentUrl) {
            addToast?.("Please provide a link or URL to your proof document", "warning");
            return;
        }

        try {
            setLoading(true);
            await moderationService.requestVerification({
                type: badgeType,
                documentType,
                documentUrl
            });
            setSubmitted(true);
            addToast?.("Verification request submitted successfully!", "success");
        } catch (err) {
            addToast?.(err.response?.data?.message || "Failed to submit verification request", "error");
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
                            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Apply for Verification</h3>
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
                            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white">Request Submitted</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                                Your verification request is under review by our identity team. You will be notified once a decision is made.
                            </p>
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                    Verification Badge Type
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: "BLUE_CHECK", label: "Verified User", desc: "Standard Blue Check" },
                                        { id: "CREATOR", label: "Creator", desc: "Verified Content Creator" },
                                        { id: "GOV_ID", label: "Official ID", desc: "Government Verified" }
                                    ].map((t) => (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => setBadgeType(t.id)}
                                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${badgeType === t.id
                                                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-200"
                                                    : "border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50"
                                                }`}
                                        >
                                            <p className="text-xs font-bold text-gray-900 dark:text-white">{t.label}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">{t.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                    Document Type
                                </label>
                                <select
                                    value={documentType}
                                    onChange={(e) => setDocumentType(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-sm text-gray-900 dark:text-white focus:outline-none"
                                >
                                    <option value="GOVT_ID">Passport or Driver's License</option>
                                    <option value="TAX_DOC">Tax Identification or Official Registration</option>
                                    <option value="WEBSITE">Official Portfolio / Website Verification</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                    Document URL or Proof Link
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://example.com/proof-document.pdf"
                                    value={documentUrl}
                                    onChange={(e) => setDocumentUrl(e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-sm text-gray-900 dark:text-white focus:outline-none"
                                />
                                <p className="text-[10px] text-gray-400 mt-1">
                                    Secure link to your identity document or verification URL for safety team audit.
                                </p>
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
                                    disabled={loading || !documentUrl}
                                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    {loading ? "Submitting..." : "Submit Verification"}
                                </button>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
