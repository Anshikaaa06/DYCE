import { useAuthStore } from "@/stores/auth-store";
import { Inbox } from "@novu/nextjs";
import { Bell } from "lucide-react";

function NotificationWidget() {
  const { user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return null;
  }
  
  return (
    <Inbox
      applicationIdentifier={process.env.NEXT_PUBLIC_NOVU_APP_ID!}
      subscriberId={user.id}
      renderBell={(unreadCount) => {
        return (
          <div className="relative">
            <Bell className="w-6 h-6 text-white" />
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {unreadCount}
            </span>
          </div>
        );
      }}
      appearance={{
        variables: {
          colorPrimary: "#a06cd5",
          colorForeground: "#0E121B",
        },
      }}
    />
  );
}
export default NotificationWidget;
