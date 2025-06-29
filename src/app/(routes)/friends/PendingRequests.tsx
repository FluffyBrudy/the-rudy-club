"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/TabComponents";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/TabComponents";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/TabComponents";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/TabComponents";
import { Badge } from "@/app/components/ui/TabComponents";
import { UserCheck, UserX, Users, Clock } from "lucide-react";
import { PendingFriendRequests } from "@/types/apiResponseTypes";
import apiClient from "@/lib/api/apiclient";

export default function PendingRequests() {
  const [receivedRequests, setReceivedRequests] = useState<
    PendingFriendRequests[]
  >([]);
  const [sentRequests, setSentRequests] = useState<PendingFriendRequests[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("received");

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    setLoading(true);
    setError(null);

    try {
      const receivedResponse = await apiClient.social.getPendingRequests(false);
      if (receivedResponse.error) {
        setError(receivedResponse.error);
      } else {
        setReceivedRequests(receivedResponse.data || []);
      }

      const sentResponse = await apiClient.social.getPendingRequests(true);
      if (sentResponse.error) {
        setError(sentResponse.error);
      } else {
        setSentRequests(sentResponse.data || []);
      }
    } catch (err) {
      setError("Failed to fetch pending requests");
      console.error("Error fetching pending requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = (userId: string, username: string) => {
    console.log(
      `Accepting friend request from user: ${username} (ID: ${userId})`
    );
    apiClient.social.acceptPendingRequest(userId).then((res) => {
      console.log(res);
      setReceivedRequests((prev) =>
        prev.filter((req) => req.userId !== userId)
      );
    });
  };

  const handleReject = (userId: string, username: string) => {
    console.log(
      `Rejecting friend request from user: ${username} (ID: ${userId})`
    );

    apiClient.social.rejectPendingRequest(userId).then((res) => {
      console.log(res);
      setReceivedRequests((prev) =>
        prev.filter((req) => req.userId !== userId)
      );
    });
  };

  const handleCancelSent = (userId: string, username: string) => {
    console.log(
      `Canceling sent friend request to user: ${username} (ID: ${userId})`
    );

    apiClient.social.rejectPendingRequest(userId).then((res) => {
      console.log(res);
      setSentRequests((prev) => prev.filter((req) => req.userId !== userId));
    });
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Pending Friend Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-color)]"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Pending Friend Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchPendingRequests} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Pending Friend Requests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="received" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Received
              {receivedRequests.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {receivedRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Sent
              {sentRequests.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {sentRequests.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="mt-4">
            {receivedRequests.length === 0 ? (
              <div className="text-center py-8">
                <UserCheck className="h-12 w-12 mx-auto text-[var(--muted-color)] mb-4" />
                <p className="text-[var(--muted-color)]">
                  No pending friend requests
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {receivedRequests.map((request) => (
                  <div
                    key={request.userId}
                    className="flex items-center justify-between p-4 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)]"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={request.imageUrl || "/placeholder.svg"}
                          alt={request.username}
                        />
                        <AvatarFallback>
                          {request.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-[var(--text-color)]">
                          {request.username}
                        </p>
                        <p className="text-sm text-[var(--muted-color)]">
                          wants to be your friend
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleAccept(request.userId, request.username)
                        }
                        className="bg-[var(--btn-bg-color)] hover:bg-[var(--btn-hover-bg-color)] text-[var(--btn-text-color)]"
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleReject(request.userId, request.username)
                        }
                        className="border-[var(--border-color)] hover:bg-[var(--accent-color)]"
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sent" className="mt-4">
            {sentRequests.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto text-[var(--muted-color)] mb-4" />
                <p className="text-[var(--muted-color)]">
                  No sent friend requests
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sentRequests.map((request) => (
                  <div
                    key={request.userId}
                    className="flex items-center justify-between p-4 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)]"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={request.imageUrl || "/placeholder.svg"}
                          alt={request.username}
                        />
                        <AvatarFallback>
                          {request.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-[var(--text-color)]">
                          {request.username}
                        </p>
                        <p className="text-sm text-[var(--muted-color)]">
                          Request pending
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleCancelSent(request.userId, request.username)
                      }
                      className="border-[var(--border-color)] hover:bg-[var(--accent-color)]"
                    >
                      Cancel
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
