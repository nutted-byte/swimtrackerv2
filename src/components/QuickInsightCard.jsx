import { motion } from 'framer-motion';
import { Card } from './Card';
import { Target, AlertCircle, CheckCircle, Info, ArrowRight } from 'lucide-react';

export const QuickInsightCard = ({ recommendation }) => {
  if (!recommendation) return null;

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'high':
        return {
          icon: AlertCircle,
          badge: '🎯 High Priority',
          badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
          iconColor: 'text-red-400',
          bgGradient: 'from-red-500/10 to-red-500/5',
          borderColor: 'border-red-500/20'
        };
      case 'medium':
        return {
          icon: Target,
          badge: '✨ Opportunity',
          badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
          iconColor: 'text-yellow-400',
          bgGradient: 'from-yellow-500/10 to-yellow-500/5',
          borderColor: 'border-yellow-500/20'
        };
      case 'positive':
        return {
          icon: CheckCircle,
          badge: '✅ Keep It Up',
          badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30',
          iconColor: 'text-green-400',
          bgGradient: 'from-green-500/10 to-green-500/5',
          borderColor: 'border-green-500/20'
        };
      default:
        return {
          icon: Info,
          badge: '💡 Tip',
          badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          iconColor: 'text-blue-400',
          bgGradient: 'from-primary-50 to-blue-50',
          borderColor: 'border-blue-500/20'
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
      <Card className={`bg-gradient-to-br ${config.bgGradient} ${config.borderColor}`}>
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 rounded-full ${config.badgeColor} flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${config.iconColor}`} />
            </div>
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
              <span className={`font-medium ${config.iconColor} flex items-center gap-1`}>
                {recommendation.action}
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
