import html2canvas from 'html2canvas';

/**
 * Generate a shareable image from a React component
 * @param {HTMLElement} element - The DOM element to convert to image
 * @param {Object} options - Options for image generation
 * @returns {Promise<string>} - Data URL of the generated image
 */
export const generateShareImage = async (element, options = {}) => {
  const {
    scale = 2, // Higher scale for better quality (retina)
    backgroundColor = '#0a0e27',
    width = 1080,
    height = null // Auto-height if not specified
  } = options;

  try {
    // Wait for fonts to load before capturing
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // Small delay to ensure layout is complete
    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(element, {
      scale,
      backgroundColor,
      useCORS: true,
      allowTaint: true,
      logging: false,
      width,
      height,
      windowWidth: width,
      windowHeight: height || element.scrollHeight,
      onclone: (clonedDoc) => {
        // Ensure fonts are applied in cloned document
        const clonedElement = clonedDoc.querySelector('[data-html2canvas-clone]') || clonedDoc.body;
        clonedElement.style.fontFamily = 'Space Grotesk, system-ui, -apple-system, sans-serif';
      }
    });

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error generating share image:', error);
    throw new Error('Failed to generate share image');
  }
};

/**
 * Download an image to the user's device
 * @param {string} dataUrl - Data URL of the image
 * @param {string} filename - Name of the file to download
 */
export const downloadImage = (dataUrl, filename = 'swimma-share.png') => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Copy image to clipboard (modern browsers)
 * @param {string} dataUrl - Data URL of the image
 * @returns {Promise<boolean>} - Success status
 */
export const copyImageToClipboard = async (dataUrl) => {
  try {
    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    // Check if clipboard API is available
    if (navigator.clipboard && navigator.clipboard.write) {
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ]);
      return true;
    } else {
      throw new Error('Clipboard API not available');
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};

/**
 * Generate social media caption text
 * @param {string} type - Type of share (swim, achievement, progress, streak)
 * @param {Object} data - Data for the share
 * @returns {string} - Generated caption text
 */
export const generateShareText = (type, data) => {
  const hashtags = '#Swimma #Swimming #SwimTraining';

  switch (type) {
    case 'swim':
      return `Just logged a ${data.distance}m swim! ${data.pace ? `Pace: ${data.pace}/100m` : ''} ${hashtags}`;

    case 'achievement':
      return `New achievement unlocked: ${data.badgeName}! ${hashtags}`;

    case 'progress':
      return `${data.period} progress: ${data.totalSwims} swims, ${data.totalDistance}m! ${hashtags}`;

    case 'streak':
      return `${data.streak}-day swim streak! Staying consistent 💪 ${hashtags}`;

    case 'pr':
      return `New personal record! ${data.achievement} 🏊‍♂️ ${hashtags}`;

    default:
      return `Check out my swim progress! ${hashtags}`;
  }
};

/**
 * Get shareable deep link URL (for future implementation)
 * @param {string} type - Type of content (swim, profile, achievement)
 * @param {string} id - ID of the content
 * @returns {string} - Deep link URL
 */
export const getShareableUrl = (type = 'app', id = null) => {
  const baseUrl = window.location.origin;

  switch (type) {
    case 'swim':
      return `${baseUrl}/swim/${id}`;
    case 'profile':
      return `${baseUrl}/profile`;
    case 'app':
    default:
      return baseUrl;
  }
};

/**
 * Share via Web Share API (mobile)
 * @param {Object} shareData - Data to share
 * @returns {Promise<boolean>} - Success status
 */
export const shareViaWebShare = async (shareData) => {
  const { title, text, url, files } = shareData;

  try {
    if (navigator.share) {
      await navigator.share({
        title,
        text,
        url,
        files
      });
      return true;
    } else {
      console.warn('Web Share API not supported');
      return false;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      // User cancelled share
      return false;
    }
    console.error('Error sharing via Web Share API:', error);
    return false;
  }
};

/**
 * Generate filename for share image
 * @param {string} type - Type of share
 * @param {Date} date - Date for the share
 * @returns {string} - Filename
 */
export const generateFilename = (type, date = new Date()) => {
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  return `swimma-${type}-${dateStr}.png`;
};

/**
 * Format swim stats for sharing
 * @param {Object} swim - Swim session data
 * @returns {Object} - Formatted stats
 */
export const formatSwimStats = (swim) => {
  return {
    distance: `${swim.distance}m`,
    duration: formatDuration(swim.duration),
    pace: swim.pace ? formatPace(swim.pace) : null,
    date: new Date(swim.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  };
};

/**
 * Format pace for display
 */
const formatPace = (pace) => {
  const minutes = Math.floor(pace);
  const seconds = Math.round((pace - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}/100m`;
};

/**
 * Format duration for display
 */
const formatDuration = (duration) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};
