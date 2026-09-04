import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  GraduationCap, Home, BookOpen, CheckSquare, 
  Star, Bell, Settings, LogOut, Menu, X, 
  Search, Sun, Moon, Shield
} from 'lucide-react';

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/student', icon: Home, end: true },
    { name: 'My Courses', path: '/student/courses', icon: BookOpen },
    { name: 'Assignments', path: '/student/assignments', icon: CheckSquare },
    { name: 'Grades', path: '/student/grades', icon: Star },
    { name: 'Notice Board', path: '/student/notices', icon: Bell },
  ];

  return (
    <div className="flex h-screen bg-[#FDF8F5] dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#F5EEDC] dark:bg-gray-900 border-r border-[#EBE0C8] dark:border-gray-800 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-[#EBE0C8] dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-[#462F2D] p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-[#462F2D] dark:text-white">Athenaeum</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-[#735A52] dark:text-gray-400">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <div className="text-xs font-bold tracking-wider text-[#935F53] uppercase mb-4 px-2">Overview</div>
          
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                ${isActive 
                  ? 'bg-[#462F2D] text-white shadow-md' 
                  : 'text-[#735A52] dark:text-gray-400 hover:bg-[#EAE2CE] dark:hover:bg-gray-800'}
              `}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}

          <div className="mt-8 mb-4 px-2 h-px bg-[#EBE0C8] dark:bg-gray-800"></div>

          <NavLink
            to="/student/settings"
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) => `
              flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
              ${isActive 
                ? 'bg-[#462F2D] text-white shadow-md' 
                : 'text-[#735A52] dark:text-gray-400 hover:bg-[#EAE2CE] dark:hover:bg-gray-800'}
            `}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-[#EBE0C8] dark:border-gray-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Navbar */}
        <header className="h-20 bg-[#FDF8F5]/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-[#EBE0C8] dark:border-gray-800 flex items-center justify-between px-4 sm:px-8 z-30">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#462F2D] dark:text-gray-300 hover:bg-[#F5EEDC] dark:hover:bg-gray-800 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden md:flex flex-col">
              <span className="font-bold text-[#462F2D] dark:text-white">Dashboard</span>
              <span className="text-xs text-[#735A52] dark:text-gray-400">Welcome back, {user?.name}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-6">
            <div className="hidden sm:flex items-center space-x-2 bg-[#F5EEDC] dark:bg-gray-900 px-3 py-1.5 rounded-full text-xs font-bold text-[#462F2D] dark:text-gray-300 tracking-wider border border-[#EBE0C8] dark:border-gray-700">
              <Shield className="h-3.5 w-3.5" />
              <span>ENCRYPTED</span>
            </div>
            
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-[#F5EEDC] dark:bg-gray-900 text-[#462F2D] dark:text-gray-300 hover:bg-[#EAE2CE] dark:hover:bg-gray-800 transition-colors border border-[#EBE0C8] dark:border-gray-700"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full bg-[#F5EEDC] dark:bg-gray-900 text-[#462F2D] dark:text-gray-300 hover:bg-[#EAE2CE] dark:hover:bg-gray-800 transition-colors border border-[#EBE0C8] dark:border-gray-700"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#FDF8F5] dark:border-gray-950"></span>
              </button>
              
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 border border-[#EBE0C8] dark:border-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-[#EBE0C8] dark:border-gray-800 font-bold text-[#462F2D] dark:text-white">Notifications</div>
                    <div className="p-4 border-b border-[#EBE0C8] dark:border-gray-800">
                      <p className="text-sm font-bold text-[#462F2D] dark:text-white mb-1">Mid-Sem Exams Scheduled</p>
                      <p className="text-xs text-[#735A52] dark:text-gray-400">Exams will start from next week.</p>
                    </div>
                    <div className="p-4 border-b border-[#EBE0C8] dark:border-gray-800">
                      <p className="text-sm font-bold text-[#462F2D] dark:text-white mb-1">Holiday on Friday</p>
                      <p className="text-xs text-[#735A52] dark:text-gray-400">College will remain closed.</p>
                    </div>
                    <button onClick={() => { setShowNotifications(false); navigate('/student/notices'); }} className="w-full p-3 text-sm font-bold text-[#935F53] dark:text-indigo-400 hover:bg-[#F5EEDC] dark:hover:bg-gray-800 transition-colors">
                      View all notices
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="h-8 w-px bg-[#EBE0C8] dark:bg-gray-800 hidden sm:block"></div>

            <div className="relative">
              <div 
                className="flex items-center space-x-3 cursor-pointer group"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Profile" 
                    className="h-10 w-10 rounded-full object-cover border-2 border-[#EBE0C8] dark:border-gray-700 group-hover:border-[#462F2D] dark:group-hover:border-gray-500 transition-colors"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-[#462F2D] text-white flex items-center justify-center font-bold border-2 border-[#EBE0C8] dark:border-gray-700 group-hover:border-[#462F2D] dark:group-hover:border-gray-500 transition-colors">
                    {user?.name?.[0] || 'S'}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold text-[#462F2D] dark:text-white leading-tight">{user?.name || 'Student'}</p>
                  <p className="text-xs text-[#735A52] dark:text-gray-400 capitalize">{user?.role || 'Student'}</p>
                </div>
              </div>
              
              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-[#EBE0C8] dark:border-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden">
                    <button onClick={() => { setShowProfileMenu(false); navigate('/student/settings'); }} className="w-full px-4 py-3 text-left flex items-center space-x-3 text-sm font-bold text-[#735A52] dark:text-gray-300 hover:bg-[#F5EEDC] dark:hover:bg-gray-800 transition-colors border-b border-[#EBE0C8] dark:border-gray-800">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    <button onClick={handleLogout} className="w-full px-4 py-3 text-left flex items-center space-x-3 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
