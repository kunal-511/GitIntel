"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  Shield, 
  Activity, 
  Users, 
  Clock,
  TrendingUp
} from 'lucide-react';
import { RiskAssessment as RiskAssessmentType } from '@/lib/github';
import { format } from 'date-fns';

interface RiskAssessmentProps {
  data: RiskAssessmentType;
}

export default function RiskAssessment({ data }: RiskAssessmentProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
      case 'healthy':
      case 'active':
        return 'text-green-400';
      case 'medium':
      case 'moderate':
        return 'text-yellow-400';
      case 'high':
      case 'concerning':
      case 'inactive':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getRiskBadgeVariant = (level: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (level) {
      case 'low':
      case 'healthy':
      case 'active':
        return 'default';
      case 'medium':
      case 'moderate':
        return 'secondary';
      case 'high':
      case 'concerning':
      case 'inactive':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getProgressColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Overall Risk Summary */}
      <Card className="bg-neutral-900 border-blue-900/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-200">
            <Shield className="h-5 w-5" />
            Risk Assessment Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-neutral-800 rounded-lg">
              <div className="text-2xl font-bold text-blue-200 mb-1">
                {Math.round((data.busFactor.score + data.maintenanceStatus.score + data.communityHealth.score) / 3)}
              </div>
              <div className="text-sm text-neutral-400">Overall Health</div>
              <Progress 
                value={(data.busFactor.score + data.maintenanceStatus.score + data.communityHealth.score) / 3} 
                className="mt-2 h-2"
              />
            </div>
            <div className="text-center p-4 bg-neutral-800 rounded-lg">
              <div className={`text-2xl font-bold mb-1 ${getRiskColor(data.busFactor.level)}`}>
                {data.busFactor.level.toUpperCase()}
              </div>
              <div className="text-sm text-neutral-400">Bus Factor Risk</div>
              <Progress 
                value={data.busFactor.score} 
                className="mt-2 h-2"
              />
            </div>
            <div className="text-center p-4 bg-neutral-800 rounded-lg">
              <div className={`text-2xl font-bold mb-1 ${getRiskColor(data.maintenanceStatus.level)}`}>
                {data.maintenanceStatus.level.toUpperCase()}
              </div>
              <div className="text-sm text-neutral-400">Maintenance</div>
              <Progress 
                value={data.maintenanceStatus.score} 
                className="mt-2 h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Risk Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bus Factor */}
        <Card className="bg-neutral-900 border-blue-900/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-200">
              <Users className="h-5 w-5" />
              Bus Factor Analysis
              <Badge variant={getRiskBadgeVariant(data.busFactor.level)}>
                {data.busFactor.level}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-neutral-300">Risk Score</span>
              <span className={`font-semibold ${getRiskColor(data.busFactor.level)}`}>
                {data.busFactor.score}/100
              </span>
            </div>
            <Progress 
              value={data.busFactor.score} 
              className="h-3"
            />
            <div className="flex items-center justify-between">
              <span className="text-neutral-300">Key Contributors</span>
              <span className="text-blue-200 font-semibold">
                {data.busFactor.topContributors}
              </span>
            </div>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {data.busFactor.description}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Maintenance Status */}
        <Card className="bg-neutral-900 border-blue-900/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-200">
              <Activity className="h-5 w-5" />
              Maintenance Status
              <Badge variant={getRiskBadgeVariant(data.maintenanceStatus.level)}>
                {data.maintenanceStatus.level}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-neutral-300">Health Score</span>
              <span className={`font-semibold ${getRiskColor(data.maintenanceStatus.level)}`}>
                {data.maintenanceStatus.score}/100
              </span>
            </div>
            <Progress 
              value={data.maintenanceStatus.score} 
              className="h-3"
            />
            <div className="flex items-center justify-between">
              <span className="text-neutral-300">Last Commit</span>
              <span className="text-blue-200 font-semibold">
                {format(new Date(data.maintenanceStatus.lastCommit), 'MMM dd, yyyy')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-300">Avg Commits/Month</span>
              <span className="text-green-400 font-semibold">
                {data.maintenanceStatus.avgCommitsPerMonth}
              </span>
            </div>
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {data.maintenanceStatus.description}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Community Health */}
      <Card className="bg-neutral-900 border-blue-900/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-200">
            <TrendingUp className="h-5 w-5" />
            Community Health
            <Badge variant={getRiskBadgeVariant(data.communityHealth.level)}>
              {data.communityHealth.level}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-neutral-300">Health Score</span>
            <span className={`font-semibold ${getRiskColor(data.communityHealth.level)}`}>
              {data.communityHealth.score}/100
            </span>
          </div>
          <Progress 
            value={data.communityHealth.score} 
            className="h-3"
          />
          
          {data.communityHealth.factors.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-neutral-200 mb-2">Positive Factors:</h4>
              <div className="flex flex-wrap gap-2">
                {data.communityHealth.factors.map((factor, index) => (
                  <Badge key={index} variant="outline" className="text-green-400 border-green-400">
                    {factor}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {data.communityHealth.factors.length === 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                No positive community health indicators detected. Consider improving documentation, 
                increasing commit frequency, or encouraging more contributors.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 