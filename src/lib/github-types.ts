// GitHub GraphQL API response types

export interface GitHubRepositoryResponse {
  repository: {
    id: string;
    name: string;
    nameWithOwner: string;
    description: string | null;
    url: string;
    stargazerCount: number;
    forkCount: number;
    watchers: {
      totalCount: number;
    };
    primaryLanguage: {
      name: string;
    } | null;
    repositoryTopics: {
      nodes: Array<{
        topic: {
          name: string;
        };
      }>;
    };
    createdAt: string;
    updatedAt: string;
    pushedAt: string;
    isArchived: boolean;
    isPrivate: boolean;
    owner: {
      login: string;
      __typename: string;
      avatarUrl: string;
    };
    licenseInfo: {
      name: string;
      key: string;
    } | null;
    collaborators: {
      totalCount: number;
    };
    releases: {
      totalCount: number;
    };
    issues: {
      totalCount: number;
    };
    closedIssues: {
      totalCount: number;
    };
    pullRequests: {
      totalCount: number;
    };
    closedPullRequests: {
      totalCount: number;
    };
    mergedPullRequests: {
      totalCount: number;
    };
    defaultBranchRef: {
      target: {
        history: {
          totalCount: number;
        };
        historyLastMonth: {
          totalCount: number;
        };
      };
    } | null;
  };
}

export interface GitHubSearchResponse {
  search: {
    repositoryCount: number;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    nodes: Array<{
      id: string;
      name: string;
      nameWithOwner: string;
      description: string | null;
      url: string;
      stargazerCount: number;
      forkCount: number;
      watchers: {
        totalCount: number;
      };
      primaryLanguage: {
        name: string;
      } | null;
      repositoryTopics: {
        nodes: Array<{
          topic: {
            name: string;
          };
        }>;
      };
      createdAt: string;
      updatedAt: string;
      pushedAt: string;
      isArchived: boolean;
      isPrivate: boolean;
      owner: {
        login: string;
        __typename: string;
        avatarUrl: string;
      };
      licenseInfo: {
        name: string;
        key: string;
      } | null;
    }>;
  };
} 