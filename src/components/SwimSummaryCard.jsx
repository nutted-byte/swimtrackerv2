import { motion } from 'framer-motion';
import { Card } from './Card';
import { MessageCircle } from 'lucide-react';
import { tokens } from '../design/tokens';

export const SwimSummaryCard = ({ summary }) => {
  if (!summary) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-gradient-to-br from-accent-blue/10 to-primary-500/10 border-accent-blue/20">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-accent-blue/20 flex items-center justify-center">
              <MessageCircle className={`${tokens.icons.lg} text-accent-blue`} />
            </div>
          </div>
          <div>
            <h3 className={`${tokens.typography.sizes.lg} ${tokens.typography.weights.semibold} text-content-secondary mb-2`}>
              Swim Summary
            </h3>
            <p className={`${tokens.typography.sizes.base} text-content-secondary leading-relaxed`}>
              {summary}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
