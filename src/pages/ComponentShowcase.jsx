import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { SessionCard } from '../components/SessionCard';
import { TrendBadge } from '../components/TrendBadge';
import { Tooltip } from '../components/Tooltip';
import { CollapsibleSection } from '../components/CollapsibleSection';
import { TechniqueCard } from '../components/TechniqueCard';
import { SwimRankingCard } from '../components/SwimRankingCard';
import { QuickInsightCard } from '../components/QuickInsightCard';
import { DeepInsightCard } from '../components/DeepInsightCard';
import { AchievementBadges } from '../components/AchievementBadges';
import { Button, IconButton } from '../components/Button';
import { SwimComparisonChart } from '../components/SwimComparisonChart';
import { LapPaceChart } from '../components/visualizations/LapPaceChart';
import { InsightsChart } from '../components/insights/InsightsChart';
import { PageContainer, PageHeader } from '../components/layout';
import { CardHeader, MetricDisplay, StatGrid, ProgressBar, CircularProgressBar, ComparisonBadge } from '../components/primitives';
import { Activity, TrendingUp, Zap, Award, Clock, Heart, ArrowRight, Calendar, Flame } from 'lucide-react';
import { tokens } from '../design/tokens';

export const ComponentShowcase = () => {
  const [activeTab, setActiveTab] = useState('tokens');

  // Mock data for components
  const mockLaps = Array.from({ length: 40 }, (_, i) => ({
    number: i + 1,
    time: 90 + Math.random() * 20 - 10,
    distance: 25,
    pace: 2.2 + Math.random() * 0.6 - 0.3,
    strokes: 18 + Math.floor(Math.random() * 6) - 3
  }));

  const mockSession = {
    id: '1',
    date: new Date().toISOString(),
    distance: 2500,
    duration: 2400,
    pace: 2.4,
    calories: 450,
    swolf: 35,
    strokes: 850,
    laps: mockLaps
  };

  const mockRecentSwims = Array.from({ length: 6 }, (_, i) => ({
    id: `${i + 1}`,
    date: new Date(Date.now() - i * 86400000).toISOString(),
    distance: 2000 + Math.random() * 1000,
    pace: 2.3 + Math.random() * 0.4,
    swolf: 33 + Math.random() * 8,
    duration: 2200 + Math.random() * 400
  }));

  // Mock data for InsightsChart (30 days of swims)
  const mockInsightsData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString(),
    pace: 2.2 + Math.sin(i / 5) * 0.3 + (Math.random() - 0.5) * 0.1,
    distance: 2000 + Math.cos(i / 4) * 500 + (Math.random() - 0.5) * 200,
    swolf: 34 + Math.sin(i / 6) * 3 + (Math.random() - 0.5) * 2,
    dps: 1.8 + Math.cos(i / 7) * 0.2 + (Math.random() - 0.5) * 0.1,
    duration: 2400 + Math.sin(i / 5) * 300
  }));

  const mockRanking = {
    pace: { rank: 12, total: 150, percentile: 92 },
    distance: { rank: 8, total: 150, percentile: 95 },
    overall: { rank: 10, total: 150, percentile: 93 }
  };

  const mockTechniqueRecommendation = {
    article: {
      id: 'breathing-basics',
      title: 'Breathing Basics',
      category: 'technique',
      level: 'beginner',
      summary: 'Master the fundamentals of swimming breathing technique'
    },
    priority: 'high',
    reason: 'Based on your recent swims, improving breathing could help your endurance'
  };

  const tabs = [
    { id: 'tokens', label: 'Design Tokens' },
    { id: 'primitives', label: 'Primitives' },
    { id: 'buttons', label: 'Buttons' },
    { id: 'cards', label: 'Cards' },
    { id: 'stats', label: 'Stats & Metrics' },
    { id: 'charts', label: 'Charts & Graphs' },
    { id: 'badges', label: 'Badges & Tooltips' },
    { id: 'sections', label: 'Sections' },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Component Showcase"
        subtitle="All design system components in one place"
      />

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-2 bg-dark-card rounded-lg p-2 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary-500 text-white'
                : 'text-content-secondary hover:text-content hover:bg-dark-bg'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Design Tokens Tab */}
      {activeTab === 'tokens' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Introduction */}
          <Card>
            <h2 className="font-display text-2xl font-bold mb-4">Design Tokens</h2>
            <p className="text-content-secondary mb-4">
              Design tokens are the foundation of our design system. They define all spacing, typography, colors, and other visual properties used throughout the app.
            </p>
            <p className="text-sm text-content-tertiary">
              All tokens are defined in <code className="px-2 py-1 bg-dark-bg rounded text-primary-400">src/design/tokens.js</code> and used via Tailwind CSS utilities.
            </p>
          </Card>

          {/* Color Palette */}
          <Card>
            <h3 className="font-display text-xl font-bold mb-4">Color Palette</h3>
            <div className="space-y-6">
              {/* Primary Colors */}
              <div>
                <h4 className="text-sm font-semibold text-content-tertiary mb-3">Primary (Teal)</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="space-y-2">
                    <div className="h-20 bg-primary-900 rounded-lg" />
                    <div className="text-xs font-mono text-center">
                      <div className="text-content-secondary">primary-900</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 bg-primary-700 rounded-lg" />
                    <div className="text-xs font-mono text-center">
                      <div className="text-content-secondary">primary-700</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 bg-primary-500 rounded-lg" />
                    <div className="text-xs font-mono text-center">
                      <div className="text-content-secondary">primary-500</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 bg-primary-300 rounded-lg" />
                    <div className="text-xs font-mono text-center">
                      <div className="text-content-secondary">primary-300</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 bg-primary-100 rounded-lg" />
                    <div className="text-xs font-mono text-center">
                      <div className="text-content-secondary">primary-100</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dark Theme Colors */}
              <div>
                <h4 className="text-sm font-semibold text-content-tertiary mb-3">Dark Theme</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-2">
                    <div className="h-20 bg-dark-bg rounded-lg" />
                    <div className="text-xs font-mono text-center">
                      <div className="text-content-secondary">dark-bg</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 bg-dark-card rounded-lg" />
                    <div className="text-xs font-mono text-center">
                      <div className="text-content-secondary">dark-card</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 bg-dark-border rounded-lg" />
                    <div className="text-xs font-mono text-center">
                      <div className="text-content-secondary">dark-border</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 bg-dark-hover rounded-lg" />
                    <div className="text-xs font-mono text-center">
                      <div className="text-content-secondary">dark-hover</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Colors */}
              <div>
                <h4 className="text-sm font-semibold text-content-tertiary mb-3">Content</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <div className="h-20 bg-dark-bg rounded-lg flex items-center justify-center">
                      <span className="text-content font-semibold">Text</span>
                    </div>
                    <div className="text-xs font-mono text-center">
                      <div className="text-content-secondary">content</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 bg-dark-bg rounded-lg flex items-center justify-center">
                      <span className="text-content-secondary font-semibold">Secondary</span>
                    </div>
                    <div className="text-xs font-mono text-center">
                      <div className="text-content-secondary">content-secondary</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 bg-dark-bg rounded-lg flex items-center justify-center">
                      <span className="text-content-tertiary font-semibold">Tertiary</span>
                    </div>
                    <div className="text-xs font-mono text-center">
                      <div className="text-content-secondary">content-tertiary</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accent Colors */}
              <div>
                <h4 className="text-sm font-semibold text-content-tertiary mb-3">Accent Colors</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-2">
                    <div className="h-20 bg-accent-blue rounded-lg" />
                    <div className="text-xs font-mono text-center">
                      <div className="text-content-secondary">accent-blue</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 bg-accent-purple rounded-lg" />
                    <div className="text-xs font-mono text-center">
                      <div className="text-content-secondary">accent-purple</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 bg-accent-orange rounded-lg" />
                    <div className="text-xs font-mono text-center">
                      <div className="text-content-secondary">accent-orange</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 bg-accent-green rounded-lg" />
                    <div className="text-xs font-mono text-center">
                      <div className="text-content-secondary">accent-green</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Typography */}
          <Card>
            <h3 className="font-display text-xl font-bold mb-4">Typography</h3>

            {/* Font Families */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-content-tertiary mb-3">Font Families</h4>
              <div className="space-y-3">
                <div className="p-4 bg-dark-bg rounded-lg">
                  <div className="text-sm text-content-tertiary mb-2">font-sans (Inter)</div>
                  <div className="font-sans text-lg">The quick brown fox jumps over the lazy dog</div>
                  <div className="text-xs text-content-tertiary mt-2">Used for: Body text, UI elements</div>
                </div>
                <div className="p-4 bg-dark-bg rounded-lg">
                  <div className="text-sm text-content-tertiary mb-2">font-display (Space Grotesk)</div>
                  <div className="font-display text-lg">The quick brown fox jumps over the lazy dog</div>
                  <div className="text-xs text-content-tertiary mt-2">Used for: Headings, numbers, emphasis</div>
                </div>
              </div>
            </div>

            {/* Font Sizes */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-content-tertiary mb-3">Font Sizes</h4>
              <div className="space-y-2">
                {Object.entries(tokens.typography.sizes).map(([key, value]) => (
                  <div key={key} className="flex items-baseline gap-4 p-3 bg-dark-bg rounded-lg">
                    <code className="text-xs text-primary-400 w-16">{key}</code>
                    <code className="text-xs text-content-tertiary w-20">{value}</code>
                    <div className={`${value} font-display`}>Sample Text</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Font Weights */}
            <div>
              <h4 className="text-sm font-semibold text-content-tertiary mb-3">Font Weights</h4>
              <div className="space-y-2">
                {Object.entries(tokens.typography.weights).map(([key, value]) => (
                  <div key={key} className="flex items-baseline gap-4 p-3 bg-dark-bg rounded-lg">
                    <code className="text-xs text-primary-400 w-20">{key}</code>
                    <code className="text-xs text-content-tertiary w-32">{value}</code>
                    <div className={`${value} text-base`}>Sample Text</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Spacing */}
          <Card>
            <h3 className="font-display text-xl font-bold mb-4">Spacing Scale</h3>
            <p className="text-sm text-content-tertiary mb-4">Based on 8px grid system (1rem = 16px)</p>
            <div className="space-y-3">
              {Object.entries(tokens.spacing).map(([key, value]) => (
                <div key={key} className="flex items-center gap-4">
                  <code className="text-xs text-primary-400 w-12">{key}</code>
                  <code className="text-xs text-content-tertiary w-20">{value}</code>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="h-8 bg-primary-500/20 border-l-4 border-primary-500 rounded" style={{ width: value }} />
                    <span className="text-xs text-content-tertiary">{parseInt(value) * 16}px</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Icons */}
          <Card>
            <h3 className="font-display text-xl font-bold mb-4">Icon Sizes</h3>
            <div className="space-y-3">
              {Object.entries(tokens.icons).map(([key, value]) => (
                <div key={key} className="flex items-center gap-4 p-3 bg-dark-bg rounded-lg">
                  <code className="text-xs text-primary-400 w-12">{key}</code>
                  <code className="text-xs text-content-tertiary w-24">{value}</code>
                  <Activity className={`${value} text-primary-400`} />
                  <span className="text-xs text-content-tertiary ml-auto">
                    {value.match(/w-(\d+)/)?.[1] ? `${parseInt(value.match(/w-(\d+)/)[1]) * 4}px` : ''}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Border Radius */}
          <Card>
            <h3 className="font-display text-xl font-bold mb-4">Border Radius</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(tokens.radius).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className={`h-24 bg-primary-500/20 border border-primary-500/30 ${value}`} />
                  <div className="text-center">
                    <code className="text-xs text-primary-400 block">{key}</code>
                    <code className="text-xs text-content-tertiary">{value}</code>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Gap Spacing */}
          <Card>
            <h3 className="font-display text-xl font-bold mb-4">Gap Spacing</h3>
            <p className="text-sm text-content-tertiary mb-4">Used for flex and grid layouts</p>
            <div className="space-y-4">
              {Object.entries(tokens.gap).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-primary-400">{key}</code>
                    <code className="text-xs text-content-tertiary">({value})</code>
                  </div>
                  <div className={`flex ${value}`}>
                    <div className="h-12 w-12 bg-primary-500/20 border border-primary-500/30 rounded-lg" />
                    <div className="h-12 w-12 bg-primary-500/20 border border-primary-500/30 rounded-lg" />
                    <div className="h-12 w-12 bg-primary-500/20 border border-primary-500/30 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Padding */}
          <Card>
            <h3 className="font-display text-xl font-bold mb-4">Padding Scale</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(tokens.padding).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="bg-dark-bg rounded-lg">
                    <div className={`${value} bg-primary-500/20 border border-primary-500/30 rounded-lg`}>
                      <div className="text-xs text-center text-content-tertiary">Content</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <code className="text-xs text-primary-400 block">{key}</code>
                    <code className="text-xs text-content-tertiary">{value}</code>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Animation Durations */}
          <Card>
            <h3 className="font-display text-xl font-bold mb-4">Animation Durations</h3>
            <div className="space-y-3">
              {Object.entries(tokens.animation).map(([key, value]) => (
                <div key={key} className="flex items-center gap-4 p-3 bg-dark-bg rounded-lg">
                  <code className="text-xs text-primary-400 w-20">{key}</code>
                  <code className="text-xs text-content-tertiary w-32">{value}</code>
                  <div className="flex-1">
                    <motion.div
                      animate={{ x: [0, 100, 0] }}
                      transition={{ duration: parseInt(value.match(/\d+/)[0]) / 1000, repeat: Infinity }}
                      className="w-8 h-8 bg-primary-500 rounded-lg"
                    />
                  </div>
                  <span className="text-xs text-content-tertiary">{value.match(/\d+/)[0]}ms</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Z-Index */}
          <Card>
            <h3 className="font-display text-xl font-bold mb-4">Z-Index Layers</h3>
            <p className="text-sm text-content-tertiary mb-4">Consistent stacking order for overlays</p>
            <div className="space-y-2">
              {Object.entries(tokens.zIndex).reverse().map(([key, value]) => (
                <div key={key} className="flex items-center gap-4 p-3 bg-dark-bg rounded-lg">
                  <code className="text-xs text-primary-400 w-24">{key}</code>
                  <code className="text-xs text-content-tertiary w-16">{value}</code>
                  <div className="text-xs text-content-tertiary">{value.match(/\d+/)?.[0] || '0'}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Usage Guide */}
          <Card>
            <h3 className="font-display text-xl font-bold mb-4">Usage in Code</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-content-secondary mb-2">Direct Tailwind Classes:</h4>
                <pre className="p-4 bg-dark-bg rounded-lg overflow-x-auto text-xs">
                  <code className="text-content-secondary">{`<div className="${tokens.padding.default} ${tokens.radius.md} ${tokens.gap.default}">
  <Icon className="${tokens.icons.lg}" />
  <span className="${tokens.typography.sizes.xl} ${tokens.typography.weights.bold}">
    Title
  </span>
</div>`}</code>
                </pre>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-content-secondary mb-2">Using Token Utilities:</h4>
                <pre className="p-4 bg-dark-bg rounded-lg overflow-x-auto text-xs">
                  <code className="text-content-secondary">{`import { tokens, getToken } from '../design/tokens';

const spacing = getToken('spacing', 'lg'); // '1.5rem'
const iconSize = getToken('icons', 'xl'); // 'w-8 h-8'`}</code>
                </pre>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Primitives Tab */}
      {activeTab === 'primitives' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Introduction */}
          <Card>
            <h2 className="font-display text-2xl font-bold mb-4">Design System Primitives</h2>
            <p className="text-content-secondary mb-4">
              Composable building blocks that eliminate code duplication and ensure design consistency.
              These primitives are used throughout the application to build complex components.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-semibold mb-2">Benefits:</h3>
                <ul className="space-y-1 text-content-tertiary">
                  <li>• 6 composable primitives</li>
                  <li>• Eliminates code duplication</li>
                  <li>• Consistent styling across components</li>
                  <li>• Easier maintenance and updates</li>
                  <li>• Better composition patterns</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Usage:</h3>
                <ul className="space-y-1 text-content-tertiary">
                  <li>• Import from /components/primitives</li>
                  <li>• Combine to build complex UIs</li>
                  <li>• All support animations</li>
                  <li>• Fully themeable</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* CardHeader */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">CardHeader</h2>
            <p className="text-sm text-content-tertiary mb-4">
              Standardized card headers with icon, title, subtitle, badge, and optional action link
            </p>
            <div className="space-y-4">
              <Card>
                <CardHeader
                  icon={Calendar}
                  title="Monthly Summary"
                  subtitle="Last 30 days of activity"
                  actionText="View all"
                  actionTo="/swims"
                />
                <p className="text-content-secondary">Card content goes here...</p>
              </Card>

              <Card>
                <CardHeader
                  icon={Activity}
                  title="Recent Swims"
                  iconColor="text-blue-400"
                  iconBgColor="bg-blue-500/20"
                />
                <p className="text-content-secondary">Simple header without action</p>
              </Card>
            </div>
          </div>

          {/* MetricDisplay */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">MetricDisplay</h2>
            <p className="text-sm text-content-tertiary mb-4">
              Display individual metrics with icon, label, value, unit, and optional badge
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricDisplay
                icon={Activity}
                label="Pace"
                value="2:30"
                unit="min/100m"
                variant="blue"
              />
              <MetricDisplay
                icon={Clock}
                label="Duration"
                value="45:00"
                unit="min:sec"
                variant="primary"
              />
              <MetricDisplay
                icon={Flame}
                label="Calories"
                value="450"
                unit="burned"
                variant="orange"
                badge={<ComparisonBadge comparison="better" value="+12%" />}
              />
            </div>
          </div>

          {/* StatGrid */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">StatGrid</h2>
            <p className="text-sm text-content-tertiary mb-4">
              Grid layout for displaying multiple metrics consistently. Powers SessionCard and other complex components.
            </p>
            <Card>
              <StatGrid
                stats={[
                  { icon: Activity, label: 'Pace', value: '2:30', unit: 'min/100m', variant: 'blue' },
                  { icon: Clock, label: 'Duration', value: '45:00', unit: 'min:sec', variant: 'primary' },
                  { icon: Zap, label: 'SWOLF', value: '35', unit: 'efficiency', variant: 'purple' },
                  { icon: Flame, label: 'Calories', value: '450', unit: 'burned', variant: 'orange' }
                ]}
                columns={4}
              />
            </Card>
          </div>

          {/* ProgressBar */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">ProgressBar</h2>
            <p className="text-sm text-content-tertiary mb-4">
              Progress indicators with optional label and value display
            </p>
            <Card>
              <div className="space-y-6">
                <ProgressBar
                  value={75}
                  label="Progress"
                  valueDisplay="3/4"
                  color="primary"
                />
                <ProgressBar
                  value={60}
                  label="Completion"
                  showPercentage
                  color="blue"
                />
                <ProgressBar
                  value={90}
                  color="green"
                  size="lg"
                />
                <ProgressBar
                  value={45}
                  label="Training Plan"
                  valueDisplay="Week 3 of 4"
                  color="purple"
                  size="sm"
                />
              </div>
            </Card>
          </div>

          {/* CircularProgressBar */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">CircularProgressBar</h2>
            <p className="text-sm text-content-tertiary mb-4">
              Circular progress indicators with multiple sizes and colors. Used in ProgressCard and other goal-tracking components.
            </p>
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <CircularProgressBar
                    percentage={75}
                    label="Small"
                    size="sm"
                    color="primary"
                  />
                </div>
                <div>
                  <CircularProgressBar
                    percentage={60}
                    label="Medium"
                    size="md"
                    color="blue"
                  />
                </div>
                <div>
                  <CircularProgressBar
                    percentage={90}
                    label="Large"
                    size="lg"
                    color="green"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* ComparisonBadge */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">ComparisonBadge</h2>
            <p className="text-sm text-content-tertiary mb-4">
              Performance indicators for showing comparisons and trends
            </p>
            <Card>
              <div className="flex flex-wrap gap-3">
                <ComparisonBadge comparison="fast" />
                <ComparisonBadge comparison="better" value="+15%" />
                <ComparisonBadge comparison="improved" />
                <ComparisonBadge comparison="slow" />
                <ComparisonBadge comparison="worse" value="-8%" />
                <ComparisonBadge comparison="declined" />
                <ComparisonBadge comparison="average" />
                <ComparisonBadge comparison="stable" />
                <ComparisonBadge
                  comparison="fast"
                  size="md"
                  tooltip="This is faster than your average!"
                />
              </div>
            </Card>
          </div>

          {/* Code Example */}
          <Card className="bg-dark-bg/50">
            <h3 className="font-display text-lg font-bold mb-3">Example: Building a Card with Primitives</h3>
            <pre className="text-xs text-content-secondary overflow-x-auto p-4 bg-dark-card rounded-lg">
{`<Card>
  <CardHeader
    icon={Activity}
    title="Recent Activity"
    actionText="View all"
    actionTo="/activity"
  />

  <StatGrid
    stats={[
      { icon: Activity, label: 'Distance', value: '5.2', unit: 'km', variant: 'blue' },
      { icon: Clock, label: 'Time', value: '2:15:30', unit: 'h:m:s', variant: 'primary' }
    ]}
    columns={2}
  />

  <ProgressBar
    value={75}
    label="Weekly Goal"
    valueDisplay="15/20 km"
    color="primary"
  />
</Card>`}
            </pre>
          </Card>
        </motion.div>
      )}

      {/* Buttons Tab */}
      {activeTab === 'buttons' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Button Variants */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Button Variants</h2>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="success">Success</Button>
              <Button variant="warning">Warning</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          {/* Button Sizes */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Button Sizes</h2>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          {/* Buttons with Icons */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Buttons with Icons</h2>
            <div className="flex flex-wrap gap-4">
              <Button leftIcon={<Activity />}>Left Icon</Button>
              <Button rightIcon={<ArrowRight />}>Right Icon</Button>
              <Button leftIcon={<Activity />} rightIcon={<ArrowRight />}>Both Icons</Button>
              <Button variant="secondary" leftIcon={<Clock />}>Secondary with Icon</Button>
            </div>
          </div>

          {/* Icon Buttons */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Icon Only Buttons</h2>
            <div className="flex flex-wrap gap-4">
              <IconButton variant="primary" icon={<Activity />} ariaLabel="Activity" />
              <IconButton variant="secondary" icon={<Clock />} ariaLabel="Clock" />
              <IconButton variant="success" icon={<Award />} ariaLabel="Award" />
              <IconButton variant="danger" icon={<Heart />} ariaLabel="Heart" />
              <IconButton variant="ghost" icon={<TrendingUp />} ariaLabel="Trending" />
            </div>
            <p className="text-sm text-content-tertiary mt-2">Icon button sizes:</p>
            <div className="flex flex-wrap gap-4 mt-2">
              <IconButton size="sm" icon={<Activity />} ariaLabel="Small" />
              <IconButton size="md" icon={<Activity />} ariaLabel="Medium" />
              <IconButton size="lg" icon={<Activity />} ariaLabel="Large" />
            </div>
          </div>

          {/* Button States */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Button States</h2>
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button disabled>Disabled</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="secondary" disabled>Secondary Disabled</Button>
            </div>
          </div>

          {/* Full Width Button */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Full Width Button</h2>
            <Button fullWidth variant="primary" leftIcon={<Activity />}>
              Full Width Button
            </Button>
          </div>

          {/* Legacy CSS Classes (for comparison) */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Legacy CSS Classes</h2>
            <p className="text-sm text-content-tertiary mb-4">These use the old btn-primary/btn-secondary classes</p>
            <div className="flex flex-wrap gap-4">
              <button className="btn-primary">btn-primary</button>
              <button className="btn-secondary">btn-secondary</button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Cards Tab */}
      {activeTab === 'cards' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Basic Card */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Basic Card</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <h3 className="font-display text-lg font-bold mb-2">Default Card</h3>
                <p className="text-content-secondary">
                  This is the base card component with default styling.
                </p>
              </Card>
              <Card hover>
                <h3 className="font-display text-lg font-bold mb-2">Hoverable Card</h3>
                <p className="text-content-secondary">
                  This card has hover effects enabled.
                </p>
              </Card>
            </div>
          </div>

          {/* Session Card */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Session Card</h2>
            <SessionCard
              session={mockSession}
              onClick={() => {}}
              allSessions={[mockSession]}
            />
          </div>

          {/* Technique Card */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Technique Card</h2>
            <TechniqueCard recommendation={mockTechniqueRecommendation} />
          </div>

          {/* Swim Ranking Card */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Ranking Card</h2>
            <SwimRankingCard
              swim={mockSession}
              ranking={mockRanking}
            />
          </div>

          {/* Insight Cards */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Insight Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuickInsightCard
                icon={TrendingUp}
                title="Your Pace is Improving"
                description="You're getting 5% faster each week"
                trend="up"
              />
              <DeepInsightCard
                insight={{
                  title: "Consistency Streak",
                  message: "You've swum 3 times this week - keep it up!",
                  type: "positive",
                  icon: "🔥"
                }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats & Metrics Tab */}
      {activeTab === 'stats' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Stat Cards */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Stat Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                icon={Activity}
                label="Total Distance"
                value="125.4 km"
                trend={{ value: 12, direction: 'up' }}
              />
              <StatCard
                icon={Clock}
                label="Total Time"
                value="42h 15m"
                trend={{ value: 8, direction: 'up' }}
              />
              <StatCard
                icon={Zap}
                label="Avg Pace"
                value="2:24/100m"
                trend={{ value: 3, direction: 'down' }}
              />
            </div>
          </div>

          {/* StatCard - Enhanced Mode */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">StatCard - Enhanced Mode</h2>
            <p className="text-content-secondary mb-4 text-sm">
              Enhanced mode with sparklines, delta, and trend badges (auto-detected when enhanced props are present)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                icon={Activity}
                label="Avg Pace"
                value="2:24"
                unit="min/100m"
                delta={-5}
                trend="improving"
                sparklineData={[
                  { value: 150 },
                  { value: 148 },
                  { value: 146 },
                  { value: 145 },
                  { value: 144 }
                ]}
                metricName="Pace"
              />
              <StatCard
                icon={Award}
                label="Total Distance"
                value="42.5"
                unit="km"
                delta={12}
                trend="improving"
                sparklineData={[
                  { value: 35 },
                  { value: 38 },
                  { value: 40 },
                  { value: 41 },
                  { value: 42.5 }
                ]}
                metricName="Distance"
              />
              <StatCard
                icon={Heart}
                label="VO2 Max"
                value="52"
                trend="stable"
                metricName="VO2 Max"
              />
            </div>
          </div>

          {/* Trend Badges */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Trend Badges</h2>
            <div className="flex flex-wrap gap-4">
              <TrendBadge value={15} direction="up" />
              <TrendBadge value={8} direction="down" />
              <TrendBadge value={0} direction="neutral" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Charts & Graphs Tab */}
      {activeTab === 'charts' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Swim Comparison Chart */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Swim Comparison Chart</h2>
            <p className="text-sm text-content-tertiary mb-4">
              Compare current swim metrics against recent averages
            </p>
            <Card>
              <SwimComparisonChart
                currentSwim={mockSession}
                recentSwims={mockRecentSwims}
              />
            </Card>
          </div>

          {/* Lap Pace Chart */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Lap Pace Chart</h2>
            <p className="text-sm text-content-tertiary mb-4">
              Visualize pace variation across all laps in a session
            </p>
            <Card>
              <LapPaceChart
                laps={mockLaps}
                poolLength={25}
              />
            </Card>
          </div>

          {/* Insights Chart */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Insights Chart</h2>
            <p className="text-sm text-content-tertiary mb-4">
              Advanced chart from the Insights page with multiple metrics and chart types
            </p>
            <Card>
              <InsightsChart
                data={mockInsightsData}
                metric="pace"
                chartType="line"
                showTrendLine={true}
                showRollingAverage={false}
              />
            </Card>
          </div>

          {/* Chart Features */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Chart Features</h2>
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-display text-lg font-bold mb-2">Interactive</h3>
                  <ul className="space-y-2 text-sm text-content-secondary">
                    <li>• Hover to see detailed values</li>
                    <li>• Responsive design adapts to screen size</li>
                    <li>• Dynamic color coding for performance</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold mb-2">Built with Recharts</h3>
                  <ul className="space-y-2 text-sm text-content-secondary">
                    <li>• Line charts for trends</li>
                    <li>• Bar charts for comparisons</li>
                    <li>• Scatter plots for distributions</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Badges & Tooltips Tab */}
      {activeTab === 'badges' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Achievement Badges */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Achievement Badges</h2>
            <AchievementBadges
              achievements={[
                { type: 'distance', value: 1000, date: new Date().toISOString() },
                { type: 'pace', value: 2.0, date: new Date().toISOString() },
                { type: 'streak', value: 7, date: new Date().toISOString() }
              ]}
            />
          </div>

          {/* Tooltips */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Tooltips</h2>
            <div className="flex flex-wrap gap-4">
              <Tooltip content="This is a helpful tooltip">
                <button className="btn-primary">Hover me</button>
              </Tooltip>
              <Tooltip content="Tooltips can contain detailed explanations about metrics and features" icon={true}>
                <button className="btn-secondary">With Icon</button>
              </Tooltip>
            </div>
          </div>

          {/* Status Badges */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Status Badges</h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/20 text-primary-400">
                Primary
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent-blue/20 text-accent-blue">
                Info
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                Success
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400">
                Warning
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400">
                Error
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Sections Tab */}
      {activeTab === 'sections' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Collapsible Section */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Collapsible Section</h2>
            <CollapsibleSection
              title="Recent Activity"
              subtitle="Your last 7 days"
              defaultOpen={true}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏊</div>
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-sm text-content-tertiary">Sessions</div>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <div className="text-4xl mb-2">📏</div>
                    <div className="text-2xl font-bold">24.5 km</div>
                    <div className="text-sm text-content-tertiary">Distance</div>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <div className="text-4xl mb-2">⏱️</div>
                    <div className="text-2xl font-bold">8h 20m</div>
                    <div className="text-sm text-content-tertiary">Time</div>
                  </div>
                </Card>
              </div>
            </CollapsibleSection>
          </div>

          {/* Design Tokens */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Design Tokens</h2>
            <Card>
              <h3 className="font-display text-lg font-bold mb-4">Spacing Scale</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-content-tertiary text-sm w-20">gap-2</span>
                  <div className="h-8 bg-primary-500/20 rounded-lg" style={{ width: '0.5rem' }}></div>
                  <span className="text-xs text-content-tertiary">8px (tight)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-content-tertiary text-sm w-20">gap-4</span>
                  <div className="h-8 bg-primary-500/20 rounded-lg" style={{ width: '1rem' }}></div>
                  <span className="text-xs text-content-tertiary">16px (compact)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-content-tertiary text-sm w-20">gap-6</span>
                  <div className="h-8 bg-primary-500/20 rounded-lg" style={{ width: '1.5rem' }}></div>
                  <span className="text-xs text-content-tertiary">24px (default)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-content-tertiary text-sm w-20">gap-8</span>
                  <div className="h-8 bg-primary-500/20 rounded-lg" style={{ width: '2rem' }}></div>
                  <span className="text-xs text-content-tertiary">32px (relaxed)</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Typography */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Typography Scale</h2>
            <Card>
              <div className="space-y-4">
                <div className="text-xs text-content-secondary">text-xs (12px) - Small labels, captions, badges</div>
                <div className="text-sm text-content-secondary">text-sm (14px) - Secondary text, button labels</div>
                <div className="text-base">text-base (16px) - Body text, default</div>
                <div className="text-lg">text-lg (18px) - Large body text, unit labels</div>
                <div className="text-xl">text-xl (20px) - Section titles, small milestones</div>
                <div className="text-2xl font-display font-bold">text-2xl (24px) - Card metrics, records</div>
                <div className="text-3xl font-display font-bold">text-3xl (30px) - Stat card values</div>
                <div className="text-4xl font-display font-bold">text-4xl (36px) - Page heroes, primary stats</div>
              </div>
            </Card>
          </div>
        </motion.div>
      )}
    </PageContainer>
  );
};
