"use client";

import type React from "react";

import { Loader2 } from "lucide-react";

interface FormButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

export default function FormButton({
  children,
  loading = false,
  disabled = false,
  type = "button",
  variant = "primary",
  onClick,
}: FormButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
        isPrimary ? "text-white" : ""
      }`}
      style={{
        backgroundColor: isPrimary
          ? "var(--primary-color)"
          : "var(--accent-color)",
        color: isPrimary ? "white" : "var(--text-color)",
        border: isPrimary ? "none" : "2px solid var(--border-color)",
      }}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
