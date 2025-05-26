import { NextRequest, NextResponse } from 'next/server';
import { GitHubService } from '@/lib/github';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repositories } = body;

    if (!repositories || !Array.isArray(repositories)) {
      return NextResponse.json(
        { error: 'Repositories array is required' },
        { status: 400 }
      );
    }

    // Validate repository format
    for (const repo of repositories) {
      if (!repo.owner || !repo.name) {
        return NextResponse.json(
          { error: 'Each repository must have owner and name' },
          { status: 400 }
        );
      }
    }

    const comparison = await GitHubService.compareRepositories(repositories);
    
    return NextResponse.json({ comparison });
  } catch (error) {
    console.error('Error in compare API:', error);
    return NextResponse.json(
      { error: 'Failed to compare repositories' },
      { status: 500 }
    );
  }
} 