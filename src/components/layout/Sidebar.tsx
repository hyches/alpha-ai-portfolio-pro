
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  BarChart2, 
  TrendingUp, 
  PieChart, 
  Newspaper, 
  Settings,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

const NavItem = ({ 
  icon: Icon, 
  label, 
  active = false, 
  collapsed = false,
  onClick
}: NavItemProps) => {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "flex items-center w-full justify-start gap-3 px-3 py-2 my-1 rounded-md transition-colors",
        active 
          ? "bg-teal/20 text-teal hover:bg-teal/30" 
          : "hover:bg-navy-700 text-muted-foreground"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </Button>
  );
};

const navItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: BarChart2, label: "Analytics", path: "/analytics" },
  { icon: TrendingUp, label: "Stocks", path: "/stocks" },
  { icon: PieChart, label: "Portfolio", path: "/portfolio" },
  { icon: Newspaper, label: "News", path: "/news" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside className={cn(
      "h-screen flex flex-col bg-navy-800 border-r border-white/10 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!collapsed && (
          <div className="font-bold text-xl flex items-center">
            <DollarSign className="h-6 w-6 text-teal mr-2" />
            <span className="text-teal">StockAI</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className={cn(
            "text-muted-foreground hover:text-foreground",
            collapsed ? "mx-auto" : ""
          )}
        >
          {collapsed ? 
            <ChevronRight className="h-5 w-5" /> : 
            <ChevronLeft className="h-5 w-5" />
          }
        </Button>
      </div>
      
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={activeItem === item.label}
            collapsed={collapsed}
            onClick={() => setActiveItem(item.label)}
          />
        ))}
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <div className={cn(
          "flex items-center",
          collapsed ? "justify-center" : "gap-3"
        )}>
          <div className="h-8 w-8 rounded-full bg-teal/20 flex items-center justify-center text-teal">
            U
          </div>
          {!collapsed && <div className="text-sm font-medium">User</div>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
