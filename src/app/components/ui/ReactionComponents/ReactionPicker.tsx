"use client";

import type React from "react";

import { useAppStore } from "@/app/store/appStore";
import { FindValueFromObj } from "@/app/utils/findProp";
import apiClient from "@/lib/api";
import type {
  reactionDisplayInfo,
  UndoReactionResponse,
} from "@/types/apiResponseTypes";
import type { ReactionOnType } from "@/types/reactionTypes";
import { Heart, ThumbsUp, Laugh, SmilePlus, Frown, Angry } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ReactionBreakdown from "./ReactionBreakdown";

type ReactionType = keyof typeof REACTION_TYPES;

interface ReactionPickerProps {
  reactionOnId: string;
  reactionOnType: ReactionOnType;
  reactions: reactionDisplayInfo;
  initialReactionCount: number;
}

const REACTION_TYPES = {
  heart: {
    emoji: <Heart size={20} color="var(--primary-color)" />,
    label: "Love",
  },
  thumbup: {
    emoji: <ThumbsUp size={20} color="var(--primary-color)" />,
    label: "Like",
  },
  funny: { emoji: <Laugh size={20} color="orange" />, label: "Haha" },
  care: {
    emoji: <SmilePlus size={20} color="var(--secondary-color)" />,
    label: "Care",
  },
  sad: { emoji: <Frown size={20} color="var(--muted-color)" />, label: "Sad" },
  angry: { emoji: <Angry size={20} color="red" />, label: "Angry" },
} as const;

export default function ReactionPicker({
  reactions,
  initialReactionCount,
  reactionOnId,
  reactionOnType,
}: ReactionPickerProps) {
  const userId = useAppStore((state) => state.user)?.userId;

  const userReactedIcon = FindValueFromObj(reactions, "reactorId", userId!)
    ?.reactionType as ReactionType | null;

  const [displayReactions, setDisplayReactions] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(
    userReactedIcon
  );
  const [reactionCount, setReactionCount] = useState(initialReactionCount);
  const containerRef = useRef<HTMLDivElement>(null);
  const breakdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        breakdownRef.current &&
        !breakdownRef.current.contains(e.target as Node)
      ) {
        setDisplayReactions(false);
        setShowBreakdown(false);
      }
    };
    document.addEventListener("mousedown", closeOnClickOutside);
    return () => document.removeEventListener("mousedown", closeOnClickOutside);
  }, []);

  const handleReactionClick = async (reactionType: ReactionType) => {
    try {
      const response = await apiClient.createReaction(
        reactionOnId,
        reactionOnType,
        reactionType
      );
      if (response.data) {
        const isUndo = (response.data as UndoReactionResponse).undo;
        const newCount = isUndo
          ? Math.max(0, reactionCount - 1)
          : reactionCount + 1;

        setUserReaction(isUndo ? null : reactionType);
        setReactionCount(newCount);
      }
    } catch (error) {
      console.error(error);
    }
    setDisplayReactions(false);
  };

  const handleReactionButtonClick = () => {
    if (reactionCount > 0) {
      setShowBreakdown(false);
      setDisplayReactions((prev) => !prev);
    } else {
      setDisplayReactions((prev) => !prev);
    }
  };

  const handleCountClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (reactionCount > 0) {
      setDisplayReactions(false);
      setShowBreakdown((prev) => !prev);
    }
  };

  return (
    <div className="relative flex items-center gap-2" ref={containerRef}>
      <div className="flex items-center">
        <button
          onClick={handleReactionButtonClick}
          className="flex items-center gap-1 px-3 py-1 rounded-l-full hover:bg-accent-color transition-colors duration-200"
          style={{ backgroundColor: "transparent" }}
        >
          {userReaction ? (
            <span className="text-xl">
              {REACTION_TYPES[userReaction].emoji}
            </span>
          ) : (
            <Heart size={18} style={{ color: "var(--muted-color)" }} />
          )}
        </button>

        {reactionCount > 0 && (
          <button
            onClick={handleCountClick}
            className="px-2 py-1 rounded-r-full hover:bg-accent-color transition-colors duration-200 border-l border-[var(--border-color)]"
            style={{ backgroundColor: "transparent" }}
            title="View reaction breakdown"
          >
            <span className="text-sm font-medium text-[var(--text-color)]">
              {reactionCount}
            </span>
          </button>
        )}

        {reactionCount === 0 && (
          <span className="px-2 py-1 text-sm text-[var(--muted-color)]">
            {reactionCount}
          </span>
        )}
      </div>

      {/* Reaction Picker Dropdown */}
      {displayReactions && (
        <div
          className="absolute z-20 -left-[50px] -top-[50px] p-2 rounded-xl border shadow-lg bg-[var(--card-bg)] flex gap-2"
          style={{
            borderColor: "var(--border-color)",
          }}
        >
          {Object.entries(REACTION_TYPES).map(([key, reaction]) => (
            <button
              key={key}
              onClick={() => handleReactionClick(key as ReactionType)}
              className="group relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-125 active:scale-95"
              title={reaction.label}
            >
              <span className="group-hover:animate-bounce">
                {reaction.emoji}
              </span>
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs px-2 py-1 bg-black/70 text-white rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                {reaction.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Reaction Breakdown Popup */}
      {showBreakdown && reactionCount > 0 && (
        <div ref={breakdownRef}>
          <ReactionBreakdown
            reactions={reactions}
            onClose={() => setShowBreakdown(false)}
          />
        </div>
      )}
    </div>
  );
}
