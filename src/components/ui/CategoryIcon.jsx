import { Zap, Activity, Clock, Waves } from 'lucide-react';

export const CategoryIcon = ({ category, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const categoryConfig = {
    efficiency: {
      icon: Zap,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      label: 'Efficiency'
    },
    technique: {
      icon: Waves,
      color: 'text-primary-400',
      bgColor: 'bg-primary-500/20',
      label: 'Technique'
    },
    pacing: {
      icon: Activity,
      color: 'text-accent-blue',
      bgColor: 'bg-accent-blue/20',
      label: 'Pacing'
    },
    drills: {
      icon: Clock,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      label: 'Drills'
    }
  };

  const config = categoryConfig[category] || categoryConfig.technique;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center justify-center p-2 rounded-lg ${config.bgColor}`}>
      <Icon className={`${sizeClasses[size]} ${config.color}`} />
    </div>
  );
};
