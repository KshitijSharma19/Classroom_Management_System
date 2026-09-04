import React, { useEffect, useState, useRef } from 'react';
import { fetchAssignments, createSubmission } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, Clock, BookOpen, UploadCloud } from 'lucide-react';

export default function Assignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const fileInputRef = useRef(null);
  const [activeAssignment, setActiveAssignment] = useState(null);

  useEffect(() => {
    fetchAssignments().then(setAssignments).catch(console.error);
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && activeAssignment) {
      // Simulate file upload delay
      alert(`Uploading ${file.name}...`);
      try {
        await createSubmission({
          assignment_id: activeAssignment,
          student_id: user.id,
          file_url: "https://example.com/uploaded_" + file.name
        });
        setAssignments(assignments.map(a => 
          a.id === activeAssignment ? { ...a, status: 'Completed' } : a
        ));
        alert('Assignment submitted successfully!');
      } catch (err) {
        alert('Failed to submit assignment');
        console.error(err);
      }
    }
  };

  const handleUploadClick = (id) => {
    setActiveAssignment(id);
    fileInputRef.current.click();
  };

  const filteredAssignments = assignments.filter(a => {
    if (subjectFilter !== 'All Subjects' && a.subject.name !== subjectFilter) return false;
    if (statusFilter !== 'All Status' && a.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-[#462F2D] dark:text-white">Assignments</h2>
        <div className="flex gap-3 w-full sm:w-auto">
          <select 
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-[#EBE0C8] dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-[#935F53] outline-none text-[#735A52] dark:text-gray-300 w-full sm:w-auto shadow-sm"
          >
            <option>All Subjects</option>
            <option>Data Structures</option>
            <option>Web Development</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-[#EBE0C8] dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-[#935F53] outline-none text-[#735A52] dark:text-gray-300 w-full sm:w-auto shadow-sm"
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments.map(a => {
          const isCompleted = a.status === 'Completed';
          return (
            <div key={a.id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-[#EBE0C8] dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col">
              {/* Decorative Corner */}
              <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 ${isCompleted ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}></div>
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <span className={`px-2.5 py-1 text-xs font-bold rounded-lg flex items-center border ${isCompleted ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50' : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50'}`}>
                  {isCompleted ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />} 
                  {a.status}
                </span>
                <span className="text-xs text-[#735A52] dark:text-gray-400 font-bold px-2 py-1 bg-[#FDF8F5] dark:bg-gray-800 rounded-lg border border-[#EBE0C8] dark:border-gray-700 flex items-center">
                  <Clock className="h-3 w-3 text-red-500 mr-1" /> Due: {new Date(a.due_date).toLocaleDateString()}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-[#462F2D] dark:text-white mb-2 relative z-10">{a.title}</h3>
              <p className="text-sm text-[#735A52] dark:text-gray-400 mb-6 relative z-10 flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-[#935F53] dark:text-indigo-400" /> {a.subject.name}
              </p>
              
              <div className="mt-auto relative z-10">
                {isCompleted ? (
                  <button className="w-full py-3 bg-[#FDF8F5] dark:bg-gray-800 border border-[#EBE0C8] dark:border-gray-700 text-[#735A52] dark:text-gray-400 rounded-xl text-sm font-bold cursor-not-allowed flex items-center justify-center transition-colors">
                    <CheckCircle className="h-4 w-4 mr-2" /> Submitted
                  </button>
                ) : (
                  <button onClick={() => handleUploadClick(a.id)} className="w-full py-3 bg-[#462F2D] dark:bg-indigo-600 text-white rounded-xl hover:bg-[#342220] dark:hover:bg-indigo-700 transition-colors text-sm font-bold flex items-center justify-center shadow-sm">
                    <UploadCloud className="h-4 w-4 mr-2" /> Submit Work
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
