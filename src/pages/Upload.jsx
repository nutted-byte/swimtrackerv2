import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileUpload } from '../components/FileUpload';
import { VO2MaxUpload } from '../components/VO2MaxUpload';
import { useSwimData } from '../context/SwimDataContext';
import { CheckCircle, Loader, Trash2, AlertTriangle } from 'lucide-react';

export const Upload = () => {
  const navigate = useNavigate();
  const { uploadFiles, clearAllSessions, sessions } = useSwimData();
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleFilesUploaded = async (files) => {
    setUploading(true);
    setSuccess(false);

    try {
      const sessions = await uploadFiles(files);
      setUploadedCount(sessions.length);
      setSuccess(true);

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      // Error is handled by FileUpload component
    } finally {
      setUploading(false);
    }
  };

  const handleClearData = () => {
    try {
      clearAllSessions();
      setShowClearConfirm(false);
      setSuccess(false);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-4xl font-bold mb-2">
          Upload Swim Data
        </h1>
        <p className="text-content-tertiary mb-8">
          Upload your swim activity files to start tracking your progress
        </p>

        <FileUpload onFilesUploaded={handleFilesUploaded} />

        {uploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 flex items-center justify-center gap-3 text-primary-400"
          >
            <Loader className="w-5 h-5 animate-spin" />
            <span>Processing your swim data...</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-6 text-center"
          >
            <CheckCircle className="w-12 h-12 text-accent-blue mx-auto mb-3" />
            <h3 className="font-display text-xl font-semibold mb-2">
              Successfully uploaded {uploadedCount} swim{uploadedCount !== 1 ? 's' : ''}!
            </h3>
            <p className="text-content-tertiary">
              Redirecting to your dashboard...
            </p>
          </motion.div>
        )}

        {/* VO2 Max Upload Section */}
        {sessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 pt-8 border-t border-dark-border"
          >
            <VO2MaxUpload />
          </motion.div>
        )}

        {/* Clear All Data Section */}
        {sessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 pt-8 border-t border-dark-border"
          >
            <h2 className="font-display text-2xl font-semibold mb-2 text-content-secondary">
              Data Management
            </h2>
            <p className="text-content-tertiary mb-4">
              You have {sessions.length} swim session{sessions.length !== 1 ? 's' : ''} stored
            </p>

            {!showClearConfirm ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-dark-card hover:bg-accent-coral/20 text-content-tertiary hover:text-accent-coral rounded-lg transition-colors border border-dark-border hover:border-accent-coral/50"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Data
              </button>
            ) : (
              <div className="bg-accent-coral/10 border border-accent-coral/30 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-accent-coral flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-accent-coral mb-1">
                      Are you absolutely sure?
                    </h3>
                    <p className="text-sm text-content-tertiary">
                      This will permanently delete all {sessions.length} swim sessions. This action cannot be undone.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleClearData}
                    className="px-4 py-2 bg-accent-coral hover:bg-accent-coral/80 text-white rounded-lg transition-colors font-medium"
                  >
                    Yes, delete everything
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-4 py-2 bg-dark-card hover:bg-dark-card/80 text-content-secondary rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
