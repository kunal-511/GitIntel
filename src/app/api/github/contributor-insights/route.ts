import { NextRequest, NextResponse } from 'next/server';
import { GitHubService } from '@/lib/github';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner');
    const name = searchParams.get('name');
    const period = searchParams.get('period') as 'week' | 'month' | 'quarter' | 'year' | 'all' || 'year';

    if (!owner || !name) {
      return NextResponse.json(
        { error: 'Owner and name parameters are required' },
        { status: 400 }
      );
    }

    const insights = await GitHubService.getContributorInsights(owner, name, period);

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error in contributor insights API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contributor insights' },
      { status: 500 }
    );
  }
} 