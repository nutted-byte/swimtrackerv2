# Swim Tracker & Coach 🏊‍♂️

A modern web app that helps casual swimmers track their progress and get AI-powered coaching insights.

## Features

- **"Am I Getting Better?" Dashboard** - Get a clear answer about your swimming progress at a glance
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

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development

The app will run on `http://localhost:3000` by default.

## Deployment

This app is configured for easy deployment to Netlify:

1. Push your code to GitHub
2. Connect your GitHub repo to Netlify
3. Netlify will auto-detect Vite settings
4. Deploy!

Build command: `npm run build`
Publish directory: `dist`

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── context/       # React context (theme, etc.)
├── hooks/         # Custom React hooks
├── utils/         # Helper functions
└── styles/        # Global CSS
```

## Contributing

This is an MVP in active development. More features coming soon!

## License

MIT
