import NotificationsContainer from "@/app/components/ui/NotificationComponents/NotificationBell";

export default function Page() {
  return (
    <div className="min-h-screen bg-[var(--bg-color)] py-8">
      <div className="container mx-auto px-4">
        <NotificationsContainer />
      </div>
    </div>
  );
}
