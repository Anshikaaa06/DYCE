import { cn } from "@/lib/utils";
import {
  Heart,
  Home,
  MessageCircle,
  User,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const BottomNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();

  // Get active tab based on current pathname
  const getActiveTab = () => {
    switch (pathname) {
      case "/matching":
        return "home";
      case "/messages":
        return "messages";
      // case "/blind-date":
      //   return "blinddate";
      case "/my-matches":
        return "my-matches";
      case "/profile":
        return "profile";
      default:
        return "home";
    }
  };

  const activeTab = getActiveTab();

  const handleNavigation = (tab: string) => {
    const routes = {
      home: "/matching",
      messages: "/messages",
      // blinddate: "/blind-date",
      profile: "/profile",
      "my-matches": "/my-matches",
    };

    const route = routes[tab as keyof typeof routes];
    if (route) {
      router.push(route);
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-dark/90 backdrop-blur-md border-t border-light/10 px-4 py-3 z-2">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button
            onClick={() => handleNavigation("home")}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 hover:scale-105",
              activeTab === "home"
                ? "bg-primary/20 text-primary"
                : "text-light/60 hover:text-light"
            )}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-rounded">Home</span>
          </button>

          <button
            onClick={() => handleNavigation("my-matches")}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 hover:scale-105",
              activeTab === "my-matches"
                ? "bg-primary/20 text-primary"
                : "text-light/60 hover:text-light"
            )}
          >
            <Heart className="w-6 h-6" />
            <span className="text-xs font-rounded">Matches</span>
          </button>

          {/* <button
            onClick={() => handleNavigation("blinddate")}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 hover:scale-105",
              activeTab === "blinddate"
                ? "bg-primary/20 text-primary"
                : "text-light/60 hover:text-light"
            )}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs font-rounded">Blind Date</span>
          </button> */}

          <button
            onClick={() => handleNavigation("messages")}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 hover:scale-105",
              activeTab === "messages"
                ? "bg-primary/20 text-primary"
                : "text-light/60 hover:text-light"
            )}
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs font-rounded">Messages</span>
          </button>

          <button
            onClick={() => handleNavigation("profile")}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 hover:scale-105",
              activeTab === "profile"
                ? "bg-primary/20 text-primary"
                : "text-light/60 hover:text-light"
            )}
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-rounded">Profile</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default BottomNavigation;
