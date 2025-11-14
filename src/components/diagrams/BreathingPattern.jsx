import { motion } from 'framer-motion';
import { CHART_COLORS } from '../../utils/constants';

export const BreathingPattern = ({ pattern = 'bilateral' }) => {
  const patterns = {
    bilateral: {
      title: 'Bilateral Breathing (Every 3 strokes)',
      strokes: [
        { side: 'left', breathe: false, count: 1 },
        { side: 'right', breathe: false, count: 2 },
        { side: 'left', breathe: true, count: 3 },
        { side: 'right', breathe: false, count: 4 },
        { side: 'left', breathe: false, count: 5 },
        { side: 'right', breathe: true, count: 6 }
      ],
      benefit: 'Balanced technique, both sides develop equally'
    },
    unilateral: {
      title: 'Unilateral Breathing (Every 2 strokes)',
      strokes: [
        { side: 'left', breathe: false, count: 1 },
        { side: 'right', breathe: true, count: 2 },
        { side: 'left', breathe: false, count: 3 },
        { side: 'right', breathe: true, count: 4 }
      ],
      benefit: 'More oxygen, easier for beginners'
    }
  };

  const config = patterns[pattern] || patterns.bilateral;

  return (
    <div className="my-8 p-6 bg-gradient-to-br from-accent-blue/10 to-primary-500/5 rounded-xl border border-accent-blue/20">
      <h4 className="text-lg font-bold mb-2 text-center">{config.title}</h4>
      <p className="text-sm text-content-secondary text-center mb-6">{config.benefit}</p>

      {/* Stroke sequence */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {config.strokes.map((stroke, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="flex flex-col items-center"
          >
            {/* Stroke indicator */}
            <div className="text-xs text-content-tertiary mb-2">Stroke {stroke.count}</div>

            {/* Swimmer head - top down view */}
            <svg width="80" height="80" viewBox="0 0 80 80">
              <defs>
                <radialGradient id={`headGrad${index}`}>
                  <stop offset="0%" stopColor={CHART_COLORS.SECONDARY} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={CHART_COLORS.SECONDARY} stopOpacity="0.4" />
                </radialGradient>
              </defs>

              {/* Water ripples */}
              {stroke.breathe && (
                <>
                  <motion.circle
                    cx="40"
                    cy="40"
                    r="30"
                    fill="none"
                    stroke={CHART_COLORS.PRIMARY}
                    strokeWidth="1"
                    opacity="0.3"
                    initial={{ r: 20, opacity: 0.6 }}
                    animate={{ r: 35, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <motion.circle
                    cx="40"
                    cy="40"
                    r="25"
                    fill="none"
                    stroke={CHART_COLORS.PRIMARY}
                    strokeWidth="1"
                    opacity="0.3"
                    initial={{ r: 20, opacity: 0.6 }}
                    animate={{ r: 35, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                  />
                </>
              )}

              {/* Head circle */}
              <ellipse
                cx="40"
                cy="40"
                rx="18"
                ry="20"
                fill={`url(#headGrad${index})`}
              />

              {/* Face direction indicator */}
              <motion.g
                animate={{
                  rotate: stroke.side === 'left' ? (stroke.breathe ? -45 : 0) : (stroke.breathe ? 45 : 0)
                }}
                transition={{ duration: 0.3 }}
                style={{ transformOrigin: '40px 40px' }}
              >
                {/* Nose/mouth */}
                <ellipse
                  cx="40"
                  cy="38"
                  rx="3"
                  ry="4"
                  fill="#8b5cf6"
                />

                {/* Eyes */}
                <circle cx="35" cy="33" r="1.5" fill="#8b5cf6" />
                <circle cx="45" cy="33" r="1.5" fill="#8b5cf6" />
              </motion.g>

              {/* Breathing indicator */}
              {stroke.breathe && (
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1.2, 1.3], y: [0, -5, -10, -15] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <circle cx={stroke.side === 'left' ? 15 : 65} cy="40" r="3" fill={CHART_COLORS.PRIMARY} opacity="0.6" />
                  <circle cx={stroke.side === 'left' ? 15 : 65} cy="40" r="5" fill="none" stroke={CHART_COLORS.PRIMARY} strokeWidth="1" opacity="0.4" />
                </motion.g>
              )}
            </svg>

            {/* Breathe label */}
            <div className={`text-xs font-semibold mt-2 ${stroke.breathe ? 'text-accent-blue' : 'text-content-tertiary'}`}>
              {stroke.breathe ? '💨 Breathe' : 'No breath'}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pattern visualization */}
      <div className="flex items-center justify-center gap-2 py-4 bg-dark-bg/30 rounded-lg">
        {config.strokes.map((stroke, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.15, type: "spring", stiffness: 200 }}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              stroke.breathe
                ? 'bg-accent-blue/30 text-accent-blue border-2 border-accent-blue'
                : 'bg-dark-border/30 text-content-tertiary'
            }`}
          >
            {stroke.count}
          </motion.div>
        ))}
      </div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-4 text-center text-xs text-content-secondary"
      >
        💡 Tip: Exhale underwater through your nose to make breathing easier
      </motion.div>
    </div>
  );
};
