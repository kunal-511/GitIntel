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
  beginnerIssues?: {
    totalCount: number;
    nodes: Array<{
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
    }>;
  };
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
  beginnerIssues?: {
    totalCount: number;
    nodes: Array<{
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
    }>;
  };
}

export interface HistoricalData {
  date: string;
  stars: number;
  forks: number;
  commits: number;
}

export interface ContributorData {
  login: string;
  avatarUrl: string;
  contributions: number;
  type: string;
}

export interface TechnologyStack {
  languages: Array<{
    name: string;
    percentage: number;
    bytes: number;
    color: string;
  }>;
  dependencies: Array<{
    name: string;
    version: string;
    type: 'dependency' | 'devDependency';
  }>;
  frameworks: string[];
}

export interface RiskAssessment {
  busFactor: {
    score: number;
    level: 'low' | 'medium' | 'high';
    topContributors: number;
    description: string;
  };
  maintenanceStatus: {
    score: number;
    level: 'active' | 'moderate' | 'inactive';
    lastCommit: string;
    avgCommitsPerMonth: number;
    description: string;
  };
  communityHealth: {
    score: number;
    level: 'healthy' | 'moderate' | 'concerning';
    factors: string[];
  };
}

export interface AdvancedAnalytics {
  repository: Repository;
  contributors: ContributorData[];
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
  beginnerIssues?: {
    totalCount: number;
    nodes: Array<{
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
    }>;
  };
  historical: HistoricalData[];
  technologyStack: TechnologyStack;
  riskAssessment: RiskAssessment;
  trends: {
    starsGrowth: number;
    forksGrowth: number;
    contributorsGrowth: number;
    commitActivity: number;
  };
}

export interface ContributorCommitData {
  week: string; // ISO date string for the week
  commits: number;
  additions: number;
  deletions: number;
}

export interface DetailedContributor {
  login: string;
  avatarUrl: string;
  name: string | null;
  email: string | null;
  contributions: number;
  commitHistory: ContributorCommitData[];
  totalAdditions: number;
  totalDeletions: number;
  firstCommit: string;
  lastCommit: string;
  weeklyAverage: number;
  isActive: boolean; // active in last 4 weeks
}

