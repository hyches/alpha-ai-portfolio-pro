
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CustomCardProps {
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
}

const CustomCard = ({ 
  className, 
  title, 
  description, 
  children,
  headerAction 
}: CustomCardProps) => {
  return (
    <Card className={cn("overflow-hidden animate-fade-in shadow-md bg-card/90 backdrop-blur-sm border border-white/10", className)}>
      {(title || description) && (
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {headerAction && (
            <div className="flex items-center">
              {headerAction}
            </div>
          )}
        </CardHeader>
      )}
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default CustomCard;
