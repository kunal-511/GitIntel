"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {  Star, GitFork, Users, TrendingUp, AlertTriangle, Code, Activity, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import GrowthChart from "@/components/charts/GrowthChart";
import LanguageChart from "@/components/charts/LanguageChart";
import ContributorChart from "@/components/charts/ContributorChart";
import RiskAssessment from "@/components/analytics/RiskAssessment";
import { BeginnerIssuesDrawer } from "@/components/github/BeginnerIssuesDrawer";

import { Repository, HistoricalData, ContributorData, TechnologyStack, RiskAssessment as RiskAssessmentType } from "@/lib/github";


interface CompetitiveAnalysis {
  targetRepository: {
    id: string;
    name: string;
    fullName: string;
    description: string | null;
    stargazerCount: number;
    forkCount: number;
    language: string | null;
    owner: {
      login: string;
      avatarUrl: string;
    };
  };
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

interface ExtendedAnalytics {
  repository: Repository;
  contributors: ContributorData[];
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
  beginnerIssues?: {
    totalCount: number;
    nodes: Array<{
      id: string;
      number: number;
      title: string;
      url: string;
      createdAt: string;
      labels: {
        nodes: Array<{
          name: string;
          color: string;
        }>;
      };
    }>;
  };
  historical: HistoricalData[];
  technologyStack: TechnologyStack;
  riskAssessment: RiskAssessmentType;
  trends: {
    starsGrowth: number;
    forksGrowth: number;
    contributorsGrowth: number;
    commitActivity: number;
  };
}

// Helper function to check if repository has beginner-friendly issues
function hasBeginnersIssues(repository: Repository): boolean {
  if (!repository?.beginnerIssues?.nodes?.length) {
    return false;
  }
  
  const BEGINNER_LABEL_KEYWORDS = [
    'good first issue',
    'beginner',
    'starter',
    'easy',
    'help wanted',
    'first-timer',
    'first timer',
    'good-first-issue',
    'good first',
    'help-wanted',
    'up-for-grabs',
    'low hanging fruit',
    'new contributor',
    'entry level',
    'easy pick',
    'easy fix',
    'newbie',
    'junior',
    'trivial',
  ];
  
  return repository.beginnerIssues.nodes.some((issue) => {
    if (!issue.labels?.nodes?.length) return false;
    
    return issue.labels.nodes.some((label) => {
      const labelName = label.name.toLowerCase();
      return BEGINNER_LABEL_KEYWORDS.some(keyword => 
        labelName.includes(keyword.toLowerCase())
      );
    });
  });
}

export default function AnalyticsPage() {
  const params = useParams();
  const owner = params.owner as string;
  const repo = params.repo as string;
  
  const [analytics, setAnalytics] = useState<ExtendedAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [competitiveAnalysis, setCompetitiveAnalysis] = useState<CompetitiveAnalysis | null>(null);
  const [loadingCompetitive, setLoadingCompetitive] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout
        
        const response = await fetch(`/api/github/advanced-analytics?owner=${owner}&name=${repo}`, {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        
        clearTimeout(timeoutId);
        
        const data = await response.json();
        
        if (!response.ok) {
          // Handle specific error cases
          if (response.status === 404) {
            throw new Error(`Repository "${owner}/${repo}" not found or is private`);
          } else if (response.status === 408) {
            throw new Error("Request timed out. This repository might be very large. Please try again.");
          } else if (response.status === 429) {
            throw new Error("Too many requests. Please wait a moment and try again.");
          } else {
            throw new Error(data.error || "Failed to fetch repository analytics");
          }
        }
        
        setAnalytics(data as ExtendedAnalytics);
      } catch (err) {
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            setError("Request timed out. Please try again.");
          } else {
            setError(err.message);
          }
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
        console.error("Analytics fetch error:", err);
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <div className="text-blue-400">Loading advanced analytics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <div className="text-red-400 text-lg mb-2">Error loading analytics</div>
          <div className="text-neutral-400 mb-4">{error}</div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="border-blue-800 text-blue-300 hover:bg-blue-900/30"
            >
              Try Again
            </Button>
            <Button 
              onClick={() => window.history.back()} 
              variant="ghost"
              className="text-neutral-400 hover:text-neutral-200"
            >
              Go Back
            </Button>
          </div>
          <div className="mt-4 text-xs text-neutral-500">
            If the problem persists, the repository might be private, very large, or temporarily unavailable.
          </div>
        </div>
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

  const { repository, historical, contributors, technologyStack, riskAssessment, trends } = analytics;
  const hasBeginnerIssues = hasBeginnersIssues(repository);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Repository Header */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Image
              src={repository.owner.avatarUrl}
              alt={repository.owner.login}
              width={48}
              height={48}
              className="rounded-full border border-blue-800 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg sm:text-2xl font-bold text-blue-200 break-words">
                {repository.fullName}
              </CardTitle>
              <p className="text-gray-400 mt-1 text-sm sm:text-base line-clamp-2">{repository.description}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 sm:mt-0 w-full sm:w-auto">
              <span className="flex items-center gap-1 text-yellow-400">
                <Star size={16} /> {repository.stargazerCount.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-blue-400">
                <GitFork size={16} /> {repository.forkCount.toLocaleString()}
              </span>
              {repository.language && (
                <Badge variant="outline" className="text-cyan-400 border-cyan-800">
                  {repository.language}
                </Badge>
              )}
            </div>
            
            {hasBeginnerIssues && repository.beginnerIssues && (
              <BeginnerIssuesDrawer 
                issues={repository.beginnerIssues} 
                repositoryName={repository.name}
              />
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Tabs Navigation */}
      <Tabs defaultValue="overview" className="w-full">
        <div 
          className="relative overflow-x-auto" 
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none' 
          }}
        >
          <TabsList 
            className="w-full flex sm:grid sm:grid-cols-5 bg-neutral-900 border border-blue-900/40"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <TabsTrigger 
              value="overview" 
              className="flex-1 min-w-[4rem] px-3 py-3 sm:py-2 data-[state=active]:bg-blue-900/40 flex items-center justify-center whitespace-nowrap"
              title="Overview"
            >
              <Activity className="h-5 w-5 sm:h-4 sm:w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="growth" 
              className="flex-1 min-w-[4rem] px-3 py-3 sm:py-2 data-[state=active]:bg-blue-900/40 flex items-center justify-center whitespace-nowrap"
              title="Growth"
            >
              <TrendingUp className="h-5 w-5 sm:h-4 sm:w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Growth</span>
            </TabsTrigger>
            <TabsTrigger 
              value="contributors" 
              className="flex-1 min-w-[4rem] px-3 py-3 sm:py-2 data-[state=active]:bg-blue-900/40 flex items-center justify-center whitespace-nowrap"
              title="Contributors"
            >
              <Users className="h-5 w-5 sm:h-4 sm:w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Contributors</span>
            </TabsTrigger>
            <TabsTrigger 
              value="technology" 
              className="flex-1 min-w-[4rem] px-3 py-3 sm:py-2 data-[state=active]:bg-blue-900/40 flex items-center justify-center whitespace-nowrap"
              title="Technology Stack"
            >
              <Code className="h-5 w-5 sm:h-4 sm:w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Tech</span>
            </TabsTrigger>
            <TabsTrigger 
              value="risk" 
              className="flex-1 min-w-[4rem] px-3 py-3 sm:py-2 data-[state=active]:bg-blue-900/40 flex items-center justify-center whitespace-nowrap"
              title="Risk Assessment"
            >
              <Shield className="h-5 w-5 sm:h-4 sm:w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Risk</span>
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="text-xs text-blue-400/50 mt-1 text-center sm:hidden">
          Swipe to see more tabs
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-neutral-900 border-blue-900/40">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-neutral-200">Stars</CardTitle>
                <Star className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-200">{repository.stargazerCount.toLocaleString()}</div>
                <p className="text-xs text-neutral-400 flex items-center">
                  {trends?.starsGrowth > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                  ) : (
                    <TrendingUp className="h-3 w-3 text-red-400 mr-1 rotate-180" />
                  )}
                  {Math.abs(trends?.starsGrowth ?? 0)}% growth
                </p>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-blue-900/40">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-neutral-200">Forks</CardTitle>
                <GitFork className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-200">{repository.forkCount.toLocaleString()}</div>
                <p className="text-xs text-neutral-400 flex items-center">
                  {trends?.forksGrowth > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                  ) : (
                    <TrendingUp className="h-3 w-3 text-red-400 mr-1 rotate-180" />
                  )}
                  {Math.abs(trends?.forksGrowth ?? 0)}% growth
                </p>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-blue-900/40">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-neutral-200">Contributors</CardTitle>
                <Users className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-200">
                  {contributors?.length?.toLocaleString() ?? 0}
                </div>
                <p className="text-xs text-neutral-400">
                  Active contributors
                </p>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-blue-900/40">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-neutral-200">Health Score</CardTitle>
                <Shield className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-200">
                  {Math.round(
                    ((riskAssessment?.busFactor?.score ?? 0) + 
                     (riskAssessment?.maintenanceStatus?.score ?? 0) + 
                     (riskAssessment?.communityHealth?.score ?? 0)) / 3
                  )}%
                </div>
                <p className="text-xs text-neutral-400">Overall health</p>
              </CardContent>
            </Card>
          </div>

