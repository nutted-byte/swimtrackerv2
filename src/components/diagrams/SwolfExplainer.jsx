import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export const SwolfExplainer = ({ strokeCount = 20, timeSeconds = 30 }) => {
  const swolf = strokeCount + timeSeconds;

  return (
    <div className="my-8 p-6 bg-gradient-to-br from-primary-500/10 to-accent-blue/5 rounded-xl border border-primary-500/20">
      <h4 className="text-lg font-bold mb-6 text-center">SWOLF Calculation</h4>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Stroke Count */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            {/* Swimmer illustration - simplified stroke count */}
            <svg width="120" height="80" viewBox="0 0 120 80" className="mb-3">
              <defs>
                <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* Water surface */}
              <rect x="0" y="40" width="120" height="40" fill="url(#waterGradient)" />
              <path d="M 0 40 Q 30 35 60 40 T 120 40" stroke="#00d4ff" strokeWidth="2" fill="none" opacity="0.5" />

              {/* Swimmer body - simplified */}
              <ellipse cx="60" cy="40" rx="8" ry="6" fill="#a78bfa" opacity="0.8" />

              {/* Arms - stroke motion */}
              <motion.path
                d="M 60 40 L 45 35"
                stroke="#a78bfa"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
              />
              <motion.path
                d="M 60 40 L 75 45"
                stroke="#a78bfa"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse", delay: 0.4 }}
              />

              {/* Stroke count indicators */}
              {[...Array(5)].map((_, i) => (
                <motion.circle
                  key={i}
                  cx={20 + i * 20}
                  cy={65}
                  r="2"
                  fill="#00d4ff"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 + 0.5 }}
                />
              ))}
            </svg>

            <div className="text-center">
              <div className="text-4xl font-bold text-primary-400">{strokeCount}</div>
              <div className="text-xs text-content-secondary mt-1">Strokes per length</div>
            </div>
          </div>
        </motion.div>

        {/* Plus sign */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="text-primary-400"
        >
          <Plus className="w-8 h-8" />
        </motion.div>

        {/* Time */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            {/* Clock illustration */}
            <svg width="120" height="80" viewBox="0 0 120 80" className="mb-3">
              {/* Clock face */}
              <circle cx="60" cy="40" r="30" fill="none" stroke="#0ea5e9" strokeWidth="2" />

              {/* Clock ticks */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
                const rad = (angle * Math.PI) / 180;
                const x1 = 60 + 25 * Math.cos(rad);
                const y1 = 40 + 25 * Math.sin(rad);
                const x2 = 60 + 28 * Math.cos(rad);
                const y2 = 40 + 28 * Math.sin(rad);
                return (
                  <line
                    key={angle}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#0ea5e9"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Hour hand */}
              <motion.line
                x1="60"
                y1="40"
                x2="60"
                y2="20"
                stroke="#0ea5e9"
                strokeWidth="3"
                strokeLinecap="round"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "60px 40px" }}
              />

              {/* Second hand */}
              <motion.line
                x1="60"
                y1="40"
                x2="75"
                y2="40"
                stroke="#00d4ff"
                strokeWidth="2"
                strokeLinecap="round"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "60px 40px" }}
              />

              {/* Center dot */}
              <circle cx="60" cy="40" r="3" fill="#0ea5e9" />
            </svg>

            <div className="text-center">
              <div className="text-4xl font-bold text-accent-blue">{timeSeconds}</div>
              <div className="text-xs text-content-secondary mt-1">Seconds per length</div>
            </div>
          </div>
        </motion.div>

        {/* Equals sign */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="hidden md:block text-primary-400"
        >
          <div className="flex flex-col gap-2">
            <div className="w-8 h-0.5 bg-primary-400" />
            <div className="w-8 h-0.5 bg-primary-400" />
          </div>
        </motion.div>

        {/* SWOLF Result */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-blue/20 blur-xl" />
            <div className="relative bg-gradient-to-br from-primary-500/30 to-accent-blue/20 rounded-2xl p-6 border border-primary-500/30">
              <div className="text-center">
                <div className="text-sm text-content-secondary mb-2">SWOLF Score</div>
                <div className="text-5xl font-bold bg-gradient-to-r from-primary-400 to-accent-blue bg-clip-text text-transparent">
                  {swolf}
                </div>
                <div className="text-xs text-content-tertiary mt-2">
                  {swolf < 50 ? 'Excellent!' : swolf < 60 ? 'Good!' : swolf < 70 ? 'Average' : 'Room to improve'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-6 text-center text-sm text-content-secondary"
      >
        Lower SWOLF = better efficiency. Reduce strokes OR swim faster!
      </motion.div>
    </div>
  );
};
