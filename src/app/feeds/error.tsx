"use client";
import React, { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error occurred:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div
        role="alert"
        aria-live="assertive"
        className="generic-card max-w-md w-full p-6 rounded-lg shadow-md transition-colors"
      >
        <h2 className="text-2xl font-semibold mb-2 text-[var(--primary-color)]">
          Something went wrong!
        </h2>
        <p className="text-sm text-[var(--muted-color)] mb-4 break-words">
          {error.message}
        </p>
        <button
          onClick={reset}
          className="mt-2 inline-block bg-[var(--primary-color)] text-[var(--bg-color)] hover:bg-opacity-90 transition-colors px-4 py-2 rounded-md font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
