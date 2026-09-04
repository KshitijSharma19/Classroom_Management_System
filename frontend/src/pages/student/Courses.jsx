import React from 'react';
import { Book, User as UserIcon, Clock } from 'lucide-react';

export default function Courses() {
  const courses = [
    { id: 'CS201', name: 'Data Structures', prof: 'Dr. Alan Turing', progress: 75, nextClass: 'Tomorrow, 10:00 AM' },
    { id: 'CS301', name: 'Web Development', prof: 'Dr. Ada Lovelace', progress: 90, nextClass: 'Today, 2:00 PM' },
    { id: 'CS401', name: 'Database Management', prof: 'Dr. E.F. Codd', progress: 40, nextClass: 'Wednesday, 11:30 AM' },
    { id: 'CS501', name: 'Machine Learning', prof: 'Dr. Geoffrey Hinton', progress: 60, nextClass: 'Thursday, 9:00 AM' }
  ];

  return (
    <div className="fade-in max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-[#462F2D] dark:text-white mb-6">My Courses</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-[#EBE0C8] dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow flex flex-col group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-[#F5EEDC] dark:bg-gray-800 text-[#935F53] dark:text-indigo-400 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-[#462F2D] group-hover:text-white transition-colors">
                <Book className="h-6 w-6" />
              </div>
              <span className="px-2.5 py-1 bg-[#FDF8F5] dark:bg-gray-800 border border-[#EBE0C8] dark:border-gray-700 text-xs font-bold rounded-lg text-[#735A52] dark:text-gray-400 uppercase tracking-wider">
                {course.id}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-[#462F2D] dark:text-white mb-2">{course.name}</h3>
            <div className="flex items-center text-sm text-[#735A52] dark:text-gray-400 mb-6">
              <UserIcon className="h-4 w-4 mr-2" />
              <span>{course.prof}</span>
            </div>
            
            <div className="mt-auto">
              <div className="flex justify-between text-xs font-bold text-[#735A52] dark:text-gray-400 mb-2 uppercase tracking-wide">
                <span>Syllabus Progress</span>
                <span>{course.progress}%</span>
              </div>
              <div className="w-full bg-[#EBE0C8] dark:bg-gray-800 rounded-full h-2 mb-4">
                <div className="bg-[#935F53] dark:bg-indigo-500 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
              </div>
              
              <div className="p-3 bg-[#FDF8F5] dark:bg-gray-800/50 border border-[#EBE0C8] dark:border-gray-700 rounded-xl text-sm font-medium flex justify-between items-center">
                <div className="flex items-center text-[#735A52] dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Next Class</span>
                </div>
                <span className="text-[#935F53] dark:text-indigo-400 font-bold">{course.nextClass}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
