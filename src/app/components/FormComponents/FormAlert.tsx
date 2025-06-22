"use client";

import { CheckCircle, XCircle } from "lucide-react";

interface FormAlertProps {
  type: "success" | "error";
  message: string;
}

export default function FormAlert({ type, message }: FormAlertProps) {
  const isSuccess = type === "success";

  return (
    <div
      className={`p-4 rounded-lg flex items-center gap-3 ${
        isSuccess
          ? "bg-green-50 dark:bg-green-900/20"
          : "bg-red-50 dark:bg-red-900/20"
      }`}
      style={{
        backgroundColor: isSuccess
          ? "rgba(34, 197, 94, 0.1)"
          : "rgba(239, 68, 68, 0.1)",
        border: `1px solid ${isSuccess ? "#22c55e" : "#ef4444"}`,
      }}
    >
      {isSuccess ? (
        <CheckCircle className="w-5 h-5 text-green-600" />
      ) : (
        <XCircle className="w-5 h-5 text-red-600" />
      )}
      <p
        className={`text-sm font-medium ${
          isSuccess ? "text-green-700" : "text-red-700"
        }`}
      >
        {message}
      </p>
    </div>
  );
}
