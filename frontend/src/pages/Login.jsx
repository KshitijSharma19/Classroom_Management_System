import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GraduationCap, Moon, UserCheck, Users, ShieldAlert } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Assuming backend runs on 8000
      const response = await axios.post('http://127.0.0.1:8000/login', null, {
        params: { email, password }
      });
      
      const user = response.data.user;
      
      if (user.role === role) {
        // Save token or user info securely (mocking localstorage for now)
        localStorage.setItem('user', JSON.stringify(user));
        
        // Navigate
        if (role === 'student') navigate('/student');
        if (role === 'teacher') navigate('/teacher');
        if (role === 'admin') navigate('/admin');
      } else {
        alert("Role mismatch. Please select the correct role.");
      }
    } catch (error) {
      alert("Invalid credentials!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6">
      
      <button className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-bg-surface hover:text-text-primary transition-colors border border-transparent hover:border-border">
        <Moon size={20} />
      </button>

      <div className="w-full max-w-4xl z-10 flex flex-col md:flex-row gap-12 items-center">
        
        {/* Left Side: Branding */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-white mb-6 shadow-sm">
            <GraduationCap size={28} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            EduTech
          </h1>
          <p className="text-lg text-text-secondary mb-8 leading-relaxed max-w-sm mx-auto md:mx-0">
            A streamlined platform for students, teachers and administrators to manage classroom activities.
          </p>
        </div>

        {/* Right Side: Login Panel */}
        <div className="w-full md:w-1/2 bg-bg-surface rounded-2xl p-8 border border-border shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Sign in</h2>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <button
              onClick={() => handleRoleSelect('student')}
              className={`flex flex-col items-center justify-center gap-2 py-3 rounded-lg border transition-colors ${role === 'student' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-bg-primary text-text-secondary hover:border-text-secondary'}`}
            >
              <Users size={20} />
              <span className="font-medium text-sm">Student</span>
            </button>
            <button
              onClick={() => handleRoleSelect('teacher')}
              className={`flex flex-col items-center justify-center gap-2 py-3 rounded-lg border transition-colors ${role === 'teacher' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-bg-primary text-text-secondary hover:border-text-secondary'}`}
            >
              <UserCheck size={20} />
              <span className="font-medium text-sm">Teacher</span>
            </button>
            <button
              onClick={() => handleRoleSelect('admin')}
              className={`flex flex-col items-center justify-center gap-2 py-3 rounded-lg border transition-colors ${role === 'admin' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-bg-primary text-text-secondary hover:border-text-secondary'}`}
            >
              <ShieldAlert size={20} />
              <span className="font-medium text-sm">Admin</span>
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                placeholder="student@school.com" 
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-text-primary">Password</label>
                <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                placeholder="••••••••" 
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors flex justify-center items-center gap-2 text-sm shadow-sm"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
