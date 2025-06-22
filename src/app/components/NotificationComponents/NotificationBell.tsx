"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Trash2, Circle, CheckCircle, X } from "lucide-react";
import type { NotificationResponse } from "@/types/apiResponseTypes";
import apiClient from "@/lib/api";

interface NotificationBellProps {
  notifications?: NotificationResponse[];
  className?: string;
}

export default function NotificationBell({
  className = "",
}: NotificationBellProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [localNotifications, setLocalNotifications] = useState<
    NotificationResponse[]
  >([]);
  const pageRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apiClient
      .fetchNotifications(pageRef.current)
      .then((res) => {
        if (res.data) {
          setLocalNotifications(res.data);
          console.log(res.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }

    function handleEscKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowNotifications(false);
      }
    }

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [showNotifications]);

  const unreadCount = localNotifications.filter((n) => !n.isRead).length;

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleLoadMore = (next?: boolean) => () => {
    if (!next && pageRef.current === 0) return;
    const page = next ? pageRef.current + 1 : Math.min(0, pageRef.current - 1);
    apiClient
      .fetchNotifications(page)
      .then((res) => {
        if (res.data) {
          setLocalNotifications(res.data);
          pageRef.current = page;
        }
      })
      .catch((err) => console.error(err));
  };

  const handleToggleRead = (id: number) => {
    apiClient
      .toggleNotificationReadStatus(id)
      .then((res) => {
        if (res.data) {
          setLocalNotifications((prev) =>
            prev.map((notification) =>
              notification.notificationId === id
                ? { ...notification, isRead: !notification.isRead }
                : notification
            )
          );
        }
      })
      .catch((err) => console.error(err));
  };

  const handleClear = (id: number) => {
    apiClient.deleteNotification([id]).then((res) => {
      if (res.data) {
        setLocalNotifications((prev) =>
          prev.filter((notification) => notification.notificationId !== id)
        );
      }
    });
  };

  const handleClearAll = (notificationIds: number[]) => () => {
    apiClient.deleteNotification(notificationIds).then((deleteRes) => {
      if (deleteRes.data) setLocalNotifications([]);
      apiClient
        .fetchNotifications(pageRef.current + 1)
        .then((fetchRes) => {
          if (fetchRes.data) {
            setLocalNotifications(fetchRes.data);
          }
        })
        .catch((err) => console.error(err));
    });
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        onClick={toggleNotifications}
        className={`p-2 rounded-xl hover:bg-accent/50 transition-colors duration-200 relative ${
          showNotifications ? "bg-accent/50" : ""
        }`}
      >
        <Bell className="h-5 w-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {showNotifications && (
        <div className="fixed left-0 top-full mt-2 z-50 duration-200 md:left-auto md:right-0 md:absolute">
          <div className="w-80 max-w-[90vw] bg-[var(--card-bg)] rounded-lg shadow-lg border border-[var(--border-color)]">
            <div className="flex items-center justify-between p-3 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[var(--text-color)]" />
                <h2 className="text-sm font-semibold text-[var(--text-color)]">
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <span className="bg-[var(--primary-color)] text-white text-xs px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {localNotifications.length > 0 && (
                  <button
                    onClick={handleClearAll(
                      localNotifications.map(
                        ({ notificationId }) => notificationId
                      )
                    )}
                    className="p-1 text-[var(--muted-color)] hover:text-red-500 transition-colors ml-1"
                    title="Clear all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {localNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Bell className="w-6 h-6 text-[var(--muted-color)] mb-2" />
                  <p className="text-xs text-[var(--muted-color)]">
                    No notifications
                  </p>
                </div>
              ) : (
                <div>
                  {localNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.notificationId}
                      notification={notification}
                      onToggleRead={handleToggleRead}
                      onClear={handleClear}
                    />
                  ))}
                </div>
              )}
            </div>

            {localNotifications.length > 0 ? (
              <div className="p-2 border-t border-[var(--border-color)] text-center">
                <button
                  onClick={handleLoadMore(true)}
                  className="text-xs text-[var(--primary-color)] hover:opacity-70 transition-opacity"
                >
                  load more
                </button>
              </div>
            ) : (
              localNotifications.length < 10 &&
              pageRef.current !== 0 && (
                <div className="p-2 border-t border-[var(--border-color)] text-center">
                  <button
                    onClick={handleLoadMore(false)}
                    className="text-xs text-[var(--primary-color)] hover:opacity-70 transition-opacity"
                  >
                    load previous
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationItem({
  notification,
  onToggleRead,
  onClear,
}: {
  notification: NotificationResponse;
  onToggleRead: (id: number) => void;
  onClear: (id: number) => void;
}) {
  const [isClearing, setIsClearing] = useState(false);

  const handleToggleRead = () => {
    onToggleRead(notification.notificationId);
  };

  const handleClear = async () => {
    setIsClearing(true);
    setTimeout(() => {
      onClear(notification.notificationId);
    }, 200);
  };

  return (
    <div
      className={`
        flex items-start gap-3 p-3 border-b border-[var(--border-color)] last:border-b-0
        transition-all duration-200 ease-in-out
        hover:bg-[var(--accent-color)]
        ${isClearing ? "opacity-0 transform translate-x-full" : "opacity-100"}
        ${
          !notification.isRead
            ? "bg-[var(--accent-color)]/30"
            : "bg-[var(--card-bg)]"
        }
      `}
    >
      <button
        onClick={handleToggleRead}
        className="flex-shrink-0 text-[var(--primary-color)] hover:opacity-70 transition-opacity mt-0.5"
        title={notification.isRead ? "Mark as unread" : "Mark as read"}
      >
        {notification.isRead ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          <Circle className="w-4 h-4" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`
            text-xs leading-relaxed
            ${
              notification.isRead
                ? "text-[var(--muted-color)]"
                : "text-[var(--text-color)] font-medium"
            }
          `}
        >
          {notification.notificationInfo}
        </p>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-[var(--muted-color)] capitalize">
            {notification.notificationOnType}
          </span>
          <span className="text-[10px] text-[var(--muted-color)]">•</span>
          <time className="text-[10px] text-[var(--muted-color)]">
            {notification.createdAt}
          </time>
        </div>
      </div>

      <button
        onClick={handleClear}
        className="flex-shrink-0 p-0.5 text-[var(--muted-color)] hover:text-red-500 transition-colors mt-0.5"
        title="Clear notification"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
