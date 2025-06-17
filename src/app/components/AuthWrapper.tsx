"use client";

import type React from "react";
import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/app/store/appStore";
import apiClient from "@/lib/api";
import {
  FEEDS_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  ROOT_ROUTE,
} from "@/lib/constants";

export default function AuthWrapper({ children }: { children: ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const performLogin = useAppStore((state) => state.login);

  useEffect(() => {
    const performCheck = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return;
      }

      try {
        const response = await apiClient.autoLoginUser();
        if (response.data) {
          performLogin(response.data);
          console.log(response.data);
          setIsChecking(false);
          if (pathname !== FEEDS_ROUTE) {
            router.push(FEEDS_ROUTE);
          }
        } else {
          console.error("No user data in response", response.data);
          router.replace(LOGIN_ROUTE);
        }
      } catch (error) {
        console.error("Auto login error", error);
        router.replace(LOGIN_ROUTE);
      }
    };
    if (![LOGIN_ROUTE, REGISTER_ROUTE].includes(pathname)) performCheck();
  }, [router, performLogin, pathname]);

  if ([LOGIN_ROUTE, REGISTER_ROUTE, ROOT_ROUTE].includes(pathname))
    return <>{children}</>;

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2"
            style={{ borderColor: "var(--primary-color)" }}
          ></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
