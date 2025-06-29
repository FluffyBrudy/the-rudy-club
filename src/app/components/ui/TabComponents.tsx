"use client";

import React, {
  useState,
  type ReactNode,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";
import { UserCheck, UserX, Users, Clock } from "lucide-react";
import Image from "next/image";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

function Button({
  variant = "default",
  size = "md",
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    default:
      "bg-[var(--btn-bg-color)] text-[var(--btn-text-color)] hover:bg-[var(--btn-hover-bg-color)] border border-[var(--btn-border-color)]",
    outline:
      "border border-[var(--border-color)] bg-transparent hover:bg-[var(--accent-color)] text-[var(--text-color)]",
    secondary:
      "bg-[var(--secondary-color)] text-white hover:bg-[var(--secondary-color)]/80",
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-6 text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function Card({ className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ className = "", children, ...props }: CardProps) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardTitle({ className = "", children, ...props }: CardProps) {
  return (
    <h3
      className={`text-2xl font-semibold leading-none tracking-tight text-[var(--text-color)] ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

function CardContent({ className = "", children, ...props }: CardProps) {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
}

interface AvatarProps {
  className?: string;
  children: ReactNode;
}

function Avatar({ className = "", children }: AvatarProps) {
  return (
    <div
      className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
    >
      {children}
    </div>
  );
}

interface AvatarImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

function AvatarImage({ src, alt, className = "" }: AvatarImageProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError || !src) {
    return null;
  }

  return (
    <Image
      className={`aspect-square h-full w-full object-cover ${className}`}
      src={src || "/placeholder.svg"}
      alt={alt ?? "user profile"}
      onError={() => setImageError(true)}
      width={48}
      height={48}
    />
  );
}

interface AvatarFallbackProps {
  className?: string;
  children: ReactNode;
}

function AvatarFallback({ className = "", children }: AvatarFallbackProps) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center rounded-full bg-[var(--accent-color)] text-[var(--text-color)] font-medium ${className}`}
    >
      {children}
    </div>
  );
}

interface BadgeProps {
  variant?: "default" | "secondary" | "outline";
  className?: string;
  children: ReactNode;
}

function Badge({ variant = "default", className = "", children }: BadgeProps) {
  const variants = {
    default:
      "bg-[var(--primary-color)] text-[var(--btn-text-color)] hover:bg-[var(--primary-color)]/80",
    secondary:
      "bg-[var(--secondary-color)] text-white hover:bg-[var(--secondary-color)]/80",
    outline: "border border-[var(--border-color)] text-[var(--text-color)]",
  };

  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  );
}

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  className?: string;
  children: ReactNode;
}

function Tabs({
  value,
  onValueChange,
  defaultValue,
  className = "",
  children,
}: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultValue || ""
  );

  const activeTab = value !== undefined ? value : internalActiveTab;

  const setActiveTab = (newValue: string) => {
    if (value !== undefined && onValueChange) {
      onValueChange(newValue);
    } else {
      setInternalActiveTab(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  className?: string;
  children: ReactNode;
}

function TabsList({ className = "", children }: TabsListProps) {
  return (
    <div
      className={`inline-flex h-10 items-center justify-center rounded-md bg-[var(--accent-color)] p-1 text-[var(--muted-color)] ${className}`}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: ReactNode;
}

function TabsTrigger({ value, className = "", children }: TabsTriggerProps) {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("TabsTrigger must be used within a Tabs component");
  }

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        isActive
          ? "bg-[var(--card-bg)] text-[var(--text-color)] shadow-sm"
          : "text-[var(--muted-color)] hover:text-[var(--text-color)]"
      } ${className}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: ReactNode;
}

function TabsContent({ value, className = "", children }: TabsContentProps) {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("TabsContent must be used within a Tabs component");
  }

  const { activeTab } = context;

  if (activeTab !== value) {
    return null;
  }

  return <div className={`mt-2 ${className}`}>{children}</div>;
}

export default function CustomComponentsDemo() {
  const receivedRequests = [
    {
      userId: "1",
      username: "alice_dev",
      imageUrl: "/placeholder.svg?height=40&width=40",
    },
    {
      userId: "2",
      username: "bob_designer",
      imageUrl: "/placeholder.svg?height=40&width=40",
    },
  ];

  const sentRequests = [
    {
      userId: "3",
      username: "charlie_pm",
      imageUrl: "/placeholder.svg?height=40&width=40",
    },
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Custom Components Demo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="received">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="received" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Received
              {receivedRequests.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {receivedRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Sent
              {sentRequests.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {sentRequests.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="mt-4">
            <div className="space-y-3">
              {receivedRequests.map((request) => (
                <div
                  key={request.userId}
                  className="flex items-center justify-between p-4 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)]"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={request.imageUrl || "/placeholder.svg"}
                        alt={request.username}
                      />
                      <AvatarFallback>
                        {request.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-[var(--text-color)]">
                        {request.username}
                      </p>
                      <p className="text-sm text-[var(--muted-color)]">
                        wants to be your friend
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">
                      <UserCheck className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button size="sm" variant="outline">
                      <UserX className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sent" className="mt-4">
            <div className="space-y-3">
              {sentRequests.map((request) => (
                <div
                  key={request.userId}
                  className="flex items-center justify-between p-4 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)]"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={request.imageUrl || "/placeholder.svg"}
                        alt={request.username}
                      />
                      <AvatarFallback>
                        {request.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-[var(--text-color)]">
                        {request.username}
                      </p>
                      <p className="text-sm text-[var(--muted-color)]">
                        Request pending
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Cancel
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
};
