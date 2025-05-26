import { graphql } from '@octokit/graphql';
import { Octokit } from '@octokit/rest';
import { GitHubRepositoryResponse, GitHubSearchResponse } from './github-types';

// Initialize GitHub API clients lazily
function getGitHubToken() {
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    throw new Error('GITHUB_TOKEN environment variable is required');
  }
  return githubToken;
}

// GraphQL client for complex queries
function getGitHubGraphQL() {
  return graphql.defaults({
    headers: {
      authorization: `token ${getGitHubToken()}`,
    },
  });
}

// REST API client for simpler operations
export function getGitHubRest() {
  return new Octokit({
    auth: getGitHubToken(),
  });
}

// Types for our application
export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  forkCount: number;
  watcherCount: number;
  language: string | null;
  topics: string[];
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  isArchived: boolean;
  isPrivate: boolean;
  owner: {
    login: string;
    type: string;
    avatarUrl: string;
  };
  license: {
    name: string;
    key: string;
  } | null;
}

export interface RepositoryStats {
  repository: Repository;
  contributors: number;
  releases: number;
  issues: {
    open: number;
    closed: number;
  };
  pullRequests: {
    open: number;
    closed: number;
    merged: number;
  };
  commits: {
    total: number;
    lastMonth: number;
  };
}

// GraphQL query to get repository details and stats
export const REPOSITORY_QUERY = `
  query GetRepository($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
      name
      nameWithOwner
      description
      url
      stargazerCount
      forkCount
      watchers {
        totalCount
      }
      primaryLanguage {
        name
      }
      repositoryTopics(first: 10) {
        nodes {
          topic {
            name
          }
        }
      }
      createdAt
      updatedAt
      pushedAt
      isArchived
      isPrivate
      owner {
        login
        ... on User {
          avatarUrl
        }
        ... on Organization {
          avatarUrl
        }
      }
      licenseInfo {
        name
        key
      }
      collaborators {
        totalCount
      }
      releases {
        totalCount
      }
      issues(states: [OPEN]) {
        totalCount
      }
      closedIssues: issues(states: [CLOSED]) {
        totalCount
      }
      pullRequests(states: [OPEN]) {
        totalCount
      }
      closedPullRequests: pullRequests(states: [CLOSED]) {
        totalCount
      }
      mergedPullRequests: pullRequests(states: [MERGED]) {
        totalCount
      }
      defaultBranchRef {
        target {
          ... on Commit {
            history {
              totalCount
            }
            historyLastMonth: history(since: "${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}") {
              totalCount
            }
          }
        }
      }
    }
  }
`;

// Search repositories by topic or keyword
export const SEARCH_REPOSITORIES_QUERY = `
  query SearchRepositories($searchQuery: String!, $first: Int!, $after: String) {
    search(query: $searchQuery, type: REPOSITORY, first: $first, after: $after) {
      repositoryCount
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ... on Repository {
          id
          name
          nameWithOwner
          description
          url
          stargazerCount
          forkCount
          watchers {
            totalCount
          }
          primaryLanguage {
            name
          }
          repositoryTopics(first: 5) {
            nodes {
              topic {
                name
              }
            }
          }
          createdAt
          updatedAt
          pushedAt
          isArchived
          isPrivate
          owner {
            login
            ... on User {
              avatarUrl
            }
            ... on Organization {
              avatarUrl
            }
          }
          licenseInfo {
            name
            key
          }
        }
      }
    }
  }
`;

