"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
}

export default function FormInput({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  error,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium transition-colors duration-200"
        style={{
          color: focused ? "var(--primary-color)" : "var(--text-color)",
        }}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={inputType}
          name={name}
          id={name}
          required={required}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
            error
              ? "border-red-500 focus:ring-red-500/20"
              : "focus:ring-opacity-20"
          }`}
          style={{
            backgroundColor: "var(--input-bg)",
            border: `2px solid ${error ? "#ef4444" : "var(--input-border)"}`,
            color: "var(--text-color)",
          }}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md transition-colors duration-200"
            style={{ color: "var(--muted-color)" }}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  );
}
