import React, { useState, useEffect } from 'react';
import { fetchSubjects, fetchUsers, createSubject, updateSubject, deleteSubject } from '../../api/client';
import { BookOpen, Plus, Trash2, Edit2, Users, X, Code } from 'lucide-react';

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: 3,
    teacher_id: ''
  });

  const loadData = async () => {
    try {
      const [subs, users] = await Promise.all([fetchSubjects(), fetchUsers('teacher')]);
      setSubjects(subs);
      setTeachers(users);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: formData.name,
        code: formData.code,
        credits: parseInt(formData.credits),
        teacher_id: formData.teacher_id ? parseInt(formData.teacher_id) : null
      };
      
      if (isEditing) {
        await updateSubject(editId, data);
      } else {
        await createSubject(data);
      }
      
      setShowModal(false);
      setIsEditing(false);
      setEditId(null);
      setFormData({ name: '', code: '', credits: 3, teacher_id: '' });
      loadData();
    } catch (err) {
      alert('Error saving subject');
      console.error(err);
    }
  };

  const handleEdit = (sub) => {
    setIsEditing(true);
    setEditId(sub.id);
    setFormData({
      name: sub.name,
      code: sub.code,
      credits: sub.credits,
      teacher_id: sub.teacher_id || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this subject? This may cause issues if students have marks tied to it.')) {
      try {
        await deleteSubject(id);
        loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getTeacherName = (id) => {
    const t = teachers.find(t => t.id === id);
    return t ? t.name : 'Unassigned';
  };

  return (
    <div className="fade-in max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
          <BookOpen className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
          Subject Registry
        </h2>
        <button 
          onClick={() => {
            setIsEditing(false);
            setEditId(null);
            setFormData({ name: '', code: '', credits: 3, teacher_id: '' });
            setShowModal(true);
          }}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>New Subject</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map(sub => (
          <div key={sub.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-bl-full -mr-8 -mt-8 z-0"></div>
            
            <div className="p-6 relative z-10 flex-1">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-bold rounded-lg uppercase tracking-wider border border-indigo-200 dark:border-indigo-800/50 flex items-center">
                  <Code className="h-3.5 w-3.5 mr-1" /> {sub.code}
                </span>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(sub)} className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(sub.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{sub.name}</h3>
              <p className="text-sm font-semibold text-slate-500 flex items-center mt-3">
                <Users className="h-4 w-4 mr-2" /> Instructor: {getTeacherName(sub.teacher_id)}
              </p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 p-4 relative z-10">
              <div className="flex justify-between items-center text-sm font-bold text-slate-600 dark:text-slate-400">
                <span>Credits: {sub.credits}</span>
                <span>ID: {sub.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                {isEditing ? 'Edit Subject' : 'New Subject'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subject Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Course Code</label>
                  <input type="text" required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white" placeholder="e.g. CS101" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Credits</label>
                  <input type="number" min="1" max="10" required value={formData.credits} onChange={e => setFormData({...formData, credits: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Assign Teacher</label>
                <select value={formData.teacher_id} onChange={e => setFormData({...formData, teacher_id: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white">
                  <option value="">-- Unassigned --</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-md shadow-indigo-200 dark:shadow-none">
                  {isEditing ? 'Save Changes' : 'Create Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
