
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, User } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ProjectHub
            </h1>
            <div className="hidden md:flex space-x-1">
              <Button
                variant={currentPage === 'projects' ? 'default' : 'ghost'}
                onClick={() => onNavigate('projects')}
                className={currentPage === 'projects' ? 'bg-blue-600' : ''}
              >
                Projects
              </Button>
              {user?.role === 'admin' && (
                <Button
                  variant={currentPage === 'admin' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('admin')}
                  className={currentPage === 'admin' ? 'bg-blue-600' : ''}
                >
                  Admin Dashboard
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="bg-white/20 dark:bg-gray-700/20"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{user?.name}</span>
            </div>
            
            <Button variant="outline" onClick={logout} className="bg-white/20 dark:bg-gray-700/20">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
