import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import { ChevronDown, ChevronUp, MessageCircleQuestion, Sparkles } from 'lucide-react';
import { tokens } from '../design/tokens';

export const SwimInterrogator = ({ questions, answers }) => {
  const [expandedId, setExpandedId] = useState(null);

  if (!questions || questions.length === 0) {
    return null;
  }

  const toggleQuestion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Category color mapping
  const getCategoryColor = (category) => {
    switch (category) {
      case 'performance':
        return 'text-accent-blue';
      case 'efficiency':
        return 'text-primary-400';
      case 'goals':
        return 'text-yellow-400';
      case 'coaching':
        return 'text-green-400';
      case 'strategy':
        return 'text-purple-400';
      case 'progress':
        return 'text-pink-400';
      case 'comparison':
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        {/* Header */}
        <div className={`flex items-center ${tokens.gap.tight} mb-6`}>
          <div className="p-2 rounded-lg bg-primary-500/20">
            <MessageCircleQuestion className={`${tokens.icons.lg} text-primary-400`} />
          </div>
          <div>
            <h3 className={`${tokens.typography.families.display} ${tokens.typography.sizes.xl} ${tokens.typography.weights.bold}`}>
              Ask About This Swim
            </h3>
            <p className="text-sm text-gray-400">
              Click any question to learn more
            </p>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-3">
          {questions.map((q, index) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => toggleQuestion(q.id)}
                className="w-full text-left"
              >
                <div
                  className={`p-4 rounded-lg border transition-all ${
                    expandedId === q.id
                      ? 'bg-primary-500/10 border-primary-500/30'
                      : 'bg-dark-bg/50 border-dark-border hover:border-primary-500/20 hover:bg-dark-bg/80'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-xl flex-shrink-0 mt-0.5">{q.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`${tokens.typography.weights.semibold} ${
                          expandedId === q.id ? 'text-primary-400' : 'text-gray-200'
                        }`}>
                          {q.question}
                        </p>
                        <p className={`text-xs mt-1 ${getCategoryColor(q.category)}`}>
                          {q.category.charAt(0).toUpperCase() + q.category.slice(1)}
                        </p>
                      </div>
                    </div>
                    <div className={`flex-shrink-0 transition-transform ${
                      expandedId === q.id ? 'rotate-180' : ''
                    }`}>
                      <ChevronDown className={tokens.icons.sm} />
                    </div>
                  </div>

                  {/* Answer (Expandable) */}
                  <AnimatePresence>
                    {expandedId === q.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-dark-border">
                          <div className={`flex items-start ${tokens.gap.tight} mb-3`}>
                            <Sparkles className={`${tokens.icons.sm} text-primary-400 flex-shrink-0 mt-1`} />
                            <span className="text-xs font-semibold text-primary-400 uppercase tracking-wide">
                              Analysis
                            </span>
                          </div>
                          <p className="text-gray-300 leading-relaxed">
                            {answers[q.id] || 'Generating answer...'}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Footer hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: questions.length * 0.05 + 0.3 }}
          className="text-xs text-gray-500 text-center mt-6"
        >
          {questions.length} questions generated based on your swim data
        </motion.p>
      </Card>
    </motion.div>
  );
};
