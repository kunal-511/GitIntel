import { NextRequest, NextResponse } from 'next/server';
import { GitHubService, Repository } from '@/lib/github';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner');
    const name = searchParams.get('name');
    const limit = parseInt(searchParams.get('limit') || '5');

    if (!owner || !name) {
      return NextResponse.json(
        { error: 'Owner and name parameters are required' },
        { status: 400 }
      );
    }

    // Get the target repository details first
    const targetRepo = await GitHubService.getRepositoryStats(owner, name);
    const { repository } = targetRepo;

    // Build search queries for competitive analysis
    const searchQueries = [];

    // Search by primary topic
    if (repository.topics.length > 0) {
      const primaryTopic = repository.topics[0];
      searchQueries.push(`topic:${primaryTopic} language:${repository.language || ''} sort:stars-desc`);
    }

    // Search by language and keywords from description
    if (repository.language) {
      const descriptionKeywords = repository.description
        ?.split(' ')
        .filter(word => word.length > 3)
        .slice(0, 2)
        .join(' ') || '';
      
      if (descriptionKeywords) {
        searchQueries.push(`${descriptionKeywords} language:${repository.language} sort:stars-desc`);
      } else {
        searchQueries.push(`language:${repository.language} sort:stars-desc`);
      }
    }

    // Search by multiple topics
    if (repository.topics.length > 1) {
      const topicQuery = repository.topics.slice(0, 3).map(topic => `topic:${topic}`).join(' ');
      searchQueries.push(`${topicQuery} sort:stars-desc`);
    }

    // Execute searches and combine results
    const allCompetitors = new Map();
    
    for (const query of searchQueries) {
      try {
        const results = await GitHubService.searchRepositories(query, limit * 2);
        
        results.repositories.forEach(repo => {
          // Exclude the target repository itself
          if (repo.fullName !== repository.fullName) {
            allCompetitors.set(repo.id, {
              ...repo,
              similarity: calculateSimilarity(repository, repo)
            });
          }
        });
      } catch (error) {
        console.warn(`Search query failed: ${query}`, error);
      }
    }

    // Sort by similarity and stars, then take top results
    const competitors = Array.from(allCompetitors.values())
      .sort((a, b) => {
        // First sort by similarity, then by stars
        if (b.similarity !== a.similarity) {
          return b.similarity - a.similarity;
        }
        return b.stargazerCount - a.stargazerCount;
      })
      .slice(0, limit);

    return NextResponse.json({
      targetRepository: repository,
      competitors,
      analysis: {
        totalFound: competitors.length,
        averageStars: competitors.reduce((sum, repo) => sum + repo.stargazerCount, 0) / competitors.length,
        languageDistribution: getLanguageDistribution(competitors),
        competitivePosition: getCompetitivePosition(repository, competitors)
      }
    });

  } catch (error) {
    console.error('Error in competitive analysis API:', error);
    return NextResponse.json(
      { error: 'Failed to perform competitive analysis' },
      { status: 500 }
    );
  }
}

function calculateSimilarity(target: Repository, competitor: Repository): number {
  let score = 0;
  
  // Language match (high weight)
  if (target.language === competitor.language) {
    score += 40;
  }
  
  // Topic overlap (high weight)
  const targetTopics = new Set(target.topics);
  const competitorTopics = new Set(competitor.topics);
  const commonTopics = [...targetTopics].filter(topic => competitorTopics.has(topic));
  score += (commonTopics.length / Math.max(targetTopics.size, 1)) * 30;
  
  // Description similarity (medium weight)
  if (target.description && competitor.description) {
    const targetWords = new Set<string>(target.description.toLowerCase().split(/\W+/).filter((w: string) => w.length > 0));
    const competitorWords = new Set<string>(competitor.description.toLowerCase().split(/\W+/).filter((w: string) => w.length > 0));
    const commonWords = Array.from(targetWords).filter((word) => competitorWords.has(word) && word.length > 3);
    score += (commonWords.length / Math.max(targetWords.size, 1)) * 20;
  }
  
  // Size similarity (low weight)
  const starRatio = Math.min(target.stargazerCount, competitor.stargazerCount) / 
                   Math.max(target.stargazerCount, competitor.stargazerCount, 1);
  score += starRatio * 10;
  
  return Math.round(score);
}

function getLanguageDistribution(repos: Repository[]) {
  const distribution: Record<string, number> = {};
  repos.forEach(repo => {
    if (repo.language) {
      distribution[repo.language] = (distribution[repo.language] || 0) + 1;
    }
  });
  return distribution;
}

function getCompetitivePosition(target: Repository, competitors: Repository[]) {
  const targetStars = target.stargazerCount;
  const betterThan = competitors.filter(repo => targetStars > repo.stargazerCount).length;
  const total = competitors.length;
  
  let position = 'Unknown';
  if (total > 0) {
    const percentile = (betterThan / total) * 100;
    if (percentile >= 80) position = 'Leader';
    else if (percentile >= 60) position = 'Strong';
    else if (percentile >= 40) position = 'Competitive';
    else if (percentile >= 20) position = 'Emerging';
    else position = 'Niche';
  }
  
  return {
    position,
    percentile: total > 0 ? Math.round((betterThan / total) * 100) : 0,
    betterThan,
    total
  };
} 