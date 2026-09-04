import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, X, Save, Edit2, CheckCircle, Clock } from 'lucide-react';
import { fetchUsers, fetchMarks, fetchAttendance, updateMark, updateAttendance } from '../../api/client';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [marksModal, setMarksModal] = useState(false);
  const [attendanceModal, setAttendanceModal] = useState(false);
  
  const [studentMarks, setStudentMarks] = useState([]);
  const [studentAttendance, setStudentAttendance] = useState([]);
  
  const [activeMenuId, setActiveMenuId] = useState(null);

  useEffect(() => {
    fetchUsers('student').then(setStudents).catch(console.error);
  }, []);

  const openMarksModal = async (student) => {
    setActiveMenuId(null);
    setSelectedStudent(student);
    try {
      const m = await fetchMarks(student.id);
      setStudentMarks(m);
      setMarksModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const openAttendanceModal = async (student) => {
    setActiveMenuId(null);
    setSelectedStudent(student);
    try {
      const a = await fetchAttendance(student.id);
      setStudentAttendance(a);
      setAttendanceModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkChange = (id, field, val) => {
    setStudentMarks(studentMarks.map(m => m.id === id ? { ...m, [field]: parseInt(val) || 0 } : m));
  };
  
  const saveMarks = async () => {
    try {
      for (let m of studentMarks) {
        await updateMark(m.id, { internal: m.internal, mid: m.mid, end: m.end, total: m.internal + m.mid + m.end });
      }
      setMarksModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAttendanceChange = (id, field, val) => {
    setStudentAttendance(studentAttendance.map(a => a.id === id ? { ...a, [field]: parseInt(val) || 0 } : a));
  };
  
  const saveAttendance = async () => {
    try {
      for (let a of studentAttendance) {
        await updateAttendance(a.id, { attended: a.attended, total: a.total });
      }
      setAttendanceModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id.toString().includes(searchTerm)
  );

  return (
    <div className="fade-in max-w-7xl mx-auto pb-12">
      <h2 className="text-2xl font-bold text-[#462F2D] dark:text-white mb-6">Student Directory</h2>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#935F53] dark:text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or roll number..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-[#EBE0C8] dark:border-gray-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#935F53] text-[#462F2D] dark:text-white shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-[#EBE0C8] dark:border-gray-800 shadow-sm overflow-visible">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FDF8F5] dark:bg-gray-800 border-b border-[#EBE0C8] dark:border-gray-700 text-[#735A52] dark:text-gray-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-bold">Roll No.</th>
                <th className="p-4 font-bold">Name</th>
                <th className="p-4 font-bold">Email</th>
                <th className="p-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE0C8] dark:divide-gray-800">
              {filteredStudents.map(s => (
                <tr key={s.id} className="hover:bg-[#FDF8F5] dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-4 text-[#735A52] dark:text-gray-400 font-bold">STU-{1000 + s.id}</td>
                  <td className="p-4 font-bold text-[#462F2D] dark:text-white flex items-center space-x-3">
                    {s.avatar ? (
                      <img src={s.avatar} alt="Avatar" className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-[#462F2D] text-white flex items-center justify-center text-xs">
                        {s.name[0]}
                      </div>
                    )}
                    <span>{s.name}</span>
                  </td>
                  <td className="p-4 text-[#735A52] dark:text-gray-400 font-bold">{s.email}</td>
                  <td className="p-4 text-center relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === s.id ? null : s.id)}
                      className="p-2 text-[#935F53] dark:text-gray-400 hover:text-[#462F2D] dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    {activeMenuId === s.id && (
                      <div className="absolute right-12 top-10 w-48 bg-white dark:bg-gray-900 border border-[#EBE0C8] dark:border-gray-700 shadow-xl rounded-xl z-50 overflow-hidden text-left flex flex-col">
                        <button onClick={() => openMarksModal(s)} className="px-4 py-3 text-sm font-bold text-[#462F2D] dark:text-gray-300 hover:bg-[#F5EEDC] dark:hover:bg-gray-800 transition-colors flex items-center space-x-2 border-b border-[#EBE0C8] dark:border-gray-700">
                          <CheckCircle className="h-4 w-4" />
                          <span>Update Marks</span>
                        </button>
                        <button onClick={() => openAttendanceModal(s)} className="px-4 py-3 text-sm font-bold text-[#462F2D] dark:text-gray-300 hover:bg-[#F5EEDC] dark:hover:bg-gray-800 transition-colors flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>Update Attendance</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredStudents.length === 0 && (
          <div className="p-12 text-center text-[#735A52] dark:text-gray-400 font-bold">
            No students found matching your criteria.
          </div>
        )}
      </div>

      {/* Marks Modal */}
      {marksModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden border border-[#EBE0C8] dark:border-gray-800 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-[#EBE0C8] dark:border-gray-800 shrink-0">
              <h3 className="text-xl font-bold text-[#462F2D] dark:text-white">Update Gradebook: {selectedStudent?.name}</h3>
              <button onClick={() => setMarksModal(false)} className="text-[#735A52] dark:text-gray-400 hover:text-[#462F2D] dark:hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {studentMarks.length === 0 ? (
                <div className="text-center p-8 text-gray-500">No marks found for this student.</div>
              ) : (
                <div className="space-y-6">
                  {studentMarks.map(m => (
                    <div key={m.id} className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                      <h4 className="font-bold text-[#462F2D] dark:text-white mb-4">{m.subject.name} (Sem {m.semester})</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Internal (30)</label>
                          <input type="number" min="0" max="30" value={m.internal} onChange={(e) => handleMarkChange(m.id, 'internal', e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm font-semibold dark:text-white focus:ring-2 focus:ring-[#935F53] focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Mid-Sem (50)</label>
                          <input type="number" min="0" max="50" value={m.mid} onChange={(e) => handleMarkChange(m.id, 'mid', e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm font-semibold dark:text-white focus:ring-2 focus:ring-[#935F53] focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">End-Sem (100)</label>
                          <input type="number" min="0" max="100" value={m.end} onChange={(e) => handleMarkChange(m.id, 'end', e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm font-semibold dark:text-white focus:ring-2 focus:ring-[#935F53] focus:outline-none" />
                        </div>
                      </div>
                      <div className="mt-3 text-right text-sm font-bold text-[#935F53] dark:text-indigo-400">
                        Total: {m.internal + m.mid + m.end} / 180
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 border-t border-[#EBE0C8] dark:border-gray-800 shrink-0 flex justify-end space-x-3 bg-gray-50 dark:bg-gray-900">
              <button onClick={() => setMarksModal(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">Cancel</button>
              <button onClick={saveMarks} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#462F2D] hover:bg-[#342220] text-white transition-colors flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Save Grades</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      {attendanceModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-[#EBE0C8] dark:border-gray-800 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-[#EBE0C8] dark:border-gray-800 shrink-0">
              <h3 className="text-xl font-bold text-[#462F2D] dark:text-white">Update Attendance: {selectedStudent?.name}</h3>
              <button onClick={() => setAttendanceModal(false)} className="text-[#735A52] dark:text-gray-400 hover:text-[#462F2D] dark:hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {studentAttendance.length === 0 ? (
                <div className="text-center p-8 text-gray-500">No attendance records found for this student.</div>
              ) : (
                <div className="space-y-4">
                  {studentAttendance.map(a => (
                    <div key={a.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="font-bold text-[#462F2D] dark:text-white flex-1">{a.subject.name}</div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <label className="block text-[10px] font-bold text-gray-500 uppercase">Attended</label>
                          <input type="number" min="0" value={a.attended} onChange={(e) => handleAttendanceChange(a.id, 'attended', e.target.value)} className="w-20 p-2 text-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm font-semibold dark:text-white focus:ring-2 focus:ring-[#935F53] focus:outline-none" />
                        </div>
                        <div className="text-center">
                          <label className="block text-[10px] font-bold text-gray-500 uppercase">Total</label>
                          <input type="number" min="0" value={a.total} onChange={(e) => handleAttendanceChange(a.id, 'total', e.target.value)} className="w-20 p-2 text-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm font-semibold dark:text-white focus:ring-2 focus:ring-[#935F53] focus:outline-none" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 border-t border-[#EBE0C8] dark:border-gray-800 shrink-0 flex justify-end space-x-3 bg-gray-50 dark:bg-gray-900">
              <button onClick={() => setAttendanceModal(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">Cancel</button>
              <button onClick={saveAttendance} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#462F2D] hover:bg-[#342220] text-white transition-colors flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Save Attendance</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
