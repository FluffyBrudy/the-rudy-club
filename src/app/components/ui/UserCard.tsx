"use client";

import { MessageCircle, UserPlus } from "lucide-react";
import User from "./User";

interface UserCardProps {
  id: string;
  username: string;
  picture?: string | null;
  onUserClick?: (userId: string) => void;
  onMessageClick?: (userId: string) => void;
  onAddFriendClick?: (userId: string) => void;
  showActions?: boolean;
}

export default function UserCard({
  id,
  username,
  picture,
  onUserClick,
  onMessageClick,
  onAddFriendClick,
  showActions = true,
}: UserCardProps) {
  const profileTooltip = "Click to view profile";

  return (
    <div
      className="p-4 rounded-xl border transition-all duration-200 hover:shadow-md"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex-1 rounded-lg transition-colors duration-200 ${
            onUserClick ? "hover:bg-[var(--accent-color)] cursor-pointer" : ""
          }`}
          onClick={onUserClick ? () => onUserClick(id) : undefined}
          title={onUserClick ? profileTooltip : undefined}
          tabIndex={onUserClick ? 0 : undefined}
          role={onUserClick ? "button" : undefined}
          onKeyDown={
            onUserClick
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onUserClick(id);
                  }
                }
              : undefined
          }
          aria-label={onUserClick ? profileTooltip : undefined}
        >
          <User
            id={id}
            username={username}
            picture={picture}
            size="md"
            className="w-full"
          />
        </div>

        {showActions && (
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => onMessageClick?.(id)}
              className="p-2 rounded-lg transition-colors duration-200 hover:bg-opacity-80"
              style={{ backgroundColor: "var(--accent-color)" }}
              aria-label="Send message"
            >
              <MessageCircle
                className="h-4 w-4"
                style={{ color: "var(--muted-color)" }}
              />
            </button>

            {onAddFriendClick && (
              <button
                onClick={() => onAddFriendClick(id)}
                className="p-2 rounded-lg transition-colors duration-200 hover:bg-opacity-80"
                style={{ backgroundColor: "var(--primary-color)" }}
                aria-label="Add friend"
              >
                <UserPlus className="h-4 w-4 text-white" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
