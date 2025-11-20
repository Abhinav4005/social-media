import React from "react";
import clsx from "clsx";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "solid",
  color = "blue",
  className = "",
  disabled = false,
}) {
  const baseStyle =
    "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed";

  const sizeStyles = {
    solid: "px-4 py-2 text-sm",
    outline: "px-4 py-2 text-sm",
    ghost: "px-3 py-2 text-sm",
    icon: "p-2",
  };

  const colorStyles = {
    blue: {
      solid: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400",
      outline:
        "border border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-300",
      ghost: "text-blue-500 hover:bg-blue-50 focus:ring-blue-200",
      icon: "text-blue-500 hover:bg-blue-100 focus:ring-blue-200",
    },
    gray: {
      solid: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-400",
      outline:
        "border border-gray-500 text-gray-700 hover:bg-gray-50 focus:ring-gray-300",
      ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-200",
      icon: "text-gray-600",
    },
    white: {
      solid:
        "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 focus:ring-gray-200",
      outline:
        "border border-gray-300 text-gray-800 hover:bg-gray-50 focus:ring-gray-200",
      ghost: "text-gray-800 hover:bg-gray-100 focus:ring-gray-200",
      icon: "text-gray-700 hover:bg-gray-100 border border-gray-300 focus:ring-gray-200",
    },
    black: {
      solid: "bg-black text-white hover:bg-gray-900 focus:ring-gray-500",
      outline:
        "border border-black text-black hover:bg-gray-100 focus:ring-gray-300",
      ghost: "text-black hover:bg-gray-200 focus:ring-gray-200",
      icon: "text-black hover:bg-gray-200 focus:ring-gray-300",
    },
    red: {
      solid: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
      outline:
        "border border-red-500 text-red-500 hover:bg-red-50 focus:ring-red-300",
      ghost: "text-red-500 hover:bg-red-50 focus:ring-red-200",
      icon: "text-red-500 hover:bg-red-100 focus:ring-red-200",
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        baseStyle,
        sizeStyles[variant],
        colorStyles[color][variant],
        className
      )}
    >
      {children}
    </button>
  );
}