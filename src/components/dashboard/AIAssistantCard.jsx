import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { Card } from '../Card';
import { CardHeader } from '../primitives';

export const AIAssistantCard = () => {
  const sampleQuestions = [
    "Why was my last swim so fast?",
    "How can I improve my SWOLF?",
    "What's my pace trend?"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-purple-500/20 via-primary-500/10 to-accent-blue/10 border-purple-500/30 relative overflow-hidden h-full">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, rgba(168, 139, 250, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 100%, rgba(0, 212, 255, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 0% 0%, rgba(168, 139, 250, 0.3) 0%, transparent 50%)',
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <div className="relative z-10">
          <CardHeader
            icon={Sparkles}
            title="Ask About Swimming"
            iconColor="text-purple-400"
            iconBgColor="bg-purple-500/20"
            iconSize="w-4 h-4"
          />

          <div className="mb-4 p-4 bg-dark-bg/50 rounded-lg">
            <MessageCircle className="w-6 h-6 text-purple-400 mb-2" />
            <p className="text-xs text-content-secondary">
              Get personalized insights about your swimming
            </p>
          </div>

          <div className="mb-4">
            <p className="text-xs text-content-tertiary mb-2">Popular questions:</p>
            <div className="space-y-2">
              {sampleQuestions.map((q, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="text-xs text-content-secondary"
                >
                  • {q}
                </motion.div>
              ))}
            </div>
          </div>

          <Link
            to="/ask"
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center justify-center gap-2 group transition-colors"
          >
            Ask Question
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};
