import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileUpload } from '../components/FileUpload';
import { useSwimData } from '../context/SwimDataContext';
import { CheckCircle, Loader } from 'lucide-react';

export const Upload = () => {
  const navigate = useNavigate();
  const { uploadFiles } = useSwimData();
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);

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
        <p className="text-gray-400 mb-8">
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
            <p className="text-gray-400">
              Redirecting to your dashboard...
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
