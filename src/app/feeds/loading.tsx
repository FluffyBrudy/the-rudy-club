import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex w-full h-[80vh] justify-center items-center">
      <div className="flex flex-col items-center">
        <Loader2
          className="h-12 w-12 animate-spin mb-4"
          style={{ color: "var(--primary-color)" }}
        />
        <p
          className="text-lg font-medium"
          style={{ color: "var(--muted-color)" }}
        >
          Loading feed...
        </p>
      </div>
    </div>
  );
}
