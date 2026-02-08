import { useState } from "react";
import { Moon, Sun, Lock, User, Bell, Shield } from "lucide-react";
import Navbar from "./Navbar";

export default function Settings() {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    return (
        <>
            <Navbar />
            <div className="max-w-3xl mx-auto mt-4 mb-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 space-y-8">
                {/* Header */}
                <div className="border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Settings
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Manage your account preferences
                    </p>
                </div>

                {/* Profile Settings */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <User size={18} /> Profile Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="px-3 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="px-3 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                </section>

                {/* Account Settings */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <Lock size={18} /> Security
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="password"
                            placeholder="Current Password"
                            className="px-3 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            className="px-3 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <button className="text-primary-600 text-sm font-medium hover:underline">
                        Forgot Password?
                    </button>
                </section>

                {/* Preferences */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        {darkMode ? <Moon size={18} /> : <Sun size={18} />} Preferences
                    </h2>
                    <div className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700">
                        <span className="text-gray-700 dark:text-gray-300">
                            Enable Dark Mode
                        </span>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`relative w-12 h-6 flex items-center rounded-full transition ${darkMode ? "bg-primary-600" : "bg-gray-300"
                                }`}
                        >
                            <span
                                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition ${darkMode ? "translate-x-6" : "translate-x-1"
                                    }`}
                            ></span>
                        </button>
                    </div>
                </section>

                {/* Notifications */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <Bell size={18} /> Notifications
                    </h2>
                    <div className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700">
                        <span className="text-gray-700 dark:text-gray-300">
                            Email Notifications
                        </span>
                        <button
                            onClick={() => setNotifications(!notifications)}
                            className={`relative w-12 h-6 flex items-center rounded-full transition ${notifications ? "bg-blue-600" : "bg-gray-300"
                                }`}
                        >
                            <span
                                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition ${notifications ? "translate-x-6" : "translate-x-1"
                                    }`}
                            ></span>
                        </button>
                    </div>
                </section>

                {/* Privacy */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <Shield size={18} /> Privacy
                    </h2>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <p>• Who can see your profile: <span className="font-medium text-gray-900 dark:text-gray-100">Everyone</span></p>
                        <p>• Who can send you messages: <span className="font-medium text-gray-900 dark:text-gray-100">Friends only</span></p>
                    </div>
                    <button className="text-primary-600 text-sm font-medium hover:underline">
                        Manage Privacy Settings
                    </button>
                </section>

                {/* Save Button */}
                <div className="pt-6 border-t">
                    <button className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition">
                        Save Changes
                    </button>
                </div>
            </div>
        </>
    );
}
