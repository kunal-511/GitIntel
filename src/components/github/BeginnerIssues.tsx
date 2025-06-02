import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HandHelping, ChevronDown, ChevronUp } from "lucide-react";
import { formatDate } from '@/lib/utils';

interface BeginnerIssue {
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
}

interface BeginnerIssuesProps {
  issues: {
    totalCount: number;
    pageInfo?: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    nodes: BeginnerIssue[];
  };
}

// List of beginner-friendly label keywords (case-insensitive)
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

// Helper function to check if an issue has a beginner-friendly label
function hasBeginnersLabel(issue: BeginnerIssue): boolean {
  if (!issue.labels || !issue.labels.nodes || issue.labels.nodes.length === 0) {
    return false;
  }

  return issue.labels.nodes.some(label => {
    const labelName = label.name.toLowerCase();
    return BEGINNER_LABEL_KEYWORDS.some(keyword => 
      labelName.includes(keyword.toLowerCase())
    );
  });
}

export function BeginnerIssues({ issues }: BeginnerIssuesProps) {
  const [displayCount, setDisplayCount] = useState(10);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!issues || issues.totalCount === 0) {
    return null;
  }

  // Filter issues with beginner-friendly labels
  const beginnerFriendlyIssues = issues.nodes
    .filter(hasBeginnersLabel)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  if (beginnerFriendlyIssues.length === 0) {
    return null;
  }

  const visibleIssues = beginnerFriendlyIssues.slice(0, displayCount);
  const hasMoreIssues = beginnerFriendlyIssues.length > displayCount;

  const handleShowMore = () => {
    setDisplayCount(prev => Math.min(prev + 10, beginnerFriendlyIssues.length));
    setIsExpanded(true);
  };

  const handleShowLess = () => {
    setDisplayCount(10);
    setIsExpanded(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <HandHelping size={20} className="text-green-500" />
          Beginner-Friendly Issues ({beginnerFriendlyIssues.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {visibleIssues.map((issue) => (
            <div key={issue.id} className="border border-blue-900/40 rounded-lg p-4 hover:bg-blue-900/20 transition-colors">
              <a
                href={issue.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-medium flex items-start justify-between group"
              >
                <div>
                  <span className="text-gray-500">#{issue.number}</span> {issue.title}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {issue.labels.nodes.map((label) => (
                      <Badge
                        key={label.name}
                        variant="outline"
                        style={{
                          backgroundColor: `#${label.color}22`,
                          borderColor: `#${label.color}`,
                          color: `#${label.color}`,
                        }}
                      >
                        {label.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <span className="text-gray-500 text-sm">
                  {formatDate(issue.createdAt)}
                </span>
              </a>
            </div>
          ))}
        </div>
      </CardContent>
      {(hasMoreIssues || isExpanded) && (
        <CardFooter className="flex justify-center pt-2 pb-4">
          {hasMoreIssues && !isExpanded && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShowMore}
              className="flex items-center gap-1"
            >
              <ChevronDown size={16} />
              Show More Issues ({beginnerFriendlyIssues.length - displayCount} remaining)
            </Button>
          )}
          {hasMoreIssues && isExpanded && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShowMore}
              className="flex items-center gap-1"
            >
              <ChevronDown size={16} />
              Show More ({beginnerFriendlyIssues.length - displayCount} remaining)
            </Button>
          )}
          {isExpanded && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShowLess}
              className="flex items-center gap-1 ml-2"
            >
              <ChevronUp size={16} />
              Show Less
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
} 