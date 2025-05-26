"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, GitFork, Eye, Users, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";


interface RepositoryAnalytics {
  repository: {
    id: string;
    name: string;
    fullName: string;
    description: string | null;
    url: string;
    stargazerCount: number;
    forkCount: number;
    watcherCount: number;
    language: string | null;
    topics: string[];
    createdAt: string;
    updatedAt: string;
    pushedAt: string;
    isArchived: boolean;
    isPrivate: boolean;
    owner: {
      login: string;
      type: string;
      avatarUrl: string;
    };
    license: {
      name: string;
      key: string;
    } | null;
  };
  contributors: number;
  releases: number;
  issues: {
    open: number;
    closed: number;
  };
  pullRequests: {
    open: number;
    closed: number;
    merged: number;
  };
  commits: {
    total: number;
    lastMonth: number;
  };
}

interface CompetitiveAnalysis {
  targetRepository: any;
  competitors: Array<{
    id: string;
    name: string;
    fullName: string;
    description: string | null;
    stargazerCount: number;
    forkCount: number;
    language: string | null;
    similarity: number;
    owner: {
      login: string;
      avatarUrl: string;
    };
  }>;
  analysis: {
    totalFound: number;
    averageStars: number;
    languageDistribution: Record<string, number>;
    competitivePosition: {
      position: string;
      percentile: number;
      betterThan: number;
      total: number;
    };
  };
}

