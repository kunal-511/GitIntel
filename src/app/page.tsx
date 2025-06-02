"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BackgroundEffect from "@/components/BackgroundEffect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";

interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  forkCount: number;
  language: string | null;
  owner: {
    login: string;
    avatarUrl: string;
  };
}

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compareTray, setCompareTray] = useState<Repository[]>([]);
  const [trayOpen, setTrayOpen] = useState(false);

  const parseSearchQuery = (query: string): string => {
    const trimmedQuery = query.trim();
    
    if (trimmedQuery.includes(':')) return trimmedQuery;
    
    if (trimmedQuery.includes('/')) return trimmedQuery;
    
    const parts = trimmedQuery.split(/\s+/);
    
    if (parts.length === 2) {
      const [firstPart, secondPart] = parts;
      if (firstPart.length > 0 && secondPart.length > 0 && 
          /^[a-zA-Z0-9_-]+$/.test(firstPart) && /^[a-zA-Z0-9_-]+$/.test(secondPart)) {
        return `${firstPart}/${secondPart}`;
      }
    }
    
    if (parts.length === 1 && parts[0].length > 0 && !parts[0].includes('/')) {
      return trimmedQuery;
    }
    
    return trimmedQuery;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const parsedQuery = parseSearchQuery(searchQuery);
      const response = await fetch(`/api/github/search?q=${encodeURIComponent(parsedQuery)}&limit=10`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to search repositories");
      setRepositories(data.repositories);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGetTrending = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/github/trending?period=week&limit=10");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch trending repositories");
      setRepositories(data.repositories);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCompare = (repo: Repository) => {
    if (!compareTray.find((r) => r.id === repo.id)) {
      setCompareTray([...compareTray, repo]);
      setTrayOpen(true);
    }
  };

  const handleRemoveFromCompare = (repoId: string) => {
    setCompareTray(compareTray.filter((r) => r.id !== repoId));
  };

  return (
    <>
      <BackgroundEffect />
      <Navbar />
      <main className="min-h-screen flex flex-col items-center px-4 pb-16">
        <HeroSection>
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center w-full">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              placeholder="Search by name, org/repo, or org repo format"
              className="w-full sm:w-80 bg-white"
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading} className="w-full sm:w-auto">
              {loading ? "Searching..." : "Search"}
            </Button>
            <Button variant="outline" onClick={handleGetTrending} disabled={loading} className="w-full sm:w-auto">
              Trending
            </Button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </HeroSection>

        {/* Results Grid */}
        <section className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {repositories.map((repo) => (
            <Card key={repo.id} className="bg-neutral-900 border border-blue-900/40 hover:shadow-blue-900/40 hover:shadow-lg transition-shadow">
              <Link href={`/analytics/${repo.owner.login}/${repo.name}`} className="block">
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <Image
                    src={repo.owner.avatarUrl}
                    alt={repo.owner.login}
                    width={32}
                    height={32}
                    className="rounded-full border border-blue-800"
                  />
                  <div>
                    <CardTitle className="text-base font-semibold text-blue-200">
                      <span className="hover:underline">
                        {repo.fullName}
                      </span>
                    </CardTitle>
                    <span className="text-xs text-cyan-300">{repo.language}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-200 mb-2 line-clamp-2 min-h-[40px]">{repo.description}</p>
                  <div className="flex items-center gap-4 text-xs text-blue-300 mb-2">
                    <span>⭐ {repo.stargazerCount.toLocaleString()}</span>
                    <span>🍴 {repo.forkCount.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Link>
              <CardContent className="pt-0">
                <Button
                  size="sm"
                  variant={compareTray.find((r) => r.id === repo.id) ? "secondary" : "default"}
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCompare(repo);
                  }}
                  disabled={!!compareTray.find((r) => r.id === repo.id)}
                  className="w-full"
                >
                  {compareTray.find((r) => r.id === repo.id) ? "Added" : "Compare"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Empty State */}
        {repositories.length === 0 && !loading && !error && (
          <div className="text-center text-gray-400 mt-16">
            Search for repositories or view trending ones to get started.
          </div>
        )}

        {/* Compare Tray (Sheet/Drawer) */}
        <Sheet open={trayOpen} onOpenChange={setTrayOpen}>
          <SheetTrigger asChild>
            {compareTray.length > 0 && (
              <Button
                className="fixed bottom-6 right-6 z-50 shadow-lg px-6 py-3 text-lg"
                onClick={() => setTrayOpen(true)}
              >
                Compare ({compareTray.length})
              </Button>
            )}
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-md">
            <SheetHeader>
              <SheetTitle>Compare Repositories</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              {compareTray.length === 0 ? (
                <div className="text-gray-500 text-center">No repositories selected.</div>
              ) : (
                compareTray.map((repo) => (
                  <Card key={repo.id} className="flex items-center gap-3 p-3">
                    <Image
                      src={repo.owner.avatarUrl}
                      alt={repo.owner.login}
                      width={28}
                      height={28}
                      className="rounded-full border"
                    />
                    <div className="flex-1">
                      <a href={repo.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                        {repo.fullName}
                      </a>
                      <div className="text-xs text-gray-500">{repo.language}</div>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => handleRemoveFromCompare(repo.id)}>
                      ✕
                    </Button>
                  </Card>
                ))
              )}
            </div>
            {compareTray.length > 1 && (
              <Button className="mt-6 w-full" onClick={() => alert("Comparison feature coming soon!")}>Compare Now</Button>
            )}
          </SheetContent>
        </Sheet>
      </main>
    </>
  );
}