import React, { useEffect, useState } from 'react';
import { fetchUsers, fetchSubjects, fetchAnnouncements } from '../../api/client';
import { Users, BookOpen, GraduationCap, TrendingUp, Bell } from 'lucide-react';

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    subjects: 0
  });
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [users, subjectsData, announcementsData] = await Promise.all([
          fetchUsers(),
          fetchSubjects(),
          fetchAnnouncements()
        ]);
        
        setStats({
          students: users.filter(u => u.role === 'student').length,
          teachers: users.filter(u => u.role === 'teacher').length,
          subjects: subjectsData.length
        });
        
        setAnnouncements(announcementsData.slice(0, 3)); // Latest 3
      } catch (err) {
        console.error(err);
      }
    };
    loadStats();
  }, []);

  const statCards = [
    { title: 'Total Students', value: stats.students, icon: GraduationCap, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { title: 'Total Teachers', value: stats.teachers, icon: Users, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { title: 'Active Subjects', value: stats.subjects, icon: BookOpen, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  ];

  return (
    <div className="fade-in max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">System Overview</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{stat.title}</p>
              <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" /> System Health
            </h3>
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <p className="text-slate-400 font-bold">All systems operational.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
              <Bell className="h-5 w-5 mr-2 text-amber-500" /> Recent Notices
            </h3>
          </div>
          <div className="space-y-4">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-slate-800 dark:text-white">{ann.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{new Date(ann.date).toLocaleDateString()}</p>
              </div>
            ))}
            {announcements.length === 0 && (
              <p className="text-slate-500 text-sm font-bold text-center py-4">No notices published.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