export default function AnalyticsPage() {
  const params = useParams();
  const owner = params.owner as string;
  const repo = params.repo as string;
  
  const [analytics, setAnalytics] = useState<RepositoryAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [competitiveAnalysis, setCompetitiveAnalysis] = useState<CompetitiveAnalysis | null>(null);
  const [loadingCompetitive, setLoadingCompetitive] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/github/repository?owner=${owner}&name=${repo}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch repository analytics");
        }
        
        setAnalytics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (owner && repo) {
      fetchAnalytics();
    }
  }, [owner, repo]);

  const fetchCompetitiveAnalysis = async () => {
    try {
      setLoadingCompetitive(true);
      const response = await fetch(`/api/github/competitive-analysis?owner=${owner}&name=${repo}&limit=5`);
      const data = await response.json();
      
      if (response.ok) {
        setCompetitiveAnalysis(data);
      }
    } catch (err) {
      console.error("Failed to fetch competitive analysis:", err);
    } finally {
      setLoadingCompetitive(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-blue-400">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-neutral-400">No data available</div>
      </div>
    );
  }

  const { repository } = analytics;
  const healthScore = Math.round(
    (analytics.commits.lastMonth > 0 ? 25 : 0) +
    (analytics.issues.open < analytics.issues.closed ? 25 : 0) +
    (analytics.pullRequests.merged > analytics.pullRequests.open ? 25 : 0) +
    (repository.stargazerCount > 100 ? 25 : 0)
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Image
              src={repository.owner.avatarUrl}
              alt={repository.owner.login}
              width={48}
              height={48}
              className="rounded-full border border-blue-800"
            />
            <div>
              <h1 className="text-2xl font-bold text-blue-200">{repository.fullName}</h1>
              <p className="text-neutral-400">{repository.description}</p>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-neutral-900 border-blue-900/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-neutral-200">Stars</CardTitle>
              <Star className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-200">{repository.stargazerCount.toLocaleString()}</div>
              <p className="text-xs text-neutral-400">GitHub stars</p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-blue-900/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-neutral-200">Forks</CardTitle>
              <GitFork className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-200">{repository.forkCount.toLocaleString()}</div>
              <p className="text-xs text-neutral-400">Repository forks</p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-blue-900/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-neutral-200">Contributors</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-200">
                {analytics.contributors > 0 ? analytics.contributors : "N/A"}
              </div>
              <p className="text-xs text-neutral-400">
                {analytics.contributors > 0 ? "Active contributors" : "Data unavailable"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-blue-900/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-neutral-200">Health Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-200">{healthScore}%</div>
              <p className="text-xs text-neutral-400">Repository health</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Activity Overview */}
          <Card className="bg-neutral-900 border-blue-900/40">
            <CardHeader>
              <CardTitle className="text-blue-200">Activity Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Total Commits</span>
                <span className="text-blue-200 font-semibold">{analytics.commits.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Commits (Last Month)</span>
                <span className="text-green-400 font-semibold">{analytics.commits.lastMonth}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Total Releases</span>
                <span className="text-blue-200 font-semibold">{analytics.releases}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Primary Language</span>
                <span className="text-cyan-300 font-semibold">{repository.language || "N/A"}</span>
              </div>
            </CardContent>
          </Card>

          {/* Issues & PRs */}
          <Card className="bg-neutral-900 border-blue-900/40">
            <CardHeader>
              <CardTitle className="text-blue-200">Issues & Pull Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Open Issues</span>
                <span className="text-red-400 font-semibold">{analytics.issues.open}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Closed Issues</span>
                <span className="text-green-400 font-semibold">{analytics.issues.closed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Open PRs</span>
                <span className="text-yellow-400 font-semibold">{analytics.pullRequests.open}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Merged PRs</span>
                <span className="text-green-400 font-semibold">{analytics.pullRequests.merged}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Competitive Analysis Section */}
        <Card className="bg-neutral-900 border-blue-900/40 mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-blue-200">Competitive Analysis</CardTitle>
            <Button 
              onClick={fetchCompetitiveAnalysis} 
              disabled={loadingCompetitive}
              variant="outline"
              size="sm"
              className="border-blue-800 text-blue-300 hover:bg-blue-900/30"
            >
              {loadingCompetitive ? "Analyzing..." : "Analyze Competition"}
            </Button>
          </CardHeader>
          <CardContent>
            {competitiveAnalysis ? (
              <div className="space-y-6">
                {/* Competitive Position */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-neutral-800 rounded-lg">
                    <div className="text-2xl font-bold text-blue-200">
                      {competitiveAnalysis.analysis.competitivePosition.position}
                    </div>
                    <div className="text-sm text-neutral-400">Market Position</div>
                  </div>
                  <div className="text-center p-4 bg-neutral-800 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">
                      {competitiveAnalysis.analysis.competitivePosition.percentile}%
                    </div>
                    <div className="text-sm text-neutral-400">Better than competitors</div>
                  </div>
                  <div className="text-center p-4 bg-neutral-800 rounded-lg">
                    <div className="text-2xl font-bold text-cyan-400">
                      {Math.round(competitiveAnalysis.analysis.averageStars).toLocaleString()}
                    </div>
                    <div className="text-sm text-neutral-400">Avg competitor stars</div>
                  </div>
                </div>

                {/* Similar Repositories */}
                <div>
                  <h3 className="text-lg font-semibold text-blue-200 mb-4">Similar Repositories</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {competitiveAnalysis.competitors.map((competitor) => (
                      <div key={competitor.id} className="p-4 bg-neutral-800 rounded-lg border border-neutral-700">
                        <div className="flex items-center gap-3 mb-2">
                          <Image
                            src={competitor.owner.avatarUrl}
                            alt={competitor.owner.login}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-blue-200">{competitor.fullName}</div>
                            <div className="text-xs text-neutral-400">{competitor.language}</div>
                          </div>
                          <span className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-full">
                            {competitor.similarity}% similar
                          </span>
                        </div>
                        <p className="text-sm text-neutral-300 mb-2 line-clamp-2">
                          {competitor.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-neutral-400">
                          <span>⭐ {competitor.stargazerCount.toLocaleString()}</span>
                          <span>🍴 {competitor.forkCount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Language Distribution */}
                <div>
                  <h3 className="text-lg font-semibold text-blue-200 mb-4">Technology Landscape</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(competitiveAnalysis.analysis.languageDistribution).map(([lang, count]) => (
                      <span key={lang} className="px-2 py-1 border border-cyan-700 text-cyan-300 text-xs rounded-full">
                        {lang} ({count})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Insights */}
                <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-200 mb-2">💡 Insights</h3>
                  <ul className="space-y-1 text-sm text-neutral-300">
                    <li>• Your repository ranks in the <strong>{competitiveAnalysis.analysis.competitivePosition.position.toLowerCase()}</strong> tier among similar projects</li>
                    <li>• You're performing better than <strong>{competitiveAnalysis.analysis.competitivePosition.percentile}%</strong> of comparable repositories</li>
                    <li>• Average competitor has <strong>{Math.round(competitiveAnalysis.analysis.averageStars).toLocaleString()}</strong> stars vs your <strong>{repository.stargazerCount.toLocaleString()}</strong></li>
                    {competitiveAnalysis.analysis.competitivePosition.percentile < 50 && (
                      <li>• Consider studying top competitors' features and community engagement strategies</li>
                    )}
                    {competitiveAnalysis.analysis.competitivePosition.percentile >= 80 && (
                      <li>• You're a market leader! Focus on maintaining your competitive edge</li>
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-400">
                Click "Analyze Competition" to discover similar repositories and your competitive position
              </div>
            )}
          </CardContent>
        </Card>

        {/* Repository Info */}
        <Card className="bg-neutral-900 border-blue-900/40 mb-8">
          <CardHeader>
            <CardTitle className="text-blue-200">Repository Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-neutral-400 text-sm">Created</span>
                <p className="text-neutral-200">{new Date(repository.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-neutral-400 text-sm">Last Updated</span>
                <p className="text-neutral-200">{new Date(repository.updatedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-neutral-400 text-sm">License</span>
                <p className="text-neutral-200">{repository.license?.name || "No license"}</p>
              </div>
              <div>
                <span className="text-neutral-400 text-sm">Watchers</span>
                <p className="text-neutral-200">{repository.watcherCount}</p>
              </div>
            </div>
            {repository.topics.length > 0 && (
              <div>
                <span className="text-neutral-400 text-sm">Topics</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {repository.topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <a href={repository.url} target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </Button>
          <Button variant="outline" className="border-blue-800 text-blue-300 hover:bg-blue-900/30">
            Compare with Similar Repos
          </Button>
        </div>
      </div>
    </div>
  );
} 