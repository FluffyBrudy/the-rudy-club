import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/app/store/appStore";
import apiClient from "@/lib/api";

interface UseLoginReturn {
  login: () => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function useLogin(route: string): UseLoginReturn {
  const router = useRouter();
  const performLogin = useAppStore((state) => state.login);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const login = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.autoLoginUser();
      if (response.data) {
        performLogin(response.data);
        setSuccess(true);
        setError(null);

        setTimeout(() => {
          router.push(route);
        }, 1000);
      } else {
        setError(response.error);
        setSuccess(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError((err as Error).message ?? "An unexpected error occurred");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [performLogin, route, router]);

  return {
    login,
    loading,
    error,
    success,
  };
}
