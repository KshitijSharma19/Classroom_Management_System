import React from 'react';
import { Moon, Sun, Bell } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header = ({ title, user }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="h-20 bg-bg-surface border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-text-secondary">Welcome back, {user?.name || 'Student'}</p>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-bg-primary hover:text-text-primary transition-colors border border-transparent hover:border-border"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-bg-primary hover:text-text-primary transition-colors border border-transparent hover:border-border relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger"></span>
        </button>
        
        <div className="w-px h-8 bg-border mx-2"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium">{user?.name || 'Student'}</p>
            <p className="text-xs text-text-secondary capitalize">{user?.role || 'student'}</p>
          </div>
          <img 
            src={user?.avatar || "https://ui-avatars.com/api/?name=Student"} 
            alt="Profile" 
            className="w-10 h-10 rounded-lg shadow-sm border border-border"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
