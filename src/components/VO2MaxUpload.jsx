import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Upload, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { useSwimData } from '../context/SwimDataContext';
import { CardVariant, IconContainer } from './primitives';
import { tokens } from '../design/tokens';

export const VO2MaxUpload = () => {
  const { uploadVO2MaxData } = useSwimData();
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setResult(null);
    setError(null);

    try {
      const uploadResult = await uploadVO2MaxData(file);
      setResult(uploadResult);
    } catch (err) {
      console.error('VO2 max upload error:', err);
      setError(err.message);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDismiss = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="p-4 rounded-lg bg-accent-blue/20">
          <Activity className={`${tokens.icons.lg} text-accent-blue`} />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-lg font-semibold mb-2">
            Add VO2 Max Data
          </h3>
          <p className="text-content-tertiary text-sm mb-4">
            Upload a CSV file with VO2 max data to automatically match it to your swim sessions by date.
            Supports Apple Health export format.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            onClick={handleButtonClick}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-blue/20 hover:bg-accent-blue/30 text-accent-blue rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className={`${tokens.icons.sm} animate-spin`} />
                Processing...
              </>
            ) : (
              <>
                <Upload className={tokens.icons.sm} />
                Upload VO2 Max CSV
              </>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-4"
          >
            <div className="flex items-start gap-4">
              <CheckCircle className={`${tokens.icons.md} text-accent-blue flex-shrink-0 mt-0.5`} />
              <div className="flex-1">
                <h4 className="font-semibold text-accent-blue mb-1">
                  VO2 Max Data Uploaded Successfully
                </h4>
                <div className="text-sm text-content-tertiary space-y-2">
                  <p>✓ {result.matchedCount} swim session{result.matchedCount !== 1 ? 's' : ''} updated</p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="p-3 hover:bg-accent-blue/20 rounded-lg transition-colors"
              >
                <X className={`${tokens.icons.sm} text-content-tertiary`} />
              </button>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <CardVariant variant="danger" className={`flex items-start ${tokens.gap.default}`}>
              <IconContainer icon={<AlertCircle />} variant="danger" size="md" className="mt-0.5" />
              <div className="flex-1">
                <h4 className={`font-semibold text-red-400 ${tokens.margin.element}`}>Upload Failed</h4>
                <p className={`${tokens.typography.sizes.sm} text-content-tertiary`}>{error}</p>
              </div>
              <button
                onClick={handleDismiss}
                className={`${tokens.padding.tight} hover:bg-red-500/20 ${tokens.radius.lg} transition-colors`}
              >
                <X className={`${tokens.icons.sm} text-content-tertiary`} />
              </button>
            </CardVariant>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-xs text-content-tertiary space-y-2">
        <p>Expected CSV format:</p>
        <ul className="list-disc list-inside ml-2 space-y-2">
          <li>Apple Health: Direct export from Apple Health app</li>
          <li>Simple: Headers "date,vo2max" with data rows</li>
        </ul>
      </div>
    </div>
  );
};
