"use client";

import type React from "react";
import { useAppStore } from "@/app/store/appStore";
import { FindValueFromObj } from "@/app/utils/findProp";
import apiClient from "@/lib/api";
import type {
  reactionDisplayInfo,
  ReactionResponse,
} from "@/types/apiResponseTypes";
import type { ReactionOnType } from "@/types/reactionTypes";
import { Heart, ThumbsUp, Laugh, SmilePlus, Frown, Angry } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
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
  reactionOnId,
  reactionOnType,
}: ReactionPickerProps) {
  const userId = useAppStore((state) => state.user)?.userId;

  const [displayReactions, setDisplayReactions] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [mutableReactions, setMutableReactions] = useState(
    JSON.parse(JSON.stringify(reactions)) as reactionDisplayInfo
  );
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const breakdownRef = useRef<HTMLDivElement>(null);
  const pendingRequestRef = useRef<AbortController | null>(null);

  const reactionCount = mutableReactions.length;

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

  useEffect(() => {
    if (!userId) return;

    const userReactionData = FindValueFromObj(reactions, "reactorId", userId);
    setUserReaction(userReactionData?.reactionType as ReactionType | null);
    setMutableReactions(JSON.parse(JSON.stringify(reactions)));
  }, [reactions, userId]);

  const handleReactionClick = useCallback(
    async (
      reactionType: ReactionType,
      reactionOnId: string,
      reactionOnType: ReactionOnType
    ) => {
      if (!userId || isLoading) return;

      if (pendingRequestRef.current) {
        pendingRequestRef.current.abort();
      }

      setIsLoading(true);
      setDisplayReactions(false);

      const originalReactions = [...mutableReactions];
      const originalUserReaction = userReaction;

      const isRemovingReaction = userReaction === reactionType;
      const isChangingReaction = userReaction && userReaction !== reactionType;
      const isAddingReaction = !userReaction;

      try {
        if (isRemovingReaction) {
          setMutableReactions((prev) =>
            prev.filter((reaction) => reaction.reactorId !== userId)
          );
          setUserReaction(null);
        } else if (isChangingReaction) {
          setMutableReactions((prev) =>
            prev.map((reaction) =>
              reaction.reactorId === userId
                ? { ...reaction, reactionType }
                : reaction
            )
          );
          setUserReaction(reactionType);
        } else if (isAddingReaction) {
          const currentUser = useAppStore.getState().user;
          const optimisticReaction = {
            reactorId: userId,
            reactionType,
            profilePicture: currentUser?.profilePicture || "",
            username: currentUser?.username || "Unknown User",
          };
          setMutableReactions((prev) => [optimisticReaction, ...prev]);
          setUserReaction(reactionType);
        }

        const abortController = new AbortController();
        pendingRequestRef.current = abortController;

        const response = await apiClient.createReaction(
          reactionOnId,
          reactionOnType,
          reactionType
        );

        if (abortController.signal.aborted) {
          return;
        }

        pendingRequestRef.current = null;

        if (response.data) {
          const { action } = response.data;

          if (action === "deleted" && !isRemovingReaction) {
            setMutableReactions((prev) =>
              prev.filter((reaction) => reaction.reactorId !== userId)
            );
            setUserReaction(null);
          } else if (action === "updated" && !isChangingReaction) {
            const updateResponse = response.data as ReactionResponse;
            setMutableReactions((prev) =>
              prev.map((reaction) =>
                reaction.reactorId === userId
                  ? {
                      ...reaction,
                      reactionType: updateResponse.reactionType as ReactionType,
                    }
                  : reaction
              )
            );
            setUserReaction(updateResponse.reactionType as ReactionType);
          } else if (action === "created" && !isAddingReaction) {
            const createResponse = response.data as ReactionResponse;
            const currentUser = useAppStore.getState().user;
            const newReaction = {
              reactorId: userId,
              reactionType: createResponse.reactionType as ReactionType,
              profilePicture: currentUser?.profilePicture || "",
              username: currentUser?.username || "Unknown User",
            };
            setMutableReactions((prev) => {
              const withoutUserReaction = prev.filter(
                (reaction) => reaction.reactorId !== userId
              );
              return [newReaction, ...withoutUserReaction];
            });
            setUserReaction(createResponse.reactionType as ReactionType);
          }
        }
      } catch (error) {
        if (!pendingRequestRef.current?.signal.aborted) {
          console.error("Failed to update reaction:", error);

          setMutableReactions(originalReactions);
          setUserReaction(originalUserReaction);
        }
      } finally {
        setIsLoading(false);
        pendingRequestRef.current = null;
      }
    },
    [userId, userReaction, mutableReactions, isLoading]
  );

  const handleReactionButtonClick = useCallback(() => {
    if (reactionCount > 0) {
      setShowBreakdown(false);
      setDisplayReactions((prev) => !prev);
    } else {
      setDisplayReactions((prev) => !prev);
    }
  }, [reactionCount]);

  const handleCountClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (reactionCount > 0) {
        setDisplayReactions(false);
        setShowBreakdown((prev) => !prev);
      }
    },
    [reactionCount]
  );

  return (
    <div className="relative flex items-center gap-2" ref={containerRef}>
      <div className="flex items-center">
        <button
          onClick={handleReactionButtonClick}
          disabled={isLoading}
          className="flex items-center gap-1 px-3 py-1 rounded-l-full hover:bg-accent-color transition-colors duration-200 disabled:opacity-50"
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

        {reactionCount > 0 ? (
          <button
            onClick={handleCountClick}
            disabled={isLoading}
            className="px-2 py-1 rounded-r-full hover:bg-accent-color transition-colors duration-200 border-l border-[var(--border-color)] disabled:opacity-50"
            style={{ backgroundColor: "transparent" }}
            title="View reaction breakdown"
          >
            <span className="text-sm font-medium text-[var(--text-color)]">
              {reactionCount}
            </span>
          </button>
        ) : (
          <span className="px-2 py-1 text-sm text-[var(--muted-color)]">
            {reactionCount}
          </span>
        )}
      </div>

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
              onClick={() =>
                handleReactionClick(
                  key as ReactionType,
                  reactionOnId,
                  reactionOnType
                )
              }
              disabled={isLoading}
              className={`group relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-125 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 ${
                userReaction === key ? "bg-blue-100 dark:bg-blue-900" : ""
              }`}
              title={reaction.label}
            >
              <span
                className={`${!isLoading ? "group-hover:animate-bounce" : ""}`}
              >
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
            reactions={mutableReactions}
            onClose={() => setShowBreakdown(false)}
          />
        </div>
      )}
    </div>
  );
}
