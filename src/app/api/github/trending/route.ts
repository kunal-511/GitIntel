import { NextRequest, NextResponse } from 'next/server';
import { GitHubService } from '@/lib/github';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const timePeriod = searchParams.get('period') as 'day' | 'week' | 'month' || 'week';
    const limit = parseInt(searchParams.get('limit') || '20');

    const repositories = await GitHubService.getTrendingRepositories(
      language || undefined,
      timePeriod,
      limit
    );
    
    return NextResponse.json({ repositories });
  } catch (error) {
    console.error('Error in trending API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending repositories' },
      { status: 500 }
    );
  }
} 