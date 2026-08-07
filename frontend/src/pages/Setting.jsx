import { useState } from "react";
import {
    Moon, Sun, Lock, User, Bell, Shield,
    ChevronRight, LogOut, CreditCard, Sparkles, Check,
    Camera, Mail, FileText, Zap, Star, Eye, EyeOff
} from "lucide-react";
import Navbar from "./Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useUserProfile } from "../hooks/useUserProfile";
import PrivacySettingsModal from "../components/Settings/PrivacySettingsModal";
import { createCheckoutSession } from "../api";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";

/* ── Reusable toggle ──────────────────────────────────────────── */
const Toggle = ({ enabled, onChange }) => (
    <button
        onClick={onChange}
        className={`relative w-11 h-6 flex items-center rounded-full transition-all duration-300 shadow-inner cursor-pointer ${enabled ? "bg-primary-600 shadow-primary-200" : "bg-gray-200 dark:bg-slate-700"}`}
    >
        <motion.span
            initial={false}
            animate={{ x: enabled ? 22 : 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="w-4.5 h-4.5 w-[18px] h-[18px] bg-white rounded-full shadow-md"
        />
    </button>
);

/* ── Field label ──────────────────────────────────────────────── */
const Label = ({ icon: Icon, children }) => (
    <label className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
        {Icon && <Icon className="w-3 h-3" />}
        {children}
    </label>
);

/* ── Input field ──────────────────────────────────────────────── */
function Field({ label, icon, type = "text", name, value, onChange, placeholder, textarea, rows = 3 }) {
    const [focused, setFocused] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const isPassword = type === "password";

    return (
        <div className="space-y-1.5">
            <Label icon={icon}>{label}</Label>
            <motion.div
                animate={focused
                    ? { boxShadow: "0 0 0 3px rgba(99,102,241,0.15)" }
                    : { boxShadow: "0 0 0 0px rgba(99,102,241,0)" }
                }
                transition={{ duration: 0.2 }}
                className={`rounded-2xl border transition-colors duration-200 ${focused
                    ? "border-primary-400 dark:border-primary-500 bg-white dark:bg-slate-800"
                    : "border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60"
                    }`}
            >
                {textarea ? (
                    <textarea
                        name={name}
                        rows={rows}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        className="w-full bg-transparent px-4 py-3.5 text-sm font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 outline-none resize-none"
                    />
                ) : (
                    <div className="flex items-center">
                        <input
                            type={isPassword && !showPw ? "password" : isPassword ? "text" : type}
                            name={name}
                            value={value}
                            onChange={onChange}
                            placeholder={placeholder}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            className="flex-1 bg-transparent px-4 py-3.5 text-sm font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 outline-none"
                        />
                        {isPassword && (
                            <button type="button" onClick={() => setShowPw(v => !v)} className="pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
                                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
}

/* ── Section wrapper ──────────────────────────────────────────── */
const sectionVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 280, damping: 26 } },
    exit: { opacity: 0, y: -12, scale: 0.98, transition: { duration: 0.15 } },
};

function SettingSection({ title, description, icon: Icon, iconColor = "from-primary-500 to-secondary-500", children }) {
    return (
        <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="bg-white dark:bg-slate-900 rounded-[24px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden"
        >
            {/* Accent bar */}
            <div className="h-1 bg-gradient-to-r from-primary-500 via-secondary-400 to-primary-600 animate-gradient-x" />

            {/* Header */}
            <div className="flex items-center gap-4 px-7 pt-6 pb-5 border-b border-gray-50 dark:border-slate-800/80">
                {Icon && (
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${iconColor} flex items-center justify-center shadow-md flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                )}
                <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 tracking-tight">{title}</h3>
                    {description && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{description}</p>}
                </div>
            </div>

            <div className="px-7 py-6">{children}</div>
        </motion.div>
    );
}

/* ── Row for toggles/preference items ────────────────────────── */
function PrefRow({ icon: Icon, iconBg, title, subtitle, right }) {
    return (
        <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0 border-b border-gray-50 dark:border-slate-800/60 last:border-0">
            <div className="flex items-center gap-3.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                    <Icon className="w-4 h-4" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{title}</p>
                    {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{subtitle}</p>}
                </div>
            </div>
            {right}
        </div>
    );
}

/* ── Avatar gradient util ─────────────────────────────────────── */
const GRADIENTS = [
    ["#6366f1", "#8b5cf6"], ["#ec4899", "#f43f5e"],
    ["#f59e0b", "#f97316"], ["#10b981", "#14b8a6"],
];
function getGradient(name = "") {
    const code = [...(name || "?")].reduce((a, c) => a + c.charCodeAt(0), 0);
    return GRADIENTS[code % GRADIENTS.length];
}

/* ── NAV categories ───────────────────────────────────────────── */
const CATEGORIES = [
    { id: "profile", name: "Profile", icon: User, color: "text-primary-500", bg: "bg-primary-50 dark:bg-primary-900/20" },
    { id: "subscription", name: "Pro Subscription", icon: CreditCard, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { id: "security", name: "Security", icon: Lock, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/20" },
    { id: "notifications", name: "Notifications", icon: Bell, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/20" },
    { id: "privacy", name: "Privacy & Blocks", icon: Shield, color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-900/20" },
    { id: "preferences", name: "Preferences", icon: Sun, color: "text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20" },
];

/* ── Main Settings page ───────────────────────────────────────── */
export default function Settings() {
    const [activeTab, setActiveTab] = useState("profile");
    const { isDark, toggleTheme } = useTheme();
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
    const [isSubscribing, setIsSubscribing] = useState(false);
    const { showSuccess, showError } = useToast();
    const [notifs, setNotifs] = useState({ email: true, push: true, sms: false });
    const { logout } = useAuth();
    const { profile, saving, error, updateProfile } = useUserProfile();
    const [formData, setFormData] = useState({ name: "", email: "", bio: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(formData);
            setFormData({ name: "", email: "", bio: "" });
        } catch (err) {
            console.error("Save profile error", err);
        }
    };

    const handleUpgradeSubscription = async () => {
        setIsSubscribing(true);
        try {
            const data = await createCheckoutSession();
            const checkoutUrl = data?.checkoutUrl || data?.data?.checkoutUrl;
            if (checkoutUrl) {
                showSuccess("Redirecting to Stripe checkout...");
                window.location.href = checkoutUrl;
            } else {
                showError("Could not retrieve checkout session URL");
            }
        } catch (err) {
            showError(err.message || "Failed to initiate Stripe checkout");
        } finally {
            setIsSubscribing(false);
        }
    };

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        if (tabId === "privacy") setIsPrivacyModalOpen(true);
    };

    const displayName = formData.name || profile?.name || "";
    const [c1, c2] = getGradient(displayName);
    const initials = displayName.slice(0, 2).toUpperCase() || "?";

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0b0f19] transition-colors duration-300">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* ── Sidebar ─────────────────────────────── */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
                            {/* Profile mini-card */}
                            <div className="px-5 pt-6 pb-5 border-b border-gray-50 dark:border-slate-800/80">
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-shrink-0">
                                        {profile?.profileImage ? (
                                            <img src={profile.profileImage} alt={displayName}
                                                className="w-11 h-11 rounded-2xl object-cover ring-2 ring-white dark:ring-slate-800 shadow-sm" />
                                        ) : (
                                            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-sm font-bold shadow-sm ring-2 ring-white dark:ring-slate-800"
                                                style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                                                {initials}
                                            </div>
                                        )}
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{profile?.name || "Your Name"}</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{profile?.email || ""}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Nav items */}
                            <div className="p-3 space-y-0.5">
                                {CATEGORIES.map((cat) => {
                                    const Icon = cat.icon;
                                    const isActive = activeTab === cat.id;
                                    return (
                                        <motion.button
                                            key={cat.id}
                                            whileHover={{ x: 2 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleTabClick(cat.id)}
                                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer text-left ${isActive
                                                ? "bg-primary-50 dark:bg-primary-900/25 text-primary-700 dark:text-primary-300"
                                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/60"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`flex-shrink-0 ${isActive ? "text-primary-600 dark:text-primary-400" : cat.color}`}>
                                                    <Icon className="w-4 h-4" />
                                                </span>
                                                <span className="truncate">{cat.name}</span>
                                            </div>
                                            <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isActive ? "rotate-90 text-primary-500" : "text-gray-300 dark:text-gray-600"}`} />
                                        </motion.button>
                                    );
                                })}

                                <div className="pt-2 mt-2 border-t border-gray-100 dark:border-slate-800">
                                    <motion.button
                                        whileHover={{ x: 2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={logout}
                                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors cursor-pointer"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Content area ────────────────────────── */}
                    <div className="flex-1 min-w-0">
                        <AnimatePresence mode="wait">

                            {/* PROFILE */}
                            {activeTab === "profile" && (
                                <SettingSection key="profile"
                                    title="Profile Settings"
                                    description="Update your personal details and bio information."
                                    icon={User}
                                    iconColor="from-primary-500 to-secondary-500"
                                >
                                    {/* Avatar preview */}
                                    <div className="flex items-center gap-4 mb-7 p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50">
                                        <div className="relative flex-shrink-0">
                                            {profile?.profileImage ? (
                                                <img src={profile.profileImage} alt={displayName}
                                                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white dark:ring-slate-800 shadow-md" />
                                            ) : (
                                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-md ring-2 ring-white dark:ring-slate-800"
                                                    style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                                                    {initials}
                                                </div>
                                            )}
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-xl bg-primary-600 flex items-center justify-center shadow-sm border-2 border-white dark:border-slate-800">
                                                <Camera className="w-3 h-3 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{profile?.name || "Your Name"}</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">To update your photo, go to <span className="text-primary-500 font-semibold cursor-pointer hover:underline">Edit Profile</span></p>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="mb-5 p-3.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-medium border border-rose-100 dark:border-rose-800/40">
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleSaveProfile} className="space-y-5">
                                        <Field label="Display Name" icon={User} name="name"
                                            value={formData.name || profile?.name || ""}
                                            onChange={handleChange} placeholder="Your name" />

                                        <Field label="Email Address" icon={Mail} type="email" name="email"
                                            value={formData.email || profile?.email || ""}
                                            onChange={handleChange} placeholder="you@example.com" />

                                        <Field label="Bio" icon={FileText} name="bio" textarea rows={3}
                                            value={formData.bio || profile?.bio || ""}
                                            onChange={handleChange} placeholder="Tell us about yourself…" />

                                        <div className="flex justify-end pt-1">
                                            <motion.button
                                                type="submit"
                                                disabled={saving}
                                                whileHover={!saving ? { scale: 1.02 } : {}}
                                                whileTap={!saving ? { scale: 0.97 } : {}}
                                                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white font-semibold text-sm shadow-lg shadow-primary-300/40 dark:shadow-primary-900/40 disabled:opacity-50 transition-all cursor-pointer disabled:cursor-not-allowed"
                                            >
                                                {saving ? (
                                                    <>
                                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                                                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                                                        Saving…
                                                    </>
                                                ) : (
                                                    <><Check className="w-4 h-4" /> Save Changes</>
                                                )}
                                            </motion.button>
                                        </div>
                                    </form>
                                </SettingSection>
                            )}

                            {/* SUBSCRIPTION */}
                            {activeTab === "subscription" && (
                                <SettingSection key="subscription"
                                    title="Pro Subscription"
                                    description="Unlock unlimited story archives, HD video streams, and advanced analytics."
                                    icon={Sparkles}
                                    iconColor="from-amber-400 to-orange-500"
                                >
                                    <div className="rounded-2xl border border-amber-100 dark:border-amber-800/30 bg-gradient-to-br from-amber-50/60 via-white to-orange-50/40 dark:from-amber-900/20 dark:via-slate-900 dark:to-orange-900/10 p-6">
                                        <div className="flex items-center justify-between mb-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-300/40">
                                                    <Star className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">Connecta Pro</h4>
                                                    <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">$9.99 / month</p>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full text-[11px] font-bold uppercase tracking-wider">
                                                Recommended
                                            </span>
                                        </div>

                                        <ul className="space-y-3 mb-6">
                                            {[
                                                "Unlimited HD Video Posts & 24hr Stories",
                                                "Advanced Custom Privacy Lists & Invisible Mode",
                                                "Priority Direct Message Delivery & Read Receipts",
                                                "Zero Ads & Custom Profile Badges",
                                            ].map((feat, i) => (
                                                <motion.li key={i}
                                                    initial={{ opacity: 0, x: -8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.07 }}
                                                    className="flex items-center gap-2.5 text-sm font-medium text-gray-700 dark:text-gray-300"
                                                >
                                                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                                                        <Check className="w-3 h-3" strokeWidth={2.5} />
                                                    </div>
                                                    {feat}
                                                </motion.li>
                                            ))}
                                        </ul>

                                        <motion.button
                                            whileHover={!isSubscribing ? { scale: 1.02 } : {}}
                                            whileTap={!isSubscribing ? { scale: 0.97 } : {}}
                                            type="button"
                                            onClick={handleUpgradeSubscription}
                                            disabled={isSubscribing}
                                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-lg shadow-amber-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                        >
                                            {isSubscribing ? (
                                                <>
                                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                                                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                                                    Opening Checkout…
                                                </>
                                            ) : (
                                                <><Zap className="w-4 h-4" /> Upgrade to Pro — $9.99/mo</>
                                            )}
                                        </motion.button>
                                    </div>
                                </SettingSection>
                            )}

                            {/* SECURITY */}
                            {activeTab === "security" && (
                                <SettingSection key="security"
                                    title="Security"
                                    description="Manage your password and account security settings."
                                    icon={Lock}
                                    iconColor="from-rose-500 to-red-600"
                                >
                                    <div className="space-y-5">
                                        <Field label="Current Password" type="password" name="currentPassword"
                                            value="" onChange={() => {}} placeholder="Enter current password" />
                                        <Field label="New Password" type="password" name="newPassword"
                                            value="" onChange={() => {}} placeholder="Enter new password" />
                                        <Field label="Confirm New Password" type="password" name="confirmPassword"
                                            value="" onChange={() => {}} placeholder="Confirm new password" />

                                        <div className="flex justify-end pt-1">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white font-semibold text-sm shadow-lg shadow-rose-300/40 dark:shadow-rose-900/30 cursor-pointer transition-all"
                                            >
                                                <Lock className="w-4 h-4" /> Update Password
                                            </motion.button>
                                        </div>
                                    </div>
                                </SettingSection>
                            )}

                            {/* NOTIFICATIONS */}
                            {activeTab === "notifications" && (
                                <SettingSection key="notifications"
                                    title="Notifications"
                                    description="Choose what updates you'd like to receive and how."
                                    icon={Bell}
                                    iconColor="from-violet-500 to-purple-600"
                                >
                                    <div className="space-y-0">
                                        <PrefRow
                                            icon={Mail} iconBg="bg-blue-50 dark:bg-blue-900/20 text-blue-500"
                                            title="Email Notifications"
                                            subtitle="Receive updates to your inbox"
                                            right={<Toggle enabled={notifs.email} onChange={() => setNotifs(p => ({ ...p, email: !p.email }))} />}
                                        />
                                        <PrefRow
                                            icon={Bell} iconBg="bg-violet-50 dark:bg-violet-900/20 text-violet-500"
                                            title="Push Notifications"
                                            subtitle="Get alerts on your device"
                                            right={<Toggle enabled={notifs.push} onChange={() => setNotifs(p => ({ ...p, push: !p.push }))} />}
                                        />
                                        <PrefRow
                                            icon={Zap} iconBg="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500"
                                            title="SMS Notifications"
                                            subtitle="Text messages for critical alerts"
                                            right={<Toggle enabled={notifs.sms} onChange={() => setNotifs(p => ({ ...p, sms: !p.sms }))} />}
                                        />
                                    </div>
                                </SettingSection>
                            )}

                            {/* PRIVACY */}
                            {activeTab === "privacy" && (
                                <SettingSection key="privacy"
                                    title="Privacy & Block Controls"
                                    description="Manage who can message you, view your posts, or block users."
                                    icon={Shield}
                                    iconColor="from-teal-500 to-emerald-600"
                                >
                                    <div className="rounded-2xl bg-teal-50/60 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-800/30 p-5 flex items-center justify-between gap-4">
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">Privacy & Block Manager</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Configure default post visibility, block list, and custom privacy lists.</p>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                            onClick={() => setIsPrivacyModalOpen(true)}
                                            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-teal-400/20 transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
                                        >
                                            Open Controls
                                        </motion.button>
                                    </div>
                                </SettingSection>
                            )}

                            {/* PREFERENCES */}
                            {activeTab === "preferences" && (
                                <SettingSection key="preferences"
                                    title="App Preferences"
                                    description="Customize appearance, language, and display settings."
                                    icon={Sun}
                                    iconColor="from-orange-400 to-amber-500"
                                >
                                    <PrefRow
                                        icon={isDark ? Moon : Sun}
                                        iconBg={isDark ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-400" : "bg-amber-50 dark:bg-amber-900/20 text-amber-500"}
                                        title="Dark Mode"
                                        subtitle={isDark ? "Currently using dark theme" : "Currently using light theme"}
                                        right={<Toggle enabled={isDark} onChange={toggleTheme} />}
                                    />
                                </SettingSection>
                            )}

                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <PrivacySettingsModal
                isOpen={isPrivacyModalOpen}
                onClose={() => setIsPrivacyModalOpen(false)}
            />
        </div>
    );
}
