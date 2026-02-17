import { lazy, Suspense, useRef } from 'react';
import { unzip } from 'fflate';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SwimDataProvider } from './context/SwimDataContext';
import { TrainingPlanProvider } from './context/TrainingPlanContext';
import { ThemeToggle } from './components/ThemeToggle';
import { DevTools } from './components/DevTools';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MobileMenu, MobileMenuProvider } from './components/MobileMenu';
import { ScrollToTop } from './components/ScrollToTop';
import { Waves, Upload as UploadIcon, Home, List, BarChart3, Trophy, MessageCircle, LogOut, User, BookOpen, Target } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useSwimData } from './context/SwimDataContext';
import { tokens } from './design/tokens';


// Lazy load pages for code splitting - improves initial load time
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Upload = lazy(() => import('./pages/Upload').then(m => ({ default: m.Upload })));
const Sessions = lazy(() => import('./pages/Sessions').then(m => ({ default: m.Sessions })));
const SessionDetail = lazy(() => import('./pages/SessionDetail').then(m => ({ default: m.SessionDetail })));
const Insights = lazy(() => import('./pages/Insights').then(m => ({ default: m.Insights })));
const Training = lazy(() => import('./pages/Training').then(m => ({ default: m.Training })));
const Patterns = lazy(() => import('./pages/Patterns').then(m => ({ default: m.Patterns })));
const Records = lazy(() => import('./pages/Records').then(m => ({ default: m.Records })));
const Ask = lazy(() => import('./pages/Ask').then(m => ({ default: m.Ask })));
const Techniques = lazy(() => import('./pages/Techniques').then(m => ({ default: m.Techniques })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const DesignTest = lazy(() => import('./pages/DesignTest').then(m => ({ default: m.DesignTest })));
const ComponentShowcase = lazy(() => import('./pages/ComponentShowcase').then(m => ({ default: m.ComponentShowcase })));
const HowItWorks = lazy(() => import('./pages/HowItWorks').then(m => ({ default: m.HowItWorks })));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-dark-bg flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-content-tertiary">Loading...</p>
    </div>
  </div>
);

function AppContent() {
  const { user, signOut, isAuthenticated } = useAuth();
  const { uploadFiles } = useSwimData();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Failed to sign out:', err);
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleLogoFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    e.target.value = '';
    try {
      const acceptedTypes = ['.fit', '.tcx', '.csv'];
      let allFiles = [];
      for (const file of files) {
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        if (ext === '.zip') {
          const extracted = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const uint8 = new Uint8Array(e.target.result);
              unzip(uint8, (err, result) => {
                if (err) { reject(err); return; }
                resolve(result);
              });
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
          });
          for (const [name, data] of Object.entries(extracted)) {
            const filename = name.split('/').pop();
            if (!filename) continue;
            const entryExt = '.' + filename.split('.').pop().toLowerCase();
            if (!acceptedTypes.includes(entryExt)) continue;
            allFiles.push(new File([data], filename));
          }
        } else {
          allFiles.push(file);
        }
      }
      if (allFiles.length) {
        await uploadFiles(allFiles);
        navigate('/');
      }
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  return (
    <MobileMenuProvider>
      <ScrollToTop />
      <div className="min-h-screen bg-dark-bg">
        {/* Header */}
        {isAuthenticated && (
          <>
            <header className="border-b border-dark-border bg-dark-card/50 backdrop-blur-sm sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={handleLogoClick} className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-blue flex items-center justify-center text-2xl hover:opacity-80 transition-opacity cursor-pointer">
                    🌊
                  </button>
                  <Link to="/" className="hover:opacity-80 transition-opacity">
                    <h1 className="font-display text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-blue bg-clip-text text-transparent">
                      Swimma
                    </h1>
                  </Link>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".fit,.tcx,.csv,.zip"
                  multiple
                  onChange={handleLogoFileChange}
                />

                <div className="flex items-center gap-4">
                  {/* Desktop Navigation */}
                  <nav className="hidden md:flex gap-4">
                    <Link
                      to="/"
                      className="px-4 py-2 rounded-lg hover:bg-dark-card transition-colors flex items-center gap-2 text-sm"
                    >
                      <Home className={tokens.icons.sm} />
                      Home
                    </Link>
                    <Link
                      to="/swims"
                      className="px-4 py-2 rounded-lg hover:bg-dark-card transition-colors flex items-center gap-2 text-sm"
                    >
                      <List className={tokens.icons.sm} />
                      Swims
                    </Link>
                    <Link
                      to="/insight"
                      className="px-4 py-2 rounded-lg hover:bg-dark-card transition-colors flex items-center gap-2 text-sm"
                    >
                      <BarChart3 className={tokens.icons.sm} />
                      Insight
                    </Link>
                    <Link
                      to="/train"
                      className="px-4 py-2 rounded-lg hover:bg-dark-card transition-colors flex items-center gap-2 text-sm"
                    >
                      <Target className={tokens.icons.sm} />
                      Train
                    </Link>
                    <Link
                      to="/learn"
                      className="px-4 py-2 rounded-lg hover:bg-dark-card transition-colors flex items-center gap-2 text-sm"
                    >
                      <BookOpen className={tokens.icons.sm} />
                      Learn
                    </Link>
                    <Link
                      to="/upload"
                      className="px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                      <UploadIcon className={tokens.icons.sm} />
                      Upload
                    </Link>
                  </nav>

                  {/* Desktop User Menu */}
                  <div className="hidden md:flex items-center gap-4 pl-4 border-l border-dark-border">
                    <div className="flex items-center gap-2 text-sm">
                      <User className={`${tokens.icons.sm} text-content-tertiary`} />
                      <span className="text-content-secondary">
                        {user?.user_metadata?.full_name?.split(' ')[0] ||
                         user?.user_metadata?.name?.split(' ')[0] ||
                         user?.email?.split('@')[0] ||
                         'User'}
                      </span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="p-3 rounded-lg hover:bg-dark-card transition-colors text-content-tertiary hover:text-red-400"
                      title="Sign out"
                    >
                      <LogOut className={tokens.icons.sm} />
                    </button>
                  </div>

                  {/* Desktop Theme Toggle */}
                  <div className="hidden md:block">
                    <ThemeToggle />
                  </div>

                  {/* Mobile Menu Button */}
                  <MobileMenu user={user} onSignOut={handleSignOut} />
                </div>
              </div>
            </header>
            {/* Mobile Menu Dropdown - Full Width */}
            <MobileMenu user={user} onSignOut={handleSignOut} menuOnly={true} />
          </>
        )}

      {/* Main Content */}
      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/swims"
              element={
                <ProtectedRoute>
                  <Sessions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/swim/:id"
              element={
                <ProtectedRoute>
                  <SessionDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/insight"
              element={
                <ProtectedRoute>
                  <Insights />
                </ProtectedRoute>
              }
            />
            <Route
              path="/train"
              element={
                <ProtectedRoute>
                  <Training />
                </ProtectedRoute>
              }
            />
            {/* Redirect old URLs */}
            <Route path="/sessions" element={<Navigate to="/swims" replace />} />
            <Route path="/session/:id" element={<Navigate to="/swim/:id" replace />} />
            <Route path="/insights" element={<Navigate to="/insight" replace />} />
            <Route path="/training" element={<Navigate to="/train" replace />} />
            <Route
              path="/patterns"
              element={
                <ProtectedRoute>
                  <Patterns />
                </ProtectedRoute>
              }
            />
            <Route
              path="/records"
              element={
                <ProtectedRoute>
                  <Records />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ask"
              element={<Navigate to="/train" replace />}
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learn"
              element={
                <ProtectedRoute>
                  <Techniques key="library" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learn/:articleId"
              element={
                <ProtectedRoute>
                  <Techniques key="article" />
                </ProtectedRoute>
              }
            />
            {/* Redirect old URLs */}
            <Route path="/techniques" element={<Navigate to="/learn" replace />} />
            <Route path="/techniques/:articleId" element={<Navigate to="/learn/:articleId" replace />} />
            {/* Design Test Page (hidden from navigation) */}
            <Route
              path="/design-test"
              element={
                <ProtectedRoute>
                  <DesignTest />
                </ProtectedRoute>
              }
            />
            {/* Component Showcase Page (hidden from navigation) */}
            <Route
              path="/components"
              element={
                <ProtectedRoute>
                  <ComponentShowcase />
                </ProtectedRoute>
              }
            />
            {/* How It Works Page (hidden from navigation) */}
            <Route
              path="/how-it-works"
              element={
                <ProtectedRoute>
                  <HowItWorks />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>

        {/* Developer Tools (dev only) */}
        {isAuthenticated && <DevTools />}
      </div>
    </MobileMenuProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SwimDataProvider>
            <TrainingPlanProvider>
              <AppContent />
            </TrainingPlanProvider>
          </SwimDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
