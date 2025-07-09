"use client";
import React, { useEffect, useRef } from "react";
import { decodeJWT } from "@/utils/decodeJWT";
import apiClient from "@/lib/api/apiclient";
import { useAppStore } from "@/app/store/appStore";

const REFRESH_DELAY_SECONDS = 13 * 60;

const JWTRefreshScheduler: React.FC = () => {
  const loginUser = useAppStore((state) => state.login);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const scheduleRefresh = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      refreshToken();
      return;
    }

    const decoded = decodeJWT(accessToken);
    if (!decoded || !decoded.payload) {
      refreshToken();
      return;
    }

    const { iat, exp } = decoded.payload;
    if (typeof iat !== "number" || typeof exp !== "number") return;

    const now = Math.floor(Date.now() / 1000);

    if (now >= exp || now >= iat + REFRESH_DELAY_SECONDS) {
      refreshToken();
      return;
    }

    const refreshAt = Math.min(iat + REFRESH_DELAY_SECONDS, exp - 1);
    const delay = (refreshAt - now) * 1000;

    timerRef.current = setTimeout(() => {
      refreshToken();
    }, delay);
  };

  const refreshToken = async () => {
    try {
      const res = await apiClient.auth.issueNewToken();
      scheduleRefresh();
      if (!res.data) {
        console.error("token refresh failed");
        localStorage.removeItem("accessToken");
      } else {
        console.log("logged");
        loginUser(res.data);
      }
    } catch (e) {
      console.error("Token refresh failed:", e);
    }
  };

  useEffect(() => {
    console.info("refreshed");
    scheduleRefresh();
    return () => {
      clearTimer();
    };
    // eslint-disable-next-line
  }, []);

  return null;
};

export default JWTRefreshScheduler;
