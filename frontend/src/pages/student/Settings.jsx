import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { updateUserProfile } from '../../api/client';
import { Camera, User as UserIcon, Moon, Save, LogOut } from 'lucide-react';

export default function Settings() {
  const { user, login } = useAuth(); // Assuming login updates the context state if we pass updated user.
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+1 987 654 3210',
    dob: user?.dob || '2002-05-15',
    address: user?.address || '123 Campus Drive, Apt 4B, University City, State 12345',
    avatar: user?.avatar || '',
    father_name: user?.father_name || 'Mr. John Doe Sr.',
    roll_no: 'STU-2023-' + (user?.id || 1).toString().padStart(4, '0')
  });
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updatedUser = await updateUserProfile(user.id, {
        name: formData.name,
        phone: formData.phone,
        dob: formData.dob,
        address: formData.address,
        avatar: formData.avatar
      });
      // Optionally update auth context if login can take user object, otherwise force reload or update local storage.
      alert('Profile updated successfully!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fade-in max-w-5xl mx-auto p-4 sm:p-8">
      <h2 className="text-2xl font-bold text-[#462F2D] dark:text-white mb-6">Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (Avatar & Preferences) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Avatar Card */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-[#EBE0C8] dark:border-gray-800 shadow-sm p-8 text-center flex flex-col items-center">
            <div className="relative mb-4">
              {formData.avatar ? (
                <img 
                  src={formData.avatar} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#1e88e5] text-white flex items-center justify-center text-3xl font-bold border-2 border-white shadow-sm">
                  {formData.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
              
              <button 
                onClick={() => fileInputRef.current.click()}
                className="absolute -bottom-2 -left-2 bg-[#935F53] text-white p-2 rounded-full shadow-md hover:bg-[#735A52] transition-colors border-2 border-white"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
              />
            </div>
            
            <h3 className="text-xl font-bold text-[#462F2D] dark:text-white">{formData.name}</h3>
            <p className="text-sm text-[#735A52] dark:text-gray-400 mb-6">{formData.email}</p>
            
            <div className="flex gap-2">
              <span className="px-4 py-1.5 bg-transparent text-[#462F2D] dark:text-gray-300 rounded-lg text-sm font-bold border border-[#462F2D] dark:border-gray-600 capitalize">
                {user?.role || 'Student'}
              </span>
              <span className="px-4 py-1.5 bg-[#FDF8F5] dark:bg-gray-800 text-[#735A52] dark:text-gray-400 rounded-lg text-sm font-bold border border-[#EBE0C8] dark:border-gray-700">
                STU-2023-{(user?.id || 1).toString().padStart(4, '0')}
              </span>
            </div>
          </div>
          
          {/* Preferences Card */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-[#EBE0C8] dark:border-gray-800 shadow-sm p-6">
            <h4 className="font-bold text-[#462F2D] dark:text-white mb-4">App Preferences</h4>
            
            <div className="flex items-center justify-between p-4 bg-[#FDF8F5] dark:bg-gray-800 rounded-2xl border border-[#EBE0C8] dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#462F2D] text-white flex items-center justify-center">
                  <Moon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#462F2D] dark:text-white">Dark Mode</p>
                  <p className="text-xs text-[#735A52] dark:text-gray-400">Toggle app theme</p>
                </div>
              </div>
              
              <button 
                onClick={toggleDarkMode}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isDarkMode ? 'bg-[#935F53]' : 'bg-[#EBE0C8]'}`}
              >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : ''}`}></div>
              </button>
            </div>
          </div>
          
        </div>
        
        {/* Right Column (Form) */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-[#EBE0C8] dark:border-gray-800 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-8 flex-1">
              <h3 className="text-lg font-bold text-[#462F2D] dark:text-white mb-8 flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-[#935F53]" /> Personal Information
              </h3>
              
              <form id="profile-form" onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#462F2D] dark:text-gray-300 mb-2">Full Name <span className="text-xs font-normal text-red-500">(Confidential)</span></label>
                    <input 
                      type="text" 
                      value={formData.name}
                      className="w-full px-4 py-3 rounded-xl border border-[#EBE0C8] dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 text-gray-500 cursor-not-allowed shadow-sm focus:outline-none" 
                      readOnly disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#462F2D] dark:text-gray-300 mb-2">Email Address <span className="text-xs font-normal text-red-500">(Confidential)</span></label>
                    <input 
                      type="email" 
                      value={formData.email}
                      className="w-full px-4 py-3 rounded-xl border border-[#EBE0C8] dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 text-gray-500 cursor-not-allowed shadow-sm focus:outline-none" 
                      readOnly disabled 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#462F2D] dark:text-gray-300 mb-2">Father's Name <span className="text-xs font-normal text-red-500">(Confidential)</span></label>
                    <input 
                      type="text" 
                      value={formData.father_name}
                      className="w-full px-4 py-3 rounded-xl border border-[#EBE0C8] dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 text-gray-500 cursor-not-allowed shadow-sm focus:outline-none" 
                      readOnly disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#462F2D] dark:text-gray-300 mb-2">Roll Number <span className="text-xs font-normal text-red-500">(Confidential)</span></label>
                    <input 
                      type="text" 
                      value={formData.roll_no}
                      className="w-full px-4 py-3 rounded-xl border border-[#EBE0C8] dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 text-gray-500 cursor-not-allowed shadow-sm focus:outline-none" 
                      readOnly disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#462F2D] dark:text-gray-300 mb-2">Phone Number</label>
                    <input 
                      type="text" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-[#EBE0C8] dark:border-gray-700 bg-[#FDF8F5] dark:bg-gray-800 text-[#462F2D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#935F53] shadow-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#462F2D] dark:text-gray-300 mb-2">Date of Birth</label>
                    <input 
                      type="date" 
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-[#EBE0C8] dark:border-gray-700 bg-[#FDF8F5] dark:bg-gray-800 text-[#462F2D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#935F53] shadow-sm" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#462F2D] dark:text-gray-300 mb-2">Home Address</label>
                    <textarea 
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-[#EBE0C8] dark:border-gray-700 bg-[#FDF8F5] dark:bg-gray-800 text-[#462F2D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#935F53] shadow-sm" 
                      rows="3" 
                    />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="px-8 py-5 bg-[#FDF8F5] dark:bg-gray-800/50 border-t border-[#EBE0C8] dark:border-gray-700">
              <button 
                type="submit" 
                form="profile-form"
                disabled={isSaving}
                className="px-6 py-2.5 bg-[#462F2D] text-white rounded-xl hover:bg-[#342220] transition-colors text-sm font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
