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

    const stats = await GitHubService.getRepositoryStats(owner, name);
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error in repository API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repository data' },
      { status: 500 }
    );
  }
} 