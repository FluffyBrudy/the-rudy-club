"use client";

import { useAppStore } from "@/app/store/appStore";
import apiClient from "@/lib/api";
import {
  reactionDisplayInfo,
  UndoReactionResponse,
} from "@/types/apiResponseTypes";
import { ReactionOnType } from "@/types/reactionTypes";
import { Heart, ThumbsUp, Laugh, SmilePlus, Frown, Angry } from "lucide-react";
import { useState, useRef, useEffect } from "react";

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
  const user = useAppStore((state) => state.user);
  const userReactedIcon =
    (reactions.find((val) => val.reactorTd === user?.userId)
      ?.reactionType as unknown as ReactionType | null) ?? null;
  console.log(userReactedIcon, user, reactions);
  const [displayReactions, setDisplayReactions] = useState(false);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(
    userReactedIcon
  );
  const [reactionCount, setReactionCount] = useState(initialReactionCount);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setDisplayReactions(false);
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

  return (
    <div className="relative flex items-center gap-2" ref={containerRef}>
      <button
        onClick={() => setDisplayReactions((prev) => !prev)}
        className="flex items-center gap-1 px-3 py-1 rounded-full hover:bg-accent-color transition-colors duration-200"
        style={{ backgroundColor: "transparent" }}
      >
        {userReaction ? (
          <span className="text-xl">{REACTION_TYPES[userReaction].emoji}</span>
        ) : (
          <Heart size={18} style={{ color: "var(--muted-color)" }} />
        )}
        <span className="text-sm">{reactionCount}</span>
      </button>

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
    </div>
  );
}
