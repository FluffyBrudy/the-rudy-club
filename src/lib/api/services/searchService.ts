import { AxiosInstance } from "axios";
import { API_ENDPOINTS, getPigeonEndpoints } from "../config";
import { TAPIResponse } from "../apiTypes";
import { SearchPostsResponse, SearchUsersResponse } from "@/types/apiResponseTypes";

export class SearchService {
    constructor(private pigeonEndpoints: ReturnType<typeof getPigeonEndpoints>, private axiosInstance: AxiosInstance) { }

    async searchUsers<T = SearchUsersResponse>(searchTerm: string, cursor?: string): Promise<
        TAPIResponse<T[]>
    > {
        console.log(cursor)
        try {
            const response = await fetch(
                this.pigeonEndpoints.SOCIAL.FRIENDS_SEARCH,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ searchTerm, cursor })
                }
            );

            if ([200, 201].includes(response.status)) {
                const data = (await response.json()) as {
                    data: T[];
                };
                return { error: null, data: data.data };
            }

            return { error: "failed to search users", data: null };
        } catch (error) {
            console.error("Failed to search users:", error);
            return { error: "failed to search users", data: null };
        }
    }

    async searchPosts<T = SearchPostsResponse>(searchTerm: string): Promise<TAPIResponse<T[]>> {
        try {
            const encodedSearchTerm = encodeURIComponent(searchTerm)
            const response = await this.axiosInstance.get(`${API_ENDPOINTS.POST.SEARCH}?q=${encodedSearchTerm}`,)

            if ([200, 201].includes(response.status)) {
                const data = response.data as {
                    data: T[];
                };
                return { error: null, data: data.data };
            }
            return { error: "failed to search post", data: null };
        } catch (error) {
            console.error("Failed to search post:", error);
            return { error: "failed to search post", data: null };
        }
    }
}

