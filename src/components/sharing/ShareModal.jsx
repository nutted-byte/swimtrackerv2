import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Copy, Check, Loader2, Image as ImageIcon, MessageCircle, Instagram, Share2 } from 'lucide-react';
import { SwimShareCard } from './SwimShareCard';
import {
  generateShareImage,
  downloadImage,
  copyImageToClipboard,
  generateShareText,
  generateFilename,
  shareViaWebShare,
  shareToWhatsApp,
  shareToInstagram,
  detectPlatform
} from '../../utils/shareUtils';

/**
 * Modal for sharing swim sessions
 * Generates image and provides download/copy/share options
 */
export const ShareModal = ({ isOpen, onClose, swim, type = 'swim' }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState('square');
  const [cardStyle, setCardStyle] = useState('bold');
  const [successMessage, setSuccessMessage] = useState(null);
  const [sharingTo, setSharingTo] = useState(null); // 'whatsapp', 'instagram', etc.
  const cardRef = useRef(null);
  const platform = detectPlatform();

  // Generate image when modal opens or format/style changes
  useEffect(() => {
    if (isOpen && swim) {
      // Reset image when format or style changes
      setImageDataUrl(null);
      handleGenerateImage();
    }
  }, [isOpen, swim, format, cardStyle]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setImageDataUrl(null);
      setError(null);
      setCopied(false);
      setSuccessMessage(null);
      setSharingTo(null);
    }
  }, [isOpen]);

  const handleGenerateImage = async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Wait for next frame to ensure DOM is rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      const dataUrl = await generateShareImage(cardRef.current, {
        scale: 2,
        backgroundColor: '#0a0e27',
        width: format === 'square' ? 1080 : format === 'story' ? 1080 : 1200,
        height: format === 'square' ? 1080 : format === 'story' ? 1920 : 675
      });

      setImageDataUrl(dataUrl);
    } catch (err) {
      console.error('Failed to generate image:', err);
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!imageDataUrl) return;

    const filename = generateFilename(type, new Date(swim.date));
    downloadImage(imageDataUrl, filename);
  };

  const handleCopy = async () => {
    if (!imageDataUrl) return;

    setError(null);

    // Check if clipboard API is available
    const hasClipboard = navigator.clipboard && navigator.clipboard.write && typeof ClipboardItem !== 'undefined';

    const success = await copyImageToClipboard(imageDataUrl);

    if (success) {
      setCopied(true);

      // Show appropriate message based on clipboard support
      if (!hasClipboard) {
        setSuccessMessage('Image downloaded! (Clipboard not supported on this browser)');
        setTimeout(() => setSuccessMessage(null), 3000);
      }

      setTimeout(() => setCopied(false), 2000);
    } else {
      setError('Failed to copy image. Try the Download button instead.');
    }
  };

  const handleWebShare = async () => {
    if (!imageDataUrl) return;

    try {
      // Convert data URL to blob
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      const file = new File([blob], generateFilename(type, new Date(swim.date)), { type: 'image/png' });

      const shareData = {
        title: 'My Swim Progress',
        text: generateShareText(type, {
          distance: swim.distance,
          pace: swim.pace ? formatPace(swim.pace) : null
        }),
        files: [file]
      };

      await shareViaWebShare(shareData);
    } catch (err) {
      console.error('Failed to share:', err);
      setError('Failed to share. Try downloading instead.');
    }
  };

  const handleWhatsAppShare = async () => {
    if (!imageDataUrl) return;

    setSharingTo('whatsapp');
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await shareToWhatsApp(imageDataUrl, {
        text: generateShareText(type, {
          distance: swim.distance,
          pace: swim.pace ? formatPace(swim.pace) : null
        })
      });

      if (result.success) {
        if (result.instructions) {
          setSuccessMessage(result.instructions);
        } else {
          setSuccessMessage('Shared to WhatsApp! 🎉');
        }
        setTimeout(() => setSuccessMessage(null), 5000);
      } else if (!result.cancelled) {
        setError(result.error || 'Failed to share to WhatsApp');
      }
    } catch (err) {
      console.error('WhatsApp share error:', err);
      setError('Failed to share to WhatsApp. Try downloading instead.');
    } finally {
      setSharingTo(null);
    }
  };

  const handleInstagramShare = async () => {
    if (!imageDataUrl) return;

    setSharingTo('instagram');
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await shareToInstagram(imageDataUrl);

      if (result.success) {
        setSuccessMessage(result.instructions || 'Image saved! Open Instagram to post it 📸');
        setTimeout(() => setSuccessMessage(null), 8000);
      } else {
        setError(result.error || 'Failed to prepare image for Instagram');
      }
    } catch (err) {
      console.error('Instagram share error:', err);
      setError('Failed to prepare image for Instagram. Try downloading instead.');
    } finally {
      setSharingTo(null);
    }
  };

  const formatPace = (pace) => {
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}/100m`;
  };

  if (!swim) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-dark-card rounded-none sm:rounded-2xl shadow-2xl max-w-2xl w-full h-full sm:h-auto sm:max-h-[90vh] overflow-hidden border-0 sm:border border-dark-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6">
              <div>
                <h2 className="text-2xl font-bold text-white font-display">
                  Share Your Swim
                </h2>
                <p className="text-content-tertiary text-sm mt-1">
                  Generate a beautiful card to share on social media
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-dark-border transition-colors text-content-tertiary hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-240px)] sm:max-h-[calc(90vh-180px)]">
              {/* Format selector */}
              <div className="mb-3 sm:mb-4">
                <label className="text-sm text-content-tertiary mb-2 block">Format</label>
                <div className="flex gap-1.5 sm:gap-2">
                  <button
                    onClick={() => setFormat('square')}
                    className={`px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                      format === 'square'
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-border text-content-tertiary hover:text-white'
                    }`}
                  >
                    <span className="hidden sm:inline">Square (1:1)</span>
                    <span className="sm:hidden">Square</span>
                  </button>
                  <button
                    onClick={() => setFormat('story')}
                    className={`px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                      format === 'story'
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-border text-content-tertiary hover:text-white'
                    }`}
                  >
                    <span className="hidden sm:inline">Story (9:16)</span>
                    <span className="sm:hidden">Story</span>
                  </button>
                  <button
                    onClick={() => setFormat('twitter')}
                    className={`px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                      format === 'twitter'
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-border text-content-tertiary hover:text-white'
                    }`}
                  >
                    <span className="hidden sm:inline">Twitter (16:9)</span>
                    <span className="sm:hidden">Twitter</span>
                  </button>
                </div>
              </div>

              {/* Card Style selector */}
              {format !== 'story' && (
                <div className="mb-4 sm:mb-6">
                  <label className="text-sm text-content-tertiary mb-2 block">Card Style</label>
                  <div className="flex gap-1.5 sm:gap-2">
                    <button
                      onClick={() => setCardStyle('bold')}
                      className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                        cardStyle === 'bold'
                          ? 'bg-primary-500 text-white'
                          : 'bg-dark-border text-content-tertiary hover:text-white'
                      }`}
                    >
                      Bold
                    </button>
                    <button
                      onClick={() => setCardStyle('minimal')}
                      className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                        cardStyle === 'minimal'
                          ? 'bg-primary-500 text-white'
                          : 'bg-dark-border text-content-tertiary hover:text-white'
                      }`}
                    >
                      Minimal
                    </button>
                    <button
                      onClick={() => setCardStyle('gradient')}
                      className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                        cardStyle === 'gradient'
                          ? 'bg-primary-500 text-white'
                          : 'bg-dark-border text-content-tertiary hover:text-white'
                      }`}
                    >
                      Gradient
                    </button>
                  </div>
                </div>
              )}

              {/* Preview */}
              <div className="mb-4 sm:mb-6">
                <label className="text-sm text-content-tertiary mb-2 block">Preview</label>

                {/* Hidden card for image generation */}
                <div style={{ position: 'absolute', left: '-9999px' }}>
                  <SwimShareCard ref={cardRef} swim={swim} format={format} style={cardStyle} />
                </div>

                {/* Preview area */}
                <div className="bg-dark-bg rounded-xl p-3 sm:p-4 flex items-center justify-center min-h-[200px] sm:min-h-[300px]">
                  {isGenerating && (
                    <div className="text-center">
                      <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-primary-400 animate-spin mx-auto mb-4" />
                      <p className="text-content-tertiary text-sm sm:text-base">Generating your share card...</p>
                    </div>
                  )}

                  {!isGenerating && imageDataUrl && (
                    <img
                      src={imageDataUrl}
                      alt="Share preview"
                      className="max-w-full max-h-[250px] sm:max-h-[400px] rounded-lg shadow-lg"
                    />
                  )}

                  {!isGenerating && !imageDataUrl && error && (
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
                      <p className="text-red-400">{error}</p>
                      <button
                        onClick={handleGenerateImage}
                        className="mt-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg text-white text-sm transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Success message */}
              {successMessage && !isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm"
                >
                  {successMessage}
                </motion.div>
              )}

              {/* Error message */}
              {error && !isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 sm:p-6 border-t border-dark-border bg-dark-bg/50">
              {/* Platform-specific share buttons */}
              <div className="mb-3 sm:mb-4">
                <label className="text-xs text-content-tertiary mb-2 block uppercase tracking-wide">Share to</label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {/* WhatsApp */}
                  <button
                    onClick={handleWhatsAppShare}
                    disabled={!imageDataUrl || isGenerating || sharingTo === 'whatsapp'}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 bg-green-600 hover:bg-green-700 disabled:bg-dark-border disabled:cursor-not-allowed rounded-lg text-white text-sm sm:text-base font-medium transition-all"
                  >
                    {sharingTo === 'whatsapp' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="hidden sm:inline">Sharing...</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </>
                    )}
                  </button>

                  {/* Instagram */}
                  <button
                    onClick={handleInstagramShare}
                    disabled={!imageDataUrl || isGenerating || sharingTo === 'instagram'}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:bg-dark-border disabled:cursor-not-allowed rounded-lg text-white text-sm sm:text-base font-medium transition-all"
                  >
                    {sharingTo === 'instagram' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="hidden sm:inline">Saving...</span>
                      </>
                    ) : (
                      <>
                        <Instagram className="w-4 h-4" />
                        Instagram
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Other actions */}
              <div className="mb-3 sm:mb-4">
                <label className="text-xs text-content-tertiary mb-2 block uppercase tracking-wide">Or save</label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button
                    onClick={handleDownload}
                    disabled={!imageDataUrl || isGenerating}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-dark-border disabled:cursor-not-allowed rounded-lg text-white text-sm sm:text-base font-medium transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>

                  <button
                    onClick={handleCopy}
                    disabled={!imageDataUrl || isGenerating}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 bg-dark-card hover:bg-dark-border disabled:bg-dark-border disabled:cursor-not-allowed rounded-lg text-white text-sm sm:text-base font-medium transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Web Share API button (mobile) - as fallback */}
              {platform.hasWebShare && (
                <button
                  onClick={handleWebShare}
                  disabled={!imageDataUrl || isGenerating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-dark-card hover:bg-dark-border disabled:bg-dark-border disabled:cursor-not-allowed rounded-lg text-white text-sm transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  More share options
                </button>
              )}

              <p className="text-content-tertiary text-xs text-center mt-4">
                {platform.isMobile
                  ? 'Tap a button to share your swim progress! 🏊‍♂️'
                  : 'Share your progress on social media and inspire others! 🏊‍♂️'
                }
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