export interface ContributorInsights {
  contributors: DetailedContributor[];
  totalCommits: number;
  totalContributors: number;
  activeContributors: number; // active in last 4 weeks
  commitsByWeek: Array<{
    week: string;
    total: number;
    contributors: number;
  }>;
  topLanguages: Array<{
    language: string;
    commits: number;
    contributors: string[];
  }>;
  periodStats: {
    startDate: string;
    endDate: string;
    totalCommits: number;
    avgCommitsPerWeek: number;
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
      releases {
        totalCount
      }
      issues(states: [OPEN]) {
        totalCount
      }
      beginnerIssues: issues(states: [OPEN], first: 100) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          number
          title
          url
          createdAt
          labels(first: 10) {
            nodes {
              name
              color
            }
          }
        }
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
          beginnerIssues: issues(states: [OPEN], first: 100) {
            totalCount
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              id
              number
              title
              url
              createdAt
              labels(first: 10) {
                nodes {
                  name
                  color
                }
              }
            }
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
      // Add timeout to GraphQL request
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('GraphQL request timeout')), 15000); // 15 second timeout
      });

      const graphqlPromise = getGitHubGraphQL()(REPOSITORY_QUERY, {
        owner,
        name,
      }) as Promise<GitHubRepositoryResponse>;

      const response = await Promise.race([graphqlPromise, timeoutPromise]);

      if (!response?.repository) {
        throw new Error(`Repository ${owner}/${name} not found`);
      }

      const repo = response.repository;
      
      // Get contributors count using REST API as fallback with timeout
      let contributorsCount = 0;
      try {
        const restClient = getGitHubRest();
        
        // Create a timeout promise
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Contributors request timeout')), 8000); // 8 second timeout
        });
        
        // Race between the API call and timeout
        const contributorsResponse = await Promise.race([
          restClient.repos.listContributors({
            owner,
            repo: name,
            per_page: 1
          }),
          timeoutPromise
        ]) as { data: unknown[]; headers: { link?: string } };
        
        // GitHub returns the total count in the Link header for pagination
        const linkHeader = contributorsResponse.headers.link;
        if (linkHeader) {
          const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
          if (lastPageMatch) {
            contributorsCount = parseInt(lastPageMatch[1]);
          }
        } else {
          contributorsCount = contributorsResponse.data.length;
        }
      } catch (contributorsError) {
        console.warn('Could not fetch contributors count (using fallback):', contributorsError instanceof Error ? contributorsError.message : 'Unknown error');
        
        // Try alternative approach using GraphQL if REST fails
        try {
          const contributorsGraphQL = await Promise.race([
            getGitHubGraphQL()(
              `query GetContributors($owner: String!, $name: String!) {
                repository(owner: $owner, name: $name) {
                  mentionableUsers(first: 1) {
                    totalCount
                  }
                }
              }`,
              { owner, name }
            ),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('GraphQL contributors timeout')), 5000)
            )
          ]) as { repository?: { mentionableUsers?: { totalCount: number } } };
          
          contributorsCount = contributorsGraphQL.repository?.mentionableUsers?.totalCount || 0;
        } catch {
          console.warn('GraphQL contributors fallback also failed, defaulting to 0');
          contributorsCount = 0; // Final fallback
        }
      }
      
      return {
        repository: {
          id: repo.id,
          name: repo.name,
          fullName: repo.nameWithOwner,
          description: repo.description,
          url: repo.url,
          stargazerCount: repo.stargazerCount || 0,
          forkCount: repo.forkCount || 0,
          watcherCount: repo.watchers?.totalCount || 0,
          language: repo.primaryLanguage?.name || null,
          topics: repo.repositoryTopics?.nodes?.map((node) => node.topic.name) || [],
          createdAt: repo.createdAt,
          updatedAt: repo.updatedAt,
          pushedAt: repo.pushedAt,
          isArchived: repo.isArchived || false,
          isPrivate: repo.isPrivate || false,
          owner: {
            login: repo.owner.login,
            type: repo.owner.__typename || 'User',
            avatarUrl: repo.owner.avatarUrl || '',
          },
          license: repo.licenseInfo ? {
            name: repo.licenseInfo.name,
            key: repo.licenseInfo.key,
          } : null,
          beginnerIssues: repo.beginnerIssues,
        },
        contributors: contributorsCount,
        releases: repo.releases?.totalCount || 0,
        issues: {
          open: repo.issues?.totalCount || 0,
          closed: repo.closedIssues?.totalCount || 0,
        },
        pullRequests: {
          open: repo.pullRequests?.totalCount || 0,
          closed: repo.closedPullRequests?.totalCount || 0,
          merged: repo.mergedPullRequests?.totalCount || 0,
        },
        commits: {
          total: repo.defaultBranchRef?.target?.history?.totalCount || 0,
          lastMonth: repo.defaultBranchRef?.target?.historyLastMonth?.totalCount || 0,
        },
        beginnerIssues: repo.beginnerIssues,
      };
    } catch (error) {
      console.error('Error fetching repository stats:', error);
      
      // If GraphQL fails completely, try the minimal fallback
      if (error instanceof Error && (error.message.includes('timeout') || error.message.includes('not found'))) {
        throw error; // Re-throw specific errors
      }
      
      throw new Error(`Failed to fetch repository stats for ${owner}/${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
          beginnerIssues: repo.beginnerIssues,
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

  /**
   * Get historical growth data for a repository
   */
  static async getHistoricalData(owner: string, name: string): Promise<HistoricalData[]> {
    try {
      const restClient = getGitHubRest();
      
      // Get stargazers with timestamps (limited to recent data due to API constraints)
      const starHistory = await restClient.activity.listStargazersForRepo({
        owner,
        repo: name,
        per_page: 100,
        headers: {
          Accept: 'application/vnd.github.v3.star+json'
        }
      });

      // Get commit activity for the past year
      const commitActivity = await restClient.repos.getCommitActivityStats({
        owner,
        repo: name
      });

      // Process data into monthly buckets
      const monthlyData: { [key: string]: HistoricalData } = {};
      const now = new Date();
      
      // Initialize last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = date.toISOString().slice(0, 7); // YYYY-MM format
        monthlyData[key] = {
          date: key,
          stars: 0,
          forks: 0,
          commits: 0
        };
      }

      // Process star history
      let cumulativeStars = 0;
      starHistory.data.forEach((star: any) => {
        const date = new Date(star.starred_at);
        const key = date.toISOString().slice(0, 7);
        if (monthlyData[key]) {
          cumulativeStars++;
          monthlyData[key].stars = cumulativeStars;
        }
      });

      // Process commit activity
      if (commitActivity.data && Array.isArray(commitActivity.data)) {
        commitActivity.data.forEach((week: any) => {
          const date = new Date(week.week * 1000);
          const key = date.toISOString().slice(0, 7);
          if (monthlyData[key]) {
            monthlyData[key].commits += week.total;
          }
        });
      }

      return Object.values(monthlyData).sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
      console.warn('Could not fetch historical data:', error);
      return [];
    }
  }

  /**
   * Get detailed contributor analysis
   */
  static async getContributorAnalysis(owner: string, name: string): Promise<ContributorData[]> {
    try {
      const restClient = getGitHubRest();
      
      const contributors = await restClient.repos.listContributors({
        owner,
        repo: name,
        per_page: 50
      });

      return contributors.data.map((contributor: any) => ({
        login: contributor.login,
        avatarUrl: contributor.avatar_url,
        contributions: contributor.contributions,
        type: contributor.type
      }));
    } catch (error) {
      console.warn('Could not fetch contributor analysis:', error);
      return [];
    }
  }

  /**
   * Get technology stack analysis
   */
  static async getTechnologyStack(owner: string, name: string): Promise<TechnologyStack> {
    try {
      const restClient = getGitHubRest();
      
      // Get languages
      const languages = await restClient.repos.listLanguages({
        owner,
        repo: name
      });

      const totalBytes = Object.values(languages.data).reduce((sum: number, bytes: any) => sum + bytes, 0);
      
      const languageData = Object.entries(languages.data).map(([name, bytes]: [string, any]) => ({
        name,
        bytes,
        percentage: Math.round((bytes / totalBytes) * 100),
        color: getLanguageColor(name)
      })).sort((a, b) => b.bytes - a.bytes);

      // Try to get package.json for dependencies (if it's a Node.js project)
      const dependencies: Array<{ name: string; version: string; type: 'dependency' | 'devDependency' }> = [];
      try {
        const packageJson = await restClient.repos.getContent({
          owner,
          repo: name,
          path: 'package.json'
        });

        if ('content' in packageJson.data) {
          const content = JSON.parse(Buffer.from(packageJson.data.content, 'base64').toString());
          
          if (content.dependencies) {
            Object.entries(content.dependencies).forEach(([name, version]: [string, any]) => {
              dependencies.push({ name, version, type: 'dependency' });
            });
          }
          
          if (content.devDependencies) {
            Object.entries(content.devDependencies).forEach(([name, version]: [string, any]) => {
              dependencies.push({ name, version, type: 'devDependency' });
            });
          }
        }
      } catch {
        // package.json not found or not accessible
      }

      return {
        languages: languageData,
        dependencies: dependencies.slice(0, 20), // Limit to top 20
        frameworks: detectFrameworks(languageData, dependencies)
      };
    } catch (error) {
      console.warn('Could not fetch technology stack:', error);
      return {
        languages: [],
        dependencies: [],
        frameworks: []
      };
    }
  }

  /**
   * Perform risk assessment
   */
  static async getRiskAssessment(owner: string, name: string, contributors: ContributorData[]): Promise<RiskAssessment> {
    try {
      const restClient = getGitHubRest();
      
      // Get recent commits for maintenance analysis
      const commits = await restClient.repos.listCommits({
        owner,
        repo: name,
        per_page: 100
      });

      const now = new Date();
      const lastCommit = commits.data[0] ? new Date(commits.data[0].commit.author?.date || '') : new Date(0);
      const daysSinceLastCommit = Math.floor((now.getTime() - lastCommit.getTime()) / (1000 * 60 * 60 * 24));
      
      // Calculate commits per month
      const threeMonthsAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
      const recentCommits = commits.data.filter(commit => 
        new Date(commit.commit.author?.date || '') > threeMonthsAgo
      );
      const avgCommitsPerMonth = Math.round((recentCommits.length / 3) * 10) / 10;

      // Bus factor analysis
      const totalContributions = contributors.reduce((sum, c) => sum + c.contributions, 0);
      const topContributorPercentage = contributors.length > 0 ? 
        (contributors[0].contributions / totalContributions) * 100 : 0;
      
      let busFactor: RiskAssessment['busFactor'];
      if (topContributorPercentage > 70) {
        busFactor = {
          score: 25,
          level: 'high',
          topContributors: 1,
          description: 'High risk: Single contributor dominates the project'
        };
      } else if (topContributorPercentage > 50) {
        busFactor = {
          score: 50,
          level: 'medium',
          topContributors: Math.min(2, contributors.length),
          description: 'Medium risk: Few contributors handle most of the work'
        };
      } else {
        busFactor = {
          score: 85,
          level: 'low',
          topContributors: Math.min(5, contributors.length),
          description: 'Low risk: Well-distributed contributor base'
        };
      }

      // Maintenance status
      let maintenanceStatus: RiskAssessment['maintenanceStatus'];
      if (daysSinceLastCommit > 180) {
        maintenanceStatus = {
          score: 25,
          level: 'inactive',
          lastCommit: lastCommit.toISOString(),
          avgCommitsPerMonth,
          description: 'Inactive: No recent commits'
        };
      } else if (daysSinceLastCommit > 60 || avgCommitsPerMonth < 2) {
        maintenanceStatus = {
          score: 60,
          level: 'moderate',
          lastCommit: lastCommit.toISOString(),
          avgCommitsPerMonth,
          description: 'Moderate: Infrequent updates'
        };
      } else {
        maintenanceStatus = {
          score: 90,
          level: 'active',
          lastCommit: lastCommit.toISOString(),
          avgCommitsPerMonth,
          description: 'Active: Regular updates and maintenance'
        };
      }

      // Community health
      const healthFactors = [];
      if (contributors.length > 10) healthFactors.push('Active contributor community');
      if (avgCommitsPerMonth > 5) healthFactors.push('Regular development activity');
      if (daysSinceLastCommit < 30) healthFactors.push('Recent updates');
      
      const communityHealth: RiskAssessment['communityHealth'] = {
        score: Math.min(90, healthFactors.length * 30),
        level: healthFactors.length >= 2 ? 'healthy' : healthFactors.length === 1 ? 'moderate' : 'concerning',
        factors: healthFactors
      };

      return {
        busFactor,
        maintenanceStatus,
        communityHealth
      };
    } catch (error) {
      console.warn('Could not perform risk assessment:', error);
      return {
        busFactor: {
          score: 50,
          level: 'medium',
          topContributors: 0,
          description: 'Unable to assess'
        },
        maintenanceStatus: {
          score: 50,
          level: 'moderate',
          lastCommit: new Date().toISOString(),
          avgCommitsPerMonth: 0,
          description: 'Unable to assess'
        },
        communityHealth: {
          score: 50,
          level: 'moderate',
          factors: []
        }
      };
    }
  }

  /**
   * Get comprehensive advanced analytics
   */
  static async getAdvancedAnalytics(owner: string, name: string): Promise<AdvancedAnalytics> {
    try {
      // Get basic repository stats with enhanced error handling
      const basicStats = await this.getRepositoryStats(owner, name);
      
      // Fetch additional data with individual error handling
      const [historicalData, contributorData, technologyStack, riskAssessment] = await Promise.allSettled([
        this.getHistoricalData(owner, name).catch(error => {
          console.warn('Failed to fetch historical data:', error);
          return [];
        }),
        this.getContributorAnalysis(owner, name).catch(error => {
          console.warn('Failed to fetch contributor analysis:', error);
          return [];
        }),
        this.getTechnologyStack(owner, name).catch(error => {
          console.warn('Failed to fetch technology stack:', error);
          return { languages: [], dependencies: [], frameworks: [] };
        }),
        this.getRiskAssessment(owner, name, []).catch(error => {
          console.warn('Failed to fetch risk assessment:', error);
          return {
            busFactor: { score: 0, level: 'medium' as const, topContributors: 0, description: 'Unable to assess' },
            maintenanceStatus: { score: 0, level: 'moderate' as const, lastCommit: '', avgCommitsPerMonth: 0, description: 'Unable to assess' },
            communityHealth: { score: 0, level: 'moderate' as const, factors: [] }
          };
        })
      ]);

      // Extract results with fallbacks
      const historical = historicalData.status === 'fulfilled' ? historicalData.value : [];
      const contributors = contributorData.status === 'fulfilled' ? contributorData.value : [];
      const techStack = technologyStack.status === 'fulfilled' ? technologyStack.value : { languages: [], dependencies: [], frameworks: [] };
      const risk = riskAssessment.status === 'fulfilled' ? riskAssessment.value : {
        busFactor: { score: 0, level: 'medium' as const, topContributors: 0, description: 'Unable to assess' },
        maintenanceStatus: { score: 0, level: 'moderate' as const, lastCommit: '', avgCommitsPerMonth: 0, description: 'Unable to assess' },
        communityHealth: { score: 0, level: 'moderate' as const, factors: [] }
      };

      // Calculate trends with fallbacks
      const trends = this.calculateTrends(historical);

      return {
        repository: basicStats.repository,
        contributors: contributors,
        releases: basicStats.releases,
        issues: basicStats.issues,
        pullRequests: basicStats.pullRequests,
        commits: basicStats.commits,
        beginnerIssues: basicStats.beginnerIssues,
        historical,
        technologyStack: techStack,
        riskAssessment: risk,
        trends
      };
    } catch (error) {
      console.error('Error fetching advanced analytics:', error);
      
      // If basic stats fail, try to provide minimal data
      try {
        const minimalStats = await this.getMinimalRepositoryData(owner, name);
        return {
          repository: minimalStats,
          contributors: [],
          releases: 0,
          issues: { open: 0, closed: 0 },
          pullRequests: { open: 0, closed: 0, merged: 0 },
          commits: { total: 0, lastMonth: 0 },
          beginnerIssues: undefined,
          historical: [],
          technologyStack: { languages: [], dependencies: [], frameworks: [] },
          riskAssessment: {
            busFactor: { score: 0, level: 'medium', topContributors: 0, description: 'Unable to assess' },
            maintenanceStatus: { score: 0, level: 'moderate', lastCommit: '', avgCommitsPerMonth: 0, description: 'Unable to assess' },
            communityHealth: { score: 0, level: 'moderate', factors: [] }
          },
          trends: { starsGrowth: 0, forksGrowth: 0, contributorsGrowth: 0, commitActivity: 0 }
        };
      } catch (minimalError) {
        console.error('Even minimal data fetch failed:', minimalError);
        throw new Error(`Failed to fetch any data for ${owner}/${name}. Repository may not exist or be inaccessible.`);
      }
    }
  }

  /**
   * Calculate trends from historical data with fallbacks
   */
  private static calculateTrends(historical: HistoricalData[]): { starsGrowth: number; forksGrowth: number; contributorsGrowth: number; commitActivity: number } {
    try {
      if (historical.length < 2) {
        return { starsGrowth: 0, forksGrowth: 0, contributorsGrowth: 0, commitActivity: 0 };
      }

      const recent = historical.slice(-3); // Last 3 months
      const previous = historical.slice(-6, -3); // Previous 3 months

      const recentAvg = {
        stars: recent.reduce((sum, d) => sum + d.stars, 0) / recent.length,
        forks: recent.reduce((sum, d) => sum + d.forks, 0) / recent.length,
        commits: recent.reduce((sum, d) => sum + d.commits, 0) / recent.length
      };

      const previousAvg = {
        stars: previous.length > 0 ? previous.reduce((sum, d) => sum + d.stars, 0) / previous.length : 0,
        forks: previous.length > 0 ? previous.reduce((sum, d) => sum + d.forks, 0) / previous.length : 0,
        commits: previous.length > 0 ? previous.reduce((sum, d) => sum + d.commits, 0) / previous.length : 0
      };

      return {
        starsGrowth: previousAvg.stars > 0 ? Math.round(((recentAvg.stars - previousAvg.stars) / previousAvg.stars) * 100) : 0,
        forksGrowth: previousAvg.forks > 0 ? Math.round(((recentAvg.forks - previousAvg.forks) / previousAvg.forks) * 100) : 0,
        contributorsGrowth: 0, // Would need more data to calculate
        commitActivity: previousAvg.commits > 0 ? Math.round(((recentAvg.commits - previousAvg.commits) / previousAvg.commits) * 100) : 0
      };
    } catch (error) {
      console.warn('Error calculating trends:', error);
      return { starsGrowth: 0, forksGrowth: 0, contributorsGrowth: 0, commitActivity: 0 };
    }
  }

  /**
   * Get minimal repository data as fallback
   */
  private static async getMinimalRepositoryData(owner: string, name: string): Promise<Repository> {
    try {
      // Try a minimal GraphQL query first
      const minimalQuery = `
        query GetMinimalRepository($owner: String!, $name: String!) {
          repository(owner: $owner, name: $name) {
            id
            name
            nameWithOwner
            description
            url
            stargazerCount
            forkCount
            watchers { totalCount }
            primaryLanguage { name }
            createdAt
            updatedAt
            pushedAt
            isArchived
            isPrivate
            owner {
              login
              ... on User { avatarUrl }
              ... on Organization { avatarUrl }
            }
          }
        }
      `;

      const response = await getGitHubGraphQL()(minimalQuery, { owner, name }) as any;
      const repo = response.repository;

      return {
        id: repo.id,
        name: repo.name,
        fullName: repo.nameWithOwner,
        description: repo.description,
        url: repo.url,
        stargazerCount: repo.stargazerCount || 0,
        forkCount: repo.forkCount || 0,
        watcherCount: repo.watchers?.totalCount || 0,
        language: repo.primaryLanguage?.name || null,
        topics: [],
        createdAt: repo.createdAt,
        updatedAt: repo.updatedAt,
        pushedAt: repo.pushedAt,
        isArchived: repo.isArchived || false,
        isPrivate: repo.isPrivate || false,
        owner: {
          login: repo.owner.login,
          type: repo.owner.__typename || 'User',
          avatarUrl: repo.owner.avatarUrl || '',
        },
        license: null,
        beginnerIssues: undefined
      };
    } catch (error) {
      console.error('Minimal GraphQL query failed, trying REST API:', error);
      
      // Fallback to REST API
      try {
        const restClient = getGitHubRest();
        const repoResponse = await restClient.repos.get({ owner, repo: name });
        const repo = repoResponse.data;

        return {
          id: repo.id.toString(),
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description,
          url: repo.html_url,
          stargazerCount: repo.stargazers_count || 0,
          forkCount: repo.forks_count || 0,
          watcherCount: repo.watchers_count || 0,
          language: repo.language,
          topics: repo.topics || [],
          createdAt: repo.created_at,
          updatedAt: repo.updated_at,
          pushedAt: repo.pushed_at,
          isArchived: repo.archived || false,
          isPrivate: repo.private || false,
          owner: {
            login: repo.owner.login,
            type: repo.owner.type,
            avatarUrl: repo.owner.avatar_url || '',
          },
          license: repo.license ? {
            name: repo.license.name,
            key: repo.license.key
          } : null,
          beginnerIssues: undefined
        };
      } catch (restError) {
        console.error('REST API fallback also failed:', restError);
        throw new Error(`Repository ${owner}/${name} not found or inaccessible`);
      }
    }
  }

  /**
   * Get detailed contributor insights with commit history
   */
  static async getContributorInsights(
    owner: string, 
    name: string, 
    period: 'week' | 'month' | 'quarter' | 'year' | 'all' = 'year'
  ): Promise<ContributorInsights> {
    try {
      const restClient = getGitHubRest();
      
      // Calculate date range based on period
      const endDate = new Date();
      const startDate = new Date();
      
      switch (period) {
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(endDate.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
        case 'all':
          startDate.setFullYear(2008); // GitHub's founding year
          break;
      }

      // Get contributors list with timeout and error handling
      let contributorsResponse;
      try {
        contributorsResponse = await Promise.race([
          restClient.repos.listContributors({
            owner,
            repo: name,
            per_page: 50 // Reduced to avoid timeouts
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Contributors request timeout')), 10000)
          )
        ]) as any;
      } catch (error) {
        console.warn('Failed to fetch contributors, using fallback approach:', error);
        // Return minimal data structure if contributors fetch fails
        return {
          contributors: [],
          totalCommits: 0,
          totalContributors: 0,
          activeContributors: 0,
          commitsByWeek: [],
          topLanguages: [],
          periodStats: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            totalCommits: 0,
            avgCommitsPerWeek: 0
          }
        };
      }

      // Get detailed commits for the period with timeout
      let commitsResponse;
      try {
        commitsResponse = await Promise.race([
          restClient.repos.listCommits({
            owner,
            repo: name,
            since: startDate.toISOString(),
            until: endDate.toISOString(),
            per_page: 50 // Reduced to avoid timeouts
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Commits request timeout')), 10000)
          )
        ]) as any;
      } catch (error) {
        console.warn('Failed to fetch commits, using contributors data only:', error);
        // Use contributors data without detailed commit analysis
        const contributors = contributorsResponse.data
          .filter((c: any) => c.login)
          .map((contributor: any) => ({
            login: contributor.login,
            avatarUrl: contributor.avatar_url || '',
            name: null,
            email: null,
            contributions: contributor.contributions || 0,
            commitHistory: [],
            totalAdditions: 0,
            totalDeletions: 0,
            firstCommit: '',
            lastCommit: '',
            weeklyAverage: 0,
            isActive: false
          }))
          .sort((a: any, b: any) => b.contributions - a.contributions);

        return {
          contributors,
          totalCommits: contributors.reduce((sum: number, c: any) => sum + c.contributions, 0),
          totalContributors: contributors.length,
          activeContributors: 0,
          commitsByWeek: [],
          topLanguages: [],
          periodStats: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            totalCommits: contributors.reduce((sum: number, c: any) => sum + c.contributions, 0),
            avgCommitsPerWeek: 0
          }
        };
      }

      // Process contributor data
      const contributorMap = new Map<string, DetailedContributor>();
      const weeklyCommits = new Map<string, { total: number; contributors: Set<string> }>();

      // Initialize contributors
      for (const contributor of contributorsResponse.data) {
        if (!contributor.login) continue; // Skip if login is undefined
        
        contributorMap.set(contributor.login, {
          login: contributor.login,
          avatarUrl: contributor.avatar_url || '',
          name: null,
          email: null,
          contributions: contributor.contributions || 0,
          commitHistory: [],
          totalAdditions: 0,
          totalDeletions: 0,
          firstCommit: '',
          lastCommit: '',
          weeklyAverage: 0,
          isActive: false
        });
      }

      // Process commits to get detailed stats
      for (const commit of commitsResponse.data) {
        const author = commit.author?.login;
        if (!author || !contributorMap.has(author)) continue;

        const contributor = contributorMap.get(author)!;
        const commitDate = new Date(commit.commit.author?.date || '');
        const weekKey = this.getWeekKey(commitDate);

        // Update contributor data
        if (!contributor.firstCommit || commitDate < new Date(contributor.firstCommit)) {
          contributor.firstCommit = commit.commit.author?.date || '';
        }
        if (!contributor.lastCommit || commitDate > new Date(contributor.lastCommit)) {
          contributor.lastCommit = commit.commit.author?.date || '';
        }

        contributor.name = commit.commit.author?.name || null;
        contributor.email = commit.commit.author?.email || null;

        // Check if active (committed in last 4 weeks)
        const fourWeeksAgo = new Date();
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
        if (commitDate > fourWeeksAgo) {
          contributor.isActive = true;
        }

        // Update weekly commits
        if (!weeklyCommits.has(weekKey)) {
          weeklyCommits.set(weekKey, { total: 0, contributors: new Set() });
        }
        weeklyCommits.get(weekKey)!.total++;
        weeklyCommits.get(weekKey)!.contributors.add(author);

        // Update commit history (without fetching individual commit details to avoid rate limits)
        const existingWeek = contributor.commitHistory.find(h => h.week === weekKey);
        if (existingWeek) {
          existingWeek.commits++;
        } else {
          contributor.commitHistory.push({
            week: weekKey,
            commits: 1,
            additions: 0, // Will be 0 since we're not fetching individual commit details
            deletions: 0  // Will be 0 since we're not fetching individual commit details
          });
        }
      }

      // Calculate weekly averages
      for (const contributor of contributorMap.values()) {
        const weeks = contributor.commitHistory.length;
        if (weeks > 0) {
          const totalCommits = contributor.commitHistory.reduce((sum, week) => sum + week.commits, 0);
          contributor.weeklyAverage = Math.round((totalCommits / weeks) * 10) / 10;
        }
        
        // Sort commit history by week
        contributor.commitHistory.sort((a, b) => a.week.localeCompare(b.week));
      }

      // Convert weekly commits to array
      const commitsByWeek = Array.from(weeklyCommits.entries())
        .map(([week, data]) => ({
          week,
          total: data.total,
          contributors: data.contributors.size
        }))
        .sort((a, b) => a.week.localeCompare(b.week));

      // Calculate language stats (simplified - would need more API calls for accuracy)
      const topLanguages = [
        { language: 'JavaScript', commits: 0, contributors: [] },
        { language: 'TypeScript', commits: 0, contributors: [] },
        { language: 'Python', commits: 0, contributors: [] }
      ];

      const contributors = Array.from(contributorMap.values())
        .sort((a, b) => b.contributions - a.contributions);

      const totalCommits = commitsResponse.data.length;
      const activeContributors = contributors.filter(c => c.isActive).length;

      // Calculate period stats
      const weeksDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
      const avgCommitsPerWeek = weeksDiff > 0 ? Math.round((totalCommits / weeksDiff) * 10) / 10 : 0;

      return {
        contributors,
        totalCommits,
        totalContributors: contributors.length,
        activeContributors,
        commitsByWeek,
        topLanguages,
        periodStats: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          totalCommits,
          avgCommitsPerWeek
        }
      };
    } catch (error) {
      console.error('Error fetching contributor insights:', error);
      throw new Error(`Failed to fetch contributor insights for ${owner}/${name}`);
    }
  }

  /**
   * Get commit activity for a specific contributor
   */
  static async getContributorCommitActivity(
    owner: string,
    name: string,
    contributor: string,
    period: 'week' | 'month' | 'quarter' | 'year' = 'year'
  ): Promise<ContributorCommitData[]> {
    try {
      const restClient = getGitHubRest();
      
      const endDate = new Date();
      const startDate = new Date();
      
      switch (period) {
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(endDate.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      const commits = await restClient.repos.listCommits({
        owner,
        repo: name,
        author: contributor,
        since: startDate.toISOString(),
        until: endDate.toISOString(),
        per_page: 100
      });

      const weeklyData = new Map<string, ContributorCommitData>();

      for (const commit of commits.data) {
        const commitDate = new Date(commit.commit.author?.date || '');
        const weekKey = this.getWeekKey(commitDate);

        if (!weeklyData.has(weekKey)) {
          weeklyData.set(weekKey, {
            week: weekKey,
            commits: 0,
            additions: 0,
            deletions: 0
          });
        }

        const weekData = weeklyData.get(weekKey)!;
        weekData.commits++;

        // Try to get commit stats
        try {
          const commitDetails = await restClient.repos.getCommit({
            owner,
            repo: name,
            ref: commit.sha
          });

          weekData.additions += commitDetails.data.stats?.additions || 0;
          weekData.deletions += commitDetails.data.stats?.deletions || 0;
        } catch {
          // Skip if we can't get commit details
        }
      }

      return Array.from(weeklyData.values()).sort((a, b) => a.week.localeCompare(b.week));
    } catch (error) {
      console.error('Error fetching contributor commit activity:', error);
      return [];
    }
  }

  /**
   * Helper method to get week key (YYYY-MM-DD format for Monday of the week)
   */
  private static getWeekKey(date: Date): string {
    const monday = new Date(date);
    const day = monday.getDay();
    const diff = monday.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    monday.setDate(diff);
    return monday.toISOString().split('T')[0];
  }
}

// Helper functions
function getLanguageColor(language: string): string {
  const colors: { [key: string]: string } = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#239120',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    Swift: '#ffac45',
    Kotlin: '#F18E33',
    Dart: '#00B4AB',
    HTML: '#e34c26',
    CSS: '#1572B6',
    Shell: '#89e051',
    Vue: '#2c3e50',
    React: '#61dafb'
  };
  return colors[language] || '#8884d8';
}

function detectFrameworks(languages: Array<{ name: string }>, dependencies: Array<{ name: string }>): string[] {
  const frameworks = new Set<string>();
  
  // Detect based on dependencies
  dependencies.forEach(dep => {
    if (dep.name.includes('react')) frameworks.add('React');
    if (dep.name.includes('vue')) frameworks.add('Vue.js');
    if (dep.name.includes('angular')) frameworks.add('Angular');
    if (dep.name.includes('express')) frameworks.add('Express.js');
    if (dep.name.includes('next')) frameworks.add('Next.js');
    if (dep.name.includes('nuxt')) frameworks.add('Nuxt.js');
    if (dep.name.includes('svelte')) frameworks.add('Svelte');
  });

  // Detect based on languages
  languages.forEach(lang => {
    if (lang.name === 'Python') {
      frameworks.add('Python');
    }
    if (lang.name === 'Java') {
      frameworks.add('Java');
    }
  });

  return Array.from(frameworks);
}

// function calculateGrowthRate(historical: HistoricalData[], field: keyof HistoricalData): number {
//   if (historical.length < 2) return 0;
  
//   const recent = historical.slice(-3); // Last 3 months
//   const older = historical.slice(-6, -3); // Previous 3 months
  
//   const recentAvg = recent.reduce((sum, item) => sum + (Number(item[field]) || 0), 0) / recent.length;
//   const olderAvg = older.reduce((sum, item) => sum + (Number(item[field]) || 0), 0) / older.length;
  
//   if (olderAvg === 0) return recentAvg > 0 ? 100 : 0;
  
//   return Math.round(((recentAvg - olderAvg) / olderAvg) * 100);
// } 