import { NextRequest, NextResponse } from 'next/server';
import { GitHubService } from '@/lib/github';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner');
    const name = searchParams.get('name');

    if (!owner || !name) {
      return NextResponse.json(
        { error: 'Owner and name parameters are required' },
        { status: 400 }
      );
    }

    const analytics = await GitHubService.getAdvancedAnalytics(owner, name);

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error in advanced analytics API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch advanced analytics' },
      { status: 500 }
    );
  }
} 