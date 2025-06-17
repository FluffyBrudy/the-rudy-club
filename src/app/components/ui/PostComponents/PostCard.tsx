"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Repeat2,
} from "lucide-react";
import { PostResponse } from "@/types/apiResponseTypes";
import Image from "next/image";

interface PostCardProps {
  post: PostResponse;
}

export default function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.totalReaction || 0);
  const [showOptions, setShowOptions] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setLiked(!liked);
  };

  const formattedDate = post.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    : "recently";

  return (
    <div
      className="p-5 rounded-xl mb-4 transition-all duration-200 hover:shadow-md"
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <div className="w-10 h-10 rounded-full overflow-hidden relative">
            {post.profilePicture ? (
              <Image
                src={post.profilePicture || "/placeholder.svg"}
                alt={post.username}
                width={48}
                height={48}
                className="object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: "var(--primary-color)" }}
              >
                {post.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">{post.username}</span>
              <span
                className="text-xs ml-2"
                style={{ color: "var(--muted-color)" }}
              >
                {formattedDate}
              </span>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="p-2 rounded-full hover:bg-accent/50 transition-colors duration-200"
              >
                <MoreHorizontal
                  size={18}
                  style={{ color: "var(--muted-color)" }}
                />
              </button>

              {showOptions && (
                <div
                  className="absolute right-0 mt-1 py-2 w-48 rounded-lg shadow-lg z-10"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-accent/50 transition-colors duration-200"
                    onClick={() => setShowOptions(false)}
                  >
                    Report post
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-accent/50 transition-colors duration-200"
                    onClick={() => setShowOptions(false)}
                  >
                    Hide post
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-2">
            {post.content.textContent && (
              <p className="mb-3 whitespace-pre-wrap">
                {post.content.textContent}
              </p>
            )}

            {post.content.mediaContent &&
              post.content.mediaContent.length > 0 && (
                <div className="mt-3 rounded-xl overflow-hidden">
                  {post.content.mediaContent.map((media, index) => (
                    <div key={index} className="relative w-full h-64">
                      <Image
                        src={media || "/placeholder.svg"}
                        alt={`Media content ${index + 1}`}
                        className="object-cover"
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  ))}
                </div>
              )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 p-2 rounded-full transition-colors duration-200 ${
                liked ? "text-red-500" : ""
              } hover:bg-accent/50`}
            >
              <Heart
                size={18}
                fill={liked ? "currentColor" : "none"}
                className={liked ? "text-red-500" : ""}
              />
              <span className="text-sm">{likeCount > 0 ? likeCount : ""}</span>
            </button>

            <button className="flex items-center gap-1 p-2 rounded-full hover:bg-accent/50 transition-colors duration-200">
              <MessageCircle size={18} />
              <span className="text-sm">
                {/* {post.comments?.length > 0 ? post.comments.length : ""} */}
              </span>
            </button>

            <button className="flex items-center gap-1 p-2 rounded-full hover:bg-accent/50 transition-colors duration-200">
              <Repeat2 size={18} />
            </button>

            <button className="flex items-center gap-1 p-2 rounded-full hover:bg-accent/50 transition-colors duration-200">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
