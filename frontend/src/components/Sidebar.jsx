import React from 'react';
import { NavLink } from 'react-router-dom';
import { GraduationCap, LogOut, Home, BookOpen, Calendar, CheckSquare, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ menuItems }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="w-64 bg-bg-surface border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3 border-b border-border">
        <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center">
          <GraduationCap size={24} />
        </div>
        <h2 className="text-xl font-bold tracking-tight">EduTech</h2>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => item.onClick(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${item.active ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-bg-primary hover:text-text-primary'}`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-danger hover:bg-danger/10 transition-colors text-sm font-medium"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