          {/* Competitive Analysis */}
          <Card className="bg-neutral-900 border-blue-900/40">
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
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-400">
                  Click &quot;Analyze Competition&quot; to discover similar repositories and your competitive position
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Growth Trends Tab */}
        <TabsContent value="growth" className="space-y-6">
          <Card className="bg-neutral-900 border-blue-900/40">
            <CardHeader>
              <CardTitle className="text-blue-200">Historical Growth Trends</CardTitle>
            </CardHeader>
            <CardContent>
              {historical?.length > 0 ? (
                <GrowthChart data={historical} height={400} />
              ) : (
                <div className="text-center py-8 text-neutral-400">
                  No historical data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Growth Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-neutral-900 border-blue-900/40">
              <CardHeader>
                <CardTitle className="text-blue-200">Stars Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {trends?.starsGrowth > 0 ? '+' : ''}{trends?.starsGrowth ?? 0}%
                </div>
                <p className="text-sm text-neutral-400">Last 3 months vs previous 3 months</p>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-blue-900/40">
              <CardHeader>
                <CardTitle className="text-blue-200">Forks Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {trends?.forksGrowth > 0 ? '+' : ''}{trends?.forksGrowth ?? 0}%
                </div>
                <p className="text-sm text-neutral-400">Last 3 months vs previous 3 months</p>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-blue-900/40">
              <CardHeader>
                <CardTitle className="text-blue-200">Commit Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {trends?.commitActivity > 0 ? '+' : ''}{trends?.commitActivity ?? 0}%
                </div>
                <p className="text-sm text-neutral-400">Recent activity trend</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contributors Tab */}
        <TabsContent value="contributors" className="space-y-6">
          <Card className="bg-neutral-900 border-blue-900/40">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-blue-200">Top Contributors</CardTitle>
              <Link href={`/contributors/${owner}/${repo}`}>
                <Button variant="outline" size="sm" className="border-blue-800 text-blue-300 hover:bg-blue-900/30">
                  View Detailed Analysis
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {contributors?.length > 0 ? (
                <ContributorChart data={contributors} height={400} />
              ) : (
                <div className="text-center py-8 text-neutral-400">
                  No contributor data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Contributors List */}
          {contributors?.length > 0 && (
            <Card className="bg-neutral-900 border-blue-900/40">
              <CardHeader>
                <CardTitle className="text-blue-200">Contributor Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contributors.slice(0, 8).map((contributor) => (
                    <div key={contributor.login} className="flex items-center gap-3 p-3 bg-neutral-800 rounded-lg">
                      <Image
                        src={contributor.avatarUrl}
                        alt={contributor.login}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-blue-200">{contributor.login}</div>
                        <div className="text-sm text-neutral-400">{contributor.contributions} contributions</div>
                      </div>
                      <Badge variant="outline" className="text-purple-300 border-purple-700">
                        #{contributors.indexOf(contributor) + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Technology Stack Tab */}
        <TabsContent value="technology" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Language Distribution */}
            <Card className="bg-neutral-900 border-blue-900/40">
              <CardHeader>
                <CardTitle className="text-blue-200">Language Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {technologyStack?.languages?.length > 0 ? (
                  <LanguageChart data={technologyStack.languages} height={300} />
                ) : (
                  <div className="text-center py-8 text-neutral-400">
                    No language data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Frameworks & Technologies */}
            <Card className="bg-neutral-900 border-blue-900/40">
              <CardHeader>
                <CardTitle className="text-blue-200">Frameworks & Technologies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {technologyStack?.frameworks?.length > 0 ? (
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-200 mb-2">Detected Frameworks:</h4>
                    <div className="flex flex-wrap gap-2">
                      {technologyStack.frameworks.map((framework, index) => (
                        <Badge key={index} variant="outline" className="text-cyan-300 border-cyan-700">
                          {framework}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-neutral-400">No frameworks detected</div>
                )}

                {technologyStack?.languages?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-200 mb-2">Language Breakdown:</h4>
                    <div className="space-y-2">
                      {technologyStack.languages.slice(0, 5).map((lang) => (
                        <div key={lang.name} className="flex items-center justify-between">
                          <span className="text-neutral-300">{lang.name}</span>
                          <span className="text-blue-200 font-semibold">{lang.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Dependencies */}
          {technologyStack?.dependencies?.length > 0 && (
            <Card className="bg-neutral-900 border-blue-900/40">
              <CardHeader>
                <CardTitle className="text-blue-200">Dependencies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {technologyStack.dependencies.map((dep) => (
                    <div key={dep.name} className="p-3 bg-neutral-800 rounded-lg">
                      <div className="font-semibold text-blue-200">{dep.name}</div>
                      <div className="text-sm text-neutral-400">{dep.version}</div>
                      <Badge 
                        variant={dep.type === 'dependency' ? 'default' : 'secondary'} 
                        className="mt-1 text-xs"
                      >
                        {dep.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Risk Assessment Tab */}
        <TabsContent value="risk" className="space-y-6">
          {riskAssessment ? (
            <RiskAssessment data={riskAssessment} />
          ) : (
            <Card className="bg-neutral-900 border-blue-900/40">
              <CardContent>
                <div className="text-center py-8 text-neutral-400">
                  No risk assessment data available
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex gap-4 mt-8">
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <a href={repository.url} target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </Button>
        <Button variant="outline" className="border-blue-800 text-blue-300 hover:bg-blue-900/30">
          Export Report
        </Button>
      </div>
    </div>
  );
}

 