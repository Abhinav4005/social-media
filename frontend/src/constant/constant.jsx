import React from "react";
import {
  Bookmark,
  CalendarDays,
  Home,
  Image,
  MessageSquare,
  Search,
  Settings,
  Store,
  User,
  UsersRound,
  Video,
} from "lucide-react";

export const BRAND_THEME = {
  // Brand color namespaces
  primary: "indigo",
  secondary: "purple", // maps to teal in theme.css/index.css
  
  // Clean backgrounds and borders (Supports dark mode)
  bgHeader: "bg-white dark:bg-slate-900",
  bgSidebar: "bg-white dark:bg-slate-900",
  borderLight: "border-gray-100 dark:border-slate-800",
  borderMedium: "border-gray-200 dark:border-slate-700",
  
  // Gradients for brand accents
  logoGradient: "bg-gradient-to-r from-indigo-600 to-purple-600", // Sleek brand gradient
  activeGradient: "bg-gradient-to-r from-indigo-500 to-purple-600",
  avatarGradient: "bg-gradient-to-br from-indigo-500 to-purple-600",
  
  // Text classes
  textPrimary: "text-indigo-600 dark:text-indigo-400",
  textPrimaryHover: "hover:text-indigo-600 dark:hover:text-indigo-400",
  textMuted: "text-gray-400 dark:text-gray-400",
  textDark: "text-gray-900 dark:text-gray-100",
  
  // Snappy hover highlights
  bgHoverLight: "hover:bg-indigo-50/60 dark:hover:bg-slate-800/80 hover:text-indigo-600 dark:hover:text-indigo-400",
  bgActiveLight: "bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300",
  bgInput: "bg-gray-50 dark:bg-slate-800/80",
  
  // Dynamic outline states
  focusBorder: "border-indigo-500",
  focusRing: "ring-2 ring-indigo-50 dark:ring-indigo-950",
  
  // Shadows (Modern soft shadow design)
  shadowSoft: "shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-none",
  shadowCard: "shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none",
  shadowActive: "shadow-xs shadow-indigo-100 dark:shadow-none",
};

export const mainItems = [
  { icon: <Home size={18} />, label: "Home", path: "/" },
  { icon: <UsersRound size={18} />, label: "Friends", path: "/friend-requests" },
  { icon: <UsersRound size={18} />, label: "Groups", path: "/groups" },
  { icon: <Store size={18} />, label: "Marketplace", path: "/marketplace" },
  { icon: <Video size={18} />, label: "Watch", path: "/watch" },
  { icon: <Bookmark size={18} />, label: "Saved", path: "/saved" },
  { icon: <CalendarDays size={18} />, label: "Events", path: "/events" },
  { icon: <User size={18} />, label: "Profile", path: "/profile" },
  { icon: <Settings size={18} />, label: "Settings", path: "/settings" },
];

export const shortcutItems = [
  { icon: <UsersRound size={18} />, label: "Creative Mind", path: "/groups" },
  { icon: <UsersRound size={18} />, label: "Design Community", path: "/groups" },
  { icon: <CalendarDays size={18} />, label: "Events 2024", path: "/events" },
];

export const menuItems = [
  { icon: <User size={20} />, label: "Profile", path: "/profile" },
  { icon: <Settings size={20} />, label: "Settings", path: "/settings" },
  { icon: <UsersRound size={20} />, label: "Friends", path: "/friend-requests" },
];