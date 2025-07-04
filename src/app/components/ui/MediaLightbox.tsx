import { useEffect } from "react";
import Image from "next/image";

type MediaLightboxProps = {
  open: boolean;
  imageUrl: string;
  onClose: () => void;
  alt?: string;
};

export default function MediaLightbox({
  open,
  imageUrl,
  onClose,
  alt,
}: MediaLightboxProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative max-w-[90vw] max-h-[90vh] animate-fadeIn"
        style={{ animation: "fadeIn 0.2s" }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={imageUrl}
          alt={alt || "Media"}
          width={1200}
          height={900}
          className="rounded-xl shadow-lg object-contain max-w-full max-h-[90vh] transition-transform duration-200 scale-100"
          priority
        />
        <button
          onClick={onClose}
          className="absolute top-0 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition"
          aria-label="Close"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>
      </div>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
