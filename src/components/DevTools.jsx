import { useState } from 'react';
import { loadTestData, clearTestData, hasData } from '../utils/testData';
import { Database, Trash2, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { tokens } from '../design/tokens';

/**
 * Development tools panel for managing test data
 * Only visible in development mode
 */
export const DevTools = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dataExists, setDataExists] = useState(hasData());

  // Only show in development
  if (!import.meta.env.DEV) return null;

  const handleLoadTestData = () => {
    loadTestData();
    setDataExists(true);
    window.location.reload(); // Reload to show new data
  };

  const handleClearData = () => {
    if (window.confirm('Clear all swim data? This cannot be undone!')) {
      clearTestData();
      setDataExists(false);
      window.location.reload(); // Reload to show empty state
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-all"
          title="Developer Tools"
        >
          <Database className={tokens.icons.md} />
        </button>
      )}

      {/* Panel */}
      {isOpen && (
        <div className="bg-dark-card border border-purple-500/30 rounded-lg p-4 min-w-[280px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Database className={`${tokens.icons.md} text-purple-400`} />
              <h3 className="font-semibold text-purple-400">Dev Tools</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-3 hover:bg-dark-bg rounded-lg transition-colors"
            >
              <ChevronDown className={tokens.icons.sm} />
            </button>
          </div>

          {/* Status */}
          <div className="mb-4 p-4 bg-dark-bg rounded-lg">
            <p className="text-xs text-content-tertiary mb-1">Data Status</p>
            <p className={`text-sm font-semibold ${dataExists ? 'text-green-400' : 'text-red-400'}`}>
              {dataExists ? '✓ Data exists' : '✗ No data'}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={handleLoadTestData}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <RefreshCw className={tokens.icons.sm} />
              Load Test Data (27 swims)
            </button>

            <button
              onClick={handleClearData}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Trash2 className={tokens.icons.sm} />
              Clear All Data
            </button>

            <button
              onClick={handleRefresh}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-dark-bg hover:bg-gray-700 text-content-secondary rounded-lg transition-colors text-sm font-medium"
            >
              <RefreshCw className={tokens.icons.sm} />
              Refresh Page
            </button>
          </div>

          {/* Info */}
          <div className="mt-4 p-4 bg-purple-900/20 border border-purple-500/20 rounded-lg">
            <p className="text-xs text-content-tertiary">
              Test data includes varied performance, personal records, and realistic swim patterns
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
