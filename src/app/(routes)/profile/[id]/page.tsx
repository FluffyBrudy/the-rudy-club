"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/lib/api/apiclient";
import PostCard from "@/app/components/PostComponents/PostCard";
import { Loader2 } from "lucide-react";
import FriendsSuggestion from "@/app/components/SharableComponents/FriendsSuggestion";
import { PostResponse } from "@/types/apiResponseTypes";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/ui/TabComponents";
import Image from "next/image";

function ProfileInfo({
  user,
}: {
  user: {
    username: string;
    profilePicture: string;
    description: string;
  } | null;
}) {
  return (
    <div className="rounded-xl shadow p-6 mb-6 flex items-center gap-4 bg-[var(--card-bg)] border border-[var(--border-color)]">
      <div className="w-20 h-20 rounded-full overflow-hidden bg-[var(--muted-color)] flex items-center justify-center">
        {user?.profilePicture ? (
          <Image
            src={user.profilePicture}
            alt="Profile"
            width={48}
            height={48}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl text-[var(--muted-color)]">
            ?
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-[var(--text-color)]">
          {user?.username || "User"}
        </div>
        <div className="text-[var(--muted-color)]">{user?.description}</div>
      </div>
    </div>
  );
}

function MediaGallery({ mediaContent }: { mediaContent: string[] }) {
  return (
    <div className="rounded-xl shadow p-4 bg-[var(--card-bg)] border border-[var(--border-color)] mb-4">
      <h3 className="font-semibold mb-2 text-[var(--text-color)]">Media</h3>
      {mediaContent.length === 0 ? (
        <div className="text-[var(--muted-color)]">No media content.</div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {mediaContent.map((url, idx) => (
            <Image
              key={idx}
              src={url}
              alt={`media-${idx}`}
              className="w-full h-24 object-cover rounded border border-[var(--border-color)]"
              fill
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PostsList({ posts }: { posts: PostResponse[] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-[var(--text-color)]">
        Posts
      </h2>
      {posts.length === 0 ? (
        <div className="text-[var(--muted-color)]">No posts yet.</div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.postId}
            post={post}
            handleProfileClick={undefined}
          />
        ))
      )}
    </div>
  );
}

export default function ProfilePage() {
  const params = useParams();
  const userId = params?.id as string;

  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = posts[0]?.username
    ? {
        username: posts[0].username,
        profilePicture: posts[0].profilePicture,
        description: "No description yet.",
      }
    : null;

  const mediaContent: string[] = posts
    .flatMap((post) => post.content.mediaContent || [])
    .filter(Boolean);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    apiClient.posts
      .fetchPostByUserId(userId)
      .then((res) => {
        if (res.error) setError(res.error);
        else setPosts(res.data || []);
      })
      .catch((err) => setError((err as { error: string }).error))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-[var(--primary-color)]" />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-[var(--primary-color)] mt-8">
        Failed to load profile: {error}
      </div>
    );

  return (
    <div className="w-[min(1200px,95vw)] mx-auto mt-8">
      <ProfileInfo user={user} />

      <div className="hidden lg:grid grid-cols-[320px_1fr] gap-8">
        <div className="flex flex-col gap-4">
          <MediaGallery mediaContent={mediaContent} />
          <FriendsSuggestion />
        </div>

        <div>
          <PostsList posts={posts} />
        </div>
      </div>

      <div className="lg:hidden flex flex-col gap-4">
        <Tabs defaultValue="posts">
          <TabsList className="mb-2 w-full flex">
            <TabsTrigger value="posts" className="flex-1">
              Posts
            </TabsTrigger>
            <TabsTrigger value="media" className="flex-1">
              Media
            </TabsTrigger>
            <TabsTrigger value="suggestion" className="flex-1">
              Who to Follow
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <PostsList posts={posts} />
          </TabsContent>
          <TabsContent value="media">
            <MediaGallery mediaContent={mediaContent} />
          </TabsContent>
          <TabsContent value="suggestion">
            <FriendsSuggestion />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
