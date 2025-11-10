import { useState } from 'react';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { PageContainer, PageHeader } from '../components/layout';
import { Activity, TrendingUp, Zap, Clock, Waves, CheckCircle } from 'lucide-react';

export const DesignTest = () => {
  const [localIsDark, setLocalIsDark] = useState(false);
  const [useNewTheme, setUseNewTheme] = useState(true);

  // Toggle between dark and light (isolated to this page)
  const toggleLocalTheme = () => {
    setLocalIsDark(!localIsDark);
  };

  // Toggle between original and new light mode theme
  const toggleThemeVariant = () => {
    setUseNewTheme(!useNewTheme);
  };

  // Determine which theme class to apply
  const themeClass = localIsDark ? 'dark' : (useNewTheme ? 'light-v2' : '');

  return (
    <div className={`${themeClass} min-h-screen bg-dark-bg`}>
      <PageContainer>
      <PageHeader
        title="Design Test Lab"
        subtitle="Compare and iterate on the new light mode theme"
      />

      {/* Theme Controls */}
      <div className="mb-8 p-6 bg-dark-card rounded-xl border border-dark-border">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Theme Controls</h2>
            <p className="text-content-secondary text-sm">
              Toggle between themes to compare the design changes
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={toggleLocalTheme}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                localIsDark
                  ? 'bg-dark-card border border-dark-border'
                  : 'bg-white border border-slate-300 text-content-secondary hover:bg-slate-50'
              }`}
            >
              {localIsDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
            {!localIsDark && (
              <button
                onClick={toggleThemeVariant}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  useNewTheme
                    ? 'bg-primary-500 text-white'
                    : 'bg-white border border-slate-300 text-content-secondary hover:bg-slate-50'
                }`}
              >
                {useNewTheme ? '✨ New Theme' : '📋 Original Theme'}
              </button>
            )}
          </div>
        </div>

        {!localIsDark && (
          <div className="mt-4 pt-4 border-t border-dark-border">
            <p className="text-sm text-content-tertiary">
              Current: <span className="font-semibold text-content">
                {useNewTheme ? 'New "Calm-Inspired" Light Mode' : 'Original Light Mode'}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Typography Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Typography</h2>
        <Card>
          <div className="space-y-4">
            <div>
              <h1 className="font-display text-4xl font-bold mb-2">Display Heading</h1>
              <p className="text-content-secondary">Space Grotesk, 4xl, Bold</p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Large Heading</h2>
              <p className="text-content-secondary">Inter, 3xl, Bold</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Section Heading</h3>
              <p className="text-content-secondary">Inter, xl, Semibold</p>
            </div>
            <div>
              <p className="text-content mb-2">
                Body text with primary color. This is the main text that users will read most often.
              </p>
              <p className="text-content-secondary mb-2">
                Secondary text for supporting information and less important details.
              </p>
              <p className="text-content-tertiary">
                Tertiary text for metadata, timestamps, and subtle information.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Stat Cards Grid */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Stat Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Total Distance"
            value="12.5"
            unit="km"
            trend={8.2}
            icon={Activity}
            glow
          />
          <StatCard
            label="Avg Pace"
            value="1:45"
            unit="/100m"
            trend={-3.5}
            icon={TrendingUp}
          />
          <StatCard
            label="Sessions"
            value="24"
            unit="this month"
            icon={Zap}
          />
        </div>
      </section>

      {/* Cards & Borders */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Cards & Elevation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold mb-2">Standard Card</h3>
            <p className="text-content-secondary mb-4">
              This is a standard card with default hover effects and shadows.
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-primary-500/10 text-primary-500 rounded-full text-sm">
                Tag 1
              </span>
              <span className="px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-sm">
                Tag 2
              </span>
            </div>
          </Card>

          <Card elevated>
            <h3 className="text-lg font-semibold mb-2">Elevated Card</h3>
            <p className="text-content-secondary mb-4">
              This card has elevated styling with enhanced shadows for emphasis.
            </p>
            <div className="flex items-center gap-2 text-content-secondary">
              <Clock className="w-4 h-4" />
              <span className="text-sm">2 hours ago</span>
            </div>
          </Card>
        </div>
      </section>

      {/* Buttons */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Buttons & Actions</h2>
        <Card>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary">
              Primary Button
            </button>
            <button className="btn-secondary">
              Secondary Button
            </button>
            <button className="px-6 py-3 rounded-lg border-2 border-primary-500 text-primary-500 font-medium hover:bg-primary-500/10 transition-all">
              Outline Button
            </button>
            <button className="px-6 py-3 rounded-lg text-content-secondary hover:bg-dark-card transition-all">
              Ghost Button
            </button>
          </div>
        </Card>
      </section>

      {/* Swim-Specific Components */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Swim Components</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-blue flex items-center justify-center">
                <Waves className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">Morning Swim Session</h3>
                <p className="text-content-secondary text-sm mb-3">
                  1000m • Freestyle • 25m pool
                </p>
                <div className="flex gap-4 text-sm">
                  <div>
                    <p className="text-content-tertiary">Pace</p>
                    <p className="font-semibold">1:42/100m</p>
                  </div>
                  <div>
                    <p className="text-content-tertiary">Duration</p>
                    <p className="font-semibold">17:20</p>
                  </div>
                  <div>
                    <p className="text-content-tertiary">SWOLF</p>
                    <p className="font-semibold">32</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card elevated>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-accent-blue" />
              <h3 className="text-lg font-semibold">Personal Best!</h3>
            </div>
            <p className="text-content-secondary mb-4">
              You just set a new record for 1000m freestyle!
            </p>
            <div className="p-4 bg-accent-blue/10 rounded-lg">
              <p className="text-sm text-content-secondary mb-1">New Time</p>
              <p className="text-3xl font-display font-bold text-accent-blue">16:45</p>
              <p className="text-sm text-content-tertiary mt-1">
                Previous: 17:20 (-35s)
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Color Palette */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Color Palette</h2>
        <Card>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="h-20 rounded-lg bg-primary-500 mb-2"></div>
              <p className="text-sm font-medium">Primary</p>
              <p className="text-xs text-content-tertiary">#007d9b</p>
            </div>
            <div>
              <div className="h-20 rounded-lg bg-accent-blue mb-2"></div>
              <p className="text-sm font-medium">Accent Blue</p>
              <p className="text-xs text-content-tertiary">#00d4ff</p>
            </div>
            <div>
              <div className="h-20 rounded-lg bg-accent-coral mb-2"></div>
              <p className="text-sm font-medium">Accent Coral</p>
              <p className="text-xs text-content-tertiary">#ff6b6b</p>
            </div>
            <div>
              <div className="h-20 rounded-lg bg-dark-bg border border-dark-border mb-2"></div>
              <p className="text-sm font-medium">Background</p>
              <p className="text-xs text-content-tertiary">Theme Aware</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Forms */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Form Elements</h2>
        <Card>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-2">Input Field</label>
              <input
                type="text"
                placeholder="Enter distance..."
                className="w-full px-4 py-3 rounded-lg bg-dark-bg border border-dark-border focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Select</label>
              <select className="w-full px-4 py-3 rounded-lg bg-dark-bg border border-dark-border focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all">
                <option>Freestyle</option>
                <option>Backstroke</option>
                <option>Breaststroke</option>
                <option>Butterfly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Textarea</label>
              <textarea
                placeholder="Add notes about your swim..."
                rows="3"
                className="w-full px-4 py-3 rounded-lg bg-dark-bg border border-dark-border focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
              ></textarea>
            </div>
          </div>
        </Card>
      </section>

      {/* Notes */}
      <Card className="bg-primary-500/5 border-primary-500/20">
        <h3 className="text-lg font-semibold mb-2">📝 Testing Notes</h3>
        <ul className="space-y-2 text-sm text-content-secondary">
          <li>• Check contrast ratios for accessibility (WCAG AA: 4.5:1 minimum)</li>
          <li>• Test with actual swim data from your dashboard</li>
          <li>• Verify all components work in both light modes</li>
          <li>• Ensure hover states are visible and feel responsive</li>
          <li>• Compare shadows and elevation in different lighting conditions</li>
        </ul>
      </Card>
      </PageContainer>
    </div>
  );
};
