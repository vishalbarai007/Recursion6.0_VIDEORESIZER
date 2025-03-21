import React from "react";
import { Bell, HelpCircle, Search, Settings, User } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface DashboardHeaderProps {
  username?: string;
  avatarUrl?: string;
  notificationCount?: number;
}

const DashboardHeader = ({
  username = "John Doe",
  avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  notificationCount = 3,
}: DashboardHeaderProps) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 w-full">
      <div className="flex items-center">
        <div className="mr-8">
          <h1 className="text-xl font-bold text-primary">VideoAI</h1>
        </div>
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </Button>

        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0">
              <Avatar>
                <AvatarImage src={avatarUrl} alt={username} />
                <AvatarFallback>
                  {username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
