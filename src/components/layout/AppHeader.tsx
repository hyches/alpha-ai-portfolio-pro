
import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AppHeader = () => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-white/10">
      <div className="flex gap-2 items-center">
        <div className="font-bold text-2xl text-teal">StockAI</div>
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
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent flex items-center justify-center text-[10px]">
            3
          </span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;
