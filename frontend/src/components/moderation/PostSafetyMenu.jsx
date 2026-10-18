import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Flag, VolumeX, UserX } from "lucide-react";
import { useMuteUser, useBlockUser } from "../../hooks/useModeration";
import { useToast } from "../../context/ToastContext";
import ReportModal from "./ReportModal";

export default function PostSafetyMenu({
    targetType = "POST",
    targetId,
    authorId,
    authorName = "User",
    className = ""
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const menuRef = useRef(null);
    const { addToast } = useToast();

    const { mutate: muteUser, isPending: isMuting } = useMuteUser();
    const { mutate: blockUser, isPending: isBlocking } = useBlockUser();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMuteUser = () => {
        if (!authorId || isMuting) return;
        muteUser(
            { userId: authorId },
            {
                onSuccess: () => {
                    addToast?.(`Muted ${authorName}. Their content will be hidden from your feed.`, "info");
                    setIsOpen(false);
                },
                onError: () => {
                    addToast?.("Failed to mute user", "error");
                }
            }
        );
    };

    const handleBlockUser = () => {
        if (!authorId || isBlocking) return;
        blockUser(
            { userId: authorId, reason: "Blocked via Post Safety Menu" },
            {
                onSuccess: () => {
                    addToast?.(`Blocked ${authorName}.`, "info");
                    setIsOpen(false);
                },
                onError: () => {
                    addToast?.("Failed to block user", "error");
                }
            }
        );
    };

    return (
        <div className={`relative inline-block ${className}`} ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Safety & Actions"
            >
                <MoreHorizontal className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-xl z-50 py-1.5 overflow-hidden text-xs">
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            setShowReportModal(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer font-medium"
                    >
                        <Flag className="w-4 h-4 text-red-500" />
                        <span>Report {targetType.toLowerCase()}</span>
                    </button>

                    {authorId && (
                        <>
                            <button
                                onClick={handleMuteUser}
                                disabled={isMuting}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer font-medium disabled:opacity-50"
                            >
                                <VolumeX className="w-4 h-4 text-amber-500" />
                                <span>{isMuting ? "Muting..." : `Mute ${authorName}`}</span>
                            </button>

                            <button
                                onClick={handleBlockUser}
                                disabled={isBlocking}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer font-medium disabled:opacity-50"
                            >
                                <UserX className="w-4 h-4 text-gray-500" />
                                <span>{isBlocking ? "Blocking..." : `Block ${authorName}`}</span>
                            </button>
                        </>
                    )}
                </div>
            )}

            {showReportModal && (
                <ReportModal
                    isOpen={showReportModal}
                    onClose={() => setShowReportModal(false)}
                    targetType={targetType}
                    targetId={targetId}
                />
            )}
        </div>
    );
}
