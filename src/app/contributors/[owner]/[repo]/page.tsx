"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Users, 
  GitCommit, 
  TrendingUp, 
  Calendar,
  Activity,
  Plus,
  Minus,
  Eye,
  EyeOff
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

// Import our chart components
import CommitActivityChart from "@/components/charts/CommitActivityChart";
import ContributorActivityChart from "@/components/charts/ContributorActivityChart";

import { ContributorInsights, DetailedContributor } from "@/lib/github";

type Period = 'week' | 'month' | 'quarter' | 'year' | 'all';

export default function ContributorsPage() {
  const params = useParams();
  const owner = params.owner as string;
  const repo = params.repo as string;
  
  const [insights, setInsights] = useState<ContributorInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>('year');
  const [selectedContributor, setSelectedContributor] = useState<DetailedContributor | null>(null);
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [showAdditions, setShowAdditions] = useState(false);
  const [showDeletions, setShowDeletions] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/github/contributor-insights?owner=${owner}&name=${repo}&period=${period}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch contributor insights");
        }
        
        setInsights(data);
        if (data.contributors.length > 0 && !selectedContributor) {
          setSelectedContributor(data.contributors[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (owner && repo) {
      fetchInsights();
    }
  }, [owner, repo, period]);

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
  };

  const getPeriodLabel = (period: Period) => {
    switch (period) {
      case 'week': return 'Last Week';
      case 'month': return 'Last Month';
      case 'quarter': return 'Last 3 Months';
      case 'year': return 'Last Year';
      case 'all': return 'All Time';
      default: return 'Last Year';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <div className="text-blue-400">Loading contributor insights...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-2">Error loading contributors</div>
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

  if (!insights) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-neutral-400">No data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href={`/analytics/${owner}/${repo}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-blue-200">
                Contributors - {owner}/{repo}
              </h1>
              <p className="text-neutral-400">
                Detailed contributor analysis and commit activity
              </p>
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex items-center gap-4">
            <Select value={period} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-40 bg-neutral-900 border-blue-900/40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-blue-900/40">
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last 3 Months</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-neutral-900 border-blue-900/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-neutral-200">Total Contributors</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-200">{insights.totalContributors}</div>
              <p className="text-xs text-neutral-400">
                {insights.activeContributors} active in {getPeriodLabel(period).toLowerCase()}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-blue-900/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-neutral-200">Total Commits</CardTitle>
              <GitCommit className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-200">{insights.totalCommits.toLocaleString()}</div>
              <p className="text-xs text-neutral-400">
                In {getPeriodLabel(period).toLowerCase()}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-blue-900/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-neutral-200">Avg Commits/Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-200">{insights.periodStats.avgCommitsPerWeek}</div>
              <p className="text-xs text-neutral-400">
                Weekly average
              </p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-blue-900/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-neutral-200">Period</CardTitle>
              <Calendar className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-blue-200">{getPeriodLabel(period)}</div>
              <p className="text-xs text-neutral-400">
                {format(new Date(insights.periodStats.startDate), 'MMM dd')} - {format(new Date(insights.periodStats.endDate), 'MMM dd')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-neutral-900 border border-blue-900/40">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-900/40">
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="individual" className="data-[state=active]:bg-blue-900/40">
              <Users className="h-4 w-4 mr-2" />
              Individual Analysis
            </TabsTrigger>
            <TabsTrigger value="contributors" className="data-[state=active]:bg-blue-900/40">
              <GitCommit className="h-4 w-4 mr-2" />
              Contributors List
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-neutral-900 border-blue-900/40">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-blue-200">Commit Activity Over Time</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={chartType === 'area' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('area')}
                    className="text-xs"
                  >
                    Area
                  </Button>
                  <Button
                    variant={chartType === 'bar' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('bar')}
                    className="text-xs"
                  >
                    Bar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {insights.commitsByWeek.length > 0 ? (
                  <CommitActivityChart 
                    data={insights.commitsByWeek} 
                    height={400} 
                    type={chartType}
                  />
                ) : (
                  <div className="text-center py-8 text-neutral-400">
                    No commit activity data available for this period
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Individual Analysis Tab */}
          <TabsContent value="individual" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Contributor Selector */}
              <Card className="bg-neutral-900 border-blue-900/40">
                <CardHeader>
                  <CardTitle className="text-blue-200">Select Contributor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                  {insights.contributors.slice(0, 20).map((contributor) => (
                    <div
                      key={contributor.login}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedContributor?.login === contributor.login
                          ? 'bg-blue-900/40 border border-blue-700'
                          : 'bg-neutral-800 hover:bg-neutral-700'
                      }`}
                      onClick={() => setSelectedContributor(contributor)}
                    >
                      <Image
                        src={contributor.avatarUrl}
                        alt={contributor.login}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-blue-200 truncate">
                          {contributor.login}
                        </div>
                        <div className="text-xs text-neutral-400">
                          {contributor.contributions} commits
                        </div>
                      </div>
                      {contributor.isActive && (
                        <Badge variant="outline" className="text-green-400 border-green-700 text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Individual Contributor Chart */}
              <div className="lg:col-span-3">
                <Card className="bg-neutral-900 border-blue-900/40">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-blue-200">
                      {selectedContributor?.login || 'Select a contributor'}
                    </CardTitle>
                                         {selectedContributor && (
                       <div className="flex items-center gap-2">
                         <Button
                           variant={showAdditions ? 'default' : 'outline'}
                           size="sm"
                           onClick={() => setShowAdditions(!showAdditions)}
                           className="text-xs"
                           disabled={!selectedContributor.commitHistory.some(h => h.additions > 0)}
                         >
                           <Plus className="h-3 w-3 mr-1" />
                           {showAdditions ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                         </Button>
                         <Button
                           variant={showDeletions ? 'default' : 'outline'}
                           size="sm"
                           onClick={() => setShowDeletions(!showDeletions)}
                           className="text-xs"
                           disabled={!selectedContributor.commitHistory.some(h => h.deletions > 0)}
                         >
                           <Minus className="h-3 w-3 mr-1" />
                           {showDeletions ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                         </Button>
                       </div>
                     )}
                  </CardHeader>
                  <CardContent>
                    {selectedContributor ? (
                      <div className="space-y-4">
                        {/* Contributor Stats */}
                                                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                           <div className="text-center p-3 bg-neutral-800 rounded-lg">
                             <div className="text-lg font-bold text-blue-200">
                               {selectedContributor.contributions}
                             </div>
                             <div className="text-xs text-neutral-400">Total Commits</div>
                           </div>
                           <div className="text-center p-3 bg-neutral-800 rounded-lg">
                             <div className="text-lg font-bold text-green-400">
                               {selectedContributor.totalAdditions > 0 ? selectedContributor.totalAdditions.toLocaleString() : 'N/A'}
                             </div>
                             <div className="text-xs text-neutral-400">Additions</div>
                           </div>
                           <div className="text-center p-3 bg-neutral-800 rounded-lg">
                             <div className="text-lg font-bold text-red-400">
                               {selectedContributor.totalDeletions > 0 ? selectedContributor.totalDeletions.toLocaleString() : 'N/A'}
                             </div>
                             <div className="text-xs text-neutral-400">Deletions</div>
                           </div>
                           <div className="text-center p-3 bg-neutral-800 rounded-lg">
                             <div className="text-lg font-bold text-purple-400">
                               {selectedContributor.weeklyAverage}
                             </div>
                             <div className="text-xs text-neutral-400">Avg/Week</div>
                           </div>
                         </div>

                        {/* Activity Chart */}
                        {selectedContributor.commitHistory.length > 0 ? (
                          <ContributorActivityChart
                            data={selectedContributor.commitHistory}
                            contributorName={selectedContributor.login}
                            height={350}
                            showAdditions={showAdditions}
                            showDeletions={showDeletions}
                          />
                        ) : (
                          <div className="text-center py-8 text-neutral-400">
                            No commit history available for this contributor in the selected period
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-neutral-400">
                        Select a contributor to view their detailed activity
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Contributors List Tab */}
          <TabsContent value="contributors" className="space-y-6">
            <Card className="bg-neutral-900 border-blue-900/40">
              <CardHeader>
                <CardTitle className="text-blue-200">All Contributors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {insights.contributors.map((contributor, index) => (
                    <div key={contributor.login} className="flex items-center gap-3 p-4 bg-neutral-800 rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        <Image
                          src={contributor.avatarUrl}
                          alt={contributor.login}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-blue-200 truncate">
                            {contributor.name || contributor.login}
                          </div>
                          <div className="text-sm text-neutral-400 truncate">
                            @{contributor.login}
                          </div>
                          <div className="text-xs text-neutral-500">
                            {contributor.contributions} commits • {contributor.weeklyAverage} avg/week
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline" className="text-purple-300 border-purple-700">
                          #{index + 1}
                        </Badge>
                        {contributor.isActive && (
                          <Badge variant="outline" className="text-green-400 border-green-700 text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 