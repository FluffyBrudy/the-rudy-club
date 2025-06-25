"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center py-12">
        <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--text-color)" }}
        >
          {error.message || "Something went wrong!"}
        </h2>
        <p className="mb-6" style={{ color: "var(--muted-color)" }}>
          We couldn&quot;t load your connected friends. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-colors duration-200 hover:opacity-90"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    </div>
  );
}
