# Setup Documentation

This directory contains all setup and configuration guides for the Swim Tracker application.

## Quick Start

**First time setup?** Follow in this order:

1. **[Main Setup Guide](./SETUP.md)** - Start here!
   - Prerequisites and installation
   - Supabase setup
   - Google OAuth configuration
   - Environment variables
   - Quick verification steps

2. **[Edge Function Setup](./EDGE_FUNCTION_SETUP.md)** - Optional (for AI features)
   - Setting up Anthropic Claude API
   - Deploying edge functions
   - Testing AI features

## Documents

### [SETUP.md](./SETUP.md)
Complete setup guide covering:
- Node.js and dependencies installation
- Supabase project creation
- Database schema setup
- Google OAuth configuration
- Environment variables (.env file)
- Running the development server
- Troubleshooting common issues

### [EDGE_FUNCTION_SETUP.md](./EDGE_FUNCTION_SETUP.md)
AI features setup guide:
- Anthropic API key setup
- Edge function deployment to Supabase
- Testing the AI assistant
- Common edge function issues

## Related Documentation

- **[Deployment Checklist](../deployment/DEPLOYMENT_CHECKLIST.md)** - Before deploying to production
- **[Local Mobile Testing](../deployment/LOCAL_MOBILE_TESTING.md)** - Testing on mobile devices
- **[Quick Start Guide](../quick-start-guide.md)** - Streamlined getting started guide

## Quick Links

### Development
```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# Visit: http://localhost:3000
```

### Environment Variables
Create a `.env` file in the project root with:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_ANTHROPIC_API_KEY=your_claude_key  # Optional, for AI
```

## Need Help?

1. Check the troubleshooting sections in [SETUP.md](./SETUP.md)
2. Review [deployment docs](../deployment/) for production issues
3. See [development docs](../development/) for testing guides

---

**First time here?** Start with [SETUP.md](./SETUP.md) and follow the steps in order.
