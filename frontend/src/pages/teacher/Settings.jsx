import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile } from '../../api/client';
import { Settings as SettingsIcon, Save, Camera, Shield, Mail, Phone, MapPin, Building, Briefcase } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(user?.avatar || null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    phone: '+1 (555) 000-0000',
    address: '123 Faculty Quarters, Campus',
    bio: 'Associate Professor, Department of Computer Science. Research interests include Distributed Systems and Web Technologies.'
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  const handleSave = async () => {
    try {
      await updateUserProfile(user.id, {
        phone: formData.phone,
        address: formData.address,
        avatar: profilePic
      });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fade-in max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#462F2D] dark:text-white flex items-center">
          <SettingsIcon className="h-6 w-6 mr-2 text-[#935F53] dark:text-gray-400" />
          Profile & Settings
        </h2>
        {isEditing ? (
          <button 
            onClick={handleSave}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 bg-[#462F2D] hover:bg-[#342220] text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-[#EBE0C8] dark:border-gray-800 shadow-sm p-6 mb-6 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#462F2D] to-[#935F53] opacity-20 dark:opacity-10"></div>
        
        <div className="relative z-10 group">
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="h-28 w-28 rounded-2xl object-cover border-4 border-white dark:border-gray-900 shadow-md" />
          ) : (
            <div className="h-28 w-28 rounded-2xl bg-[#462F2D] text-white flex items-center justify-center text-4xl font-bold border-4 border-white dark:border-gray-900 shadow-md">
              {user?.name?.[0] || 'T'}
            </div>
          )}
          
          {isEditing && (
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-3 -right-3 p-2.5 bg-white dark:bg-gray-800 border border-[#EBE0C8] dark:border-gray-700 rounded-xl shadow-lg text-[#935F53] dark:text-gray-300 hover:text-[#462F2D] dark:hover:text-white transition-colors z-20"
            >
              <Camera className="h-5 w-5" />
            </button>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
        
        <div className="flex-1 text-center sm:text-left z-10 pt-2">
          <h3 className="text-2xl font-bold text-[#462F2D] dark:text-white mb-1">{user?.name || 'Teacher Name'}</h3>
          <p className="text-sm font-bold text-[#935F53] dark:text-indigo-400 mb-3 uppercase tracking-wider">{user?.role || 'Teacher'}</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            <span className="px-3 py-1 bg-[#FDF8F5] dark:bg-gray-800 border border-[#EBE0C8] dark:border-gray-700 rounded-lg text-xs font-bold text-[#735A52] dark:text-gray-400 flex items-center">
              <Briefcase className="h-3.5 w-3.5 mr-1.5" /> Associate Professor
            </span>
            <span className="px-3 py-1 bg-[#FDF8F5] dark:bg-gray-800 border border-[#EBE0C8] dark:border-gray-700 rounded-lg text-xs font-bold text-[#735A52] dark:text-gray-400 flex items-center">
              <Building className="h-3.5 w-3.5 mr-1.5" /> Computer Science
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Read-Only Confidential Information */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-[#EBE0C8] dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="bg-[#FDF8F5] dark:bg-gray-800/50 px-6 py-4 border-b border-[#EBE0C8] dark:border-gray-800 flex items-center justify-between">
            <h4 className="font-bold text-[#462F2D] dark:text-white flex items-center">
              <Shield className="h-4 w-4 mr-2 text-[#935F53] dark:text-gray-400" />
              Institutional Records
            </h4>
            <span className="text-[10px] font-bold tracking-widest text-[#935F53] uppercase px-2 py-1 bg-[#F5EEDC] dark:bg-gray-800 rounded-md">Locked</span>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#935F53] dark:text-gray-500 uppercase tracking-wider mb-1">Full Legal Name</label>
              <div className="text-sm font-bold text-[#462F2D] dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">{user?.name || 'Teacher Name'}</div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#935F53] dark:text-gray-500 uppercase tracking-wider mb-1">Employee ID</label>
              <div className="text-sm font-bold text-[#462F2D] dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">FAC-2023-089</div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#935F53] dark:text-gray-500 uppercase tracking-wider mb-1">Department</label>
              <div className="text-sm font-bold text-[#462F2D] dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">Computer Science & Engineering</div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#935F53] dark:text-gray-500 uppercase tracking-wider mb-1">Institutional Email</label>
              <div className="text-sm font-bold text-[#462F2D] dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                {user?.email || 'teacher@school.com'}
              </div>
            </div>
          </div>
        </div>

        {/* Editable Contact Information */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-[#EBE0C8] dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="bg-[#FDF8F5] dark:bg-gray-800/50 px-6 py-4 border-b border-[#EBE0C8] dark:border-gray-800">
            <h4 className="font-bold text-[#462F2D] dark:text-white flex items-center">
              Personal Information
            </h4>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#935F53] dark:text-gray-500 uppercase tracking-wider mb-1">Contact Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-semibold transition-colors
                    ${isEditing 
                      ? 'bg-white dark:bg-gray-800 border-2 border-[#935F53] dark:border-indigo-500 text-[#462F2D] dark:text-white focus:outline-none' 
                      : 'bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 text-[#462F2D] dark:text-gray-300 cursor-not-allowed'
                    }
                  `}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-[#935F53] dark:text-gray-500 uppercase tracking-wider mb-1">Residential Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
                <textarea 
                  disabled={!isEditing}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows="2"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-semibold transition-colors resize-none
                    ${isEditing 
                      ? 'bg-white dark:bg-gray-800 border-2 border-[#935F53] dark:border-indigo-500 text-[#462F2D] dark:text-white focus:outline-none' 
                      : 'bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 text-[#462F2D] dark:text-gray-300 cursor-not-allowed'
                    }
                  `}
                ></textarea>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#935F53] dark:text-gray-500 uppercase tracking-wider mb-1">Professional Bio</label>
              <textarea 
                disabled={!isEditing}
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                rows="3"
                className={`w-full p-3 rounded-xl text-sm font-semibold transition-colors resize-none
                  ${isEditing 
                    ? 'bg-white dark:bg-gray-800 border-2 border-[#935F53] dark:border-indigo-500 text-[#462F2D] dark:text-white focus:outline-none' 
                    : 'bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 text-[#462F2D] dark:text-gray-300 cursor-not-allowed'
                  }
                `}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
