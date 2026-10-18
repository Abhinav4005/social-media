import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    ShieldAlert,
    CheckCircle,
    XCircle,
    Filter,
    UserCheck,
    Scale,
    Lock,
    Activity,
    AlertTriangle,
    RefreshCw,
    Search,
    ChevronRight,
    Ban,
    Slash
} from "lucide-react";
import { moderationService } from "../../services/moderation.service";
import { useToast } from "../../context/ToastContext";

export default function AdminModerationDashboard() {
    const [activeTab, setActiveTab] = useState("reports");
    const [reports, setReports] = useState([]);
    const [verifications, setVerifications] = useState([]);
    const [appeals, setAppeals] = useState([]);
    const [suspiciousLogins, setSuspiciousLogins] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [contentLogs, setContentLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [resolutionType, setResolutionType] = useState(null);
    const [resolutionNotes, setResolutionNotes] = useState("");
    const { addToast } = useToast();

    useEffect(() => {
        fetchTabData();
    }, [activeTab, statusFilter]);

    const fetchTabData = async () => {
        setLoading(true);
        try {
            if (activeTab === "reports") {
                const res = await moderationService.adminGetReports({ status: statusFilter });
                setReports(res.data?.reports || []);
            } else if (activeTab === "verifications") {
                const res = await moderationService.adminGetVerificationRequests({ status: statusFilter });
                setVerifications(res.data?.requests || []);
            } else if (activeTab === "appeals") {
                const res = await moderationService.adminGetAppeals({ status: statusFilter });
                setAppeals(res.data?.appeals || []);
            } else if (activeTab === "suspicious") {
                const res = await moderationService.adminGetSuspiciousLogins({ isFlagged: true });
                setSuspiciousLogins(res.data?.logins || []);
            } else if (activeTab === "audit") {
                const res = await moderationService.adminGetAuditLogs();
                setAuditLogs(res.data?.logs || []);
            } else if (activeTab === "spam") {
                const res = await moderationService.adminGetModerationLogs();
                setContentLogs(res.data?.logs || []);
            }
        } catch (err) {
            console.error("Dashboard fetch error:", err);
            addToast?.("Error loading moderation data", "error");
        } finally {
            setLoading(false);
        }
    };

    // Action handlers
    const openResolveModal = (report, action) => {
        setSelectedReport(report);
        setResolutionType(action);
        setResolutionNotes(`Resolution action: ${action}`);
    };

    const handleConfirmResolve = async () => {
        if (!selectedReport || !resolutionType) return;
        try {
            await moderationService.adminResolveReport(selectedReport.id, {
                status: "RESOLVED",
                resolution: resolutionType,
                resolutionNotes: resolutionNotes || `Actioned as ${resolutionType}`
            });
            addToast?.(`Report #${selectedReport.id} resolved with action ${resolutionType}`, "success");
            setSelectedReport(null);
            setResolutionType(null);
            fetchTabData();
        } catch (err) {
            addToast?.("Failed to resolve report", "error");
        }
    };

    const handleProcessVerification = async (requestId, status) => {
        try {
            await moderationService.adminProcessVerification(requestId, {
                status,
                reviewerNotes: `Processed by Admin as ${status}`
            });
            addToast?.(`Verification request ${status.toLowerCase()}`, "success");
            fetchTabData();
        } catch (err) {
            addToast?.("Failed to process verification", "error");
        }
    };

    const handleProcessAppeal = async (appealId, status) => {
        try {
            await moderationService.adminProcessAppeal(appealId, {
                status,
                reviewerNotes: `Appeal ${status.toLowerCase()} by admin`
            });
            addToast?.(`Appeal ${status.toLowerCase()}`, "success");
            fetchTabData();
        } catch (err) {
            addToast?.("Failed to process appeal", "error");
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-800/80 border border-slate-700/60 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Trust & Safety Moderation Hub</h1>
                        <p className="text-xs text-slate-400">
                            Admin Moderation Queue, Suspicious Logins, Content Spam Scanner & Identity Verification
                        </p>
                    </div>
                </div>

                <button
                    onClick={fetchTabData}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    <span>Refresh Data</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-slate-800/60 rounded-2xl border border-slate-700/50">
                {[
                    { id: "reports", label: "Moderation Queue", icon: ShieldAlert },
                    { id: "spam", label: "Spam & Toxicity Logs", icon: AlertTriangle },
                    { id: "verifications", label: "Identity Verifications", icon: UserCheck },
                    { id: "appeals", label: "User Appeals", icon: Scale },
                    { id: "suspicious", label: "Suspicious Logins", icon: Lock },
                    { id: "audit", label: "System Audit Logs", icon: Activity }
                ].map((t) => {
                    const Icon = t.icon;
                    return (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === t.id
                                ? "bg-gradient-to-r from-red-600 to-indigo-600 text-white shadow-md"
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{t.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="bg-slate-800/60 rounded-3xl border border-slate-700/50 p-6 min-h-[400px]">
                {loading ? (
                    <div className="flex items-center justify-center py-24 text-slate-400">
                        <RefreshCw className="w-8 h-8 animate-spin" />
                    </div>
                ) : activeTab === "reports" ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-slate-200">Reports Queue</h3>
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-slate-400" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-1.5 rounded-xl bg-slate-700 border border-slate-600 text-xs text-slate-200 focus:outline-none"
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="IN_REVIEW">In Review</option>
                                    <option value="RESOLVED">Resolved</option>
                                    <option value="DISMISSED">Dismissed</option>
                                </select>
                            </div>
                        </div>

                        {reports.length === 0 ? (
                            <p className="text-center py-16 text-xs text-slate-500">No reports found for this status.</p>
                        ) : (
                            <div className="space-y-3">
                                {reports.map((report) => (
                                    <div
                                        key={report.id}
                                        className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold">
                                                    {report.targetType} #{report.targetId}
                                                </span>
                                                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                                                    Reason: {report.reason}
                                                </span>
                                            </div>
                                            <p className="text-xs font-semibold text-slate-200">
                                                Reporter: {report.reporter?.name || `User #${report.reporterId}`}
                                            </p>
                                            {report.description && (
                                                <p className="text-xs text-slate-400 bg-slate-800/40 p-2 rounded-xl border border-slate-700/40">
                                                    "{report.description}"
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 self-end md:self-auto">
                                            <button
                                                onClick={() => openResolveModal(report, "CONTENT_REMOVED")}
                                                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition-colors cursor-pointer"
                                            >
                                                Remove Content
                                            </button>
                                            <button
                                                onClick={() => openResolveModal(report, "USER_RESTRICTED")}
                                                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white transition-colors cursor-pointer"
                                            >
                                                Restrict User
                                            </button>
                                            <button
                                                onClick={() => openResolveModal(report, "NO_ACTION")}
                                                className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
                                            >
                                                Dismiss
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : activeTab === "verifications" ? (
                    <div className="space-y-4">
                        <h3 className="text-base font-bold text-slate-200">Identity Verification Requests</h3>
                        {verifications.length === 0 ? (
                            <p className="text-center py-16 text-xs text-slate-500">No verification requests.</p>
                        ) : (
                            <div className="space-y-3">
                                {verifications.map((req) => (
                                    <div
                                        key={req.id}
                                        className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 flex items-center justify-between"
                                    >
                                        <div>
                                            <p className="text-sm font-bold text-slate-100">{req.user?.name || `User #${req.userId}`}</p>
                                            <p className="text-xs text-slate-400">Badge: {req.type} | Doc: {req.documentType}</p>
                                            {req.documentUrl && (
                                                <a
                                                    href={req.documentUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-xs text-blue-400 underline hover:text-blue-300"
                                                >
                                                    View Document Link
                                                </a>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleProcessVerification(req.id, "VERIFIED")}
                                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white cursor-pointer"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleProcessVerification(req.id, "REJECTED")}
                                                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white cursor-pointer"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : activeTab === "appeals" ? (
                    <div className="space-y-4">
                        <h3 className="text-base font-bold text-slate-200">Moderation Appeals</h3>
                        {appeals.length === 0 ? (
                            <p className="text-center py-16 text-xs text-slate-500">No pending appeals.</p>
                        ) : (
                            <div className="space-y-3">
                                {appeals.map((app) => (
                                    <div
                                        key={app.id}
                                        className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 flex items-center justify-between"
                                    >
                                        <div>
                                            <p className="text-sm font-bold text-slate-100">User: {app.user?.name || app.userId}</p>
                                            <p className="text-xs text-slate-300 mt-1">"{app.reason}"</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleProcessAppeal(app.id, "APPROVED")}
                                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white cursor-pointer"
                                            >
                                                Approve Appeal
                                            </button>
                                            <button
                                                onClick={() => handleProcessAppeal(app.id, "REJECTED")}
                                                className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-slate-300 cursor-pointer"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : activeTab === "suspicious" ? (
                    <div className="space-y-4">
                        <h3 className="text-base font-bold text-slate-200">Suspicious Login Detection Alerts</h3>
                        {suspiciousLogins.length === 0 ? (
                            <p className="text-center py-16 text-xs text-slate-500">No suspicious logins flagged.</p>
                        ) : (
                            <div className="space-y-3">
                                {suspiciousLogins.map((item) => (
                                    <div key={item.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 flex justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-red-400">User ID: #{item.userId}</p>
                                            <p className="text-xs text-slate-400">IP: {item.ipAddress} | Risk Score: {item.riskScore}</p>
                                            <p className="text-xs text-slate-500">Action: {item.actionTaken}</p>
                                        </div>
                                        <span className="text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h3 className="text-base font-bold text-slate-200">System Audit Logs</h3>
                        {auditLogs.length === 0 ? (
                            <p className="text-center py-16 text-xs text-slate-500">No audit logs available.</p>
                        ) : (
                            <div className="space-y-2">
                                {auditLogs.map((log) => (
                                    <div key={log.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/40 flex justify-between text-xs">
                                        <div>
                                            <span className="font-bold text-indigo-400">{log.action}</span>
                                            <span className="text-slate-300 ml-2">{log.details}</span>
                                        </div>
                                        <span className="text-slate-500 text-[10px]">{new Date(log.createdAt).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Action Resolution Notes Modal */}
            {selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-4">
                        <h3 className="text-lg font-bold text-white">Resolve Report #{selectedReport.id}</h3>
                        <p className="text-xs text-slate-400">
                            Action selected: <span className="font-bold text-red-400">{resolutionType}</span>
                        </p>
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">
                                Administrator Resolution Notes
                            </label>
                            <textarea
                                value={resolutionNotes}
                                onChange={(e) => setResolutionNotes(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-slate-100 focus:outline-none"
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmResolve}
                                className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg cursor-pointer"
                            >
                                Confirm Resolution
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
