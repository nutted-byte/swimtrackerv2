import { useState, useEffect } from 'react';
import { analyzeSwim, askAboutSwim } from '../utils/ai/llmQuery';
import { getCachedSwimAnalysis, cacheSwimAnalysis, getCachedSwimConversation, cacheSwimConversation } from '../utils/cache/queryCache';

/**
 * Custom hook for managing swim analysis state and operations
 */
export const useSwimAnalysis = (swim, sessions) => {
  const [analysisState, setAnalysisState] = useState({
    isOpen: false,
    analysis: null,
    conversation: [],
    loading: false,
    error: null,
  });

  // Load cached data when component mounts or swim changes
  useEffect(() => {
    if (swim) {
      const cachedAnalysis = getCachedSwimAnalysis(swim.id);
      const cachedConversation = getCachedSwimConversation(swim.id);

      if (cachedAnalysis || cachedConversation) {
        setAnalysisState(prev => ({
          ...prev,
          analysis: cachedAnalysis || prev.analysis,
          conversation: cachedConversation || prev.conversation,
        }));
      }
    }
  }, [swim?.id]);

  // Handler to generate initial analysis
  const handleAnalyzeSwim = async () => {
    if (!swim) return;

    setAnalysisState(prev => ({ ...prev, isOpen: true, loading: true, error: null }));

    try {
      // Check cache first
      const cached = getCachedSwimAnalysis(swim.id);
      if (cached) {
        setAnalysisState(prev => ({
          ...prev,
          analysis: { ...cached, cached: true },
          loading: false,
        }));
        return;
      }

      // Get recent swims for comparison
      const recentSwims = sessions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      const result = await analyzeSwim(swim, recentSwims);

      if (result.success) {
        const analysis = {
          content: result.content,
          usage: result.usage,
          cached: false,
        };
        setAnalysisState(prev => ({ ...prev, analysis, loading: false }));
        cacheSwimAnalysis(swim.id, analysis);
      } else {
        setAnalysisState(prev => ({ ...prev, error: result.error, loading: false }));
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setAnalysisState(prev => ({ ...prev, error: err.message, loading: false }));
    }
  };

  // Handler for follow-up questions
  const handleAskQuestion = async (question) => {
    if (!swim) return;

    setAnalysisState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const recentSwims = sessions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      const result = await askAboutSwim(swim, question, recentSwims, analysisState.conversation);

      if (result.success) {
        const newConversation = [
          ...analysisState.conversation,
          { role: 'user', content: question },
          { role: 'assistant', content: result.content, usage: result.usage }
        ];

        setAnalysisState(prev => ({
          ...prev,
          conversation: newConversation,
          loading: false
        }));

        cacheSwimConversation(swim.id, newConversation);
      } else {
        setAnalysisState(prev => ({ ...prev, error: result.error, loading: false }));
      }
    } catch (err) {
      console.error('Question error:', err);
      setAnalysisState(prev => ({ ...prev, error: err.message, loading: false }));
    }
  };

  // Toggle analysis panel
  const toggleAnalysisPanel = () => {
    setAnalysisState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  };

  // Close analysis panel
  const closeAnalysisPanel = () => {
    setAnalysisState(prev => ({ ...prev, isOpen: false }));
  };

  return {
    analysisState,
    handleAnalyzeSwim,
    handleAskQuestion,
    toggleAnalysisPanel,
    closeAnalysisPanel
  };
};
