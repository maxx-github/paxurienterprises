// src/components/shared/scroll-tracker-provider.tsx
"use client";

import { createContext, useContext, ReactNode } from "react";
import { useScrollTracker } from "./scroll-tracker";

interface ScrollTrackerContextType {
  activeSection: string;
  scrollProgress: number;
}

const ScrollTrackerContext = createContext<ScrollTrackerContextType | undefined>(undefined);

export function ScrollTrackerProvider({ children }: { children: ReactNode }) {
  const { activeSection, scrollProgress } = useScrollTracker();

  return (
    <ScrollTrackerContext.Provider value={{ activeSection, scrollProgress }}>
      {children}
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-grey-dark z-50">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </ScrollTrackerContext.Provider>
  );
}

export function useScrollTrackerContext() {
  const context = useContext(ScrollTrackerContext);
  if (context === undefined) {
    throw new Error("useScrollTrackerContext must be used within a ScrollTrackerProvider");
  }
  return context;
}