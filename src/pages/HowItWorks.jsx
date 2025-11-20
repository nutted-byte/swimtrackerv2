import { motion } from 'framer-motion';
import { PageContainer, PageHeader } from '../components/layout';
import { Card } from '../components/Card';
import { tokens } from '../design/tokens';
import {
  Code,
  Database,
  Zap,
  Sparkles,
  Brain,
  TrendingUp,
  Activity,
  Calendar,
  Target,
  BarChart3,
  Watch,
  Cloud,
  Cpu,
  Layout,
  Palette,
  GitBranch,
  Box,
  LineChart,
  Award,
  Gauge,
  Timer,
  Rocket,
  Settings,
  Lock,
  MessageSquare,
  Wand2,
  Users,
  Layers,
  LayoutGrid,
  RefreshCw,
  Lightbulb,
  AlertTriangle,
  FileText,
  CheckCircle,
  XCircle,
  BookOpen,
  User,
  Heart,
  Briefcase,
  Bot
} from 'lucide-react';

export const HowItWorks = () => {
  const integrations = [
    {
      icon: <FileText className={tokens.icons.lg} />,
      name: 'CSV Upload',
      description: 'Import swim data from FIT files or manual CSV entry',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Database className={tokens.icons.lg} />,
      name: 'Supabase',
      description: 'Real-time database with PostgreSQL backend',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: <Sparkles className={tokens.icons.lg} />,
      name: 'Claude AI',
      description: 'AI-powered swim analysis and coaching insights via Edge Functions',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: <Cloud className={tokens.icons.lg} />,
      name: 'Netlify',
      description: 'Continuous deployment and global CDN distribution',
      color: 'from-cyan-500 to-teal-600'
    },
    {
      icon: <Activity className={tokens.icons.lg} />,
      name: 'Google OAuth',
      description: 'Secure authentication with Google Sign-In',
      color: 'from-red-500 to-orange-600'
    }
  ];

  const techStack = [
    {
      category: 'Frontend',
      icon: <Code className={tokens.icons.lg} />,
      why: 'Chosen for modern React patterns, fast development, and excellent developer experience',
      technologies: [
        { name: 'React 18', description: 'UI library with hooks & context' },
        { name: 'Vite', description: 'Lightning-fast build tool' },
        { name: 'Framer Motion', description: 'Smooth animations' },
        { name: 'React Router', description: 'Client-side routing' }
      ]
    },
    {
      category: 'Styling',
      icon: <Palette className={tokens.icons.lg} />,
      why: 'Design tokens ensure consistency, Tailwind enables rapid prototyping without CSS bloat',
      technologies: [
        { name: 'Tailwind CSS', description: 'Utility-first CSS framework' },
        { name: 'Design Tokens', description: 'Centralized design system' },
        { name: 'Dark Mode', description: 'Native theme support' },
        { name: 'Responsive Design', description: 'Mobile-first approach' }
      ]
    },
    {
      category: 'Backend',
      icon: <Database className={tokens.icons.lg} />,
      why: 'Supabase provides authentication, database, and real-time features without managing servers',
      technologies: [
        { name: 'Supabase', description: 'Auth, database & storage' },
        { name: 'PostgreSQL', description: 'Relational database' },
        { name: 'Edge Functions', description: 'Serverless compute' },
        { name: 'Real-time', description: 'Live data sync' }
      ]
    }
  ];

  const smartFeatures = [
    {
      icon: <Brain className={tokens.icons.lg} />,
      title: 'Deep Analysis',
      description: 'Analyzes pacing strategy, fatigue patterns, and comparative performance',
      features: ['Negative/Positive splits', 'Fatigue index calculation', 'Personal best tracking']
    },
    {
      icon: <Target className={tokens.icons.lg} />,
      title: 'Smart Recommendations',
      description: 'AI-generated coaching based on your actual swim data',
      features: ['Personalized next-swim goals', 'Efficiency improvements', 'Distance progression']
    },
    {
      icon: <TrendingUp className={tokens.icons.lg} />,
      title: 'Performance Metrics',
      description: 'Track SWOLF, DPS, pace trends, and efficiency over time',
      features: ['SWOLF efficiency score', 'Distance per stroke', '90-day averages']
    },
    {
      icon: <Calendar className={tokens.icons.lg} />,
      title: 'Pattern Recognition',
      description: 'Discovers when you perform best and maintains streak tracking',
      features: ['Best day/time detection', 'Weekly streaks', 'Training momentum']
    },
    {
      icon: <Award className={tokens.icons.lg} />,
      title: 'Ranking System',
      description: 'Percentile-based ranking against your historical performance',
      features: ['Top swims identification', 'Comparative analysis', 'Personal records']
    },
    {
      icon: <Gauge className={tokens.icons.lg} />,
      title: 'Real-time Analytics',
      description: 'Instant calculations and visualizations of your swim data',
      features: ['Live pace calculations', 'Dynamic charts', 'Session comparisons']
    }
  ];

  const dataFlow = [
    {
      step: 1,
      title: 'Data Import',
      description: 'Upload FIT files from Garmin or manually enter swim data',
      icon: <Watch className={tokens.icons.md} />
    },
    {
      step: 2,
      title: 'Processing',
      description: 'Parse and validate swim metrics (distance, pace, strokes, SWOLF)',
      icon: <Cpu className={tokens.icons.md} />
    },
    {
      step: 3,
      title: 'Storage',
      description: 'Store in Supabase with user authentication and real-time sync',
      icon: <Database className={tokens.icons.md} />
    },
    {
      step: 4,
      title: 'Analysis',
      description: 'Run analytics algorithms to generate insights and recommendations',
      icon: <Brain className={tokens.icons.md} />
    },
    {
      step: 5,
      title: 'Visualization',
      description: 'Display results with interactive charts and smart summaries',
      icon: <BarChart3 className={tokens.icons.md} />
    }
  ];

  const deployment = [
    {
      step: 1,
      title: 'Build',
      description: 'Vite (French for "fast") is a next-gen build tool that bundles JavaScript with lightning speed using native ES modules and esbuild. It creates optimized production bundles with automatic code splitting and tree shaking.',
      icon: <Cpu className={tokens.icons.md} />,
      command: 'npm run build'
    },
    {
      step: 2,
      title: 'Deploy to Netlify',
      description: 'Netlify is a modern hosting platform for web apps. It automatically deploys from Git pushes to the main branch using continuous deployment. Each commit triggers a new build and deployment with zero downtime.',
      icon: <Rocket className={tokens.icons.md} />,
      command: 'netlify deploy --prod'
    },
    {
      step: 3,
      title: 'Edge Functions',
      description: 'Serverless functions are code that runs on-demand without managing servers. Netlify Edge Functions run at CDN edge locations globally, specifically for AI swim analysis powered by Claude API.',
      icon: <Zap className={tokens.icons.md} />,
      command: 'auto-deployed'
    },
    {
      step: 4,
      title: 'Environment Variables',
      description: 'Environment variables store sensitive data like API keys outside of code. Netlify securely manages secrets for Supabase database connections and Claude AI API keys, keeping them encrypted and separate from the public codebase.',
      icon: <Lock className={tokens.icons.md} />,
      command: 'netlify env:set'
    },
    {
      step: 5,
      title: 'Live',
      description: 'A CDN (Content Delivery Network) caches and serves your app from servers worldwide. Netlify distributes the app globally with automatic HTTPS encryption, making Swimma fast and secure no matter where users are located.',
      icon: <Cloud className={tokens.icons.md} />,
      command: '✓ deployed'
    }
  ];

  const technicalDecisions = [
    {
      icon: <Palette className={tokens.icons.md} />,
      title: 'Design Token System',
      description: 'Centralized styling prevents inconsistencies and makes theme changes instant across the entire app. One source of truth for colors, spacing, typography',
      benefit: 'Theme updates in seconds vs hours'
    },
    {
      icon: <LayoutGrid className={tokens.icons.md} />,
      title: 'Component Architecture',
      description: 'Every UI element is a reusable component (Cards, Buttons, etc.). Build once, use everywhere',
      benefit: 'Consistent UX across all pages'
    },
    {
      icon: <Layers className={tokens.icons.md} />,
      title: 'Lazy Loading',
      description: 'Pages load on-demand to reduce initial bundle size with React.lazy(). First load is faster, subsequent navigation is instant',
      benefit: 'Fast initial page load'
    },
    {
      icon: <RefreshCw className={tokens.icons.md} />,
      title: 'Memoization',
      description: 'Expensive calculations cached with React useMemo to prevent re-computation on every render',
      benefit: '60fps UI with complex analytics'
    }
  ];

  const personas = [
    {
      name: 'Comeback Claire',
      subtitle: 'The Returning Swimmer',
      icon: '🏊‍♀️',
      color: 'blue',
      description: 'Swam competitively at county level, 15 years off, recently rejoined local leisure centre',
      needs: [
        'AI coaching insights that answer "am I doing alright?"',
        'Progress visualisation that proves improvement',
        'Comparisons to "returning swimmers" not elite athletes',
        'Technique tips based on her data'
      ],
      quote: "I used to swim a 1:05 100m at county level. Now I'm doing 2:30 and I don't know if that's pathetic or actually quite good for someone who hasn't trained in 15 years."
    },
    {
      name: 'Data-Driven David',
      subtitle: 'The Analytical Optimizer',
      icon: '📊',
      color: 'purple',
      description: 'Software engineer who loves tracking everything, started 2 years ago for cross-training',
      needs: [
        'Natural language querying (Ask AI feature)',
        'Detailed analytics and trend charts',
        'Pattern recognition and correlations',
        'Data export (CSV, JSON, API access)'
      ],
      quote: "I want to know: do I swim faster on days when I sleep 8+ hours? After rest days? In the morning vs. evening? Show me the data."
    },
    {
      name: 'Milestone Maria',
      subtitle: 'The Goal-Oriented Beginner',
      icon: '🎯',
      color: 'green',
      description: 'Nurse training for first Olympic triathlon, never swam laps until 6 months ago',
      needs: [
        'Achievement badges and celebrations for milestones',
        'Clear progress bars toward goals (50% to 1500m!)',
        'Encouraging AI coach tone (not technical)',
        'Educational content about swimming basics'
      ],
      quote: "I just want to know: am I getting better? Am I on track for my triathlon? And please tell me that 3:15/100m is alright for a beginner..."
    },
    {
      name: 'Competitive Chris',
      subtitle: 'The Masters Swimmer',
      icon: '🏆',
      color: 'orange',
      description: 'Masters swimmer competing in galas 4-6x per year, very serious about performance',
      needs: [
        'Lap-by-lap breakdown with split times',
        'Pacing strategy analysis (negative split detection)',
        'Training zones by pace',
        'Age group comparison standards'
      ],
      quote: "I need to know: was my pacing strategy effective? Did I start too fast? How does this compare to my age group at the last gala?"
    },
    {
      name: 'Casual Casey',
      subtitle: 'The Wellness Swimmer',
      icon: '🧘‍♀️',
      color: 'pink',
      description: 'Stay-at-home parent who swims for stress relief and gentle exercise, not competition',
      needs: [
        'Streak tracking ("5 swims in a row!")',
        'Celebratory animations for showing up',
        'Non-judgemental, gentle tone',
        'Focus on consistency over performance'
      ],
      quote: "I don't care if I'm fast or slow. I just want to celebrate the fact that I made it to the pool twice this week despite everything going on."
    }
  ];

  const claudeAgent = {
    purpose: 'Specialized AI agent for product strategy and feature validation',
    capabilities: [
      {
        title: 'Feature Validation',
        description: 'Evaluates new feature ideas against user personas and product vision',
        icon: <Target className={tokens.icons.md} />,
        example: 'Validated the "+100m recommendation" approach for weekly swimmers vs traditional daily training models'
      },
      {
        title: 'Strategic Roadmap',
        description: 'Helps prioritize features based on user impact and technical complexity',
        icon: <BarChart3 className={tokens.icons.md} />,
        example: 'Prioritized swim summary recommendations over complex training plan generation'
      },
      {
        title: 'UX Analysis',
        description: 'Reviews user flows and suggests improvements based on persona needs',
        icon: <Users className={tokens.icons.md} />,
        example: 'Recommended simplifying the summary sentence structure for better readability'
      },
      {
        title: 'Data-Driven Insights',
        description: 'Analyzes usage patterns to inform product decisions',
        icon: <Brain className={tokens.icons.md} />,
        example: 'Identified that users care more about "what to do next" than historical analysis'
      }
    ],
    usage: [
      'Invoked via /swimma-strategist command in Claude Code',
      'Has access to all project files and context',
      'Can analyze user personas and product vision',
      'Provides strategic guidance without code implementation',
      'Helps validate ideas before building them'
    ],
    benefits: [
      'Prevents building features users don\'t need',
      'Ensures features align with persona needs',
      'Saves development time by validating early',
      'Maintains product vision consistency'
    ]
  };

  const learnings = [
    {
      challenge: 'Context Memory Limitations',
      problem: 'Claude would forget decisions made earlier in the conversation, leading to inconsistent implementations',
      solution: 'Document architectural decisions in .md files in .claude/ directory. Claude reads these files at conversation start',
      impact: 'Critical',
      icon: <Brain className={tokens.icons.md} />,
      tips: [
        'Create DESIGN_SYSTEM_RULES.md early with styling guidelines',
        'Add project-specific constraints as you discover them',
        'Reference these docs when Claude makes conflicting suggestions'
      ]
    },
    {
      challenge: 'Token Usage Blowup',
      problem: 'Reading entire large files repeatedly consumed massive tokens, especially with node_modules accidentally included',
      solution: 'Use .claudeignore to exclude node_modules, dist, .git. Be selective about file reads - read only what you need',
      impact: 'High',
      icon: <AlertTriangle className={tokens.icons.md} />,
      tips: [
        'Set up .claudeignore before starting serious development',
        'Use Grep for searching instead of reading entire files',
        'Ask Claude to read specific line ranges, not entire files'
      ]
    },
    {
      challenge: 'Inconsistent Styling',
      problem: 'Different components used different approaches - some Tailwind classes, some inline styles, mixed spacing',
      solution: 'Created design token system (tokens.js) as single source of truth. Refactored all components to use it',
      impact: 'Medium',
      icon: <Palette className={tokens.icons.md} />,
      tips: [
        'Define design system FIRST before building components',
        'Use design tokens from day one, not as a refactor',
        'Document token usage in .claude/commands or rules'
      ]
    },
    {
      challenge: 'Duplicate Code & Logic',
      problem: 'Analytics calculations reimplemented multiple times in different files with slight variations',
      solution: 'Consolidated all analytics into utils/ with single functions used everywhere',
      impact: 'Medium',
      icon: <Code className={tokens.icons.md} />,
      tips: [
        'Create utility functions early, before duplication spreads',
        'Use Claude to search for duplicate patterns: "find all places we calculate SWOLF"',
        'Refactor aggressively when you notice duplication'
      ]
    },
    {
      challenge: 'Over-Engineering Early On',
      problem: 'Built complex features before validating if we actually needed them',
      solution: 'Embrace progressive enhancement - start simple, add complexity only when needed',
      impact: 'Low',
      icon: <Layers className={tokens.icons.md} />,
      tips: [
        'Ship basic features first, get them working',
        'Add AI/advanced features as layers on top',
        'Don\'t optimize prematurely - measure first'
      ]
    }
  ];

  const bestPractices = [
    {
      category: 'Project Setup',
      icon: <FileText className={tokens.icons.md} />,
      dos: [
        'Create .claudeignore immediately (exclude node_modules, dist, .git)',
        'Set up .claude/ directory with project rules and design guidelines',
        'Document tech stack decisions in a central README or HOW_IT_WORKS.md',
        'Define design tokens before writing any components'
      ],
      donts: [
        'Don\'t let Claude read node_modules - token waste',
        'Don\'t start building without style guidelines',
        'Don\'t assume Claude remembers previous conversations'
      ]
    },
    {
      category: 'Working with Claude',
      icon: <MessageSquare className={tokens.icons.md} />,
      dos: [
        'Break large features into smaller, focused tasks',
        'Use Grep and Glob instead of reading entire files',
        'Reference your .claude/*.md files when Claude forgets patterns',
        'Ask Claude to explain its approach before implementing',
        'Use TodoWrite to track multi-step tasks'
      ],
      donts: [
        'Don\'t ask Claude to refactor everything at once',
        'Don\'t let conversations get too long - start fresh when needed',
        'Don\'t trust Claude to remember your design system without docs'
      ]
    },
    {
      category: 'Code Organization',
      icon: <GitBranch className={tokens.icons.md} />,
      dos: [
        'Create utils/ for reusable logic early',
        'Use a consistent file structure from day one',
        'Centralize configuration (design tokens, API endpoints, constants)',
        'Establish naming conventions and document them'
      ],
      donts: [
        'Don\'t scatter analytics logic across multiple files',
        'Don\'t mix approaches (e.g., some CSS modules, some Tailwind)',
        'Don\'t create "temp" or "test" files that live forever'
      ]
    },
    {
      category: 'Performance',
      icon: <Zap className={tokens.icons.md} />,
      dos: [
        'Use lazy loading for route-level code splitting',
        'Memoize expensive calculations with useMemo',
        'Set up proper .claudeignore to save tokens',
        'Monitor bundle size as you add features'
      ],
      donts: [
        'Don\'t import entire libraries when you only need one function',
        'Don\'t re-render components unnecessarily',
        'Don\'t read large files repeatedly in conversations'
      ]
    }
  ];

  return (
    <PageContainer>
      <PageHeader
        title="How It Works"
        subtitle="Technical overview of Swimma's architecture, integrations, and intelligence"
      />

      {/* Integrations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Zap className={`${tokens.icons.lg} text-primary-400`} />
            <h2 className="font-display text-2xl font-bold">Integrations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 rounded-lg bg-dark-bg/80 border border-dark-border hover:bg-dark-bg/60 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${integration.color} text-white flex-shrink-0`}>
                    {integration.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold mb-1 text-content-primary">{integration.name}</h3>
                    <p className="text-sm text-content-secondary">{integration.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Code className={`${tokens.icons.lg} text-accent-blue`} />
            <h2 className="font-display text-2xl font-bold">Tech Stack</h2>
          </div>
          <div className="space-y-6">
            {techStack.map((stack, index) => (
              <motion.div
                key={stack.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-dark-bg/60">
                    {stack.icon}
                  </div>
                  <h3 className="font-display text-xl font-bold">{stack.category}</h3>
                </div>
                <p className="text-sm text-content-tertiary italic ml-14 mb-4">Why: {stack.why}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-14">
                  {stack.technologies.map((tech) => (
                    <div key={tech.name} className="flex items-start gap-3 p-3 rounded-lg bg-dark-bg/40 hover:bg-dark-bg/60 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-primary-400 mt-2"></div>
                      <div>
                        <p className="font-medium">{tech.name}</p>
                        <p className="text-sm text-content-tertiary">{tech.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Smart Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className={`${tokens.icons.lg} text-purple-400`} />
            <h2 className="font-display text-2xl font-bold">Smart Features</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {smartFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                className="p-4 rounded-lg bg-dark-bg/60 hover:bg-dark-bg/80 transition-colors border border-dark-border"
              >
                <div className="text-primary-400 mb-3">
                  {feature.icon}
                </div>
                <h3 className="font-display text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-content-tertiary mb-3">{feature.description}</p>
                <ul className="space-y-1">
                  {feature.features.map((item) => (
                    <li key={item} className="text-xs flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-accent-blue"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Data Flow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <GitBranch className={`${tokens.icons.lg} text-green-400`} />
            <h2 className="font-display text-2xl font-bold">Data Flow</h2>
          </div>
          <div className="relative">
            {dataFlow.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                className="flex items-start gap-4 mb-6 last:mb-0"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-blue flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-2 mb-1">
                    {step.icon}
                    <h3 className="font-display text-lg font-bold">{step.title}</h3>
                  </div>
                  <p className="text-sm text-content-tertiary">{step.description}</p>
                </div>
                {index < dataFlow.length - 1 && (
                  <div className="absolute left-6 top-14 w-0.5 h-12 bg-gradient-to-b from-primary-500 to-accent-blue opacity-30" style={{ marginTop: `${index * 80}px` }}></div>
                )}
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Deployment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Rocket className={`${tokens.icons.lg} text-cyan-400`} />
            <h2 className="font-display text-2xl font-bold">Deployment Pipeline</h2>
          </div>
          <p className="text-sm text-content-tertiary mb-6 italic">
            Continuous deployment from Git to production with zero downtime using Netlify's edge network
          </p>
          <div className="relative">
            {deployment.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                className="flex items-start gap-4 mb-6 last:mb-0"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-2 mb-1">
                    {step.icon}
                    <h3 className="font-display text-lg font-bold">{step.title}</h3>
                  </div>
                  <p className="text-sm text-content-tertiary mb-2">{step.description}</p>
                  <code className="text-xs bg-dark-bg px-2 py-1 rounded text-primary-400 font-mono">
                    {step.command}
                  </code>
                </div>
                {index < deployment.length - 1 && (
                  <div className="absolute left-6 top-14 w-0.5 h-12 bg-gradient-to-b from-cyan-500 to-blue-600 opacity-30" style={{ marginTop: `${index * 110}px` }}></div>
                )}
              </motion.div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-lg bg-dark-bg/60 border border-cyan-500/20">
            <div className="flex items-start gap-3">
              <Settings className={`${tokens.icons.md} text-cyan-400 flex-shrink-0 mt-1`} />
              <div>
                <h4 className="font-display font-bold mb-2">Key Features</h4>
                <ul className="space-y-2 text-sm text-content-tertiary">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2"></div>
                    <span><strong>Instant rollbacks:</strong> Revert to any previous deployment in seconds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2"></div>
                    <span><strong>Preview deployments:</strong> Every PR gets a unique preview URL</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2"></div>
                    <span><strong>Atomic deploys:</strong> New version goes live all at once, no partial updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2"></div>
                    <span><strong>Global CDN:</strong> Assets served from edge locations worldwide</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Technical Decisions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Settings className={`${tokens.icons.lg} text-indigo-400`} />
            <h2 className="font-display text-2xl font-bold">Technical Decisions</h2>
          </div>
          <div className="space-y-4">
            {technicalDecisions.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.1 + index * 0.05 }}
                className="p-4 rounded-lg bg-dark-bg/60 hover:bg-dark-bg/80 transition-colors border border-dark-border"
              >
                <div className="flex items-start gap-4">
                  <div className="text-indigo-400 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display font-bold">{item.title}</h3>
                      <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded">
                        {item.benefit}
                      </span>
                    </div>
                    <p className="text-sm text-content-tertiary">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* User Personas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <User className={`${tokens.icons.lg} text-cyan-400`} />
            <h2 className="font-display text-2xl font-bold">User Personas</h2>
          </div>
          <p className="text-sm text-content-tertiary mb-6 italic">
            5 documented personas representing real swimmer archetypes - from competitive masters to wellness swimmers
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {personas.map((persona, index) => (
              <motion.div
                key={persona.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 1.3 + index * 0.05 }}
                className="p-4 rounded-lg bg-dark-bg/60 hover:bg-dark-bg/80 transition-colors border border-dark-border"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-4xl">{persona.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-bold mb-0">{persona.name}</h3>
                    <p className="text-xs text-content-secondary mb-1 italic">{persona.subtitle}</p>
                    <p className="text-sm text-content-tertiary">{persona.description}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-bold text-content-secondary mb-2">KEY NEEDS</h4>
                  <ul className="space-y-1">
                    {persona.needs.map((need, idx) => (
                      <li key={idx} className="text-xs text-content-tertiary flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0"></div>
                        <span>{need}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-3 border-t border-dark-border">
                  <p className="text-xs italic text-content-tertiary">"{persona.quote}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Claude Agent */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.4 }}
      >
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Bot className={`${tokens.icons.lg} text-violet-400`} />
            <h2 className="font-display text-2xl font-bold">Swimma Product Strategist Agent</h2>
          </div>
          <p className="text-sm text-content-tertiary mb-6 italic">
            {claudeAgent.purpose}
          </p>

          {/* Capabilities */}
          <div className="mb-6">
            <h3 className="font-display text-lg font-bold mb-4">Capabilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {claudeAgent.capabilities.map((cap, index) => (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.5 + index * 0.05 }}
                  className="p-3 rounded-lg bg-dark-bg/60 border border-dark-border"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="text-violet-400 flex-shrink-0">
                      {cap.icon}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm mb-1">{cap.title}</h4>
                      <p className="text-xs text-content-tertiary mb-2">{cap.description}</p>
                      <div className="text-xs text-content-secondary italic bg-dark-bg/60 p-2 rounded">
                        <strong>Example:</strong> {cap.example}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Usage & Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
                <Settings className={tokens.icons.md} />
                How to Use
              </h3>
              <ul className="space-y-2">
                {claudeAgent.usage.map((item, idx) => (
                  <li key={idx} className="text-sm text-content-tertiary flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 flex-shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
                <CheckCircle className={tokens.icons.md} />
                Benefits
              </h3>
              <ul className="space-y-2">
                {claudeAgent.benefits.map((item, idx) => (
                  <li key={idx} className="text-sm text-content-tertiary flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
            <div className="flex items-start gap-3">
              <Lightbulb className={`${tokens.icons.md} text-violet-400 flex-shrink-0 mt-1`} />
              <div>
                <h4 className="font-display font-bold mb-2">Why This Matters</h4>
                <p className="text-sm text-content-tertiary">
                  The Swimma strategist agent helped validate that weekly swimmers need different features than daily athletes.
                  This prevented us from building complex training schedules nobody would use, and instead focused on simple,
                  actionable "next swim" recommendations.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Learnings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.6 }}
      >
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className={`${tokens.icons.lg} text-red-400`} />
            <h2 className="font-display text-2xl font-bold">Learnings & Challenges</h2>
          </div>
          <p className="text-sm text-content-tertiary mb-6 italic">
            Real challenges we faced building with AI assistance and how we solved them
          </p>
          <div className="space-y-6">
            {learnings.map((item, index) => (
              <motion.div
                key={item.challenge}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1.7 + index * 0.1 }}
                className="p-4 rounded-lg bg-dark-bg/60 border border-dark-border"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-red-400 flex-shrink-0 mt-1">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display text-lg font-bold">{item.challenge}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.impact === 'Critical' ? 'bg-red-500/20 text-red-400' :
                        item.impact === 'High' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {item.impact} Impact
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <XCircle className="w-4 h-4 text-red-400" />
                          <span className="text-sm font-medium text-red-400">Problem</span>
                        </div>
                        <p className="text-sm text-content-tertiary ml-6">{item.problem}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-medium text-green-400">Solution</span>
                        </div>
                        <p className="text-sm text-content-tertiary ml-6">{item.solution}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm font-medium text-yellow-400">Tips for Next Project</span>
                        </div>
                        <ul className="space-y-1 ml-6">
                          {item.tips.map((tip, idx) => (
                            <li key={idx} className="text-xs text-content-tertiary flex items-start gap-2">
                              <div className="w-1 h-1 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0"></div>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Best Practices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.8 }}
      >
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className={`${tokens.icons.lg} text-green-400`} />
            <h2 className="font-display text-2xl font-bold">Best Practices for Your Next Project</h2>
          </div>
          <p className="text-sm text-content-tertiary mb-6 italic">
            Actionable guidelines distilled from building Swimma
          </p>
          <div className="space-y-6">
            {bestPractices.map((practice, index) => (
              <motion.div
                key={practice.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.9 + index * 0.1 }}
                className="p-4 rounded-lg bg-dark-bg/60 border border-dark-border"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-green-400">
                    {practice.icon}
                  </div>
                  <h3 className="font-display text-lg font-bold">{practice.category}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-9">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-bold text-green-400">DO</span>
                    </div>
                    <ul className="space-y-2">
                      {practice.dos.map((item, idx) => (
                        <li key={idx} className="text-xs text-content-tertiary flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1 flex-shrink-0"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-bold text-red-400">DON'T</span>
                    </div>
                    <ul className="space-y-2">
                      {practice.donts.map((item, idx) => (
                        <li key={idx} className="text-xs text-content-tertiary flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1 flex-shrink-0"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Final Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 2.0 }}
        className="text-center"
      >
        <div className="p-6 rounded-lg bg-dark-bg/40 border border-dark-border/50">
          <p className="text-content-secondary italic">
            This entire app was built over the past month in collaboration with Claude Code (AI assistant).
            Every feature, bug fix, and design decision happened through conversational development.
            The good, the bad, the refactors - all documented in the Learnings section above.
            Not perfect, but real.
          </p>
        </div>
      </motion.div>

    </PageContainer>
  );
};
