import React, { useState, useEffect } from 'react';
import { fetchAnnouncements, createAnnouncement, deleteAnnouncement } from '../../api/client';
import { Bell, Calendar, Plus, Edit2, Trash2, X } from 'lucide-react';

export default function NoticeBoard() {
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });

  const loadAnnouncements = () => {
    fetchAnnouncements().then(setAnnouncements).catch(console.error);
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAnnouncement({
        title: formData.title,
        content: formData.content,
        date: new Date().toISOString().split('T')[0]
      });
      setShowModal(false);
      setFormData({ title: '', content: '' });
      loadAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await deleteAnnouncement(id);
        loadAnnouncements();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="fade-in max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#462F2D] dark:text-white">Notice Board</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-[#462F2D] hover:bg-[#342220] text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Post Notice</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {announcements.map(notice => (
          <div key={notice.id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-[#EBE0C8] dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-3">
                <div className="bg-[#F5EEDC] dark:bg-gray-800 p-2 rounded-xl text-[#935F53] dark:text-indigo-400">
                  <Bell className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-[#462F2D] dark:text-white">{notice.title}</h3>
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleDelete(notice.id)}
                  className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-red-600 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-[#735A52] dark:text-gray-400 mb-4 ml-12">{notice.content}</p>
            <div className="flex items-center text-xs font-bold text-[#935F53] dark:text-indigo-400 ml-12">
              <Calendar className="h-4 w-4 mr-1.5" />
              <span>Posted on: {new Date(notice.date).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        {announcements.length === 0 && (
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-[#EBE0C8] dark:border-gray-800 text-center text-[#735A52] dark:text-gray-400">
            No notices published yet.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-[#EBE0C8] dark:border-gray-800">
            <div className="flex justify-between items-center p-6 border-b border-[#EBE0C8] dark:border-gray-800">
              <h3 className="text-xl font-bold text-[#462F2D] dark:text-white">Post New Notice</h3>
              <button onClick={() => setShowModal(false)} className="text-[#735A52] dark:text-gray-400 hover:text-[#462F2D] dark:hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#935F53] dark:text-gray-400 uppercase tracking-wider mb-2">Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-[#FDF8F5] dark:bg-gray-800 border border-[#EBE0C8] dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#462F2D] dark:text-white"
                  placeholder="e.g. Mid-term Exam Schedule"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#935F53] dark:text-gray-400 uppercase tracking-wider mb-2">Content</label>
                <textarea 
                  required
                  rows="4"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full px-4 py-3 bg-[#FDF8F5] dark:bg-gray-800 border border-[#EBE0C8] dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#462F2D] dark:text-white resize-none"
                  placeholder="Type your notice here..."
                ></textarea>
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-[#735A52] dark:text-gray-300 hover:bg-[#F5EEDC] dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#462F2D] hover:bg-[#342220] text-white transition-colors shadow-md"
                >
                  Post Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
