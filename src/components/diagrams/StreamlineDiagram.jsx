import { motion } from 'framer-motion';

export const StreamlineDiagram = () => {
  return (
    <div className="my-8 p-6 bg-gradient-to-br from-primary-500/10 to-accent-blue/5 rounded-xl border border-primary-500/20">
      <h4 className="text-lg font-bold mb-6 text-center">Perfect Streamline Position</h4>

      <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
        {/* Side view */}
        <div className="flex-1">
          <div className="text-sm text-content-secondary mb-3 text-center">Side View</div>
          <svg width="100%" height="200" viewBox="0 0 400 200" className="max-w-md mx-auto">
            <defs>
              <linearGradient id="waterGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Water surface */}
            <rect x="0" y="100" width="400" height="100" fill="url(#waterGradient2)" />
            <motion.path
              d="M 0 100 Q 100 95 200 100 T 400 100"
              stroke="#00d4ff"
              strokeWidth="2"
              fill="none"
              opacity="0.5"
              animate={{
                d: [
                  "M 0 100 Q 100 95 200 100 T 400 100",
                  "M 0 100 Q 100 105 200 100 T 400 100",
                  "M 0 100 Q 100 95 200 100 T 400 100"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Swimmer in streamline */}
            <g>
              {/* Arms extended */}
              <motion.rect
                x="80"
                y="93"
                width="80"
                height="8"
                rx="4"
                fill="#a78bfa"
                initial={{ x: 60 }}
                animate={{ x: 80 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              />

              {/* Head */}
              <ellipse cx="165" cy="97" rx="12" ry="10" fill="#a78bfa" />

              {/* Body */}
              <rect x="165" y="93" width="80" height="8" rx="4" fill="#a78bfa" />

              {/* Legs */}
              <rect x="245" y="95" width="50" height="6" rx="3" fill="#a78bfa" />

              {/* Direction arrow */}
              <motion.g
                initial={{ opacity: 0.5, x: 0 }}
                animate={{ opacity: [0.5, 1, 0.5], x: [0, 20, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <path d="M 320 97 L 360 97 L 350 87 M 360 97 L 350 107" stroke="#00d4ff" strokeWidth="3" strokeLinecap="round" fill="none" />
              </motion.g>
            </g>

            {/* Annotations */}
            <g>
              {/* Arms straight annotation */}
              <line x1="100" y1="75" x2="140" y2="85" stroke="#primary-400" strokeWidth="1" strokeDasharray="2,2" />
              <text x="105" y="70" className="text-xs fill-primary-400" fontSize="10">Arms straight</text>

              {/* Head down annotation */}
              <line x1="165" y1="75" x2="165" y2="87" stroke="#primary-400" strokeWidth="1" strokeDasharray="2,2" />
              <text x="120" y="70" className="text-xs fill-primary-400" fontSize="10">Head down</text>

              {/* Body straight annotation */}
              <line x1="200" y1="120" x2="200" y2="105" stroke="#primary-400" strokeWidth="1" strokeDasharray="2,2" />
              <text x="160" y="135" className="text-xs fill-primary-400" fontSize="10">Body straight</text>
            </g>
          </svg>
        </div>

        {/* Front view */}
        <div className="flex-1">
          <div className="text-sm text-content-secondary mb-3 text-center">Front View</div>
          <svg width="100%" height="200" viewBox="0 0 200 200" className="max-w-xs mx-auto">
            {/* Water */}
            <rect x="0" y="100" width="200" height="100" fill="url(#waterGradient2)" />

            {/* Swimmer front view */}
            <g>
              {/* Arms stacked */}
              <motion.rect
                x="85"
                y="50"
                width="30"
                height="60"
                rx="15"
                fill="#a78bfa"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Hands stacked */}
              <ellipse cx="100" cy="45" rx="18" ry="10" fill="#a78bfa" opacity="0.9" />

              {/* Head */}
              <ellipse cx="100" cy="100" rx="20" ry="22" fill="#a78bfa" />

              {/* Body narrow */}
              <rect x="88" y="120" width="24" height="50" rx="12" fill="#a78bfa" />

              {/* Legs together */}
              <rect x="92" y="170" width="16" height="28" rx="8" fill="#a78bfa" />

              {/* Checkmarks */}
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <circle cx="40" cy="60" r="12" fill="#4ade80" opacity="0.2" />
                <path d="M 35 60 L 38 63 L 45 56" stroke="#4ade80" strokeWidth="2" fill="none" strokeLinecap="round" />
              </motion.g>

              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              >
                <circle cx="40" cy="130" r="12" fill="#4ade80" opacity="0.2" />
                <path d="M 35 130 L 38 133 L 45 126" stroke="#4ade80" strokeWidth="2" fill="none" strokeLinecap="round" />
              </motion.g>
            </g>

            {/* Annotations */}
            <text x="55" y="65" className="text-xs fill-content-secondary" fontSize="10">Hands stacked</text>
            <text x="55" y="135" className="text-xs fill-content-secondary" fontSize="10">Body narrow</text>
          </svg>
        </div>
      </div>

      {/* Key Points */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3"
      >
        <div className="flex items-start gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-primary-400 mt-1" />
          <div>
            <span className="font-semibold text-content">Arms fully extended</span>
            <p className="text-xs text-content-secondary">Hands stacked, biceps by ears</p>
          </div>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-primary-400 mt-1" />
          <div>
            <span className="font-semibold text-content">Head neutral</span>
            <p className="text-xs text-content-secondary">Looking down, not forward</p>
          </div>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-primary-400 mt-1" />
          <div>
            <span className="font-semibold text-content">Body tight</span>
            <p className="text-xs text-content-secondary">Core engaged, minimal drag</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
