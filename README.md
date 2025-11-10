# Swim Tracker & Coach 🏊‍♂️

A modern web app that helps casual swimmers track their progress and get AI-powered coaching insights.

## Features

- **"Am I Getting Better?" Dashboard** - Get a clear answer about your swimming progress at a glance
- **Ask AI** - Natural language interface to query your swim data using Claude AI
- **Performance Tracking** - Monitor pace, distance, SWOLF, and other key metrics
- **AI Coaching** - Receive personalized insights and actionable tips
- **Beautiful Visualizations** - Interactive charts showing your improvement over time
- **Dark Mode First** - Sleek, modern UI inspired by Runna, Strava, and WHOOP

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualizations
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn
- A Supabase account (free tier works great!)
- A Google Cloud account for OAuth

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Configuration

**📖 Complete Setup Guide:** See [SETUP.md](./SETUP.md) for detailed instructions.

**Quick setup:**
1. Create a Supabase project and run `supabase-schema.sql`
2. Set up Google OAuth in Google Cloud Console
3. Configure Google OAuth in Supabase
4. Copy `.env.example` to `.env` and add your credentials
5. (Optional) Set up Edge Functions for AI features - see [EDGE_FUNCTION_SETUP.md](./EDGE_FUNCTION_SETUP.md)

## Development

```bash
# Start dev server
npm run dev
# App runs at http://localhost:5173

# Test on mobile (same WiFi network)
npm run dev -- --host
# Access from phone: http://YOUR_LOCAL_IP:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

**📱 Mobile Testing:** See [docs/deployment/LOCAL_MOBILE_TESTING.md](./docs/deployment/LOCAL_MOBILE_TESTING.md)

## Deployment

**⚠️ IMPORTANT:** Before deploying to production, follow the complete checklist!

**📋 Deployment Checklist:** [docs/deployment/DEPLOYMENT_CHECKLIST.md](./docs/deployment/DEPLOYMENT_CHECKLIST.md)

### Quick Deploy

```bash
# 1. Run pre-deploy checks
./scripts/pre-deploy-check.sh

# 2. If all checks pass, deploy via GitHub
git push origin main
# Netlify will automatically build and deploy
```

### Critical Pre-Deployment Steps

1. ✅ **Supabase Auth URLs** - Configure at https://supabase.com/dashboard/project/YOUR_PROJECT/auth/url-configuration
   - Set Site URL to production domain
   - Add production domain to Redirect URLs

2. ✅ **Google OAuth** - Update authorized origins and redirect URIs in Google Cloud Console

3. ✅ **Netlify Environment Variables** - Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

**See [docs/deployment/](./docs/deployment/) for complete deployment documentation.**

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── dashboard/  # Dashboard-specific components
│   ├── insights/   # Insights & analytics components
│   ├── layout/     # Layout components (PageContainer, Header, etc.)
│   ├── shared/     # Shared utility components
│   ├── sharing/    # Social sharing components
│   ├── techniques/ # Swimming technique components
│   └── ui/         # Base UI components
├── pages/          # Page components (Dashboard, Sessions, etc.)
├── context/        # React context providers
├── hooks/          # Custom React hooks
├── utils/          # Helper functions & utilities
│   ├── ai/         # AI/LLM integration
│   ├── parsers/    # File parsers (TCX, FIT, CSV)
│   └── analytics/  # Analytics & calculations
├── design/         # Design tokens & theme
└── lib/            # External library configs
```

## Documentation

**📚 Complete Documentation:** [docs/README.md](./docs/README.md)

### Key Documents

- **[Setup Guide](./SETUP.md)** - Complete local development setup
- **[Deployment Checklist](./docs/deployment/DEPLOYMENT_CHECKLIST.md)** - Production deployment steps
- **[Testing Guide](./docs/development/TESTING.md)** - How to test features
- **[2025 Roadmap](./docs/roadmap/2025-roadmap.md)** - Product roadmap
- **[User Personas](./docs/personas/README.md)** - Testing with user personas

## Contributing

This is an MVP in active development. More features coming soon!

### Before Committing

1. Run tests (if applicable)
2. Ensure build succeeds: `npm run build`
3. Follow conventional commit messages
4. Update documentation if needed

### Before Deploying

Always run: `./scripts/pre-deploy-check.sh`

## License

MIT
