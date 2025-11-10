import { Link, useLocation } from 'react-router-dom';
import { Home, List, BarChart3, Target, BookOpen } from 'lucide-react';

export const MobileBottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/swims', icon: List, label: 'Swims' },
    { path: '/insight', icon: BarChart3, label: 'Insight' },
    { path: '/train', icon: Target, label: 'Train' },
    { path: '/learn', icon: BookOpen, label: 'Learn' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-dark-card/95 backdrop-blur-sm border-t border-dark-border">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                active
                  ? 'bg-primary-500/20 text-primary-400'
                  : 'text-content-tertiary hover:text-content-secondary'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
