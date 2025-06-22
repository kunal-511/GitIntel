"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, CreditCard } from "lucide-react";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { data: session, status } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="w-full sticky top-0 z-40 bg-neutral-950/80 backdrop-blur border-b border-neutral-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-xl font-extrabold tracking-tight text-blue-400">GitIntel</span>
            <span className="hidden md:inline-block text-xs font-mono bg-blue-900 text-blue-200 px-2 py-0.5 rounded ml-2">beta</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="text-neutral-200 hover:text-blue-400 font-medium transition">Features</Link>
          <Link href="/#compare" className="text-neutral-200 hover:text-blue-400 font-medium transition">Compare</Link>
          <Link href="/#about" className="text-neutral-200 hover:text-blue-400 font-medium transition">About</Link>
          {session && (
            <Link href="/docs" className="text-neutral-200 hover:text-blue-400 font-medium transition">Docs</Link>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="border-blue-800 text-blue-300 hover:bg-blue-900/30">
            <a href="https://github.com/kunal-511/gitintel" target="_blank" rel="noopener noreferrer">
              <svg width="18" height="18" fill="currentColor" className="inline mr-1" viewBox="0 0 24 24">
                <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 2.92-.39c.99 0 1.99.13 2.92.39 2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z"/>
              </svg>
              GitHub
            </a>
          </Button>
          
          <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggleTheme} className="ml-1">
            {theme === "dark" ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07-1.41-1.41M6.34 6.34 4.93 4.93m12.02 0-1.41 1.41M6.34 17.66l-1.41 1.41"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
              </svg>
            )}
          </Button>

          {/* Authentication Section */}
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-neutral-800 animate-pulse" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                  {session.user.image ? (
                    <div className="relative h-8 w-8 rounded-full overflow-hidden">
                      <Image
                        src={session.user.image}
                        alt={session.user.name || session.user.email}
                        fill
                        className="object-cover"
                        sizes="32px"
                        onError={(e) => {
                          // Hide the image on error and show fallback
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {session.user.name?.charAt(0)?.toUpperCase() || session.user.email?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  {/* Fallback when image fails to load */}
                  {session.user.image && (
                    <div className="absolute inset-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-sm font-medium text-white">
                        {session.user.name?.charAt(0)?.toUpperCase() || session.user.email?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-neutral-900 border-neutral-700" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-neutral-100">
                      {session.user.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-neutral-400">
                      {session.user.email}
                    </p>
                    {session.user.plan && (
                      <span className="text-xs bg-blue-600 text-blue-100 px-2 py-0.5 rounded-full w-fit">
                        {session.user.plan}
                      </span>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-neutral-700" />
                <DropdownMenuItem asChild className="text-neutral-100 hover:bg-neutral-800">
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-neutral-100 hover:bg-neutral-800">
                  <Link href="/profile/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-neutral-100 hover:bg-neutral-800">
                  <Link href="/profile/billing">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-neutral-700" />
                <DropdownMenuItem 
                  className="text-neutral-100 hover:bg-neutral-800"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="text-neutral-200 hover:text-blue-400">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 