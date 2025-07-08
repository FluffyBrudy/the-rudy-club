"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import apiClient from "@/lib/api/apiclient";

interface FollowButtonProps {
  userId: string;
}

export default function FollowButton({ userId }: FollowButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "pending">("idle");

  const handleFollow = async () => {
    if (status !== "idle") return;
    setStatus("loading");
    try {
      const res = await apiClient.social.sendFriendRequest(userId);
      if (res?.data) {
        setStatus("pending");
      } else {
        setStatus("idle");
      }
    } catch (err) {
      console.error("Follow request failed:", err);
      setStatus("idle");
    }
  };

  return (
    <button
      disabled={status !== "idle"}
      onClick={handleFollow}
      className="text-1xl px-3 py-1 rounded-full font-medium transition-colors duration-200 hover:opacity-90 disabled:opacity-50"
      style={{
        backgroundColor: "var(--primary-color)",
        color: "white",
      }}
    >
      {status === "loading" ? (
        <Loader2 className="animate-spin w-4 h-4" />
      ) : status === "pending" ? (
        "Pending"
      ) : (
        "Follow"
      )}
    </button>
  );
}
