import { FetchLoggedUserProfileResponse } from "@/types/apiResponseTypes";
import { getPigeonEndpoints } from "../config";

export class PreferenceService {
    constructor(private pigeonEndpoints: ReturnType<typeof getPigeonEndpoints>) { }

    async fetchLoggedUserProfile(userId: string) {
        try {
            const response = await fetch(
                `${this.pigeonEndpoints.PREFERENCES.PROFILE_FETCH}?q=${userId}`,
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
                    data: FetchLoggedUserProfileResponse;
                };
                return { error: null, data: data.data };
            }

            return { error: "failed to fetch friends", data: null };
        } catch (error) {
            console.error("Failed to fetch connected friends:", error);
            return { error: "failed to fetch friends", data: null };
        }
    }

    async updateLoggedUserProfileBio(bio: string) {
        try {
            const response = await fetch(
                this.pigeonEndpoints.PREFERENCES.PROFILE_BIO_UPDATE,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ bio }),
                }
            );

            if ([200, 201].includes(response.status)) {
                const data = (await response.json()) as {
                    data: FetchLoggedUserProfileResponse;
                };
                return { error: null, data };
            }

            return { error: "failed to update bio", data: null };
        } catch (error) {
            console.error("Failed to update bio:", error);
            return { error: "failed to update bio", data: null };
        }
    }
}
