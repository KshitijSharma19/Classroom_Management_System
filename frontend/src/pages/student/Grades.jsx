import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchMarks } from '../../api/client';
import { Award, FileText, Calendar, LineChart } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';

export default function Grades() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [marks, setMarks] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('1'); // Default to semester 1

  useEffect(() => {
    if (user) {
      fetchMarks(user.id).then(setMarks).catch(console.error);
    }
  }, [user]);

  const totalObtained = marks.reduce((acc, curr) => acc + curr.total, 0);
  const totalOutOf = marks.reduce((acc, curr) => acc + curr.out_of, 0);
  const overallPercentage = totalOutOf ? (totalObtained / totalOutOf) * 100 : 0;
  const currentCGPA = (overallPercentage / 10).toFixed(2);

  const calcSemSgpa = (sem) => {
    const semMarks = marks.filter(m => m.semester === sem);
    if (!semMarks.length) return 0;
    const totObtained = semMarks.reduce((a, c) => a + c.total, 0);
    const totOutOf = semMarks.reduce((a, c) => a + c.out_of, 0);
    return ((totObtained / totOutOf) * 10).toFixed(2);
  };

  const chartData = {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    datasets: [
      {
        label: 'SGPA',
        data: [
          calcSemSgpa(1),
          calcSemSgpa(2),
          calcSemSgpa(3),
          calcSemSgpa(4)
        ],
        borderColor: '#935F53',
        backgroundColor: isDarkMode ? 'rgba(147, 95, 83, 0.2)' : 'rgba(147, 95, 83, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#059669',
        pointBorderColor: isDarkMode ? '#111827' : '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
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

  return (
    <div className="fade-in max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-[#462F2D] dark:text-white mb-6">Grades & Reports</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-[#EBE0C8] dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#735A52] dark:text-gray-400 mb-1">Overall CGPA</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-[#462F2D] dark:text-white">{currentCGPA > 0 ? currentCGPA : "N/A"}</span>
              <span className="text-sm font-bold text-emerald-500 mb-1">/ 10.0</span>
            </div>
          </div>
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center shadow-inner border border-emerald-100 dark:border-emerald-800/50">
            <Award className="h-7 w-7" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-[#EBE0C8] dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div className="text-right">
            <p className="text-sm font-bold text-[#735A52] dark:text-gray-400 mb-1">Total Credits</p>
            <div className="text-xl font-bold text-[#462F2D] dark:text-white">{marks.length * 3}</div>
          </div>
          <div className="w-14 h-14 bg-[#F5EEDC] dark:bg-indigo-900/20 text-[#935F53] dark:text-indigo-400 rounded-2xl flex items-center justify-center shadow-inner border border-[#EBE0C8] dark:border-indigo-800/50">
            <FileText className="h-7 w-7" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-[#EBE0C8] dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[#735A52] dark:text-gray-400 text-sm font-bold uppercase tracking-wide mb-1">Current Semester</p>
            <h3 className="text-3xl font-bold text-amber-600 dark:text-amber-400">4th</h3>
          </div>
          <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shadow-inner border border-amber-100 dark:border-amber-800/50">
            <Calendar className="h-7 w-7" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-[#EBE0C8] dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold text-[#462F2D] dark:text-white mb-4">CGPA Trend</h3>
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-[#EBE0C8] dark:border-gray-800 shadow-sm flex flex-col justify-center items-center text-center">
           <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-[#F5EEDC] dark:text-gray-800" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8"/>
                <path className="text-emerald-500" strokeDasharray={`${(currentCGPA/10)*100}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{currentCGPA}</span>
              </div>
            </div>
           <h3 className="text-xl font-bold text-[#462F2D] dark:text-white mb-2">First Class with Distinction</h3>
           <p className="text-[#735A52] dark:text-gray-400 text-sm px-4">You are currently in the top 10% of your class. Maintain this performance in the upcoming exams!</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-[#462F2D] dark:text-white">Current Semester Marks</h3>
        <select 
          value={selectedSemester} 
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="px-4 py-2 rounded-xl border border-[#EBE0C8] dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#935F53] font-bold text-[#462F2D]"
        >
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
          <option value="3">Semester 3</option>
          <option value="4">Semester 4</option>
        </select>
      </div>
      
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-[#EBE0C8] dark:border-gray-800 shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FDF8F5] dark:bg-gray-800 border-b border-[#EBE0C8] dark:border-gray-700 text-[#735A52] dark:text-gray-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-bold">Subject</th>
                <th className="p-4 font-bold text-center">Internal (30)</th>
                <th className="p-4 font-bold text-center">Mid Sem (50)</th>
                <th className="p-4 font-bold text-center">End Sem (100)</th>
                <th className="p-4 font-bold text-center">Total</th>
                <th className="p-4 font-bold text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE0C8] dark:divide-gray-800">
              {marks.filter(m => m.semester === parseInt(selectedSemester)).map(m => {
                const p = (m.total / m.out_of) * 100;
                let grade = 'F';
                if (p >= 90) grade = 'O';
                else if (p >= 80) grade = 'A+';
                else if (p >= 70) grade = 'A';
                else if (p >= 60) grade = 'B+';
                else if (p >= 50) grade = 'B';
                
                const isFail = grade === 'F';
                const gradeClass = isFail 
                  ? 'text-red-700 bg-red-50 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50' 
                  : 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50';
                
                return (
                  <tr key={m.id} className="hover:bg-[#FDF8F5] dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4 font-bold text-[#462F2D] dark:text-white">{m.subject.name}</td>
                    <td className="p-4 text-center text-[#735A52] dark:text-gray-400">{m.internal}</td>
                    <td className="p-4 text-center text-[#735A52] dark:text-gray-400">{m.mid}</td>
                    <td className="p-4 text-center text-[#735A52] dark:text-gray-400">{m.end}</td>
                    <td className="p-4 text-center font-bold text-[#462F2D] dark:text-white">{m.total} <span className="text-xs text-[#735A52] dark:text-gray-500 font-normal">/ {m.out_of}</span></td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${gradeClass}`}>{grade}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
