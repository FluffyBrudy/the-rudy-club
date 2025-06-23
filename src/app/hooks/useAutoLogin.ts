"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/app/store/appStore";
import apiClient from "@/lib/api";

export function useAutoLogin() {
  const performLogin = useAppStore((state) => state.login);
  const [state, setState] = useState({
    loading: true,
    error: null as string | null,
    success: false,
  });

  useEffect(() => {
    const attemptAutoLogin = async () => {
      try {
        const response = await apiClient.autoLoginUser();

        if (response.data) {
          performLogin(response.data);
          setState({ loading: false, error: null, success: true });
        } else {
          setState({ loading: false, error: response.error, success: false });
        }
      } catch (err) {
        setState({
          loading: false,
          error: (err as Error).message ?? "An unexpected error occurred",
          success: false,
        });
      }
    };

    attemptAutoLogin();
  }, [performLogin]);

  return state;
}
