import { Rocket, Code2, Wrench, Users, Target, TrendingUp, Search } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">GitIntel Documentation</h1>
          <p className="text-lg text-muted-foreground">
            A comprehensive platform for analyzing GitHub repositories, discovering beginner-friendly issues, and understanding open source trends
          </p>
        </div>

        {/* Features Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Rocket className="h-6 w-6" />
            Features Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg p-6 border">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold">Beginner-Friendly Issues</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Automatically detects "good first issue" labeled issues</li>
                <li>• Supports 19+ beginner-friendly label variations</li>
                <li>• Direct GitHub integration with issue links</li>
              </ul>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="flex items-center gap-2 mb-3">
                <Search className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Repository Analytics</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Deep repository statistics and metrics</li>
                <li>• Technology stack analysis</li>
                <li>• Risk assessment and health scoring</li>
                <li>• Real-time data from GitHub API</li>
                <li>• Comprehensive search and discovery</li>
              </ul>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold">Contributor Insights</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Detailed contributor analysis</li>
                <li>• Commit history and activity tracking</li>
                <li>• Active vs. inactive contributor identification</li>
                <li>• Weekly contribution patterns</li>
                <li>• Top contributor rankings</li>
              </ul>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <h3 className="font-semibold">Growth & Trends</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Historical growth visualization</li>
                <li>• Trending repositories by technology</li>
                <li>• Competitive analysis and positioning</li>
                <li>• Growth trend calculations</li>
                <li>• Market insights and comparisons</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Beginner Issues Guide */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Target className="h-6 w-6 text-green-500" />
            Using Beginner-Friendly Issues
          </h2>
          <div className="space-y-4">
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-medium mb-2">How It Works</h3>
              <p className="text-sm text-muted-foreground mb-3">
                GitIntel automatically scans repository issues for beginner-friendly labels and presents them in an easy-to-browse interface.
              </p>
              <div className="bg-muted p-3 rounded-md">
                <h4 className="text-sm font-medium mb-2">Supported Label Keywords:</h4>
                <div className="text-xs text-muted-foreground grid grid-cols-2 md:grid-cols-3 gap-1">
                  <span>• good first issue</span>
                  <span>• beginner</span>
                  <span>• help wanted</span>
                  <span>• starter</span>
                  <span>• easy</span>
                  <span>• first-timer</span>
                  <span>• up-for-grabs</span>
                  <span>• new contributor</span>
                  <span>• entry level</span>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-medium mb-2">Accessing Beginner Issues</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Navigate to any repository's analytics page</li>
                <li>Look for the "Beginner Issues" button in the repository header</li>
                <li>Click to open the responsive drawer from the right side</li>
                <li>Browse issues with full context including labels and creation dates</li>
                <li>Click "View on GitHub" to open issues directly</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Code2 className="h-6 w-6" />
            Tech Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-medium mb-2">Frontend</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>Next.js 15 with App Router</li>
                <li>TypeScript for type safety</li>
                <li>Tailwind CSS for styling</li>
                <li>shadcn/ui component library</li>
                <li>Recharts for data visualization</li>
              </ul>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-medium mb-2">APIs & Integration</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>GitHub GraphQL API</li>
                <li>GitHub REST API (Octokit)</li>
                <li>Real-time data fetching</li>
                <li>Robust error handling</li>
                <li>Request timeout management</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Setup Guide */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Wrench className="h-6 w-6" />
            Quick Setup
          </h2>
          <div className="space-y-4">
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-medium mb-2">1. Clone and Install</h3>
              <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                <code>{`git clone https://github.com/kunal-511/gitintel
cd gitintel
pnpm install`}</code>
              </pre>
            </div>
            
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-medium mb-2">2. Set up Environment</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Create a .env.local file with your GitHub token:
              </p>
              <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                <code>{`GITHUB_TOKEN=your_github_personal_access_token_here
NEXT_PUBLIC_APP_NAME=GitIntel`}</code>
              </pre>
            </div>

            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-medium mb-2">3. Start Development Server</h3>
              <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                <code>pnpm dev</code>
              </pre>
              <p className="text-sm text-muted-foreground mt-2">
                Open http://localhost:3000 to view the app
              </p>
            </div>
          </div>
        </section>

        {/* Contributing */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Contributing</h2>
          <p className="text-muted-foreground">
            This is a passion project, and I welcome any contributions! Feel free to open issues or submit pull requests on{' '}
            <a 
              href="https://github.com/kunal-511/gitintel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GitHub
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
} 