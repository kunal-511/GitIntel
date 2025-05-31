import { Rocket, Code2, Wrench } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">GitIntel Documentation</h1>
          <p className="text-lg text-muted-foreground">
            A passion project for analyzing GitHub repositories and understanding open source trends
          </p>
        </div>

        {/* Features Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Rocket className="h-6 w-6" />
            Current Features
          </h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>GitHub API integration with GraphQL and REST</li>
            <li>Repository search and discovery</li>
            <li>Trending repositories analysis</li>
            <li>Repository statistics and metrics</li>
            <li>Interactive UI for repository analytics</li>
          </ul>
        </section>

        {/* Tech Stack */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Code2 className="h-6 w-6" />
            Tech Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-medium mb-2">Core</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>Next.js 15 with App Router</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
              </ul>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-medium mb-2">APIs & Tools</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>GitHub API (Octokit)</li>
                <li>GraphQL + REST</li>
                <li>pnpm package manager</li>
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