import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Eye, BookOpen, User as UserIcon, Shield, Moon, Sun, ArrowRight, Check } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('Student');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleAutofill = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'Student') {
      setEmail('student@school.com');
      setPassword('password');
    } else if (selectedRole === 'Teacher') {
      setEmail('teacher@school.com');
      setPassword('password');
    } else if (selectedRole === 'Admin') {
      setEmail('admin@school.com');
      setPassword('password');
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.role === 'student') navigate('/student');
      else if (user.role === 'teacher') navigate('/teacher');
      else if (user.role === 'admin') navigate('/admin');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#FDF8F5] dark:bg-gray-950 transition-colors duration-300 font-sans`}>
      {/* Top Navbar */}
      <div className="flex justify-between items-center p-6 lg:px-12">
        <div className="flex items-center space-x-3">
          <div className="bg-[#462F2D] dark:bg-gray-800 p-2 rounded-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-[#462F2D] dark:text-gray-100">Athenaeum Scholar</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 bg-[#F4ECD8] dark:bg-gray-800 px-3 py-1.5 rounded-full text-xs font-bold text-[#462F2D] dark:text-gray-300 tracking-wider">
            <Shield className="h-3.5 w-3.5" />
            <span>ENCRYPTED PORTAL</span>
          </div>
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-[#F4ECD8] dark:bg-gray-800 text-[#462F2D] dark:text-gray-300 hover:bg-[#EBE0C8] dark:hover:bg-gray-700 transition-colors"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden border border-gray-200 dark:border-gray-800">
          
          {/* Left Panel */}
          <div className="w-full md:w-1/2 bg-[#F5EEDC] dark:bg-gray-800 p-8 lg:p-12 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-8">
                <div className="bg-[#462F2D] p-3 rounded-xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-[#935F53] uppercase">Edutech Workspace</p>
                  <p className="text-lg font-bold text-[#462F2D] dark:text-white">Athenaeum Scholar</p>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-[#462F2D] dark:text-white mb-4">Welcome back</h1>
              <p className="text-sm text-[#735A52] dark:text-gray-300 mb-8 leading-relaxed max-w-sm">
                Sign in to access your unified academic portal, syllabus repository, and research archives.
              </p>

              <div className="mb-4">
                <p className="text-xs font-bold tracking-wider text-[#935F53] uppercase mb-3">Select Academic Role</p>
                <div className="flex space-x-2 bg-[#EAE2CE] dark:bg-gray-700 p-1.5 rounded-xl">
                  {['Student', 'Teacher', 'Admin'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                        role === r 
                          ? 'bg-[#462F2D] text-white shadow-md' 
                          : 'text-[#735A52] dark:text-gray-300 hover:bg-[#DED5C1] dark:hover:bg-gray-600'
                      }`}
                    >
                      {r === 'Student' && <GraduationCap className="h-4 w-4" />}
                      {r === 'Teacher' && <UserIcon className="h-4 w-4" />}
                      {r === 'Admin' && <Shield className="h-4 w-4" />}
                      <span>{r}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 bg-[#F0E6CE] dark:bg-gray-700/50 rounded-xl p-5 border border-[#EBE0C8] dark:border-gray-600">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-[#735A52] dark:text-gray-300">Instant Sandbox Presets:</span>
                <div className="flex items-center space-x-1.5 text-xs font-bold text-[#935F53] dark:text-red-400">
                  <span className="h-2 w-2 rounded-full bg-[#935F53] dark:bg-red-400 animate-pulse"></span>
                  <span>Ready to autofill</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => handleAutofill('Student')}
                  className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-3 rounded-lg border border-transparent hover:border-[#462F2D] transition-colors"
                >
                  <span className="text-sm font-bold text-[#462F2D] dark:text-white">Alex</span>
                  <span className="text-[10px] text-[#735A52] dark:text-gray-400">(Student)</span>
                </button>
                <button 
                  onClick={() => handleAutofill('Teacher')}
                  className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-3 rounded-lg border border-transparent hover:border-[#462F2D] transition-colors"
                >
                  <span className="text-sm font-bold text-[#462F2D] dark:text-white">Sarah</span>
                  <span className="text-[10px] text-[#735A52] dark:text-gray-400">(Teacher)</span>
                </button>
                <button 
                  onClick={() => handleAutofill('Admin')}
                  className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-3 rounded-lg border border-transparent hover:border-[#462F2D] transition-colors"
                >
                  <span className="text-sm font-bold text-[#462F2D] dark:text-white">Dr. Vance</span>
                  <span className="text-[10px] text-[#735A52] dark:text-gray-400">(Admin)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-[#462F2D] dark:text-white mb-2">Sign in with credentials</h2>
            <p className="text-sm text-[#735A52] dark:text-gray-400 mb-8">Enter your institutional details to proceed</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#462F2D] dark:text-gray-300">Institutional Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#935F53] dark:text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-[#FDF8F5] dark:bg-gray-800 border border-[#EBE0C8] dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#462F2D] dark:focus:ring-gray-500 transition-shadow dark:text-white"
                    placeholder="e.g. sarah.miller@lincoln.edu"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-[#462F2D] dark:text-gray-300">Security Password</label>
                  <a href="#" className="text-xs text-[#935F53] dark:text-indigo-400 hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#935F53] dark:text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 bg-[#FDF8F5] dark:bg-gray-800 border border-[#EBE0C8] dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#462F2D] dark:focus:ring-gray-500 transition-shadow tracking-widest dark:text-white"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#935F53] dark:text-gray-400 hover:text-[#462F2D]"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <div className="relative flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 rounded border-gray-300 text-[#462F2D] focus:ring-[#462F2D] dark:bg-gray-800 dark:border-gray-700 accent-[#462F2D]"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="font-medium text-[#735A52] dark:text-gray-300">
                      Remember credentials
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-4 px-4 bg-[#462F2D] hover:bg-[#342220] text-white rounded-xl text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#462F2D] dark:focus:ring-offset-gray-900"
              >
                <span>Sign In as {role}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
