
import React from 'react';
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormGroupProps {
  htmlFor: string;
  label: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}

const FormGroup = ({
  htmlFor,
  label,
  error,
  optional = false,
  className,
  children,
}: FormGroupProps) => {
  return (
    <div className={cn("mb-4", className)}>
      <div className="flex justify-between items-center mb-2">
        <Label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
        </Label>
        {optional && (
          <span className="text-xs text-muted-foreground">Optional</span>
        )}
      </div>
      {children}
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default FormGroup;
