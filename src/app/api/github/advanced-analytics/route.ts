import { NextRequest, NextResponse } from 'next/server';
import { GitHubService } from '@/lib/github';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get('owner');
  const name = searchParams.get('name');

  try {
    if (!owner || !name) {
      return NextResponse.json(
        { error: 'Owner and name parameters are required' },
        { status: 400 }
      );
    }

    // Validate input parameters
    if (!/^[a-zA-Z0-9._-]+$/.test(owner) || !/^[a-zA-Z0-9._-]+$/.test(name)) {
      return NextResponse.json(
        { error: 'Invalid repository owner or name format' },
        { status: 400 }
      );
    }

    // Add timeout to the entire operation
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 30000); // 30 second timeout
    });

    const analyticsPromise = GitHubService.getAdvancedAnalytics(owner, name);

    const analytics = await Promise.race([analyticsPromise, timeoutPromise]);

    // Add cache headers for successful responses
    const response = NextResponse.json(analytics);
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600'); // 5 min cache, 10 min stale
    
    return response;

  } catch (error) {
    console.error('Error in advanced analytics API:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('not found') || error.message.includes('inaccessible')) {
        return NextResponse.json(
          { error: `Repository ${owner}/${name} not found or is private` },
          { status: 404 }
        );
      }
      
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Request timed out. The repository might be too large or GitHub API is slow. Please try again.' },
          { status: 408 }
        );
      }
      
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'GitHub API rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch repository analytics. Please check if the repository exists and try again.',
        details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
      },
      { status: 500 }
    );
  }
} 