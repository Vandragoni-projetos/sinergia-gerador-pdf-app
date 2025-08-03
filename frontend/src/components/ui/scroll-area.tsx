// src/components/ui/ScrollArea.tsx
import React from "react";

export const ScrollArea = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="overflow-y-auto max-h-96 p-4 rounded-md border">
      {children}
    </div>
  );
};
