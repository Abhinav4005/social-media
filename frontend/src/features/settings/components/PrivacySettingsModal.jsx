import React, { useState, useEffect } from "react";
import { privacyService } from "../../../services/privacy.service";
import { useToast } from "../../../context/ToastContext";
import TabBar from "../../../components/Common/TabBar";
import EmptyState from "../../../components/Common/EmptyState";
import UserAvatar from "../../../components/Common/UserAvatar";
import { Users } from "lucide-react";
import { QUERY_KEYS } from "../../../constant/queryKeys";
import { POST_VISIBILITY, DM_PERMISSION } from "../../../constant/enums";

export const PrivacySettingsModal = ({ isOpen, onClose }) => {
    const { showSuccess, showError } = useToast();
    const [activeTab, setActiveTab] = useState("settings");
    const [settings, setSettings] = useState({
        defaultPostVisibility: "FOLLOWERS",
        defaultMessageSetting: "FOLLOWERS",
        allowFollowersToMessage: true,
    });
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [lists, setLists] = useState([]);
    const [newListName, setNewListName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [settingsRes, blockedRes, listsRes] = await Promise.all([
                privacyService.getPrivacySettings(),
                privacyService.getBlockedUsers(),
                privacyService.getPrivacyLists(),
            ]);
            const settingsObj = settingsRes?.data?.settings || settingsRes?.settings || settingsRes?.data;
            if (settingsObj) setSettings(prev => ({ ...prev, ...settingsObj }));

            const blockedArr = blockedRes?.data?.users || blockedRes?.users || blockedRes?.data || [];
            if (Array.isArray(blockedArr)) setBlockedUsers(blockedArr);

            const listsArr = listsRes?.data?.lists || listsRes?.lists || listsRes?.data || [];
            if (Array.isArray(listsArr)) setLists(listsArr);
        } catch (err) {
            console.error("Error fetching privacy data:", err);
            showError("Failed to fetch privacy settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        try {
            await privacyService.updatePrivacySettings(settings);
            showSuccess("Privacy settings updated successfully!");
        } catch (err) {
            showError(err.message || "Failed to update privacy settings.");
        }
    };

    const handleUnblock = async (userId) => {
        try {
            await privacyService.unblockUser(userId);
            setBlockedUsers((prev) => prev.filter((u) => u.id !== userId));
            showSuccess("User unblocked!");
        } catch (err) {
            showError(err.message || "Failed to unblock user.");
        }
    };

    const handleCreateList = async (e) => {
        e.preventDefault();
        if (!newListName.trim()) return;
        try {
            const res = await privacyService.createPrivacyList(newListName.trim());
            if (res.list) setLists((prev) => [...prev, res.list]);
            setNewListName("");
            showSuccess("Custom privacy list created!");
        } catch (err) {
            showError(err.message || "Failed to create privacy list.");
        }
    };

    const handleDeleteList = async (listId) => {
        try {
            await privacyService.deletePrivacyList(listId);
            setLists((prev) => prev.filter((l) => l.id !== listId));
            showSuccess("Privacy list deleted!");
        } catch (err) {
            showError(err.message || "Failed to delete privacy list.");
        }
    };

    if (!isOpen) return null;

    const TABS = [
        { id: "settings", label: "Visibility & Messaging" },
        { id: "blocked", label: `Blocked Users (${blockedUsers.length})` },
        { id: "lists",   label: `Custom Lists (${lists.length})` },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <h2 className="text-xl font-black text-gray-900">Privacy & Block Controls</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold transition-all"
                    >
                        ✕
                    </button>
                </div>

                <div className="my-4">
                    <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} variant="pill" />
                </div>

                {loading ? (
                    <div className="py-12 text-center text-gray-400 font-medium">Loading settings...</div>
                ) : (
                    <>
                        {activeTab === "settings" && (
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        Default Post Visibility
                                    </label>
                                    <select
                                        value={settings.defaultPostVisibility}
                                        onChange={(e) =>
                                            setSettings({ ...settings, defaultPostVisibility: e.target.value })
                                        }
                                        className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        {Object.values(POST_VISIBILITY).map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        Default Direct Message Permission
                                    </label>
                                    <select
                                        value={settings.defaultMessageSetting}
                                        onChange={(e) =>
                                            setSettings({ ...settings, defaultMessageSetting: e.target.value })
                                        }
                                        className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        {Object.values(DM_PERMISSION).map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <button
                                        onClick={handleSaveSettings}
                                        className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl text-sm shadow-lg shadow-primary-500/20 transition-all"
                                    >
                                        Save Privacy Preferences
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === "blocked" && (
                            <div className="space-y-3">
                                {blockedUsers.length === 0 ? (
                                    <EmptyState
                                        icon={Users}
                                        title="No blocked users"
                                        description="Users you block will appear here."
                                        noBorder
                                        iconBg="bg-gray-100"
                                        iconColor="text-gray-400"
                                    />
                                ) : (
                                    blockedUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100"
                                        >
                                            <div className="flex items-center gap-3">
                                                <UserAvatar
                                                    name={user.name}
                                                    profileImage={user.profileImage}
                                                    size="sm"
                                                    shape="circle"
                                                />
                                                <div>
                                                    <h4 className="text-sm font-bold text-gray-900">{user.name}</h4>
                                                    <p className="text-xs text-gray-400">{user.email}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleUnblock(user.id)}
                                                className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs rounded-xl transition-all"
                                            >
                                                Unblock
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === "lists" && (
                            <div className="space-y-4">
                                <form onSubmit={handleCreateList} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="New List Name (e.g. Close Friends)"
                                        value={newListName}
                                        onChange={(e) => setNewListName(e.target.value)}
                                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-xl transition-all"
                                    >
                                        Create List
                                    </button>
                                </form>

                                <div className="space-y-2">
                                    {lists.length === 0 ? (
                                        <EmptyState
                                            icon={Users}
                                            title="No custom lists yet"
                                            description="Create a list to control who sees your posts."
                                            noBorder
                                            iconBg="bg-gray-100"
                                            iconColor="text-gray-400"
                                        />
                                    ) : (
                                        lists.map((list) => (
                                            <div
                                                key={list.id}
                                                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100"
                                            >
                                                <div>
                                                    <h4 className="text-sm font-bold text-gray-900">{list.name}</h4>
                                                    <p className="text-xs text-gray-400">
                                                        {list.members?.length || 0} members
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteList(list.id)}
                                                    className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs rounded-xl transition-all"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PrivacySettingsModal;
