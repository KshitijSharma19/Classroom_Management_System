import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { fetchMarks, fetchAttendance, fetchAssignments, fetchAnnouncements } from '../../api/client';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js';
import { Calendar, BookOpen, Clock, Target, TrendingUp, CalendarCheck } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

export default function DashboardOverview() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  
  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    if (user) {
      fetchMarks(user.id).then(setMarks).catch(console.error);
      fetchAttendance(user.id).then(setAttendance).catch(console.error);
      fetchAssignments().then(setAssignments).catch(console.error);
      fetchAnnouncements().then(setAnnouncements).catch(console.error);
    }
  }, [user]);

  // Calculations
  const totalAttended = attendance.reduce((acc, curr) => acc + curr.attended, 0);
  const totalClasses = attendance.reduce((acc, curr) => acc + curr.total, 0);
  const overallAttendance = totalClasses ? ((totalAttended / totalClasses) * 100).toFixed(1) : 0;
  
  const totalObtained = marks.reduce((acc, curr) => acc + curr.total, 0);
  const totalOutOf = marks.reduce((acc, curr) => acc + curr.out_of, 0);
  const overallPercentage = totalOutOf ? (totalObtained / totalOutOf) * 100 : 0;
  const currentCGPA = (overallPercentage / 10).toFixed(2);

  const pendingAssignments = assignments.filter(a => a.status === 'Pending').length;
  const upcomingExams = 2;

  function calcSemSgpa(marksArray, sem) {
    const semMarks = marksArray.filter(m => m.semester === sem);
    if (!semMarks.length) return 0;
    const totObtained = semMarks.reduce((a, c) => a + c.total, 0);
    const totOutOf = semMarks.reduce((a, c) => a + c.out_of, 0);
    return ((totObtained / totOutOf) * 10).toFixed(2);
  }

  const lineData = {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    datasets: [
      {
        label: 'SGPA Trend',
        data: [
          calcSemSgpa(marks, 1),
          calcSemSgpa(marks, 2),
          calcSemSgpa(marks, 3),
          calcSemSgpa(marks, 4)
        ],
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
      y: { min: 5, max: 10, grid: { color: isDarkMode ? '#374151' : '#EBE0C8' }, ticks: { color: isDarkMode ? '#9CA3AF' : '#735A52' } },
      x: { grid: { display: false }, ticks: { color: isDarkMode ? '#9CA3AF' : '#735A52' } }
    }
  };

  const stats = [
    { label: "Overall CGPA", value: currentCGPA > 0 ? currentCGPA : "N/A", icon: <Target className="h-6 w-6" />, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30" },
    { label: "Attendance", value: `${overallAttendance}%`, icon: <TrendingUp className="h-6 w-6" />, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30" },
    { label: "Pending Assignments", value: pendingAssignments.toString(), icon: <BookOpen className="h-6 w-6" />, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/30" },
    { label: "Exams", value: upcomingExams.toString(), icon: <Clock className="h-6 w-6" />, color: "text-red-600 bg-red-50 dark:bg-red-900/30" }
  ];

  return (
    <div className="fade-in">
      <h2 className="text-2xl font-bold text-[#462F2D] dark:text-white mb-6">
        Welcome back, {user?.name?.split(' ')[0]}! 👋
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
          <h3 className="text-lg font-bold text-[#462F2D] dark:text-white mb-4">Academic Progress</h3>
          <div className="h-64">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
        
        {/* Announcements */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-[#EBE0C8] dark:border-gray-800 shadow-sm h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#462F2D] dark:text-white">Announcements</h3>
            <button className="text-[#935F53] dark:text-indigo-400 text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto">
            {announcements.map(a => (
              <div key={a.id} className="p-4 bg-[#FDF8F5] dark:bg-gray-800/50 rounded-xl border border-[#EBE0C8] dark:border-gray-700 hover:border-[#935F53] transition-colors cursor-pointer">
                <h4 className="font-bold text-[#462F2D] dark:text-white text-sm mb-1">{a.title}</h4>
                <p className="text-xs text-[#735A52] dark:text-gray-400 mb-3">{a.content}</p>
                <div className="flex items-center text-xs font-bold text-[#935F53] dark:text-indigo-400">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{new Date(a.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
