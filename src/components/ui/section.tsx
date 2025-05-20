
import React from 'react';
import { cn } from "@/lib/utils";

interface SectionProps {
  className?: string;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

const Section = ({ 
  className, 
  title, 
  description, 
  children 
}: SectionProps) => {
  return (
    <div className={cn("mb-8", className)}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h2 className="text-xl font-semibold text-foreground">{title}</h2>}
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
};

export default Section;
