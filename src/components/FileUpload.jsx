import { useState, useCallback } from 'react';
import { Upload, File, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';

export const FileUpload = ({ onFilesUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState(null);

  const acceptedTypes = ['.fit', '.tcx', '.csv'];

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file) => {
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    if (!acceptedTypes.includes(extension)) {
      return `Invalid file type. Please upload ${acceptedTypes.join(', ')} files.`;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return 'File is too large. Maximum size is 10MB.';
    }
    return null;
  };

  const processFiles = (files) => {
    setError(null);
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setUploadedFiles(prev => [...prev, ...fileArray]);

    if (onFilesUploaded) {
      onFilesUploaded(fileArray);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  }, [onFilesUploaded]);

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setError(null);
  };

  return (
    <div className="space-y-4">
      <Card
        className={`relative transition-all duration-300 ${
          isDragging ? 'border-accent-blue border-2 bg-primary-500/10' : ''
        }`}
      >
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="text-center py-12"
        >
          <motion.div
            animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Upload className="w-16 h-16 mx-auto text-primary-400 mb-4" />
            <h3 className="font-display text-xl font-semibold mb-2">
              Upload Swim Data
            </h3>
            <p className="text-gray-400 mb-4">
              Drag and drop your swim files here, or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Supports .FIT, .TCX, and .CSV files (max 10MB)
            </p>

            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept=".fit,.tcx,.csv"
                multiple
                onChange={handleFileInput}
              />
              <span className="btn-primary inline-block">
                Choose Files
              </span>
            </label>
          </motion.div>
        </div>

        {isDragging && (
          <div className="absolute inset-0 bg-accent-blue/5 rounded-2xl pointer-events-none" />
        )}
      </Card>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-accent-coral/10 border border-accent-coral/30 rounded-lg p-4 flex items-start gap-3"
          >
            <XCircle className="w-5 h-5 text-accent-coral flex-shrink-0 mt-0.5" />
            <p className="text-accent-coral text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Card>
          <h4 className="font-display font-semibold mb-4">
            Uploaded Files ({uploadedFiles.length})
          </h4>
          <div className="space-y-2">
            <AnimatePresence>
              {uploadedFiles.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-3 bg-dark-bg rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <File className="w-5 h-5 text-primary-400" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-accent-blue" />
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-accent-coral transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Card>
      )}
    </div>
  );
};
