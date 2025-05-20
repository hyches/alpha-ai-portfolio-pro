
import React from 'react';
import AppHeader from './AppHeader';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AppLayout = ({ children, title }: AppLayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-navy-900">
          {title && (
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
              <div className="mt-1 h-1 w-16 bg-teal rounded-full"></div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
