import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SwimDataProvider } from './context/SwimDataContext';
import { ThemeToggle } from './components/ThemeToggle';
import { Dashboard } from './pages/Dashboard';
import { Upload } from './pages/Upload';
import { Sessions } from './pages/Sessions';
import { SessionDetail } from './pages/SessionDetail';
import { Waves, Upload as UploadIcon, Home, List } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SwimDataProvider>
          <div className="min-h-screen bg-dark-bg">
            {/* Header */}
            <header className="border-b border-dark-border bg-dark-card/50 backdrop-blur-sm sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-blue flex items-center justify-center">
                    <Waves className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="font-display text-xl font-bold">Swim Tracker</h1>
                    <p className="text-xs text-gray-400">Track your progress</p>
                  </div>
                </Link>

                <div className="flex items-center gap-4">
                  <nav className="flex gap-2">
                    <Link
                      to="/"
                      className="px-4 py-2 rounded-lg hover:bg-dark-card transition-colors flex items-center gap-2 text-sm"
                    >
                      <Home className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/sessions"
                      className="px-4 py-2 rounded-lg hover:bg-dark-card transition-colors flex items-center gap-2 text-sm"
                    >
                      <List className="w-4 h-4" />
                      Sessions
                    </Link>
                    <Link
                      to="/upload"
                      className="px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                      <UploadIcon className="w-4 h-4" />
                      Upload
                    </Link>
                  </nav>
                  <ThemeToggle />
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/sessions" element={<Sessions />} />
                <Route path="/session/:id" element={<SessionDetail />} />
                <Route path="/upload" element={<Upload />} />
              </Routes>
            </main>
          </div>
        </SwimDataProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
