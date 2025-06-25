// lib/api/client.ts - Main API Client
import axios, { AxiosInstance } from "axios";
import { getPigeonEndpoints } from "./config";
import {
  setupRequestInterceptor,
  setupResponseInterceptor,
} from "./interceptors";
import { AuthService } from "./services/authService";
import { PostService } from "./services/postService";
import { UploadService } from "./services/uploadService";
import { NotificationService } from "./services/notificationService";
import { CommentService } from "./services/commentService";
import { ReactionService } from "./services/reactionService";
import { SocialService } from "./services/socialService";

export class ApiClient {
  private axiosInstance: AxiosInstance;
  private pigeonEndpoints: ReturnType<typeof getPigeonEndpoints>;

  public auth: AuthService;
  public posts: PostService;
  public upload: UploadService;
  public notifications: NotificationService;
  public comments: CommentService;
  public reactions: ReactionService;
  public social: SocialService;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: "",
      withCredentials: true,
    });

    const pigeonBaseUrl = process.env.NEXT_PUBLIC_PIGEON_API_URL!;
    this.pigeonEndpoints = getPigeonEndpoints(pigeonBaseUrl);

    setupRequestInterceptor(this.axiosInstance);
    setupResponseInterceptor(this.axiosInstance);

    this.upload = new UploadService(this.pigeonEndpoints);
    this.auth = new AuthService(this.axiosInstance);
    this.posts = new PostService(this.axiosInstance, this.upload);
    this.notifications = new NotificationService(this.axiosInstance);
    this.comments = new CommentService(this.axiosInstance);
    this.reactions = new ReactionService(this.axiosInstance);
    this.social = new SocialService(this.pigeonEndpoints);
  }

  get instance(): AxiosInstance {
    return this.axiosInstance;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
