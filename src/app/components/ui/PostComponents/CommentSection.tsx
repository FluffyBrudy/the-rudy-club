"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  MessageCircle,
  Send,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import type {
  CommentResponse,
  CommentReplyResponse,
} from "@/types/apiResponseTypes";
import { useAppStore } from "@/app/store/appStore";
import apiClient from "@/lib/api";
import Image from "next/image";

interface CommentSectionProps {
  postId: number;
  isOpen: boolean;
  onToggle: () => void;
}

export default function CommentSection({
  postId,
  isOpen,
  onToggle,
}: CommentSectionProps) {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(
    new Set()
  );
  const [replies, setReplies] = useState<
    Record<number, CommentReplyResponse[]>
  >({});
  const [replyText, setReplyText] = useState<Record<number, string>>({});
  const [replySubmitting, setReplySubmitting] = useState<Set<number>>(
    new Set()
  );

  const user = useAppStore((state) => state.user);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await apiClient.fetchComments(postId);
        if (response.data) {
          setComments(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setLoading(false);
      }
    };
    if (isOpen && comments.length === 0) {
      fetchComments();
    }
  }, [isOpen, postId, comments.length]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await apiClient.createComment(postId, newComment.trim());
      console.log(response);
      if (response.data) {
        setComments((prev) => [...prev, response.data!]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Failed to create comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchReplies = async (commentId: number) => {
    try {
      const response = await apiClient.fetchReplies(commentId);
      if (response.data) {
        setReplies((prev) => ({
          ...prev,
          [commentId]: response.data!,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch replies:", error);
    }
  };

  const toggleReplies = async (commentId: number) => {
    const newExpanded = new Set(expandedReplies);

    if (expandedReplies.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
      if (!replies[commentId]) {
        await fetchReplies(commentId);
      }
    }

    setExpandedReplies(newExpanded);
  };

  const handleSubmitReply = async (commentId: number) => {
    const text = replyText[commentId]?.trim();
    if (!text) return;

    setReplySubmitting((prev) => new Set([...prev, commentId]));
    try {
      const response = await apiClient.createReply(commentId, text);
      if (response.data) {
        setReplies((prev) => ({
          ...prev,
          [commentId]: [...(prev[commentId] || []), response.data!],
        }));
        setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      }
    } catch (error) {
      console.error("Failed to create reply:", error);
    } finally {
      setReplySubmitting((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  return (
    <div className="border-t" style={{ borderColor: "var(--border-color)" }}>
      <button
        onClick={onToggle}
        className="flex items-center gap-2 w-full p-4 hover:bg-accent/30 transition-colors duration-200"
      >
        <MessageCircle size={18} />
        <span className="text-sm font-medium">
          {comments.length > 0 ? `${comments.length} Comments` : "Comments"}
        </span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  {user?.profilePicture ? (
                    <Image
                      src={user.profilePicture || "/placeholder.svg"}
                      alt={user.username}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: "var(--primary-color)" }}
                    >
                      {user?.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full p-2 text-sm rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-opacity-20"
                  style={{
                    backgroundColor: "var(--input-bg)",
                    border: "1px solid var(--input-border)",
                    color: "var(--text-color)",
                  }}
                  rows={2}
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={!newComment.trim() || submitting}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "var(--primary-color)" }}
                  >
                    {submitting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                    Comment
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments List */}
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2
                size={20}
                className="animate-spin"
                style={{ color: "var(--primary-color)" }}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.commentId} className="space-y-2">
                  {/* Comment */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        {comment.profilePicture ? (
                          <Image
                            src={comment.profilePicture || "/placeholder.svg"}
                            alt={comment.username}
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-white text-sm font-bold"
                            style={{ backgroundColor: "var(--primary-color)" }}
                          >
                            {comment.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: "var(--accent-color)" }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {comment.username}
                          </span>
                          <span
                            className="text-xs"
                            style={{ color: "var(--muted-color)" }}
                          >
                            {comment.createdAt.toString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.commentBody}</p>
                      </div>

                      {/* Reply Button */}
                      <div className="flex items-center gap-4 mt-2 ml-3">
                        <button
                          onClick={() => toggleReplies(comment.commentId)}
                          className="text-xs font-medium hover:underline"
                          style={{ color: "var(--primary-color)" }}
                        >
                          {expandedReplies.has(comment.commentId)
                            ? "Hide replies"
                            : "Reply"}
                        </button>
                        {comment.totalReaction > 0 && (
                          <span
                            className="text-xs"
                            style={{ color: "var(--muted-color)" }}
                          >
                            {comment.totalReaction} reactions
                          </span>
                        )}
                      </div>

                      {expandedReplies.has(comment.commentId) && (
                        <div className="mt-3 ml-3">
                          <div className="flex gap-2">
                            <div className="flex-shrink-0">
                              <div className="w-6 h-6 rounded-full overflow-hidden">
                                {user?.profilePicture ? (
                                  <Image
                                    src={
                                      user.profilePicture || "/placeholder.svg"
                                    }
                                    alt={user.username}
                                    width={24}
                                    height={24}
                                    className="object-cover"
                                  />
                                ) : (
                                  <div
                                    className="w-full h-full flex items-center justify-center text-white text-xs font-bold"
                                    style={{
                                      backgroundColor: "var(--primary-color)",
                                    }}
                                  >
                                    {user?.username.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <input
                                type="text"
                                value={replyText[comment.commentId] || ""}
                                onChange={(e) =>
                                  setReplyText((prev) => ({
                                    ...prev,
                                    [comment.commentId]: e.target.value,
                                  }))
                                }
                                placeholder="Write a reply..."
                                className="w-full p-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-20"
                                style={{
                                  backgroundColor: "var(--input-bg)",
                                  border: "1px solid var(--input-border)",
                                  color: "var(--text-color)",
                                }}
                                onKeyUp={(e) => {
                                  if (e.key === "Enter") {
                                    handleSubmitReply(comment.commentId);
                                  }
                                }}
                              />
                              <button
                                onClick={() =>
                                  handleSubmitReply(comment.commentId)
                                }
                                disabled={
                                  !replyText[comment.commentId]?.trim() ||
                                  replySubmitting.has(comment.commentId)
                                }
                                className="mt-1 px-2 py-1 text-xs font-medium text-white rounded disabled:opacity-50"
                                style={{
                                  backgroundColor: "var(--primary-color)",
                                }}
                              >
                                {replySubmitting.has(comment.commentId) ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  "Reply"
                                )}
                              </button>
                            </div>
                          </div>

                          {replies[comment.commentId] && (
                            <div className="mt-3 space-y-2">
                              {replies[comment.commentId].map((reply) => (
                                <div
                                  key={reply.commentReplyId}
                                  className="flex gap-2"
                                >
                                  <div className="flex-shrink-0">
                                    <div className="w-6 h-6 rounded-full overflow-hidden">
                                      {reply.profilePicture ? (
                                        <Image
                                          src={
                                            reply.profilePicture ||
                                            "/placeholder.svg"
                                          }
                                          alt={reply.username}
                                          width={24}
                                          height={24}
                                          className="object-cover"
                                        />
                                      ) : (
                                        <div
                                          className="w-full h-full flex items-center justify-center text-white text-xs font-bold"
                                          style={{
                                            backgroundColor:
                                              "var(--primary-color)",
                                          }}
                                        >
                                          {reply.username
                                            .charAt(0)
                                            .toUpperCase()}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <div
                                      className="p-2 rounded-lg"
                                      style={{
                                        backgroundColor: "var(--accent-color)",
                                      }}
                                    >
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-xs">
                                          {reply.username}
                                        </span>
                                        <span
                                          className="text-xs"
                                          style={{
                                            color: "var(--muted-color)",
                                          }}
                                        >
                                          {reply.createdAt.toString()}
                                        </span>
                                      </div>
                                      <p className="text-xs">
                                        {reply.replyContent}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
