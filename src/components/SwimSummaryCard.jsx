import { motion } from 'framer-motion';
import { CardVariant, IconContainer } from './primitives';
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
      <CardVariant variant="accent">
        <div className="flex gap-4">
          <IconContainer icon={<MessageCircle className={tokens.icons.lg} />} variant="accent" size="lg" rounded />
          <div>
            <h3 className={`${tokens.typography.sizes.lg} ${tokens.typography.weights.semibold} text-content-secondary mb-2`}>
              Swim Summary
            </h3>
            <p className={`${tokens.typography.sizes.base} text-content-secondary leading-relaxed`}>
              {summary}
            </p>
          </div>
        </div>
      </CardVariant>
    </motion.div>
  );
};
