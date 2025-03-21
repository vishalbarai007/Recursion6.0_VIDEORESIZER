import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Upload,
  History,
  Settings,
  HelpCircle,
  Home,
  BarChart,
  Users,
  LogOut,
} from "lucide-react";
import { logout } from "@/lib/api";
import { useUser } from "@/lib/hooks";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem = ({
  icon,
  label,
  href,
  active = false,
}: SidebarItemProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={href} className="block">
            <Button
              variant={active ? "secondary" : "ghost"}
              size="lg"
              className={cn(
                "w-full justify-start gap-3 mb-1 text-left",
                active ? "bg-secondary" : "hover:bg-secondary/50",
              )}
            >
              {icon}
              <span>{label}</span>
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface SidebarProps {
  activePath?: string;
}

const Sidebar = ({ activePath = "/dashboard" }: SidebarProps) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [userData, setUserData] = useState({
    name: "User",
    email: "user@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
  });

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "User",
        email: user.email || "user@example.com",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || "user"}`,
      });
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const mainNavItems = [
    { icon: <Upload size={20} />, label: "Upload", href: "/dashboard" },
    {
      icon: <History size={20} />,
      label: "History",
      href: "/dashboard/history",
    },
    {
      icon: <BarChart size={20} />,
      label: "Analytics",
      href: "/dashboard/analytics",
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      href: "/dashboard/settings",
    },
  ];

  const secondaryNavItems = [
    { icon: <Users size={20} />, label: "Account", href: "/dashboard/account" },
    { icon: <HelpCircle size={20} />, label: "Help", href: "/dashboard/help" },
    { icon: <Home size={20} />, label: "Back to Home", href: "/" },
  ];

  return (
    <div className="w-64 h-full bg-background border-r flex flex-col">
      {/* Logo and branding */}
      <div className="p-4 border-b">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">VA</span>
          </div>
          <span className="font-bold text-xl">VideoAI</span>
        </Link>
      </div>

      {/* User profile */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <img
            src={userData.avatar}
            alt="User avatar"
            className="w-10 h-10 rounded-full"
          />
          <div className="overflow-hidden">
            <p className="font-medium truncate">{userData.name}</p>
            <p className="text-sm text-muted-foreground truncate">
              {userData.email}
            </p>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={activePath === item.href}
            />
          ))}
        </div>

        <div className="mt-8">
          <p className="text-xs font-medium text-muted-foreground mb-2 px-4">
            GENERAL
          </p>
          <div className="space-y-1">
            {secondaryNavItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={activePath === item.href}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t mt-auto">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
