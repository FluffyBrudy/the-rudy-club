"use client";

import { useAppStore } from "@/app/store/appStore";
import {
  authProtectedRoutes,
  preAuthRenderableRoutes,
  FEEDS_ROUTE,
  LOGIN_ROUTE,
  ROOT_ROUTE,
} from "@/lib/navigation/router";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import apiClient from "@/lib/api/apiclient";
import { isTokenExpired } from "@/utils/decodeJWT";

interface AuthRouteGuardProps {
  children: ReactNode;
  fallbackElement?: ReactNode;
}

export function AuthRouterGuard({
  children,
  fallbackElement,
}: AuthRouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const performLogin = useAppStore((state) => state.login);

  const [authState, setAuthState] = useState({
    loading: false,
    error: null as string | null,
    success: false,
    hasAttempted: false,
  });

  const routeType = getRouteType(pathname);

  useEffect(() => {
    if (isAuthenticated) {
      if ([LOGIN_ROUTE, ROOT_ROUTE].includes(pathname)) {
        router.replace(FEEDS_ROUTE);
      }
      return;
    }

    if (authState.hasAttempted || authState.loading) {
      return;
    }

    const attemptAutoLogin = async () => {
      setAuthState((prev) => ({ ...prev, loading: true }));

      try {
        const response = await apiClient.auth.autoLogin();

        if (response.data) {
          performLogin(response.data);
          setAuthState({
            loading: false,
            error: null,
            success: true,
            hasAttempted: true,
          });
        } else {
          setAuthState({
            loading: false,
            error: response.error,
            success: false,
            hasAttempted: true,
          });
        }
      } catch (err) {
        setAuthState({
          loading: false,
          error: (err as Error).message ?? "An unexpected error occurred",
          success: false,
          hasAttempted: true,
        });
      }
    };

    const token = localStorage.getItem("accessToken");
    if (token) {
      const isExpired = isTokenExpired(token);
      if (!isExpired) attemptAutoLogin();
    }
  }, [
    isAuthenticated,
    authState.hasAttempted,
    authState.loading,
    performLogin,
    pathname,
    router,
  ]);

  useEffect(() => {
    if (authState.hasAttempted && !authState.loading) {
      if (authState.success || isAuthenticated) {
        if (pathname === LOGIN_ROUTE) {
          router.replace(FEEDS_ROUTE);
        }
        return;
      }

      if (!authState.success && !isAuthenticated && routeType === "protected") {
        console.error(authState.error);
        sessionStorage.clear();
        router.replace(LOGIN_ROUTE);
      }
    }
  }, [
    authState.error,
    authState.loading,
    isAuthenticated,
    pathname,
    routeType,
    authState.success,
    authState.hasAttempted,
    router,
  ]);

  if (routeType === "protected") {
    if (isAuthenticated) {
      return <>{children}</>;
    }

    if (authState.loading || !authState.hasAttempted) {
      return <div>{fallbackElement ?? null}</div>;
    }

    if (!authState.success && !isAuthenticated) {
      return null;
    }
  }

  return <>{children}</>;
}

function getRouteType(
  pathname: string
): "protected" | "prerenderable" | "public" {
  if (authProtectedRoutes.some((route) => pathname.startsWith(route))) {
    return "protected";
  }

  if (preAuthRenderableRoutes.some((route) => pathname.startsWith(route))) {
    return "prerenderable";
  }

  return "public";
}
