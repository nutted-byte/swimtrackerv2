import { forwardRef } from 'react';

/**
 * Generic wrapper for shareable content
 * This component is designed to be converted to an image
 * Renders at fixed dimensions suitable for social media
 */
export const ShareableCard = forwardRef(({
  children,
  format = 'square', // 'square', 'story', 'twitter'
  showWatermark = true,
  className = ''
}, ref) => {

  // Define dimensions for different formats
  const formats = {
    square: { width: 1080, height: 1080 }, // Instagram square
    story: { width: 1080, height: 1920 },  // Instagram story
    twitter: { width: 1200, height: 675 }   // Twitter card
  };

  const { width, height } = formats[format] || formats.square;

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: '#0a0e27' // Dark background for export
      }}
    >
      {/* Main content */}
      <div className="w-full h-full p-12 flex flex-col">
        {children}
      </div>

      {/* Watermark */}
      {showWatermark && (
        <div className="absolute bottom-8 right-8 flex items-center gap-3 opacity-60">
          <div className="text-3xl">🌊</div>
          <div>
            <div className="text-white text-sm font-medium">Tracked with Swimma</div>
            <div className="text-gray-400 text-xs">Your swim tracking companion</div>
          </div>
        </div>
      )}
    </div>
  );
});

ShareableCard.displayName = 'ShareableCard';
