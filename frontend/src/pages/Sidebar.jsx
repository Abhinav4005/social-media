import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChevronDown } from "lucide-react";
import { BRAND_THEME, mainItems, shortcutItems } from "../constant/constant";
import UserAvatar from "../components/Common/UserAvatar";
import { ROUTES } from "../constant/routes";

function NavItem({ item, active }) {
  return (
    <div className="w-full">
      <Link
        to={item.path}
        className={`relative flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-bold transition-all duration-150 ${
          active
            ? "border border-primary-100 dark:border-primary-900/50 bg-primary-50/70 dark:bg-primary-950/40 text-primary-650 dark:text-primary-300 shadow-xs shadow-primary-50/50 dark:shadow-none"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50/80 dark:hover:bg-slate-800/80 hover:text-primary-650 dark:hover:text-primary-400"
        }`}
      >
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-150 ${
            active
              ? "bg-white dark:bg-slate-800 border-primary-100 dark:border-primary-900/50 text-primary-650 dark:text-primary-300 shadow-xs"
              : "bg-gray-50 dark:bg-slate-800/50 border-gray-100 dark:border-slate-800 text-gray-400 dark:text-gray-400 group-hover:bg-white dark:group-hover:bg-slate-800"
          }`}
        >
          {item.icon}
        </span>

        <span className="tracking-tight">{item.label}</span>
      </Link>
    </div>
  );
}

export default function Sidebar() {
  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.auth);

  return (
    <aside
      className="
        sticky
        top-[88px]
        h-[calc(100vh-112px)]
        overflow-y-auto
        scrollbar-hide
        rounded-2xl
        border
        border-gray-100
        dark:border-slate-800
        bg-white
        dark:bg-slate-900
        p-4
        shadow-[0_2px_12px_rgba(0,0,0,0.02)]
        dark:shadow-none
        transition-colors
        duration-200
      "
    >
      {/* Dynamic User Profile Card */}
      <Link
        to={ROUTES.PROFILE}
        className="
          flex
          mb-5
          rounded-2xl
          border
          border-gray-100
          dark:border-slate-800
          bg-gray-50/30
          dark:bg-slate-800/40
          p-3
          hover:bg-gray-50
          dark:hover:bg-slate-800
          hover:border-gray-200
          dark:hover:border-slate-700
          transition-all
          duration-150
          cursor-pointer
        "
      >
        <div className="flex items-center gap-3">
          <UserAvatar
            name={user?.name}
            profileImage={user?.profileImage}
            size="sm"
            shape="rounded"
            ring="ring-1.5 ring-white dark:ring-slate-800 shadow-xs"
          />

          <div className="min-w-0">
            <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100 truncate">
              {user?.name || "User"}
            </h3>

            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-400 truncate">
              {user?.bio || "Software Engineer"}
            </p>
          </div>
        </div>
      </Link>

      {/* Main Navigation */}
      <nav className="space-y-1">
        {mainItems.map((item) => (
          <NavItem
            key={item.label}
            item={item}
            active={pathname === item.path}
          />
        ))}
      </nav>

      <div className="my-4 border-t border-gray-100 dark:border-slate-800" />

      {/* Communities */}
      <div>
        <p
          className="
            mb-2.5
            px-3
            text-[9px]
            font-bold
            uppercase
            tracking-[0.2em]
            text-gray-400
            dark:text-gray-400
          "
        >
          Communities
        </p>

        <nav className="space-y-1">
          {shortcutItems.map((item) => (
            <NavItem
              key={item.label}
              item={item}
              active={pathname === item.path}
            />
          ))}

          <button
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-2
              text-[13px]
              font-bold
              text-gray-600
              dark:text-gray-400
              transition-all
              hover:bg-gray-50
              dark:hover:bg-slate-800
              hover:text-indigo-650
              dark:hover:text-indigo-400
            "
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-gray-400">
              <ChevronDown size={14} />
            </span>

            See More
          </button>
        </nav>
      </div>
    </aside>
  );
}