import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Waves, TrendingUp, Trophy, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login = () => {
  const { signInWithGoogle, loading, error } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
    } catch (err) {
      console.error('Failed to sign in:', err);
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Branding & Features */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <div className="flex items-center gap-3 justify-center lg:justify-start mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-blue flex items-center justify-center text-4xl">
              🌊
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-blue bg-clip-text text-transparent">
                Swimma
              </h1>
              <p className="text-content-tertiary text-sm">Your swimming analytics</p>
            </div>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
            Track Every Stroke.<br />
            See Every Improvement.
          </h2>

          <p className="text-content-tertiary text-lg mb-8">
            Upload your swim data, analyze your performance, and watch yourself get faster.
          </p>

          <div className="grid gap-4 mb-8">
            <FeatureItem
              icon={<Activity className="w-5 h-5" />}
              title="Detailed Analytics"
              description="Track pace, distance, SWOLF, and more"
            />
            <FeatureItem
              icon={<TrendingUp className="w-5 h-5" />}
              title="Progress Insights"
              description="See how you're improving over time"
            />
            <FeatureItem
              icon={<Trophy className="w-5 h-5" />}
              title="Personal Records"
              description="Break records and earn achievements"
            />
          </div>
        </motion.div>

        {/* Right side - Login */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-dark-card rounded-2xl p-8 lg:p-12"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2 text-white">Welcome Back</h3>
            <p className="text-content-tertiary">Sign in to access your swim data</p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading || isSigningIn}
            className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isSigningIn ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <p className="text-xs text-content-tertiary text-center mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// Feature item component
const FeatureItem = ({ icon, title, description }) => (
  <div className="flex items-start gap-3">
    <div className="w-10 h-10 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 flex-shrink-0">
      {icon}
    </div>
    <div>
      <h4 className="font-semibold text-white mb-1">{title}</h4>
      <p className="text-sm text-content-tertiary">{description}</p>
    </div>
  </div>
);
