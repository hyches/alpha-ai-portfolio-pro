
import React, { useState, useEffect } from 'react';
import { Bell, Search, User, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { Toggle } from '@/components/ui/toggle';

const AppHeader = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [notificationCount, setNotificationCount] = useState(3);
  const { toast } = useToast();

  // Theme detection on initial load
  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDarkMode ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    toast({
      title: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode enabled`,
      duration: 1500,
    });
    // In a real implementation, this would also update the actual theme in the DOM
  };

  const handleNotificationClick = () => {
    if (notificationCount > 0) {
      // In a real app, this would mark notifications as read
      setNotificationCount(0);
    }
  };

  return (
    <header className="flex items-center justify-between p-4 border-b border-white/10 bg-navy-800">
      <div className="flex gap-2 items-center">
        <div className="font-bold text-2xl text-teal hidden md:block">StockAI</div>
        <div className="hidden md:block ml-8 w-96">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stocks..."
              className="pl-8 bg-secondary border-none"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <Toggle
          aria-label="Toggle theme"
          pressed={theme === 'dark'}
          onPressedChange={toggleTheme}
          className="data-[state=on]:bg-teal/20 data-[state=on]:text-teal"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Toggle>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground hover:bg-navy-700"
              onClick={handleNotificationClick}
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex flex-col">
                <span className="font-semibold">Portfolio Alert</span>
                <span className="text-xs text-muted-foreground">Apple (AAPL) is up by 5%</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex flex-col">
                <span className="font-semibold">Research Report Ready</span>
                <span className="text-xs text-muted-foreground">Tesla (TSLA) report is available</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex flex-col">
                <span className="font-semibold">Price Alert</span>
                <span className="text-xs text-muted-foreground">Microsoft (MSFT) reached target price</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-navy-700"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback className="bg-teal/20 text-teal">U</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline">John Doe</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AppHeader;
