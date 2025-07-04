"use client";

import Image from "next/image";

interface UserProps {
  id: string;
  username: string;
  picture?: string | null;
  size?: "sm" | "md" | "lg";
  showUsername?: boolean;
  onClick?: (userId: string) => void;
  className?: string;
}

export default function User({
  id,
  username,
  picture,
  size = "md",
  showUsername = true,
  onClick,
  className = "",
}: UserProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <div
      className={`flex items-center gap-3 ${
        onClick ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
      } ${className}`}
      onClick={handleClick}
    >
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0 border-0`}
        style={{ borderColor: "var(--border-color)" }}
      >
        {picture ? (
          <Image
            src={picture || "/placeholder.svg"}
            alt={username}
            width={size === "sm" ? 32 : size === "md" ? 48 : 64}
            height={size === "sm" ? 32 : size === "md" ? 48 : 64}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: "var(--primary-color)" }}
          >
            {username.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {showUsername && (
        <div className="flex-1 min-w-0">
          <p
            className={`font-medium truncate ${textSizes[size]}`}
            style={{ color: "var(--text-color)" }}
          >
            {username}
          </p>
        </div>
      )}
    </div>
  );
}
