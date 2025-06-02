import { NextRequest, NextResponse } from 'next/server';
import { GitHubService } from '@/lib/github';

function normalizeSearchQuery(query: string): string {
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
  
  return trimmedQuery;
}

function isRepoQuery(query: string): boolean {
  const parts = query.split('/');
  return parts.length === 2 && parts[0].trim() !== '' && parts[1].trim() !== '';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');
    const cursor = searchParams.get('cursor');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const normalizedQuery = normalizeSearchQuery(query);
    
    if (isRepoQuery(normalizedQuery)) {
      try {
        const [owner, repo] = normalizedQuery.split('/');
        
        const repoStats = await GitHubService.getRepositoryStats(owner.trim(), repo.trim());
        
        return NextResponse.json({
          repositories: [repoStats.repository],
          totalCount: 1,
          hasNextPage: false,
          endCursor: null
        });
      } catch (repoError) {
        console.log(`Repository ${normalizedQuery} not found directly, falling back to search`);
        console.error(repoError);
      }
    }
    
    const results = await GitHubService.searchRepositories(normalizedQuery, limit, cursor || undefined);
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in search API:', error);
    return NextResponse.json(
      { error: 'Failed to search repositories' },
      { status: 500 }
    );
  }
} 