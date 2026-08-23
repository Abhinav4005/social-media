import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
    Users,
    Globe,
    Lock,
    Plus,
    Settings,
    UserCheck,
    UserMinus,
    Shield,
    MessageSquare,
    ThumbsUp,
    Image as ImageIcon,
    Loader2,
    ArrowLeft,
    Trash2,
} from "lucide-react";
import Navbar from "../../../pages/Navbar";
import Sidebar from "../../../pages/Sidebar";
import FeedLayout from "../../../components/FeedLayout";
import EmptyState from "../../../components/Common/EmptyState";
import {
    getGroupById,
    getGroupPosts,
    getGroupMembers,
    createGroupPost,
    joinGroup,
    leaveGroup,
    removeGroupMember,
    updateMemberRole,
    updateGroup,
    deleteGroup,
} from "../../../api";
import { useToast } from "../../../context/ToastContext";
import GroupModal from "../modals/GroupModal";
import { PostCard } from "../../posts";

export default function GroupDetailPage() {
    const { id } = useParams();
    const groupId = parseInt(id, 10);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();
    const { user: currentUser } = useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState("posts");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Post creation state
    const [postTitle, setPostTitle] = useState("");
    const [postDescription, setPostDescription] = useState("");
    const [postImage, setPostImage] = useState("");

    // Queries
    const { data: group, isLoading: loadingGroup, error: groupError } = useQuery({
        queryKey: ["group", groupId],
        queryFn: () => getGroupById(groupId),
        enabled: !isNaN(groupId),
    });

    const { data: posts = [], isLoading: loadingPosts } = useQuery({
        queryKey: ["groupPosts", groupId],
        queryFn: () => getGroupPosts(groupId),
        enabled: !isNaN(groupId),
    });

    const { data: members = [], isLoading: loadingMembers } = useQuery({
        queryKey: ["groupMembers", groupId],
        queryFn: () => getGroupMembers(groupId),
        enabled: !isNaN(groupId),
    });

    // Check user membership and admin role
    const currentMemberRecord = members.find((m) => m.userId === currentUser?.id);
    const isMember = Boolean(currentMemberRecord) || group?.members?.some((m) => m.userId === currentUser?.id);
    const isAdmin = currentMemberRecord?.role === "ADMIN" || group?.members?.some((m) => m.userId === currentUser?.id && m.role === "ADMIN");

    // Mutations
    const joinMutation = useMutation({
        mutationFn: () => joinGroup(groupId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["group", groupId] });
            queryClient.invalidateQueries({ queryKey: ["groupMembers", groupId] });
            queryClient.invalidateQueries({ queryKey: ["groupPosts", groupId] });
            showSuccess("Joined group successfully!");
        },
        onError: (err) => showError(err?.response?.data?.message || "Failed to join group"),
    });

    const leaveMutation = useMutation({
        mutationFn: () => leaveGroup(groupId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["group", groupId] });
            queryClient.invalidateQueries({ queryKey: ["groupMembers", groupId] });
            showSuccess("Left group successfully");
        },
        onError: (err) => showError(err?.response?.data?.message || "Failed to leave group"),
    });

    const createPostMutation = useMutation({
        mutationFn: (data) => createGroupPost(groupId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groupPosts", groupId] });
            setPostTitle("");
            setPostDescription("");
            setPostImage("");
            showSuccess("Post created in group!");
        },
        onError: (err) => showError(err?.response?.data?.message || "Failed to create group post"),
    });

    const removeMemberMutation = useMutation({
        mutationFn: (targetUserId) => removeGroupMember(groupId, targetUserId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groupMembers", groupId] });
            queryClient.invalidateQueries({ queryKey: ["group", groupId] });
            showSuccess("Member removed from group");
        },
        onError: (err) => showError(err?.response?.data?.message || "Failed to remove member"),
    });

    const updateRoleMutation = useMutation({
        mutationFn: ({ targetUserId, role }) => updateMemberRole(groupId, targetUserId, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groupMembers", groupId] });
            showSuccess("Member role updated");
        },
        onError: (err) => showError(err?.response?.data?.message || "Failed to update member role"),
    });

    const updateGroupMutation = useMutation({
        mutationFn: (formData) => updateGroup(groupId, { name: formData.groupName, description: formData.description, coverImage: formData.profileImage }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["group", groupId] });
            showSuccess("Group settings updated!");
            setIsEditModalOpen(false);
        },
        onError: (err) => showError(err?.response?.data?.message || "Failed to update group"),
    });

    const deleteGroupMutation = useMutation({
        mutationFn: () => deleteGroup(groupId),
        onSuccess: () => {
            showSuccess("Group deleted successfully");
            navigate("/groups");
        },
        onError: (err) => showError(err?.response?.data?.message || "Failed to delete group"),
    });

    const handleCreatePost = (e) => {
        e.preventDefault();
        if (!postTitle.trim() || !postDescription.trim()) {
            showError("Please enter a title and description for your post");
            return;
        }
        createPostMutation.mutate({
            title: postTitle,
            description: postDescription,
            image: postImage,
        });
    };

    if (loadingGroup) {
        return (
            <>
                <Navbar />
                <FeedLayout
                    left={<Sidebar />}
                    center={
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                        </div>
                    }
                />
            </>
        );
    }

    if (groupError || !group) {
        return (
            <>
                <Navbar />
                <FeedLayout
                    left={<Sidebar />}
                    center={
                        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 space-y-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Group not found</h2>
                            <p className="text-sm text-gray-400">The group you're looking for does not exist or has been deleted.</p>
                            <button
                                onClick={() => navigate("/groups")}
                                className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                            >
                                Back to Groups
                            </button>
                        </div>
                    }
                />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <FeedLayout
                left={<Sidebar />}
                center={
                    <div className="space-y-6">
                        {/* Back Button */}
                        <button
                            onClick={() => navigate("/groups")}
                            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-indigo-600 transition-all cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Groups
                        </button>

                        {/* Group Banner & Header */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-xs">
                            <div className="relative h-44 sm:h-56 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
                                {group.coverImage && (
                                    <img src={group.coverImage} alt={group.name} className="w-full h-full object-cover" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                {/* Privacy Badge */}
                                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-bold">
                                    {group.visibility === "PRIVATE" ? (
                                        <>
                                            <Lock className="w-3.5 h-3.5 text-amber-400" />
                                            Private Group
                                        </>
                                    ) : (
                                        <>
                                            <Globe className="w-3.5 h-3.5 text-emerald-400" />
                                            Public Group
                                        </>
                                    )}
                                </div>

                                {/* Group Details Overlay */}
                                <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl border-4 border-white dark:border-slate-900 shadow-md flex items-center justify-center text-white text-2xl font-black overflow-hidden">
                                            {group.coverImage ? (
                                                <img src={group.coverImage} alt={group.name} className="w-full h-full object-cover" />
                                            ) : (
                                                group.name[0]?.toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">{group.name}</h1>
                                            <p className="text-xs font-medium text-gray-200 mt-0.5">
                                                {group._count?.members || members.length || 0} members • {group._count?.posts || posts.length || 0} posts
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        {isAdmin && (
                                            <button
                                                onClick={() => setIsEditModalOpen(true)}
                                                className="p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-xl transition-all cursor-pointer"
                                                title="Group Settings"
                                            >
                                                <Settings className="w-4 h-4" />
                                            </button>
                                        )}

                                        <button
                                            onClick={() => (isMember ? leaveMutation.mutate() : joinMutation.mutate())}
                                            disabled={joinMutation.isPending || leaveMutation.isPending}
                                            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 ${isMember
                                                ? "bg-white/20 hover:bg-red-500/80 backdrop-blur-md text-white"
                                                : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                                }`}
                                        >
                                            {joinMutation.isPending || leaveMutation.isPending ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : isMember ? (
                                                <>
                                                    <UserCheck className="w-4 h-4" />
                                                    Joined
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-4 h-4" />
                                                    Join Group
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Group Description */}
                            {group.description && (
                                <div className="p-6 border-b border-gray-100 dark:border-slate-800">
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                                        {group.description}
                                    </p>
                                </div>
                            )}

                            {/* Tabs */}
                            <div className="flex border-b border-gray-100 dark:border-slate-800 px-6">
                                {[
                                    { id: "posts", label: `Posts (${posts.length})` },
                                    { id: "members", label: `Members (${members.length})` },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${activeTab === tab.id
                                            ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                                            : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* TAB CONTENT */}
                        {activeTab === "posts" && (
                            <div className="space-y-6">
                                {/* Create Group Post Box */}
                                {isMember && (
                                    <form onSubmit={handleCreatePost} className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xs space-y-3">
                                        <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Create Group Post</h3>
                                        <input
                                            type="text"
                                            placeholder="Post title..."
                                            value={postTitle}
                                            onChange={(e) => setPostTitle(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500"
                                        />
                                        <textarea
                                            rows={2}
                                            placeholder="Share something with the group..."
                                            value={postDescription}
                                            onChange={(e) => setPostDescription(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500 resize-none"
                                        />
                                        <div className="flex items-center justify-between pt-1">
                                            <div className="flex items-center gap-2">
                                                <ImageIcon className="w-4 h-4 text-gray-400" />
                                                <input
                                                    type="url"
                                                    placeholder="Image URL (optional)"
                                                    value={postImage}
                                                    onChange={(e) => setPostImage(e.target.value)}
                                                    className="px-3 py-1.5 bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-lg text-[11px] text-gray-700 dark:text-gray-300 focus:outline-none"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={createPostMutation.isPending}
                                                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer transition-all"
                                            >
                                                {createPostMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                                Post
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* Posts List */}
                                {loadingPosts ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                                    </div>
                                ) : posts.length === 0 ? (
                                    <EmptyState
                                        icon={MessageSquare}
                                        title="No posts in this group yet"
                                        description={isMember ? "Be the first one to create a post in this group!" : "Join this group to see and post content."}
                                    />
                                ) : (
                                    <div className="space-y-4">
                                        {posts.map((post) => (
                                            <PostCard key={post.id} {...post} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* MEMBERS TAB */}
                        {activeTab === "members" && (
                            <div className="space-y-4">
                                {loadingMembers ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                                    </div>
                                ) : members.length === 0 ? (
                                    <EmptyState icon={Users} title="No members found" description="This group currently has no active members." />
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {members.map((member) => {
                                            const isTargetAdmin = member.role === "ADMIN";
                                            const isSelf = member.userId === currentUser?.id;

                                            return (
                                                <div
                                                    key={member.id}
                                                    className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                                                            {member.user?.profileImage ? (
                                                                <img src={member.user.profileImage} alt={member.user.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                member.user?.name?.[0] || "U"
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="font-bold text-xs text-gray-900 dark:text-gray-100">{member.user?.name}</h4>
                                                                {isTargetAdmin && (
                                                                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold">
                                                                        <Shield className="w-3 h-3" /> Admin
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-[11px] text-gray-400 truncate max-w-[140px]">{member.user?.email}</p>
                                                        </div>
                                                    </div>

                                                    {/* Admin Controls for Members */}
                                                    {isAdmin && !isSelf && (
                                                        <div className="flex items-center gap-1.5">
                                                            <button
                                                                onClick={() =>
                                                                    updateRoleMutation.mutate({
                                                                        targetUserId: member.userId,
                                                                        role: isTargetAdmin ? "MEMBER" : "ADMIN",
                                                                    })
                                                                }
                                                                disabled={updateRoleMutation.isPending}
                                                                className="px-2.5 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-gray-700 dark:text-gray-300 text-[11px] font-bold rounded-lg transition-all cursor-pointer"
                                                                title={isTargetAdmin ? "Demote to Member" : "Promote to Admin"}
                                                            >
                                                                {isTargetAdmin ? "Demote" : "Promote"}
                                                            </button>

                                                            <button
                                                                onClick={() => removeMemberMutation.mutate(member.userId)}
                                                                disabled={removeMemberMutation.isPending}
                                                                className="p-1.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 rounded-lg transition-all cursor-pointer"
                                                                title="Remove member"
                                                            >
                                                                <UserMinus className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                }
            />

            {/* Edit Group Settings Modal */}
            <GroupModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={(formData) => updateGroupMutation.mutate(formData)}
                initialData={{
                    groupName: group.name,
                    description: group.description,
                    profileImage: group.coverImage,
                }}
            />
        </>
    );
}
