"use client";

import { useAutoLogin } from "@/app/hooks/useAutoLogin";
import {
  authProtectedRoutes,
  preAuthRenderableRoutes,
  FEEDS_ROUTE,
  LOGIN_ROUTE,
} from "@/lib/router";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

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
  const { error, loading, success } = useAutoLogin();

  const routeType = getRouteType(pathname);

  useEffect(() => {
    if (loading) return;

    if (success) {
      router.replace(FEEDS_ROUTE);
    } else if (!success && routeType === "protected") {
      console.error(error);
      sessionStorage.clear();
      router.replace(LOGIN_ROUTE);
    }
  }, [loading, success, routeType, router, error]);

  if (routeType === "protected") {
    if (loading) return <div>{fallbackElement ?? null}</div>;
    if (!success) return null;
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