// Service functions
export class GitHubService {
  /**
   * Get detailed repository information and statistics
   */
  static async getRepositoryStats(owner: string, name: string): Promise<RepositoryStats> {
    try {
      const response = await getGitHubGraphQL()(REPOSITORY_QUERY, {
        owner,
        name,
      }) as GitHubRepositoryResponse;

      const repo = response.repository;
      
      return {
        repository: {
          id: repo.id,
          name: repo.name,
          fullName: repo.nameWithOwner,
          description: repo.description,
          url: repo.url,
          stargazerCount: repo.stargazerCount,
          forkCount: repo.forkCount,
          watcherCount: repo.watchers.totalCount,
          language: repo.primaryLanguage?.name || null,
          topics: repo.repositoryTopics.nodes.map((node) => node.topic.name),
          createdAt: repo.createdAt,
          updatedAt: repo.updatedAt,
          pushedAt: repo.pushedAt,
          isArchived: repo.isArchived,
          isPrivate: repo.isPrivate,
          owner: {
            login: repo.owner.login,
            type: repo.owner.__typename,
            avatarUrl: repo.owner.avatarUrl,
          },
          license: repo.licenseInfo ? {
            name: repo.licenseInfo.name,
            key: repo.licenseInfo.key,
          } : null,
        },
        contributors: repo.collaborators.totalCount,
        releases: repo.releases.totalCount,
        issues: {
          open: repo.issues.totalCount,
          closed: repo.closedIssues.totalCount,
        },
        pullRequests: {
          open: repo.pullRequests.totalCount,
          closed: repo.closedPullRequests.totalCount,
          merged: repo.mergedPullRequests.totalCount,
        },
        commits: {
          total: repo.defaultBranchRef?.target?.history?.totalCount || 0,
          lastMonth: repo.defaultBranchRef?.target?.historyLastMonth?.totalCount || 0,
        },
      };
    } catch (error) {
      console.error('Error fetching repository stats:', error);
      throw new Error(`Failed to fetch repository stats for ${owner}/${name}`);
    }
  }

  /**
   * Search repositories by keyword, topic, or language
   */
  static async searchRepositories(
    query: string,
    limit: number = 20,
    cursor?: string
  ): Promise<{
    repositories: Repository[];
    totalCount: number;
    hasNextPage: boolean;
    endCursor: string | null;
  }> {
    try {
      const response = await getGitHubGraphQL()(SEARCH_REPOSITORIES_QUERY, {
        searchQuery: query,
        first: limit,
        after: cursor || null,
      }) as GitHubSearchResponse;

      const search = response.search;
      
      return {
        repositories: search.nodes.map((repo) => ({
          id: repo.id,
          name: repo.name,
          fullName: repo.nameWithOwner,
          description: repo.description,
          url: repo.url,
          stargazerCount: repo.stargazerCount,
          forkCount: repo.forkCount,
          watcherCount: repo.watchers.totalCount,
          language: repo.primaryLanguage?.name || null,
          topics: repo.repositoryTopics.nodes.map((node) => node.topic.name),
          createdAt: repo.createdAt,
          updatedAt: repo.updatedAt,
          pushedAt: repo.pushedAt,
          isArchived: repo.isArchived,
          isPrivate: repo.isPrivate,
          owner: {
            login: repo.owner.login,
            type: repo.owner.__typename,
            avatarUrl: repo.owner.avatarUrl,
          },
          license: repo.licenseInfo ? {
            name: repo.licenseInfo.name,
            key: repo.licenseInfo.key,
          } : null,
        })),
        totalCount: search.repositoryCount,
        hasNextPage: search.pageInfo.hasNextPage,
        endCursor: search.pageInfo.endCursor,
      };
    } catch (error) {
      console.error('Error searching repositories:', error);
      throw new Error(`Failed to search repositories with query: ${query}`);
    }
  }

  /**
   * Get trending repositories by language and time period
   */
  static async getTrendingRepositories(
    language?: string,
    timePeriod: 'day' | 'week' | 'month' = 'week',
    limit: number = 20
  ): Promise<Repository[]> {
    const since = new Date();
    switch (timePeriod) {
      case 'day':
        since.setDate(since.getDate() - 1);
        break;
      case 'week':
        since.setDate(since.getDate() - 7);
        break;
      case 'month':
        since.setMonth(since.getMonth() - 1);
        break;
    }

    let query = `created:>${since.toISOString().split('T')[0]} sort:stars-desc`;
    if (language) {
      query = `language:${language} ${query}`;
    }

    const result = await this.searchRepositories(query, limit);
    return result.repositories;
  }

  /**
   * Compare multiple repositories
   */
  static async compareRepositories(repositories: Array<{ owner: string; name: string }>): Promise<RepositoryStats[]> {
    const promises = repositories.map(({ owner, name }) => 
      this.getRepositoryStats(owner, name)
    );
    
    return Promise.all(promises);
  }
} 