import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwimData } from '../context/SwimDataContext';
import { PageContainer, PageHeader } from '../components/layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { CardVariant, IconContainer } from '../components/primitives';
import { querySwimData, getExampleQueries, suggestDateRangeForQuery } from '../utils/ai/llmQuery';
import { MessageCircle, Send, Sparkles, Loader2, AlertCircle, Upload, Zap } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { tokens } from '../design/tokens';


export const Ask = () => {
  const { sessions } = useSwimData();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const exampleQueries = getExampleQueries();

  // Load initial context from location state (from swim analysis)
  useEffect(() => {
    if (location.state?.initialContext && location.state?.swimId) {
      const { initialContext, swimId } = location.state;

      // Add the initial analysis as a message
      setMessages([
        {
          id: Date.now(),
          role: 'assistant',
          content: initialContext,
          timestamp: new Date(),
          isInitial: true,
        }
      ]);

      // Clear the location state to prevent re-adding on navigation
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Calculate cumulative token usage
  const tokenStats = useMemo(() => {
    let totalInput = 0;
    let totalOutput = 0;
    let cachedCount = 0;

    messages.forEach(msg => {
      if (msg.usage) {
        totalInput += msg.usage.inputTokens || 0;
        totalOutput += msg.usage.outputTokens || 0;
      }
      if (msg.cached) {
        cachedCount++;
      }
    });

    return {
      totalInput,
      totalOutput,
      total: totalInput + totalOutput,
      cachedCount,
      queryCount: messages.filter(m => m.role === 'assistant').length,
    };
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput('');
    setError(null);

    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Show loading
    setLoading(true);

    try {
      // Detect appropriate date range for query
      const maxDays = suggestDateRangeForQuery(question);

      // Query the LLM (recentCount reduced to 5 to save tokens)
      const response = await querySwimData(question, sessions, {
        maxDays,
        includeRecent: true,
        recentCount: 5,
        includeGrouped: true,
      });

      // Add assistant message
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.answer,
        success: response.success,
        usage: response.usage,
        cached: response.cached || false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      if (!response.success) {
        setError(response.error);
      }
    } catch (err) {
      console.error('Query error:', err);
      setError(err.message);

      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your question. Please try again.',
        success: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (question) => {
    setInput(question);
    inputRef.current?.focus();
  };

  // Empty state
  if (sessions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="text-8xl mb-6">💬</div>
          <h1 className={`${tokens.typography.families.display} ${tokens.typography.sizes['4xl']} ${tokens.typography.weights.bold} mb-4`}>
            Swim Coach
          </h1>
          <p className={`${tokens.typography.sizes.xl} text-content-tertiary mb-8`}>
            Upload some swim data first to start asking questions!
          </p>
          <Link to="/upload">
            <Button leftIcon={<Upload />}>
              Upload Swim Data
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Swim Coach"
        actions={
          tokenStats.queryCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-dark-card rounded-lg text-sm">
              <Zap className={`${tokens.icons.sm} text-yellow-400`} />
              <span className="text-content-tertiary">
                {tokenStats.total.toLocaleString()} tokens
              </span>
              {tokenStats.cachedCount > 0 && (
                <span className="text-green-400 text-xs">
                  ({tokenStats.cachedCount} cached)
                </span>
              )}
            </div>
          )
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-[calc(100vh-16rem)] flex flex-col"
      >
        {/* Welcome message / Example queries */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <CardVariant variant="primary">
              <div className="flex items-start gap-4">
                <IconContainer
                  icon={<Sparkles />}
                  variant="primary"
                  size="lg"
                  rounded
                />
                <div className="flex-1">
                  <h3 className="font-display text-xl font-semibold mb-2">
                    Ask me anything about your swimming!
                  </h3>
                  <p className="text-content-tertiary mb-4">
                    I can analyze your {sessions.length} swim sessions and help you understand your progress, find patterns, and identify your best performances.
                  </p>

                  <div className="space-y-2">
                    <p className="text-sm text-content-tertiary font-medium">Try asking:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {exampleQueries.slice(0, 6).map(example => (
                        <Button
                          key={example.id}
                          variant="secondary"
                          size="md"
                          onClick={() => handleExampleClick(example.question)}
                          className="text-left justify-start group"
                        >
                          <MessageCircle className={`${tokens.icons.sm} text-primary-400 flex-shrink-0`} />
                          <span className="text-content-secondary group-hover:text-white transition-colors">
                            "{example.question}"
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardVariant>
          </motion.div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={message.role === 'user' ? 'bg-primary-500/10 border-primary-500/20' : ''}>
                  <div className="flex items-start gap-4">
                    <IconContainer
                      icon={message.role === 'user' ? <MessageCircle /> : <Sparkles />}
                      variant={message.role === 'user' ? 'primary' : 'accent'}
                      size="md"
                      rounded
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm">
                          {message.role === 'user' ? 'You' : 'AI Coach'}
                        </span>
                        <span className="text-xs text-content-tertiary">
                          {message.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-content-secondary whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </div>
                      {message.usage && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-content-tertiary">
                          <span>
                            {message.usage.inputTokens + message.usage.outputTokens} tokens
                          </span>
                          {message.cached && (
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded">
                              Cached
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card>
                <div className="flex items-center gap-4">
                  <IconContainer
                    icon={<Loader2 className="animate-spin" />}
                    variant="accent"
                    size="md"
                    rounded
                  />
                  <div className="text-content-tertiary">Analyzing your swim data...</div>
                </div>
              </Card>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={tokens.margin.group}
          >
            <CardVariant variant="danger" className={`flex items-start ${tokens.gap.default}`}>
              <IconContainer icon={<AlertCircle />} variant="danger" size="md" className="mt-0.5" />
              <div>
                <p className={`text-red-400 font-medium ${tokens.margin.element}`}>Error</p>
                <p className={`${tokens.typography.sizes.sm} text-content-tertiary`}>{error}</p>
                {error.includes('API key') && (
                  <p className={`${tokens.typography.sizes.xs} text-content-tertiary ${tokens.margin.section}`}>
                    Add your Anthropic API key to .env file: VITE_ANTHROPIC_API_KEY=your-key-here
                  </p>
                )}
              </div>
            </CardVariant>
          </motion.div>
        )}

        {/* Input form */}
        <Card className="bg-dark-card">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your swimming..."
              disabled={loading}
              className="flex-1 bg-dark-bg rounded-lg px-4 py-3 text-content placeholder-content-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!input.trim() || loading}
              leftIcon={loading ? <Loader2 className="animate-spin" /> : <Send />}
            >
              <span className="hidden sm:inline">{loading ? 'Thinking...' : 'Send'}</span>
            </Button>
          </form>
        </Card>
      </motion.div>
    </PageContainer>
  );
};
