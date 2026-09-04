import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Users, BookOpen, Clock, Target, CalendarCheck } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

export default function DashboardOverview() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  
  const stats = [
    { label: "My Classes", value: "3", icon: <BookOpen className="h-6 w-6" />, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30" },
    { label: "Total Students", value: "120", icon: <Users className="h-6 w-6" />, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30" },
    { label: "Needs Grading", value: "14", icon: <Target className="h-6 w-6" />, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/30" },
    { label: "Classes Today", value: "2", icon: <Clock className="h-6 w-6" />, color: "text-red-600 bg-red-50 dark:bg-red-900/30" }
  ];

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    datasets: [
      {
        label: 'Average Attendance %',
        data: [85, 88, 92, 89, 94],
        borderColor: '#935F53',
        backgroundColor: isDarkMode ? 'rgba(147, 95, 83, 0.2)' : 'rgba(147, 95, 83, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { min: 60, max: 100, grid: { color: isDarkMode ? '#374151' : '#EBE0C8' }, ticks: { color: isDarkMode ? '#9CA3AF' : '#735A52' } },
      x: { grid: { display: false }, ticks: { color: isDarkMode ? '#9CA3AF' : '#735A52' } }
    }
  };

  return (
    <div className="fade-in">
      <h2 className="text-2xl font-bold text-[#462F2D] dark:text-white mb-6">
        Welcome back, {user?.name?.split(' ')[0] || 'Teacher'}! 👋
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-[#EBE0C8] dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[#735A52] dark:text-gray-400 text-sm font-bold mb-1 uppercase tracking-wide">{s.label}</p>
                <h3 className="text-3xl font-bold text-[#462F2D] dark:text-white">{s.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
                {s.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-[#EBE0C8] dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold text-[#462F2D] dark:text-white mb-4">Class Attendance Trend</h3>
          <div className="h-64">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
        
        {/* Schedule */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-[#EBE0C8] dark:border-gray-800 shadow-sm h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#462F2D] dark:text-white">Today's Schedule</h3>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto">
            <div className="p-4 bg-[#FDF8F5] dark:bg-gray-800/50 rounded-xl border border-[#EBE0C8] dark:border-gray-700 hover:border-[#935F53] transition-colors cursor-pointer">
              <h4 className="font-bold text-[#462F2D] dark:text-white text-sm mb-1">Data Structures (CS201)</h4>
              <p className="text-xs text-[#735A52] dark:text-gray-400 mb-3">Room 304 - 2nd Year CSE</p>
              <div className="flex items-center text-xs font-bold text-[#935F53] dark:text-indigo-400">
                <Clock className="h-3 w-3 mr-1" />
                <span>10:00 AM - 11:30 AM</span>
              </div>
            </div>
            
            <div className="p-4 bg-[#FDF8F5] dark:bg-gray-800/50 rounded-xl border border-[#EBE0C8] dark:border-gray-700 hover:border-[#935F53] transition-colors cursor-pointer">
              <h4 className="font-bold text-[#462F2D] dark:text-white text-sm mb-1">Web Development (CS301)</h4>
              <p className="text-xs text-[#735A52] dark:text-gray-400 mb-3">Lab 2 - 3rd Year CSE</p>
              <div className="flex items-center text-xs font-bold text-[#935F53] dark:text-indigo-400">
                <Clock className="h-3 w-3 mr-1" />
                <span>2:00 PM - 4:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
