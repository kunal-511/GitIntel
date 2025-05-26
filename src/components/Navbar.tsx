import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  return (
    <nav className="w-full sticky top-0 z-40 bg-neutral-950/80 backdrop-blur border-b border-neutral-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <span className="text-xl font-extrabold tracking-tight text-blue-400">GitIntel</span>
          <span className="hidden md:inline-block text-xs font-mono bg-blue-900 text-blue-200 px-2 py-0.5 rounded ml-2">beta</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-neutral-200 hover:text-blue-400 font-medium transition">Features</a>
          <a href="#compare" className="text-neutral-200 hover:text-blue-400 font-medium transition">Compare</a>
          <a href="#about" className="text-neutral-200 hover:text-blue-400 font-medium transition">About</a>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="border-blue-800 text-blue-300 hover:bg-blue-900/30">
            <a href="https://github.com/kunal-511/gitintel" target="_blank" rel="noopener noreferrer">
              <svg width="18" height="18" fill="currentColor" className="inline mr-1" viewBox="0 0 24 24"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 2.92-.39c.99 0 1.99.13 2.92.39 2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z"/></svg>
              GitHub
            </a>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggleTheme} className="ml-1">
            {theme === "dark" ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07-1.41-1.41M6.34 6.34 4.93 4.93m12.02 0-1.41 1.41M6.34 17.66l-1.41 1.41"/></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
} 