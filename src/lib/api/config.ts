export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    AUTHORIZE: "/api/auth/authorize",
  },

  POST: {
    CREATE: "/api/post/create",
    FETCH: "/api/post/fetch",
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
  },

  CHAT: {
    MESSAGE_CREATE: `${baseUrl}/api/chat/message/create`,
    MESSAGE_FETCH: `${baseUrl}/api/chat/message/fetch`,
    LATEST_MESSAGES: `${baseUrl}/api/chat/message/fetch/latest`,
  },

  PREFERENCES: {
    PROFILE_SIGNATURE: `${baseUrl}/api/preference/profile/signature`,
    PROFILE_IMAGE: `${baseUrl}/api/preference/profile/image`,
  },
});
