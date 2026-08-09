import React from "react";
import {
  Bookmark,
  CalendarDays,
  Home,
  MessageSquare,
  Settings,
  Store,
  User,
  UsersRound,
  Video,
} from "lucide-react";
import { ROUTES } from "./routes";

export const BRAND_THEME = {
  primary: "primary",
  secondary: "secondary",

  bgHeader: "bg-white dark:bg-slate-900",
  bgSidebar: "bg-white dark:bg-slate-900",
  borderLight: "border-gray-100 dark:border-slate-800",
  borderMedium: "border-gray-200 dark:border-slate-700",

  // Gradients for brand accents
  logoGradient: "bg-gradient-to-r from-primary-600 to-secondary-600",
  activeGradient: "bg-gradient-to-r from-primary-500 to-secondary-600",
  avatarGradient: "bg-gradient-to-br from-primary-500 to-secondary-600",

  // Text classes
  textPrimary: "text-primary-600 dark:text-primary-400",
  textPrimaryHover: "hover:text-primary-600 dark:hover:text-primary-400",
  textMuted: "text-gray-400 dark:text-gray-400",
  textDark: "text-gray-900 dark:text-gray-100",

  // Snappy hover highlights
  bgHoverLight: "hover:bg-primary-50/60 dark:hover:bg-slate-800/80 hover:text-primary-600 dark:hover:text-primary-400",
  bgActiveLight: "bg-primary-50/70 dark:bg-primary-950/40 text-primary-600 dark:text-primary-300",
  bgInput: "bg-gray-50 dark:bg-slate-800/80",

  // Dynamic outline states
  focusBorder: "border-primary-500",
  focusRing: "ring-2 ring-primary-50 dark:ring-primary-950",

  // Shadows
  shadowSoft: "shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-none",
  shadowCard: "shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none",
  shadowActive: "shadow-xs shadow-primary-100 dark:shadow-none",
};

export const mainItems = [
  { icon: <Home size={18} />, label: "Home", path: ROUTES.HOME },
  { icon: <UsersRound size={18} />, label: "Friends", path: ROUTES.FRIEND_REQUESTS },
  { icon: <UsersRound size={18} />, label: "Groups", path: ROUTES.GROUPS },
  { icon: <Store size={18} />, label: "Marketplace", path: ROUTES.MARKETPLACE },
  { icon: <Video size={18} />, label: "Watch", path: ROUTES.WATCH },
  { icon: <Bookmark size={18} />, label: "Saved", path: ROUTES.SAVED },
  { icon: <CalendarDays size={18} />, label: "Events", path: ROUTES.EVENTS },
  { icon: <User size={18} />, label: "Profile", path: ROUTES.PROFILE },
  { icon: <Settings size={18} />, label: "Settings", path: ROUTES.SETTINGS },
];

export const shortcutItems = [
  { icon: <UsersRound size={18} />, label: "Creative Mind", path: ROUTES.GROUPS },
  { icon: <UsersRound size={18} />, label: "Design Community", path: ROUTES.GROUPS },
  { icon: <CalendarDays size={18} />, label: "Events 2026", path: ROUTES.EVENTS },
];

export const menuItems = [
  { icon: <User size={20} />, label: "Profile", path: ROUTES.PROFILE },
  { icon: <Settings size={20} />, label: "Settings", path: ROUTES.SETTINGS },
  { icon: <UsersRound size={20} />, label: "Friends", path: ROUTES.FRIEND_REQUESTS },
];