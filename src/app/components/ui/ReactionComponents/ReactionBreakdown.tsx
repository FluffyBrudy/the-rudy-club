import { reactionDisplayInfo } from "@/types/apiResponseTypes";
import { Heart, ThumbsUp, Laugh, SmilePlus, Frown, Angry } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";

type ReactionType = "heart" | "thumbup" | "funny" | "care" | "sad" | "angry";

const REACTION_ICONS: Record<ReactionType, ReactNode> = {
  heart: <Heart size={16} color="var(--primary-color)" />,
  thumbup: <ThumbsUp size={16} color="var(--primary-color)" />,
  funny: <Laugh size={16} color="orange" />,
  care: <SmilePlus size={16} color="var(--secondary-color)" />,
  sad: <Frown size={16} color="var(--muted-color)" />,
  angry: <Angry size={16} color="red" />,
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

  const sortedTypes = Object.keys(grouped) as ReactionType[];

  return (
    <div className="absolute z-30 top-full left-0 mt-2 w-72 max-h-96 overflow-y-auto rounded-lg shadow-lg border bg-[var(--card-bg)] border-[var(--border-color)] text-sm">
      <div className="flex justify-between items-center px-3 py-2 border-b border-[var(--border-color)]">
        <span className="font-semibold text-[var(--text-color)]">
          Reactions
        </span>
        <button
          onClick={onClose}
          className="text-[var(--muted-color)] hover:text-[var(--text-color)]"
        >
          ✕
        </button>
      </div>

      {sortedTypes.map((type) => (
        <div key={type}>
          <div className="px-3 py-1 flex items-center gap-2 border-b border-[var(--border-color)] bg-[var(--accent-color)]">
            {REACTION_ICONS[type]}
            <span className="capitalize text-[var(--text-color)]">
              {type} ({grouped[type].length})
            </span>
          </div>
          {grouped[type].map((r) => (
            <div
              key={r.reactorTd}
              className="px-3 py-2 flex items-center gap-2 hover:bg-[var(--accent-color)] transition"
            >
              <Image
                src={r.profilePicture}
                alt={r.username}
                width={8}
                height={8}
              />
              <span className="text-[var(--text-color)] truncate">
                {r.username}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
