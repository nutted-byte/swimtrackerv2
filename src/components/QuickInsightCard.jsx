import { motion } from 'framer-motion';
import { CardVariant, IconContainer } from './primitives';
import { Target, AlertCircle, CheckCircle, Info, ArrowRight } from 'lucide-react';
import { tokens } from '../design/tokens';

export const QuickInsightCard = ({ recommendation }) => {
  if (!recommendation) return null;

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'high':
        return {
          icon: AlertCircle,
          badge: '🎯 High Priority',
          badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
          iconVariant: 'warning'
        };
      case 'medium':
        return {
          icon: Target,
          badge: '✨ Opportunity',
          badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
          iconVariant: 'warning'
        };
      case 'positive':
        return {
          icon: CheckCircle,
          badge: '✅ Keep It Up',
          badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30',
          iconVariant: 'success'
        };
      default:
        return {
          icon: Info,
          badge: '💡 Tip',
          badgeColor: 'bg-accent-blue/20 text-accent-blue border-accent-blue/30',
          iconVariant: 'primary'
        };
    }
  };

  const config = getPriorityConfig(recommendation.priority);
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CardVariant variant={config.iconVariant}>
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <IconContainer
              icon={<Icon />}
              variant={config.iconVariant}
              size="lg"
              rounded
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Badge */}
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border mb-3 ${config.badgeColor}`}>
              {config.badge}
            </span>

            {/* Title */}
            <h3 className="font-display text-xl font-bold mb-2">
              {recommendation.title}
            </h3>

            {/* Message */}
            <p className="text-content-tertiary leading-relaxed mb-4">
              {recommendation.message}
            </p>

            {/* Action */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-content-tertiary">Next Step:</span>
              <span className={`font-medium text-primary-400 flex items-center gap-1`}>
                {recommendation.action}
                <ArrowRight className={tokens.icons.sm} />
              </span>
            </div>
          </div>
        </div>
      </CardVariant>
    </motion.div>
  );
};
