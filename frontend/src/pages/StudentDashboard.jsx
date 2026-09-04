import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchAttendance, fetchMarks, fetchAssignments } from '../api/client';
import { LogOut, User as UserIcon, Book, CheckSquare } from 'lucide-react';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    if (user) {
      Promise.all([
        fetchAttendance(user.id),
        fetchMarks(user.id),
        fetchAssignments()
      ]).then(([attData, marksData, assignmentsData]) => {
        setAttendance(attData);
        setMarks(marksData);
        setAssignments(assignmentsData);
      }).catch(console.error);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Book className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">CMS</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <img src={user.avatar} alt="avatar" className="h-8 w-8 rounded-full mr-2" />
                <span className="font-medium">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
              <UserIcon className="h-5 w-5 mr-2 text-indigo-500" /> Attendance
            </h3>
            <div className="space-y-3">
              {attendance.map(a => (
                <div key={a.id} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{a.subject.name}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {Math.round((a.attended / a.total) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
              <Book className="h-5 w-5 mr-2 text-indigo-500" /> Marks (Out of 200)
            </h3>
            <div className="space-y-3">
              {marks.map(m => (
                <div key={m.id} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{m.subject.name}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {m.total}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
              <CheckSquare className="h-5 w-5 mr-2 text-indigo-500" /> Assignments
            </h3>
            <div className="space-y-3">
              {assignments.map(a => (
                <div key={a.id} className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{a.title}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{a.subject.name}</span>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${a.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
