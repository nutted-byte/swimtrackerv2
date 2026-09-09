import { motion } from 'framer-motion';
import {
  Activity, Waves, Target, TrendingUp, Wind, Dumbbell, Droplets,
  Clock, ListChecks, Repeat, Lightbulb, MapPin,
} from 'lucide-react';
import { Card } from '../Card';
import { CardVariant, StatGrid } from '../primitives';
import { CollapsibleSection } from '../CollapsibleSection';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../design/tokens';
import { warmupRoutine, cooldownRoutine } from '../../content/warmup/routines';

// Map the string `icon` field from the data to a lucide component
const ICONS = { Activity, Waves, Target, TrendingUp, Wind, Dumbbell, Droplets };

// A single phase, rendered as a collapsible block
const PhaseSection = ({ phase, index }) => {
  const { isDark } = useTheme();
  const Icon = ICONS[phase.icon] || Activity;

  return (
    <CollapsibleSection
      title={phase.name}
      subtitle={`${phase.location} · ${phase.duration}`}
      icon={Icon}
      defaultExpanded={index === 0}
      className={tokens.margin.element}
    >
      <Card>
        {/* Location + duration chips */}
        <div className={`flex items-center ${tokens.gap.compact} ${tokens.margin.group} ${tokens.typography.sizes.xs} text-content-tertiary`}>
          <span className={`flex items-center ${tokens.gap.tight}`}>
            <MapPin className={tokens.icons.xs} /> {phase.location}
          </span>
          <span className={`flex items-center ${tokens.gap.tight}`}>
            <Clock className={tokens.icons.xs} /> {phase.duration}
          </span>
        </div>

        {/* Activities */}
        <ul className={`space-y-3 ${tokens.margin.group}`}>
          {phase.activities.map((activity, i) => (
            <li key={i} className={`flex items-start ${tokens.gap.compact}`}>
              <span className="text-primary-400 mt-1">•</span>
              <div>
                <span className={`${tokens.typography.weights.semibold} text-content`}>{activity.name}</span>
                <span className="text-content-secondary"> — {activity.detail}</span>
              </div>
            </li>
          ))}
        </ul>

        {/* Why-it-matters callout (mirrors the Techniques article callout idiom) */}
        <div className={`p-4 ${tokens.radius.sm} border-l-4 ${
          isDark ? 'bg-accent-blue/10 border-blue-500' : 'bg-blue-50 border-blue-500'
        }`}>
          <div className={`flex ${tokens.gap.compact}`}>
            <Lightbulb className={`${tokens.icons.md} mt-0.5 flex-shrink-0 ${isDark ? 'text-accent-blue' : 'text-blue-600'}`} />
            <p className={`mb-0 ${tokens.typography.sizes.sm} text-content-secondary leading-relaxed`}>
              <span className={tokens.typography.weights.semibold}>Why: </span>{phase.why}
            </p>
          </div>
        </div>
      </Card>
    </CollapsibleSection>
  );
};

// One routine (warm-up or cool-down): intro + at-a-glance stats + phases
const Routine = ({ routine, delay }) => {
  const stats = [
    { icon: Clock, label: 'Total time', value: routine.totalTime, variant: 'blue' },
    { icon: ListChecks, label: 'Steps', value: String(routine.phases.length), variant: 'primary' },
    { icon: Repeat, label: 'Do it', value: 'Every swim', variant: 'green' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={tokens.margin.section}
    >
      <CardVariant variant={routine.variant} className={tokens.margin.group}>
        <h2 className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold} mb-1`}>
          {routine.title}
        </h2>
        <p className={`${tokens.typography.sizes.sm} text-content-tertiary ${tokens.margin.group}`}>{routine.tagline}</p>
        <p className={`${tokens.typography.sizes.base} text-content-secondary leading-relaxed`}>{routine.intro}</p>
      </CardVariant>

      <div className={tokens.margin.group}>
        <StatGrid stats={stats} columns={3} />
      </div>

      {routine.phases.map((phase, index) => (
        <PhaseSection key={phase.id} phase={phase} index={index} />
      ))}
    </motion.div>
  );
};

export const WarmupGuide = () => (
  <div>
    <Routine routine={warmupRoutine} delay={0.1} />
    <Routine routine={cooldownRoutine} delay={0.2} />
  </div>
);
