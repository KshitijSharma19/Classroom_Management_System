import React, { useState, useEffect } from 'react';
import { fetchAssignments, fetchSubjects, createAssignment, deleteAssignment, fetchSubmissions, gradeSubmission, updateAssignment } from '../../api/client';
import { Plus, Edit2, Trash2, Calendar, CheckCircle, X, Users, UploadCloud, Save } from 'lucide-react';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Data state
  const [formData, setFormData] = useState({ title: '', subject_id: '', due_date: '' });
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  
  const loadData = () => {
    fetchAssignments().then(setAssignments).catch(console.error);
    fetchSubjects().then(setSubjects).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateAssignment(editId, {
          title: formData.title,
          subject_id: parseInt(formData.subject_id),
          due_date: formData.due_date,
        });
      } else {
        await createAssignment({
          title: formData.title,
          subject_id: parseInt(formData.subject_id),
          due_date: formData.due_date,
          status: 'Pending'
        });
      }
      setShowModal(false);
      setIsEditing(false);
      setEditId(null);
      setFormData({ title: '', subject_id: '', due_date: '' });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (a, e) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditId(a.id);
    setFormData({
      title: a.title,
      subject_id: a.subject_id || '',
      due_date: a.due_date ? new Date(a.due_date).toISOString().split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if(window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await deleteAssignment(id);
        loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openSubmissions = async (assignment) => {
    setSelectedAssignment(assignment);
    try {
      const subs = await fetchSubmissions(assignment.id);
      setSubmissions(subs);
      setShowSubmissionsModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGradeChange = (subId, val) => {
    setSubmissions(submissions.map(s => s.id === subId ? { ...s, score: parseInt(val) || 0 } : s));
  };

  const saveGrade = async (sub) => {
    if(sub.score === null) return;
    try {
      await gradeSubmission(sub.id, { score: sub.score });
      // update local status
      setSubmissions(submissions.map(s => s.id === sub.id ? { ...s, status: 'Graded' } : s));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fade-in max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#462F2D] dark:text-white">Manage Assignments</h2>
        <button 
          onClick={() => {
            setIsEditing(false);
            setEditId(null);
            setFormData({ title: '', subject_id: '', due_date: '' });
            setShowModal(true);
          }}
          className="flex items-center space-x-2 bg-[#462F2D] hover:bg-[#342220] text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Assignment</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map(a => (
          <div 
            key={a.id} 
            onClick={() => openSubmissions(a)}
            className="cursor-pointer bg-white dark:bg-gray-900 p-6 rounded-2xl border border-[#EBE0C8] dark:border-gray-800 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 flex flex-col group relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 w-1 h-full ${a.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2.5 py-1 text-xs font-bold rounded-lg uppercase tracking-wider ${
                a.status === 'Completed' 
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              }`}>
                {a.status === 'Completed' ? 'Graded' : 'Needs Grading'}
              </span>
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => handleEdit(a, e)}
                  className="p-1.5 text-[#735A52] dark:text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button 
                  onClick={(e) => handleDelete(a.id, e)}
                  className="p-1.5 text-[#735A52] dark:text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-[#462F2D] dark:text-white mb-2">{a.title}</h3>
            <p className="text-sm font-bold text-[#735A52] dark:text-gray-400 mb-6">{a.subject?.name}</p>
            
            <div className="mt-auto border-t border-[#EBE0C8] dark:border-gray-800 pt-4 flex justify-between items-center">
              <div className="flex items-center text-xs font-bold text-red-500">
                <Calendar className="h-4 w-4 mr-1.5" />
                <span>Due: {new Date(a.due_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-xs font-bold text-emerald-600">
                <Users className="h-4 w-4 mr-1.5" />
                <span>Submissions</span>
              </div>
            </div>
          </div>
        ))}
        {assignments.length === 0 && (
          <div className="col-span-full p-8 text-center text-[#735A52] dark:text-gray-400">
            No assignments found.
          </div>
        )}
      </div>

      {/* New/Edit Assignment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-[#EBE0C8] dark:border-gray-800">
            <div className="flex justify-between items-center p-6 border-b border-[#EBE0C8] dark:border-gray-800">
              <h3 className="text-xl font-bold text-[#462F2D] dark:text-white">
                {isEditing ? 'Edit Assignment' : 'New Assignment'}
              </h3>
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
                  className="w-full px-4 py-3 bg-[#FDF8F5] dark:bg-gray-800 border border-[#EBE0C8] dark:border-gray-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#462F2D] dark:text-white"
                  placeholder="e.g. Lab Report 1"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#935F53] dark:text-gray-400 uppercase tracking-wider mb-2">Subject</label>
                <select 
                  required
                  value={formData.subject_id}
                  onChange={(e) => setFormData({...formData, subject_id: e.target.value})}
                  className="w-full px-4 py-3 bg-[#FDF8F5] dark:bg-gray-800 border border-[#EBE0C8] dark:border-gray-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#462F2D] dark:text-white"
                >
                  <option value="">Select a subject...</option>
                  {subjects.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#935F53] dark:text-gray-400 uppercase tracking-wider mb-2">Due Date (Students must upload by)</label>
                <input 
                  type="date" 
                  required
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                  className="w-full px-4 py-3 bg-[#FDF8F5] dark:bg-gray-800 border border-[#EBE0C8] dark:border-gray-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#462F2D] dark:text-white"
                />
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
                  {isEditing ? 'Save Changes' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submissions Modal */}
      {showSubmissionsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden border border-[#EBE0C8] dark:border-gray-800 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-[#EBE0C8] dark:border-gray-800 shrink-0">
              <h3 className="text-xl font-bold text-[#462F2D] dark:text-white flex items-center">
                Submissions for {selectedAssignment?.title}
              </h3>
              <button onClick={() => setShowSubmissionsModal(false)} className="text-[#735A52] dark:text-gray-400 hover:text-[#462F2D] dark:hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {submissions.length === 0 ? (
                <div className="text-center p-8 text-[#735A52] dark:text-gray-400 font-bold">
                  No submissions yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map(sub => (
                    <div key={sub.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-4">
                        {sub.student.avatar ? (
                          <img src={sub.student.avatar} alt="Avatar" className="h-10 w-10 rounded-full" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-[#462F2D] text-white flex items-center justify-center font-bold">
                            {sub.student.name[0]}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-[#462F2D] dark:text-white">{sub.student.name}</h4>
                          <a href={sub.file_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center hover:underline mt-0.5">
                            <UploadCloud className="h-3.5 w-3.5 mr-1" /> View Attachment
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <label className="block text-[10px] font-bold text-gray-500 uppercase">Score (/{sub.max_score})</label>
                          <input 
                            type="number" 
                            min="0" 
                            max={sub.max_score}
                            value={sub.score === null ? '' : sub.score} 
                            onChange={(e) => handleGradeChange(sub.id, e.target.value)} 
                            className="w-20 p-2 text-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm font-semibold dark:text-white focus:ring-2 focus:ring-[#935F53] focus:outline-none" 
                          />
                        </div>
                        <button 
                          onClick={() => saveGrade(sub)}
                          className={`p-2 rounded-lg transition-colors ${sub.status === 'Graded' ? 'bg-emerald-100 text-emerald-600' : 'bg-[#462F2D] text-white hover:bg-[#342220]'}`}
                          title={sub.status === 'Graded' ? "Graded" : "Save Grade"}
                        >
                          {sub.status === 'Graded' ? <CheckCircle className="h-5 w-5" /> : <Save className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
