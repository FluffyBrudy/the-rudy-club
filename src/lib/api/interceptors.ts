import { AxiosInstance, AxiosResponse, AxiosError } from "axios";

export const setupRequestInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

export const setupResponseInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      const response = error.response;
      if (response) {
        const { data, status, statusText } = response;
        if (data && (data as { error: string }).error === "jwt expired") {
          // TODO: implement refresh token logic
          // TODO: or either hard reload page so user is directly naviated to login page before refresh logic set
        }
        return Promise.reject({ data, status, statusText });
      }
      return Promise.reject({ data: { error: "connection error" } });
    }
  );
};
