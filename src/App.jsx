import { ThemeProvider } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { Dashboard } from './pages/Dashboard';
import { Waves } from 'lucide-react';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-dark-bg">
        {/* Header */}
        <header className="border-b border-dark-border bg-dark-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-blue flex items-center justify-center">
                <Waves className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold">Swim Tracker</h1>
                <p className="text-xs text-gray-400">Track your progress</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <main>
          <Dashboard />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
