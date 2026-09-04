import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile } from '../../api/client';
import { Save, User, Mail, Shield } from 'lucide-react';

export default function Settings() {
  const { user, login } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Admin settings are simpler, mostly just viewing profile for now
  const [formData, setFormData] = useState({
    name: user?.name || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);
    
    try {
      const updatedUser = await updateUserProfile(user.id, {
        name: formData.name
      });
      // The backend doesn't support changing email easily without cascading auth issues
      
      // Update local storage slightly manually to reflect name change if we want
      const session = JSON.parse(localStorage.getItem('user'));
      if(session) {
         session.name = updatedUser.name;
         localStorage.setItem('user', JSON.stringify(session));
      }
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fade-in max-w-4xl mx-auto pb-12">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">System Preferences</h2>
      
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
        <div className="bg-indigo-600 px-8 py-6 text-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold flex items-center"><Shield className="mr-2 h-6 w-6"/> Administrator Profile</h3>
            <p className="text-indigo-100 text-sm mt-1">Superuser privileges active.</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6 max-w-xl">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Display Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address (Immutable)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="email" 
                  value={user?.email}
                  disabled
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <button 
                type="submit" 
                disabled={isSaving}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? 'Saving...' : 'Save Preferences'}</span>
              </button>
              
              {success && (
                <p className="mt-3 text-sm font-bold text-emerald-600 dark:text-emerald-400 fade-in">
                  Preferences updated successfully!
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
