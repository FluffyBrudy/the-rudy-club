"use client";

import type { reactionDisplayInfo } from "@/types/apiResponseTypes";
import {
  Heart,
  ThumbsUp,
  Laugh,
  SmilePlus,
  Frown,
  Angry,
  X,
} from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect } from "react";

type ReactionType = "heart" | "thumbup" | "funny" | "care" | "sad" | "angry";

const REACTION_ICONS: Record<ReactionType, ReactNode> = {
  heart: <Heart size={18} color="var(--primary-color)" />,
  thumbup: <ThumbsUp size={18} color="var(--primary-color)" />,
  funny: <Laugh size={18} color="orange" />,
  care: <SmilePlus size={18} color="var(--secondary-color)" />,
  sad: <Frown size={18} color="var(--muted-color)" />,
  angry: <Angry size={18} color="red" />,
};

const REACTION_LABELS: Record<ReactionType, string> = {
  heart: "Love",
  thumbup: "Like",
  funny: "Haha",
  care: "Care",
  sad: "Sad",
  angry: "Angry",
};

interface ReactionBreakdownProps {
  reactions: reactionDisplayInfo;
  onClose: () => void;
}

export default function ReactionBreakdown({
  reactions,
  onClose,
}: ReactionBreakdownProps) {
  const grouped = reactions.reduce((acc, reaction) => {
    const type = reaction.reactionType as ReactionType;
    if (!acc[type]) acc[type] = [];
    acc[type].push(reaction);
    return acc;
  }, {} as Record<ReactionType, reactionDisplayInfo>);

  const sortedTypes = (Object.keys(grouped) as ReactionType[]).sort(
    (a, b) => grouped[b].length - grouped[a].length
  );

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md mx-4 max-h-[80vh] bg-[var(--card-bg)] rounded-2xl shadow-2xl border border-[var(--border-color)] animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-[var(--border-color)] bg-gradient-to-r from-[var(--accent-color)]/20 to-transparent rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] flex items-center justify-center">
              <Heart size={16} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-[var(--text-color)]">
                Reactions
              </h2>
              <p className="text-sm text-[var(--muted-color)]">
                {reactions.length} people reacted
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--accent-color)] text-[var(--muted-color)] hover:text-[var(--text-color)] transition-all duration-200 hover:scale-110"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {sortedTypes.map((type) => (
            <div
              key={type}
              className="border-b border-[var(--border-color)]/30 last:border-b-0"
            >
              <div className="px-6 py-3 flex items-center justify-between bg-[var(--accent-color)]/10 sticky top-0 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--card-bg)] border-2 border-[var(--border-color)] flex items-center justify-center">
                    {REACTION_ICONS[type]}
                  </div>
                  <span className="font-semibold text-[var(--text-color)]">
                    {REACTION_LABELS[type]}
                  </span>
                </div>
                <span className="text-sm px-3 py-1 rounded-full bg-[var(--primary-color)]/20 text-[var(--primary-color)] font-medium">
                  {grouped[type].length}
                </span>
              </div>

              <div className="divide-y divide-[var(--border-color)]/20">
                {grouped[type].map((reaction, userIndex) => (
                  <div
                    key={`${reaction.reactorId}-${userIndex}`}
                    className="px-6 py-4 flex items-center gap-4 hover:bg-[var(--accent-color)]/30 transition-all duration-200 group"
                  >
                    <div className="relative">
                      <Image
                        src={reaction.profilePicture || "/placeholder.svg"}
                        alt={reaction.username}
                        width={40}
                        height={40}
                        className="rounded-full ring-2 ring-[var(--border-color)] group-hover:ring-[var(--primary-color)]/50 transition-all duration-200"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[var(--card-bg)] border-2 border-[var(--border-color)] flex items-center justify-center">
                        <div className="w-3 h-3 flex items-center justify-center scale-75">
                          {REACTION_ICONS[type]}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[var(--text-color)] font-medium truncate">
                        {reaction.username}
                      </h3>
                      <p className="text-sm text-[var(--muted-color)]">
                        Reacted with {REACTION_LABELS[type].toLowerCase()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-[var(--border-color)] bg-[var(--accent-color)]/5 rounded-b-2xl">
          <div className="flex items-center justify-center gap-2 text-sm text-[var(--muted-color)]">
            <div className="flex -space-x-1">
              {sortedTypes.slice(0, 3).map((type) => (
                <div
                  key={type}
                  className="w-6 h-6 rounded-full bg-[var(--card-bg)] border-2 border-[var(--border-color)] flex items-center justify-center"
                >
                  <div className="scale-75">{REACTION_ICONS[type]}</div>
                </div>
              ))}
            </div>
            <span>
              {sortedTypes.length} reaction type
              {sortedTypes.length !== 1 ? "s" : ""} • {reactions.length} total
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
