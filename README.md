# GitIntel

A Next.js application for analyzing competition in open source GitHub projects. GitIntel helps you discover, compare, and analyze GitHub repositories to understand the competitive landscape in any technology domain.

## 🚀 Features

### Phase 1 (Current)
- ✅ GitHub API integration with GraphQL and REST
- ✅ Repository search and discovery
- ✅ Trending repositories analysis
- ✅ Repository statistics and metrics
- ✅ Basic UI for interacting with the API (Search, Trending,In Depth Analytics)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **GitHub API**: Octokit (GraphQL + REST)
- **Package Manager**: pnpm

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **pnpm** package manager
3. **GitHub Personal Access Token** or GitHub App credentials

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/kunal-511/gitintel
cd gitintel
pnpm install
```

### 2. GitHub API Setup

You need to set up GitHub API access. Choose one of the following methods:

#### Option A: Personal Access Token (Recommended for development)

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select the following scopes:
   - `public_repo` (for public repository access)
   - `read:org` (for organization data)
   - `read:user` (for user data)
4. Copy the generated token

#### Option B: GitHub App (Recommended for production)

1. Go to [GitHub Settings > Developer settings > GitHub Apps](https://github.com/settings/apps)
2. Click "New GitHub App"
3. Fill in the required information
4. Generate a private key and download it
5. Note the App ID

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp env.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# For Personal Access Token
GITHUB_TOKEN=your_github_personal_access_token_here

# For GitHub App (alternative to token)
GITHUB_APP_ID=your_github_app_id_here
GITHUB_APP_PRIVATE_KEY=your_github_app_private_key_here

# App Configuration
NEXT_PUBLIC_APP_NAME=GitIntel
NEXT_PUBLIC_APP_DESCRIPTION=Analyze competition in open source GitHub projects
```

### 4. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 📞 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/kunal-511/gitintel/issues) on GitHub. 

