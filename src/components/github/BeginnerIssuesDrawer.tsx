import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { HandHelping, ChevronDown, ChevronUp, X, ExternalLink } from "lucide-react";
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

interface BeginnerIssuesDrawerProps {
  issues: {
    totalCount: number;
    pageInfo?: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    nodes: BeginnerIssue[];
  };
  repositoryName: string;
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

export function BeginnerIssuesDrawer({ issues, repositoryName }: BeginnerIssuesDrawerProps) {
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
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm border-green-800 text-green-400 hover:bg-green-900/20 px-2 md:px-3 py-1.5 md:py-2"
        >
          <HandHelping size={14} className="flex-shrink-0 md:w-4 md:h-4" />
          <span className="truncate">
            Beginner Issues ({beginnerFriendlyIssues.length})
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full w-full md:w-[600px] lg:w-[700px] xl:w-[800px] md:max-w-[85vw]">
        <div className="flex flex-col h-full">
          <DrawerHeader className="border-b border-neutral-800 px-4 py-3 md:px-6 md:py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 pr-4">
                <DrawerTitle className="text-lg md:text-xl flex items-center gap-2">
                  <HandHelping size={18} className="text-green-500 md:w-5 md:h-5" />
                  <span className="truncate">Beginner-Friendly Issues</span>
                </DrawerTitle>
                <DrawerDescription className="text-neutral-400 text-sm md:text-base mt-1">
                  {beginnerFriendlyIssues.length} beginner-friendly issues found in {repositoryName}
                </DrawerDescription>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                  <X size={16} />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          
          <div className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-6">
            <div className="space-y-3 md:space-y-4">
              {visibleIssues.map((issue) => (
                <div 
                  key={issue.id} 
                  className="border border-green-900/40 rounded-lg p-3 md:p-4 hover:bg-green-900/10 transition-colors bg-neutral-900/50"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3 gap-2 md:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-neutral-500 text-xs md:text-sm font-mono">#{issue.number}</span>
                        <a
                          href={issue.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-400 hover:text-green-300 font-medium flex items-center gap-1 group"
                        >
                          <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity md:w-3.5 md:h-3.5" />
                        </a>
                      </div>
                      <h3 className="text-neutral-200 font-medium leading-tight mb-3 text-sm md:text-base">
                        {issue.title}
                      </h3>
                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {issue.labels.nodes.map((label) => (
                          <Badge
                            key={label.name}
                            variant="outline"
                            className="text-xs px-2 py-0.5"
                            style={{
                              backgroundColor: `#${label.color}22`,
                              borderColor: `#${label.color}66`,
                              color: `#${label.color}`,
                            }}
                          >
                            {label.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-neutral-500 text-xs md:text-sm flex-shrink-0 md:ml-4 self-start">
                      {formatDate(issue.createdAt)}
                    </div>
                  </div>
                  <a
                    href={issue.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs md:text-sm text-green-400 hover:text-green-300 transition-colors"
                  >
                    View on GitHub
                    <ExternalLink size={12} className="md:w-3.5 md:h-3.5" />
                  </a>
                </div>
              ))}
            </div>
            
            {(hasMoreIssues || isExpanded) && (
              <div className="flex flex-col sm:flex-row justify-center pt-4 md:pt-6 pb-2 gap-2">
                {hasMoreIssues && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleShowMore}
                    className="flex items-center gap-1 text-xs md:text-sm w-full sm:w-auto"
                  >
                    <ChevronDown size={14} className="md:w-4 md:h-4" />
                    <span className="truncate">
                      Show More ({beginnerFriendlyIssues.length - displayCount} remaining)
                    </span>
                  </Button>
                )}
                {isExpanded && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleShowLess}
                    className="flex items-center gap-1 text-xs md:text-sm w-full sm:w-auto"
                  >
                    <ChevronUp size={14} className="md:w-4 md:h-4" />
                    Show Less
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
} 