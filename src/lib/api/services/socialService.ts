import { TAPIResponse } from "../apiTypes";
import { getPigeonEndpoints } from "../config";
import { ConnectedFriendsResponse } from "@/types/apiResponseTypes";

export class SocialService {
  constructor(private pigeonEndpoints: ReturnType<typeof getPigeonEndpoints>) {}

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
}
