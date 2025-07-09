import { TAPIResponse } from "../apiTypes";
import { getPigeonEndpoints } from "../config";
import {
  CheckFriendshipStatusResponse,
  ConnectedFriendsResponse,
  PendingFriendRequests,
  SuggestedFriendsResponse,
} from "@/types/apiResponseTypes";

export class SocialService {
  constructor(private pigeonEndpoints: ReturnType<typeof getPigeonEndpoints>) { }

  async getConnectedFriends(): Promise<
    TAPIResponse<ConnectedFriendsResponse[]>
  > {
    try {
      const response = await fetch(
        this.pigeonEndpoints.SOCIAL.ACCEPTED_REQUESTS,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if ([200, 201].includes(response.status)) {
        const data = (await response.json()) as {
          data: ConnectedFriendsResponse[];
        };
        return { error: null, data: data.data };
      }

      return { error: "failed to fetch friends", data: null };
    } catch (error) {
      console.error("Failed to fetch connected friends:", error);
      return { error: "failed to fetch friends", data: null };
    }
  }

  async getFriendsSuggestion(
    page = 0
  ): Promise<TAPIResponse<SuggestedFriendsResponse[]>> {
    try {
      const response = await fetch(
        `${this.pigeonEndpoints.SOCIAL.FRIENDS_SUGGESTION}?skip=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if ([200, 201].includes(response.status)) {
        const data = (await response.json()) as {
          data: SuggestedFriendsResponse[];
        };
        return { error: null, data: data.data };
      }

      return { error: "failed to send friend request", data: null };
    } catch (error) {
      console.error("Failed to send friend request:", error);
      return { error: "failed to send friend request", data: null };
    }
  }

  async sendFriendRequest(friendId: string): Promise<TAPIResponse<string>> {
    {
      try {
        const response = await fetch(
          `${this.pigeonEndpoints.SOCIAL.FRIEND_REQUEST}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ friendId }),
          }
        );

        if ([200, 201].includes(response.status)) {
          const data = (await response.json()) as {
            data: string;
          };
          return { error: null, data: data.data };
        }

        return { error: "failed to fetch friends suggestion", data: null };
      } catch (error) {
        console.error("Failed to fetch friends suggestion:", error);
        return { error: "failed to fetch friends suggestion", data: null };
      }
    }
  }

  public async getPendingRequests(
    isReqSent: boolean
  ): Promise<TAPIResponse<PendingFriendRequests[]>> {
    try {
      const friendRequestType = isReqSent ? "sent" : "receive";
      const response = await fetch(
        `${this.pigeonEndpoints.SOCIAL.PENDING_REQUESTS}?type=${friendRequestType}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if ([200, 201].includes(response.status)) {
        const data = (await response.json()) as {
          data: PendingFriendRequests[];
        };
        return { error: null, data: data.data };
      }

      return { error: "failed to send friend request", data: null };
    } catch (error) {
      console.error("Failed to send friend request:", error);
      return { error: "failed to send friend request", data: null };
    }
  }

  public async acceptPendingRequest(friendId: string) {
    try {
      const response = await fetch(this.pigeonEndpoints.SOCIAL.ACCEPT_REQUEST, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId }),
      });

      if ([200, 201].includes(response.status)) {
        const data = (await response.json()) as {
          data: ConnectedFriendsResponse[];
        };
        return { error: null, data: data.data };
      }

      return { error: "failed to fetch friends", data: null };
    } catch (error) {
      console.error("Failed to fetch connected friends:", error);
      return { error: "failed to fetch friends", data: null };
    }
  }

  public async rejectPendingRequest(friendId: string) {
    try {
      const response = await fetch(this.pigeonEndpoints.SOCIAL.REJECT_REQUEST, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId }),
      });

      if ([200, 201].includes(response.status)) {
        const data = (await response.json()) as {
          data: ConnectedFriendsResponse[];
        };
        return { error: null, data: data.data };
      }

      return { error: "failed to fetch friends", data: null };
    } catch (error) {
      console.error("Failed to fetch connected friends:", error);
      return { error: "failed to fetch friends", data: null };
    }
  }
  public async checkFriendshipStatus<T = CheckFriendshipStatusResponse>(
    userId: string
  ): Promise<TAPIResponse<T>> {
    try {
      const response = await fetch(
        `${this.pigeonEndpoints.SOCIAL.FRIENDSHIP_CHECK}?q=${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if ([200, 201].includes(response.status)) {
        const data = (await response.json()) as {
          data: T;
        };
        return { error: null, data: data.data };
      }

      return { error: "failed to check friendship status", data: null };
    } catch (error) {
      console.error("Failed to check friendship status:", error);
      return { error: "failed to check friendship status", data: null };
    }
  }
}
