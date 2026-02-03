import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Watch, Upload, CheckCircle, AlertCircle, Loader2, X, Check, AlertTriangle } from 'lucide-react';
import { useSwimData } from '../context/SwimDataContext';
import { CardVariant, IconContainer } from './primitives';
import { tokens } from '../design/tokens';
import { parseAppleHealthLapCSV } from '../utils/parsers/appleHealthLapParser';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export const AppleHealthLapUpload = () => {
  const { sessions, loadSessions } = useSwimData();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [parsedSessions, setParsedSessions] = useState(null);
  const [matches, setMatches] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setParsedSessions(null);
    setMatches([]);

    try {
      // Parse CSV
      const parsed = await parseAppleHealthLapCSV(file);
      console.log('Parsed sessions:', parsed);

      if (parsed.length === 0) {
        throw new Error('No swimming sessions found in CSV');
      }

      setParsedSessions(parsed);

      // Find matches for each parsed session
      const matchResults = parsed.map(parsedSession => {
        const candidates = findMatchingCandidates(parsedSession, sessions);
        return {
          parsedSession,
          candidates,
          selectedMatch: candidates.length > 0 ? candidates[0].session : null,
          approved: false,
        };
      });

      setMatches(matchResults);
    } catch (err) {
      console.error('Lap data upload error:', err);
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const findMatchingCandidates = (parsedSession, existingSessions) => {
    const parsedDate = new Date(parsedSession.date);

    const candidates = existingSessions
      .map(session => {
        const sessionDate = new Date(session.date);
        const timeDiff = Math.abs(sessionDate - parsedDate) / 1000 / 60; // minutes
        const distanceDiff = Math.abs(session.distance - parsedSession.distance);
        const durationDiff = Math.abs(session.duration - parsedSession.duration);

        // Calculate match score (0-100)
        let score = 100;

        // Time difference (within 60 minutes = good)
        if (timeDiff > 60) {
          return null; // Too far apart in time
        }
        score -= timeDiff; // Deduct 1 point per minute difference

        // Distance difference (within 50m = good)
        if (distanceDiff > 100) {
          return null; // Too different in distance
        }
        score -= distanceDiff / 5; // Deduct points for distance difference

        // Duration difference (within 5 minutes = good)
        score -= durationDiff * 2; // Deduct 2 points per minute difference

        return {
          session,
          score: Math.max(0, Math.round(score)),
          timeDiff,
          distanceDiff,
          durationDiff,
        };
      })
      .filter(c => c !== null)
      .sort((a, b) => b.score - a.score); // Best match first

    return candidates;
  };

  const handleApproveMatch = async (index) => {
    const match = matches[index];
    if (!match.selectedMatch) return;

    setProcessing(true);

    try {
      // Update session with lap data
      const { error: updateError } = await supabase
        .from('swim_sessions')
        .update({
          laps: match.parsedSession.laps,
        })
        .eq('id', match.selectedMatch.id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Reload sessions to get updated data
      await loadSessions();

      // Mark as approved
      setMatches(prev => prev.map((m, i) =>
        i === index ? { ...m, approved: true } : m
      ));
    } catch (err) {
      console.error('Error updating session:', err);
      setError(`Failed to update session: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectMatch = (index) => {
    setMatches(prev => prev.map((m, i) =>
      i === index ? { ...m, selectedMatch: null } : m
    ));
  };

  const handleSelectCandidate = (matchIndex, candidate) => {
    setMatches(prev => prev.map((m, i) =>
      i === matchIndex ? { ...m, selectedMatch: candidate.session } : m
    ));
  };

  const handleFinish = () => {
    const approvedCount = matches.filter(m => m.approved).length;
    setResult({ matchedCount: approvedCount });
    setParsedSessions(null);
    setMatches([]);
  };

  const handleDismiss = () => {
    setResult(null);
    setError(null);
    setParsedSessions(null);
    setMatches([]);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const formatDistance = (meters) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${meters} m`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="p-4 rounded-lg bg-purple-500/20">
          <Watch className={`${tokens.icons.lg} text-purple-400`} />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-lg font-semibold mb-2">
            Add Lap Data from Apple Health
          </h3>
          <p className="text-content-tertiary text-sm mb-4">
            Upload Apple Health lap data CSV to add detailed lap-by-lap pace analysis to your existing swims.
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
            disabled={uploading || matches.length > 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className={`${tokens.icons.sm} animate-spin`} />
                Parsing...
              </>
            ) : (
              <>
                <Upload className={tokens.icons.sm} />
                Upload Lap Data CSV
              </>
            )}
          </button>
        </div>
      </div>

      {/* Matching UI */}
      <AnimatePresence>
        {matches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-purple-400 mb-2">
                Review Matches ({matches.length} sessions found)
              </h4>
              <p className="text-sm text-content-tertiary mb-4">
                Review each match and approve to add lap data. You can select a different candidate if the suggested match isn't correct.
              </p>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {matches.map((match, index) => (
                  <div
                    key={index}
                    className={`bg-dark-card rounded-lg p-4 border ${
                      match.approved
                        ? 'border-green-500/30 bg-green-500/5'
                        : match.selectedMatch
                        ? 'border-purple-500/30'
                        : 'border-yellow-500/30 bg-yellow-500/5'
                    }`}
                  >
                    {/* Parsed Session Info */}
                    <div className="mb-3">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-xs text-content-tertiary mb-1">From CSV:</p>
                          <p className="font-medium">
                            {formatDistance(match.parsedSession.distance)} • {formatDate(match.parsedSession.date)}
                          </p>
                          <p className="text-xs text-content-tertiary">
                            {match.parsedSession.lapCount} laps
                          </p>
                        </div>
                        {match.approved && (
                          <div className="flex items-center gap-1 text-green-400 text-sm">
                            <CheckCircle className={tokens.icons.sm} />
                            <span>Approved</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Match candidates */}
                    {!match.approved && (
                      <>
                        {match.candidates.length === 0 ? (
                          <div className="flex items-center gap-2 text-yellow-400 text-sm bg-yellow-500/10 rounded p-3">
                            <AlertTriangle className={tokens.icons.sm} />
                            <span>No matching sessions found</span>
                          </div>
                        ) : (
                          <>
                            <p className="text-xs text-content-tertiary mb-2">Match to existing session:</p>
                            <div className="space-y-2">
                              {match.candidates.slice(0, 3).map((candidate, candIndex) => (
                                <div
                                  key={candIndex}
                                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                    match.selectedMatch?.id === candidate.session.id
                                      ? 'border-purple-500/50 bg-purple-500/10'
                                      : 'border-dark-border/30 hover:border-purple-500/30'
                                  }`}
                                  onClick={() => handleSelectCandidate(index, candidate)}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">
                                        {formatDistance(candidate.session.distance)} • {formatDate(candidate.session.date)}
                                      </p>
                                      <p className="text-xs text-content-tertiary">
                                        Match score: {candidate.score}% •
                                        Time diff: {Math.round(candidate.timeDiff)}min •
                                        Distance diff: {Math.round(candidate.distanceDiff)}m
                                      </p>
                                    </div>
                                    {match.selectedMatch?.id === candidate.session.id && (
                                      <Check className={`${tokens.icons.sm} text-purple-400`} />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => handleApproveMatch(index)}
                                disabled={!match.selectedMatch || processing}
                                className="flex-1 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                              >
                                {processing ? 'Processing...' : 'Approve Match'}
                              </button>
                              <button
                                onClick={() => handleRejectMatch(index)}
                                disabled={processing}
                                className="px-3 py-2 bg-dark-bg hover:bg-dark-card text-content-tertiary rounded-lg transition-colors text-sm"
                              >
                                Skip
                              </button>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Finish button */}
              {matches.some(m => m.approved) && (
                <button
                  onClick={handleFinish}
                  className="mt-4 w-full px-4 py-2 bg-purple-500 hover:bg-purple-500/80 text-white rounded-lg transition-colors font-medium"
                >
                  Finish
                </button>
              )}
            </div>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4"
          >
            <div className="flex items-start gap-4">
              <CheckCircle className={`${tokens.icons.md} text-purple-400 flex-shrink-0 mt-0.5`} />
              <div className="flex-1">
                <h4 className="font-semibold text-purple-400 mb-1">
                  Lap Data Added Successfully
                </h4>
                <div className="text-sm text-content-tertiary space-y-2">
                  <p>✓ {result.matchedCount} session{result.matchedCount !== 1 ? 's' : ''} updated with lap data</p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="p-3 hover:bg-purple-500/20 rounded-lg transition-colors"
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
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>Apple Health: Export "Distance Swimming" data</li>
          <li>File should contain: startDate, endDate, value (distance in meters)</li>
          <li>Laps are automatically grouped into sessions based on time gaps</li>
        </ul>
      </div>
    </div>
  );
};
