import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { tokens } from '../design/tokens';

export const Tooltip = ({ content, children, icon = true, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
    }
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isVisible]);

  return (
    <>
      <div
        ref={triggerRef}
        className={`relative inline-flex items-center ${className}`}
        onMouseEnter={() => {
          setIsVisible(true);
          updatePosition();
        }}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => {
          setIsVisible(!isVisible);
          if (!isVisible) updatePosition();
        }}
      >
        {children}
        {icon && (
          <HelpCircle className={`${tokens.icons.xs} ml-1 text-content-tertiary hover:text-content-secondary transition-colors cursor-help`} />
        )}
      </div>

      {createPortal(
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={`fixed px-3 py-2 bg-dark-card ${tokens.radius.md} max-w-xs pointer-events-none`}
              style={{
                zIndex: 99999,
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: 'translate(-50%, -100%)'
              }}
            >
              <div className={`${tokens.typography.sizes.xs} text-content-secondary leading-relaxed`}>
                {content}
              </div>
              {/* Arrow pointing down */}
              <div
                className="absolute left-1/2 -translate-x-1/2 border-8 border-transparent border-t-dark-card"
                style={{ top: '100%' }}
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

// Preset tooltips for common metrics
export const tooltips = {
  pace: "Your average time to swim 100 metres. Lower is faster! Most recreational swimmers range from 2:00-3:30 per 100m. Learn more about pacing strategies →",

  swolf: "SWOLF (Swimming + Golf) = strokes per length + time per length. Lower scores mean better efficiency. It combines your speed and stroke count, rewarding smooth, efficient swimming. Learn how to improve your SWOLF →",

  distance: "Total distance swum in this session, measured in metres or kilometres.",

  duration: "How long you spent swimming (active time in the water).",

  lengths: "Number of pool lengths completed. Most pools are 25m or 50m.",

  calories: "Estimated calories burned during your swim. Swimming is an excellent full-body workout!",

  vo2max: "VO2 Max measures your cardiovascular fitness - the maximum oxygen your body can use during exercise. Higher values indicate better aerobic fitness. Elite swimmers often have VO2 Max above 60.",

  strokes: "Total number of arm strokes taken during the session. Fewer strokes per length generally indicates better technique and efficiency.",

  pr: "Personal Record - your best performance for this distance! This shows you've swum faster than ever before.",

  avgPace: "Your typical pace across recent swims. Individual sessions are compared to this to show if you're swimming faster or slower than usual.",
};
