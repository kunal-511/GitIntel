"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, GitFork, Users, TrendingUp, AlertTriangle, Code, Activity, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Import our new components
import GrowthChart from "@/components/charts/GrowthChart";
import LanguageChart from "@/components/charts/LanguageChart";
import ContributorChart from "@/components/charts/ContributorChart";
import RiskAssessment from "@/components/analytics/RiskAssessment";

import { AdvancedAnalytics } from "@/lib/github";




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

export default function AnalyticsPage() {
  const params = useParams();
  const owner = params.owner as string;
  const repo = params.repo as string;
  
  const [analytics, setAnalytics] = useState<AdvancedAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [competitiveAnalysis, setCompetitiveAnalysis] = useState<CompetitiveAnalysis | null>(null);
  const [loadingCompetitive, setLoadingCompetitive] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/github/advanced-analytics?owner=${owner}&name=${repo}`);
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
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <div className="text-red-400 text-lg mb-2">Error loading analytics</div>
          <div className="text-neutral-400">{error}</div>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
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
          <div className="flex items-center gap-3 flex-1">
            <Image
              src={repository.owner.avatarUrl}
              alt={repository.owner.login}
              width={48}
              height={48}
              className="rounded-full border border-blue-800"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-blue-200">{repository.fullName}</h1>
              <p className="text-neutral-400">{repository.description}</p>
              <div className="flex items-center gap-2 mt-2">
                {repository.language && (
                  <Badge variant="outline" className="text-cyan-300 border-cyan-700">
                    {repository.language}
                  </Badge>
                )}
                <Badge variant="outline" className="text-blue-300 border-blue-700">
                  {repository.stargazerCount.toLocaleString()} stars
                </Badge>
                <Badge variant="outline" className="text-green-300 border-green-700">
                  {repository.forkCount.toLocaleString()} forks
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-neutral-900 border border-blue-900/40">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-900/40">
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="growth" className="data-[state=active]:bg-blue-900/40">
              <TrendingUp className="h-4 w-4 mr-2" />
              Growth
            </TabsTrigger>
            <TabsTrigger value="contributors" className="data-[state=active]:bg-blue-900/40">
              <Users className="h-4 w-4 mr-2" />
              Contributors
            </TabsTrigger>
            <TabsTrigger value="technology" className="data-[state=active]:bg-blue-900/40">
              <Code className="h-4 w-4 mr-2" />
              Tech Stack
            </TabsTrigger>
            <TabsTrigger value="risk" className="data-[state=active]:bg-blue-900/40">
              <Shield className="h-4 w-4 mr-2" />
              Risk Assessment
            </TabsTrigger>
          </TabsList>

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
                    {trends.starsGrowth > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                    ) : (
                      <TrendingUp className="h-3 w-3 text-red-400 mr-1 rotate-180" />
                    )}
                    {Math.abs(trends.starsGrowth)}% growth
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
                    {trends.forksGrowth > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                    ) : (
                      <TrendingUp className="h-3 w-3 text-red-400 mr-1 rotate-180" />
                    )}
                    {Math.abs(trends.forksGrowth)}% growth
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
                    {contributors.length > 0 ? contributors.length : "N/A"}
                  </div>
                  <p className="text-xs text-neutral-400">
                    {contributors.length > 0 ? "Active contributors" : "Data unavailable"}
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
                    {Math.round((riskAssessment.busFactor.score + riskAssessment.maintenanceStatus.score + riskAssessment.communityHealth.score) / 3)}%
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
                {historical.length > 0 ? (
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
                    {trends.starsGrowth > 0 ? '+' : ''}{trends.starsGrowth}%
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
                    {trends.forksGrowth > 0 ? '+' : ''}{trends.forksGrowth}%
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
                    {trends.commitActivity > 0 ? '+' : ''}{trends.commitActivity}%
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
                {contributors.length > 0 ? (
                  <ContributorChart data={contributors} height={400} />
                ) : (
                  <div className="text-center py-8 text-neutral-400">
                    No contributor data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Contributors List */}
            {contributors.length > 0 && (
              <Card className="bg-neutral-900 border-blue-900/40">
                <CardHeader>
                  <CardTitle className="text-blue-200">Contributor Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contributors.slice(0, 8).map((contributor, index) => (
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
                          #{index + 1}
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
                  {technologyStack.languages.length > 0 ? (
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
                  {technologyStack.frameworks.length > 0 ? (
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

                  {technologyStack.languages.length > 0 && (
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
            {technologyStack.dependencies.length > 0 && (
              <Card className="bg-neutral-900 border-blue-900/40">
                <CardHeader>
                  <CardTitle className="text-blue-200">Dependencies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {technologyStack.dependencies.map((dep, index) => (
                      <div key={index} className="p-3 bg-neutral-800 rounded-lg">
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
            <RiskAssessment data={riskAssessment} />
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
    </div>
  );
}

 