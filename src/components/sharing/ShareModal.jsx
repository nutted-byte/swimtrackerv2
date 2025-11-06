import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Copy, Check, Loader2, Image as ImageIcon } from 'lucide-react';
import { SwimShareCard } from './SwimShareCard';
import {
  generateShareImage,
  downloadImage,
  copyImageToClipboard,
  generateShareText,
  generateFilename,
  shareViaWebShare
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
  const cardRef = useRef(null);

  // Generate image when modal opens
  useEffect(() => {
    if (isOpen && swim && !imageDataUrl) {
      handleGenerateImage();
    }
  }, [isOpen, swim, format]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setImageDataUrl(null);
      setError(null);
      setCopied(false);
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

    const success = await copyImageToClipboard(imageDataUrl);

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setError('Failed to copy to clipboard. Try downloading instead.');
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

  const formatPace = (pace) => {
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}/100m`;
  };

  if (!swim) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            className="relative bg-dark-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-dark-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-dark-border">
              <div>
                <h2 className="text-2xl font-bold text-white font-display">
                  Share Your Swim
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Generate a beautiful card to share on social media
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-dark-border transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {/* Format selector */}
              <div className="mb-6">
                <label className="text-sm text-gray-400 mb-2 block">Format</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFormat('square')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      format === 'square'
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-border text-gray-400 hover:text-white'
                    }`}
                  >
                    Square (1:1)
                  </button>
                  <button
                    onClick={() => setFormat('story')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      format === 'story'
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-border text-gray-400 hover:text-white'
                    }`}
                  >
                    Story (9:16)
                  </button>
                  <button
                    onClick={() => setFormat('twitter')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      format === 'twitter'
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-border text-gray-400 hover:text-white'
                    }`}
                  >
                    Twitter (16:9)
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div className="mb-6">
                <label className="text-sm text-gray-400 mb-2 block">Preview</label>

                {/* Hidden card for image generation */}
                <div style={{ position: 'absolute', left: '-9999px' }}>
                  <SwimShareCard ref={cardRef} swim={swim} format={format} />
                </div>

                {/* Preview area */}
                <div className="bg-dark-bg rounded-xl p-4 flex items-center justify-center min-h-[300px]">
                  {isGenerating && (
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 text-primary-400 animate-spin mx-auto mb-4" />
                      <p className="text-gray-400">Generating your share card...</p>
                    </div>
                  )}

                  {!isGenerating && imageDataUrl && (
                    <img
                      src={imageDataUrl}
                      alt="Share preview"
                      className="max-w-full max-h-[400px] rounded-lg shadow-lg"
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

              {/* Error message */}
              {error && !isGenerating && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-dark-border bg-dark-bg/50">
              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  disabled={!imageDataUrl || isGenerating}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>

                <button
                  onClick={handleCopy}
                  disabled={!imageDataUrl || isGenerating}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-dark-card hover:bg-dark-border disabled:bg-gray-800 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors border border-dark-border"
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

                {/* Web Share API button (mobile) */}
                {navigator.share && (
                  <button
                    onClick={handleWebShare}
                    disabled={!imageDataUrl || isGenerating}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-accent-blue hover:bg-accent-blue/80 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Share
                  </button>
                )}
              </div>

              <p className="text-gray-500 text-xs text-center mt-4">
                Share your progress on social media and inspire others! 🏊‍♂️
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
