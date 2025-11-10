import html2canvas from 'html2canvas';

/**
 * Detect current platform and device type
 * @returns {Object} - Platform information
 */
export const detectPlatform = () => {
  const ua = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);

  return {
    isMobile,
    isIOS,
    isAndroid,
    isSafari,
    isDesktop: !isMobile,
    hasWebShare: Boolean(navigator.share)
  };
};

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

    // Longer delay to ensure all styles and layout are rendered
    await new Promise(resolve => setTimeout(resolve, 500));

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
      scrollY: -window.scrollY,
      scrollX: -window.scrollX,
      onclone: (clonedDoc) => {
        // Ensure fonts and styles are applied in cloned document
        const clonedElement = clonedDoc.querySelector('[data-html2canvas-clone]') || clonedDoc.body;
        clonedElement.style.fontFamily = 'Space Grotesk, system-ui, -apple-system, sans-serif';

        // Fix any potential style issues
        const allElements = clonedElement.querySelectorAll('*');
        allElements.forEach(el => {
          // Ensure font smoothing
          el.style.webkitFontSmoothing = 'antialiased';
          el.style.mozOsxFontSmoothing = 'grayscale';

          // Preserve line-height exactly
          const computedStyle = window.getComputedStyle(el);
          if (computedStyle.lineHeight && computedStyle.lineHeight !== 'normal') {
            el.style.lineHeight = computedStyle.lineHeight;
          }

          // Preserve transform
          if (computedStyle.transform && computedStyle.transform !== 'none') {
            el.style.transform = computedStyle.transform;
          }
        });
      }
    });

    return canvas.toDataURL('image/png', 1.0); // Maximum quality
  } catch (error) {
    console.error('Error generating share image:', error);
    throw new Error('Failed to generate share image. Please try again.');
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
    // Check if clipboard API is available
    if (!navigator.clipboard || !navigator.clipboard.write) {
      console.warn('Clipboard API not available');
      // Fallback: just download the image
      downloadImage(dataUrl, 'swimma-share.png');
      return true; // Return true to show success message suggesting download
    }

    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    // Ensure the blob has the correct MIME type
    const pngBlob = blob.type === 'image/png' ? blob : new Blob([blob], { type: 'image/png' });

    // Try to copy to clipboard
    try {
      // Check if ClipboardItem is available and supports images
      if (typeof ClipboardItem !== 'undefined') {
        const clipboardItem = new ClipboardItem({
          'image/png': pngBlob
        });

        await navigator.clipboard.write([clipboardItem]);
        return true;
      } else {
        throw new Error('ClipboardItem not supported');
      }
    } catch (clipboardError) {
      console.warn('Clipboard write failed, trying alternative:', clipboardError);

      // Some browsers might not support image clipboard, download instead
      downloadImage(dataUrl, 'swimma-share.png');
      return true;
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error);

    // Final fallback: just download
    try {
      downloadImage(dataUrl, 'swimma-share.png');
      return true;
    } catch (downloadError) {
      console.error('Download fallback also failed:', downloadError);
      return false;
    }
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

/**
 * Share to WhatsApp
 * @param {string} imageDataUrl - Data URL of the image
 * @param {Object} shareData - Share data (title, text)
 * @returns {Promise<Object>} - Result with success status and instructions
 */
export const shareToWhatsApp = async (imageDataUrl, shareData = {}) => {
  const platform = detectPlatform();
  const { text = 'Check out my swim progress! 🏊‍♂️ #Swimma' } = shareData;

  try {
    if (platform.isMobile && navigator.share) {
      // Mobile: Convert image to blob
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'swimma-share.png', { type: 'image/png' });

      // Check if files are supported
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        // Try sharing with both text and file
        try {
          await navigator.share({
            text: text,
            files: [file]
          });
          return { success: true, method: 'web-share' };
        } catch (err) {
          // If both fails, try just the file
          if (err.name !== 'AbortError') {
            await navigator.share({
              files: [file]
            });
            return {
              success: true,
              method: 'web-share',
              instructions: 'Image shared! Add your caption in WhatsApp.'
            };
          }
          throw err;
        }
      } else {
        // Files not supported, download and open WhatsApp
        downloadImage(imageDataUrl, 'swimma-share.png');

        if (platform.isAndroid) {
          // Try WhatsApp URL scheme on Android
          const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(text)}`;
          window.location.href = whatsappUrl;
        } else if (platform.isIOS) {
          // Try WhatsApp URL scheme on iOS
          const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(text)}`;
          window.location.href = whatsappUrl;
        }

        return {
          success: true,
          method: 'download',
          instructions: 'Image saved! Open WhatsApp and attach the image from your gallery.'
        };
      }
    } else {
      // Desktop: Download image and provide WhatsApp Web link
      downloadImage(imageDataUrl, 'swimma-share.png');

      // Open WhatsApp Web with pre-filled message
      const whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');

      return {
        success: true,
        method: 'download',
        instructions: 'Image downloaded! Click the attachment icon in WhatsApp to send it.'
      };
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      return { success: false, cancelled: true };
    }
    console.error('Error sharing to WhatsApp:', error);

    // Fallback: Download image and try to open WhatsApp
    try {
      downloadImage(imageDataUrl, 'swimma-share.png');
      if (platform.isMobile) {
        const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(text)}`;
        window.location.href = whatsappUrl;
      }
      return {
        success: true,
        method: 'fallback',
        instructions: 'Image saved! Open WhatsApp and attach the image from your gallery.'
      };
    } catch (fallbackError) {
      return {
        success: false,
        error: 'Could not share to WhatsApp. Try using the Download button instead.',
        fallback: 'download'
      };
    }
  }
};

/**
 * Share to Instagram
 * @param {string} imageDataUrl - Data URL of the image
 * @param {Object} shareData - Share data
 * @returns {Promise<Object>} - Result with success status and instructions
 */
export const shareToInstagram = async (imageDataUrl, shareData = {}) => {
  const platform = detectPlatform();

  try {
    // Download the image first
    downloadImage(imageDataUrl, 'swimma-instagram.png');

    if (platform.isMobile) {
      // Mobile: Try to save to camera roll / show instructions
      return {
        success: true,
        method: 'download',
        instructions: platform.isIOS
          ? 'Image saved! Open Instagram → tap + → select this photo from your camera roll'
          : 'Image saved! Open Instagram → tap + → select this photo from your gallery'
      };
    } else {
      // Desktop: Show instructions
      return {
        success: true,
        method: 'download',
        instructions: 'Image downloaded! Open Instagram on your phone and upload it from your camera roll.'
      };
    }
  } catch (error) {
    console.error('Error sharing to Instagram:', error);
    return {
      success: false,
      error: 'Could not prepare image for Instagram',
      instructions: 'Try using the Download button instead.'
    };
  }
};

/**
 * Save image to device gallery (mobile)
 * @param {string} imageDataUrl - Data URL of the image
 * @param {string} filename - Filename for the image
 * @returns {Promise<boolean>} - Success status
 */
export const saveToGallery = async (imageDataUrl, filename = 'swimma-share.png') => {
  try {
    const platform = detectPlatform();

    if (platform.isMobile && platform.hasWebShare) {
      // Try Web Share API first
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      const file = new File([blob], filename, { type: 'image/png' });

      await navigator.share({
        files: [file]
      });

      return true;
    } else {
      // Fallback to download
      downloadImage(imageDataUrl, filename);
      return true;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      return false;
    }
    console.error('Error saving to gallery:', error);
    // Try download as fallback
    downloadImage(imageDataUrl, filename);
    return true;
  }
};
