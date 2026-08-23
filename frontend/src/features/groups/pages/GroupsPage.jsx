import { useState } from "react";
import { Plus, Users, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../pages/Navbar";
import Sidebar from "../../../pages/Sidebar";
import FeedLayout from "../../../components/FeedLayout";
import EmptyState from "../../../components/Common/EmptyState";
import { getMyGroups, discoverGroups, joinGroup, leaveGroup } from "../../../api";
import { QUERY_KEYS } from "../../../constant/queryKeys";
import { useToast } from "../../../context/ToastContext";
import CreateCommunityGroupModal from "../modals/CreateCommunityGroupModal";

const GroupShimmer = () => (
  <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 animate-pulse">
    <div className="flex items-center gap-3.5">
      <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-2xl" />
      <div className="space-y-2">
        <div className="h-3 w-28 bg-gray-200 dark:bg-slate-700 rounded" />
        <div className="h-2.5 w-20 bg-gray-100 dark:bg-slate-800 rounded" />
      </div>
    </div>
    <div className="h-8 w-16 bg-gray-200 dark:bg-slate-700 rounded-xl" />
  </div>
);

export default function GroupsPage() {
  const [activeTab, setActiveTab] = useState("your");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const { data: myGroups = [], isLoading: loadingMyGroups } = useQuery({
    queryKey: QUERY_KEYS.myGroups,
    queryFn: getMyGroups,
  });

  const { data: discover = [], isLoading: loadingDiscover } = useQuery({
    queryKey: QUERY_KEYS.discoverGroups,
    queryFn: () => discoverGroups(20, 0),
  });

  const joinMutation = useMutation({
    mutationFn: (groupId) => joinGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myGroups });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.discoverGroups });
      showSuccess("Joined group successfully!");
    },
    onError: (err) => showError(err?.response?.data?.message || "Failed to join group"),
  });

  const leaveMutation = useMutation({
    mutationFn: (groupId) => leaveGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myGroups });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.discoverGroups });
      showSuccess("Left group successfully");
    },
    onError: (err) => showError(err?.response?.data?.message || "Failed to leave group"),
  });

  const displayedGroups = activeTab === "your" ? myGroups : activeTab === "discover" ? discover : [...myGroups, ...discover];
  const isLoading = activeTab === "your" ? loadingMyGroups : activeTab === "discover" ? loadingDiscover : loadingMyGroups || loadingDiscover;

  const isUserMember = (group) => {
    return myGroups.some((g) => g.id === group.id);
  };

  return (
    <>
      <Navbar />
      <FeedLayout
        left={<Sidebar />}
        center={
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Your groups</h1>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-400">Discover and manage communities you care about</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create group
              </button>
            </div>

            {/* My Groups Carousel (always shown at top) */}
            {myGroups.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {myGroups.slice(0, 3).map((group) => (
                  <div
                    key={group.id}
                    onClick={() => navigate(`/groups/${group.id}`)}
                    className="group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="h-28 overflow-hidden relative bg-gradient-to-br from-indigo-500 to-purple-600">
                      {group.coverImage && (
                        <img src={group.coverImage} alt={group.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate">{group.name}</h3>
                      <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-400 mt-0.5">
                        {group._count?.members || 0} members
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tabs */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
              <div className="flex gap-2">
                {[
                  { id: "all", label: "All groups" },
                  { id: "your", label: "Your groups" },
                  { id: "discover", label: "Discover" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTab === tab.id
                      ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50 shadow-xs"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Group List */}
            {isLoading ? (
              <div className="space-y-3">
                <GroupShimmer />
                <GroupShimmer />
                <GroupShimmer />
              </div>
            ) : displayedGroups.length === 0 ? (
              <EmptyState
                icon={Users}
                title={activeTab === "your" ? "No groups yet" : "No groups to discover"}
                description={
                  activeTab === "your"
                    ? "Join or create a group to start connecting with communities."
                    : "There are no new groups to discover right now. Check back later!"
                }
              />
            ) : (
              <div className="space-y-3">
                {displayedGroups.map((group) => {
                  const isMember = isUserMember(group);
                  const isBusy = joinMutation.isPending || leaveMutation.isPending;

                  return (
                    <motion.div
                      key={group.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => navigate(`/groups/${group.id}`)}
                      className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-xs overflow-hidden">
                          {group.coverImage ? (
                            <img src={group.coverImage} alt={group.name} className="w-full h-full object-cover" />
                          ) : (
                            group.name[0]
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">{group.name}</h4>
                          <p className="text-xs font-medium text-gray-400 dark:text-gray-400">
                            {group.visibility === "PRIVATE" ? "Private" : "Public"} group • {group._count?.members || 0} members
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          isMember ? leaveMutation.mutate(group.id) : joinMutation.mutate(group.id);
                        }}
                        disabled={isBusy}
                        className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 ${isMember
                          ? "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                          : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                          }`}
                      >
                        {isBusy ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : isMember ? "Joined" : "Join"}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        }
      />

      <CreateCommunityGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
