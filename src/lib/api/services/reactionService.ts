import { AxiosInstance } from "axios";
import { TAPIResponse, ErrorResponse } from "@/lib/api/apiTypes";
import { API_ENDPOINTS } from "../config";
import {
  ReactionResponse,
  UndoReactionResponse,
} from "@/types/apiResponseTypes";

export class ReactionService {
  constructor(private axiosInstance: AxiosInstance) {}

  async createReaction(
    reactionOnId: string,
    reactionOnType: string,
    reactionType: string
  ): Promise<TAPIResponse<ReactionResponse | UndoReactionResponse>> {
    try {
      const response = await this.axiosInstance.post(
        API_ENDPOINTS.REACTION.CREATE,
        {
          reactionOnId,
          reactionOnType,
          reactionType,
        }
      );

      if ([200, 201].includes(response.status)) {
        const data = response.data as {
          data: ReactionResponse | UndoReactionResponse;
        };
        return { error: null, data: data.data };
      }

      return { error: "failed to create reaction", data: null };
    } catch (error) {
      const e = error as ErrorResponse;
      const errMsg =
        e.data?.error || e.statusText || "failed to create reaction";
      return { error: `${e.status}:${errMsg}`, data: null };
    }
  }
}
