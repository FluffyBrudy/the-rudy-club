export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REGISTER: "/api/auth/register",
    AUTHORIZE: "/api/auth/authorize",
    REFRESH_TOKEN: "/api/auth/refresh"
  },

  POST: {
    CREATE: "/api/post/create",
    FETCH: "/api/post/fetch",
    SEARCH: "/api/post/search",
    FETCH_USER_POST: "/api/post/fetch/user"
  },

  COMMENT: {
    CREATE: "/api/comment/create",
    FETCH: "/api/comment/fetch",
    REPLY: {
      CREATE: "/api/comment/reply/create",
      FETCH: "/api/comment/reply/fetch",
    },
  },

  REACTION: {
    CREATE: "/api/reaction/create",
  },

  NOTIFICATION: {
    FETCH: "/api/notification/fetch",
    DELETE: "/api/notification/delete",
    TOGGLE_READ: "/api/notification/toggle-read",
  },
} as const;

export const getPigeonEndpoints = (baseUrl: string) => ({
  SOCIAL: {
    FRIENDS_SEARCH: `${baseUrl}/api/social/friends/search`,
    FRIEND_REQUEST: `${baseUrl}/api/social/friends/requests`,
    PENDING_REQUESTS: `${baseUrl}/api/social/friends/requests/pending`,
    ACCEPTED_REQUESTS: `${baseUrl}/api/social/friends/requests/accepted`,
    ACCEPT_REQUEST: `${baseUrl}/api/social/friends/requests/accept`,
    REJECT_REQUEST: `${baseUrl}/api/social/friends/requests/reject`,
    FRIENDS_SUGGESTION: `${baseUrl}/api/social/friends/suggestion`,
    FRIENDSHIP_CHECK: `${baseUrl}/api/social/friends/status`
  },

  CHAT: {
    MESSAGE_CREATE: `${baseUrl}/api/chat/message/create`,
    MESSAGE_FETCH: `${baseUrl}/api/chat/message/fetch`,
    LATEST_MESSAGES: `${baseUrl}/api/chat/message/fetch/latest`,
  },

  PREFERENCES: {
    PROFILE_SIGNATURE: `${baseUrl}/api/preference/profile/signature`,
    PROFILE_IMAGE: `${baseUrl}/api/preference/profile/image`,
    PROFILE_FETCH: `${baseUrl}/api/preference/profile`,
    PROFILE_BIO_UPDATE: `${baseUrl}/api/preference/profile/bio/update`
  },
});
