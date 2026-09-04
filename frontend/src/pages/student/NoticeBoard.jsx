import React, { useEffect, useState } from 'react';
import { fetchAnnouncements } from '../../api/client';
import { Megaphone, Calendar, Search } from 'lucide-react';

export default function NoticeBoard() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements().then(setAnnouncements).catch(console.error);
  }, []);

  const colors = [
    'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50',
    'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50',
    'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50',
    'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50'
  ];

  return (
    <div className="fade-in max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-[#462F2D] dark:text-white">Notice Board</h2>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#735A52] dark:text-gray-400" />
          <input 
            type="text" 
            placeholder="Search notices..." 
            className="pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE0C8] dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#935F53] w-full sm:w-72 shadow-sm text-[#462F2D] dark:text-white"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {announcements.map((a, i) => {
          const colorClass = colors[i % colors.length];
          const primaryColor = colorClass.split(' ')[0].replace('text-', '');
          
          return (
            <div key={a.id} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-[#EBE0C8] dark:border-gray-800 shadow-sm hover:shadow-md transition-all flex flex-col relative overflow-hidden group cursor-pointer">
              {/* Top Accent line */}
              <div className={`absolute left-0 top-0 right-0 h-1 bg-${primaryColor} opacity-80 group-hover:h-2 transition-all`}></div>
              
              <div className="flex items-center gap-4 mb-4 mt-2">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border ${colorClass}`}>
                  <Megaphone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold text-[#462F2D] dark:text-white transition-colors leading-tight`}>{a.title}</h3>
                  <span className="text-xs font-bold text-[#735A52] dark:text-gray-400 mt-1 flex items-center">
                    <Calendar className="h-3 w-3 mr-1 text-[#935F53] dark:text-indigo-400" /> {new Date(a.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <p className="text-[#735A52] dark:text-gray-400 text-sm leading-relaxed flex-1">{a.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
