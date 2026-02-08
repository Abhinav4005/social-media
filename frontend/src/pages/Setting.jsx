import { useState } from "react";
import {
    Moon, Sun, Lock, User, Bell, Shield,
    ChevronRight, Mail, Eye, Globe,
    Trash2, LogOut, CreditCard, HelpCircle
} from "lucide-react";
import Navbar from "./Navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function Settings() {
    const [activeTab, setActiveTab] = useState("profile");
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false
    });

    const categories = [
        { id: "profile", name: "Profile", icon: <User className="w-5 h-5" />, color: "text-blue-500" },
        { id: "security", name: "Security", icon: <Lock className="w-5 h-5" />, color: "text-red-500" },
        { id: "notifications", name: "Notifications", icon: <Bell className="w-5 h-5" />, color: "text-amber-500" },
        { id: "privacy", name: "Privacy", icon: <Shield className="w-5 h-5" />, color: "text-green-500" },
        { id: "preferences", name: "Preferences", icon: <Sun className="w-5 h-5" />, color: "text-indigo-500" },
    ];

    const Toggle = ({ enabled, onChange }) => (
        <button
            onClick={onChange}
            className={`relative w-12 h-6 flex items-center rounded-full transition-all duration-300 shadow-inner ${enabled ? "bg-primary-600" : "bg-gray-200"
                }`}
        >
            <motion.span
                initial={false}
                animate={{ x: enabled ? 24 : 4 }}
                className="w-4 h-4 bg-white rounded-full shadow-lg"
            />
        </button>
    );

    const SettingSection = ({ title, description, children }) => (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
        >
            <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{description}</p>
            </div>
            <div className="space-y-6">
                {children}
            </div>
        </motion.div>
    );

    const InputGroup = ({ label, icon, ...props }) => (
        <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">{label}</label>
            <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-primary-500 transition-colors">
                    {icon}
                </div>
                <input
                    {...props}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-100 focus:ring-4 focus:ring-primary-50/50 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="max-w-7xl mx-auto w-full p-6 md:p-10 flex-1 flex flex-col md:flex-row gap-10">
                {/* Sidebar Navigation */}
                <aside className="md:w-72 shrink-0">
                    <div className="sticky top-28 bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
                        <h2 className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                            Settings Menu
                        </h2>
                        <nav className="space-y-1">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveTab(cat.id)}
                                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all group ${activeTab === cat.id
                                            ? "bg-primary-50 text-primary-600 shadow-sm"
                                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`p-2 rounded-xl transition-colors ${activeTab === cat.id ? "bg-white text-primary-600" : "bg-gray-100 text-gray-400 group-hover:bg-white"
                                            }`}>
                                            {cat.icon}
                                        </span>
                                        <span className="font-bold text-sm tracking-tight">{cat.name}</span>
                                    </div>
                                    {activeTab === cat.id && (
                                        <motion.div layoutId="activeDot" className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                                    )}
                                </button>
                            ))}
                        </nav>

                        <div className="mt-8 pt-8 border-t border-gray-50">
                            <button className="w-full flex items-center gap-3 p-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm">
                                <span className="p-2 rounded-xl bg-red-50">
                                    <LogOut className="w-5 h-5" />
                                </span>
                                Log Out
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Content Area */}
                <div className="flex-1">
                    <AnimatePresence mode="wait">
                        {activeTab === "profile" && (
                            <SettingSection
                                key="profile"
                                title="Profile Information"
                                description="Update your personal details and how others see you on the platform."
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputGroup label="Full Name" icon={<User className="w-5 h-5" />} placeholder="Abhinav" />
                                    <InputGroup label="Email Address" icon={<Mail className="w-5 h-5" />} placeholder="abhinav@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">About Bio</label>
                                    <textarea
                                        className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-100 focus:ring-4 focus:ring-primary-50/50 transition-all font-medium text-gray-900 placeholder:text-gray-400 min-h-[120px]"
                                        placeholder="Tell the world about yourself..."
                                    />
                                </div>
                            </SettingSection>
                        )}

                        {activeTab === "security" && (
                            <SettingSection
                                key="security"
                                title="Security Settings"
                                description="Manage your password and account security preferences."
                            >
                                <div className="space-y-6">
                                    <InputGroup label="Current Password" icon={<Lock className="w-5 h-5" />} type="password" placeholder="••••••••" />
                                    <InputGroup label="New Password" icon={<Lock className="w-5 h-5" />} type="password" placeholder="••••••••" />
                                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                                        <div>
                                            <h4 className="font-bold text-red-900 text-sm">Two-Factor Authentication</h4>
                                            <p className="text-xs text-red-600">Secure your account with 2FA for extra safety.</p>
                                        </div>
                                        <button className="px-4 py-2 bg-white text-red-600 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all">
                                            Enable
                                        </button>
                                    </div>
                                </div>
                            </SettingSection>
                        )}

                        {activeTab === "notifications" && (
                            <SettingSection
                                key="notifications"
                                title="Notification Preferences"
                                description="Choose what updates you want to receive and where."
                            >
                                <div className="space-y-4">
                                    {[
                                        { id: 'email', name: 'Email Notifications', desc: 'Get updates about your activity via email.' },
                                        { id: 'push', name: 'Push Notifications', desc: 'Receive instant alerts on your device.' },
                                        { id: 'sms', name: 'SMS Notifications', desc: 'Alerts sent directly to your phone number.' },
                                    ].map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl">
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                                                <p className="text-xs text-gray-500">{item.desc}</p>
                                            </div>
                                            <Toggle
                                                enabled={notifications[item.id]}
                                                onChange={() => setNotifications({ ...notifications, [item.id]: !notifications[item.id] })}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </SettingSection>
                        )}

                        {activeTab === "privacy" && (
                            <SettingSection
                                key="privacy"
                                title="Privacy Control"
                                description="Manage who can see your profile and interact with you."
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                                <Globe className="w-5 h-5 text-primary-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm">Private Account</h4>
                                                <p className="text-xs text-gray-500">Only people you approve can see your posts.</p>
                                            </div>
                                        </div>
                                        <Toggle enabled={false} />
                                    </div>
                                    <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                                <Eye className="w-5 h-5 text-primary-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm">Profile Visibility</h4>
                                                <p className="text-xs text-gray-500">Show your profile in search results.</p>
                                            </div>
                                        </div>
                                        <Toggle enabled={true} />
                                    </div>
                                </div>
                            </SettingSection>
                        )}

                        {activeTab === "preferences" && (
                            <SettingSection
                                key="preferences"
                                title="App Preferences"
                                description="Customize your experience with theme and display options."
                            >
                                <div className="flex items-center justify-between p-6 bg-gray-900 rounded-3xl shadow-xl shadow-gray-200">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gray-800 rounded-xl">
                                            {darkMode ? <Moon className="w-6 h-6 text-indigo-400" /> : <Sun className="w-6 h-6 text-amber-400" />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-base">Dark Mode</h4>
                                            <p className="text-xs text-gray-400 font-medium">Switch to a darker interface to reduce eye strain.</p>
                                        </div>
                                    </div>
                                    <Toggle enabled={darkMode} onChange={() => setDarkMode(!darkMode)} />
                                </div>
                            </SettingSection>
                        )}
                    </AnimatePresence>

                    {/* Action Footer */}
                    <div className="mt-10 flex items-center justify-end gap-4">
                        <button className="px-8 py-3.5 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                            Cancel
                        </button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-10 py-3.5 bg-primary-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all"
                        >
                            Save Changes
                        </motion.button>
                    </div>
                </div>
            </main>
        </div>
    );
}
