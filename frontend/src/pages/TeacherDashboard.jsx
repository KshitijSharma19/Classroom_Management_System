import React, { useState, useEffect } from 'react';
import { Home, Users, BookOpen, CheckSquare, Plus, FileText, Edit, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import apiService from '../api/apiService';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  
  // Assignment Modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingAssign, setEditingAssign] = useState(null);
  const [assignForm, setAssignForm] = useState({ title: '', subject_id: '', due_date: '', status: 'Pending', student_id: '' });

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/');
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'teacher') {
      navigate('/');
      return;
    }
    
    setUser(parsedUser);
    fetchData(parsedUser);
  }, [navigate]);

  const fetchData = async (currentUser) => {
    try {
      const [subRes, assignRes, userRes] = await Promise.all([
        apiService.getSubjects(),
        apiService.getAssignments(),
        apiService.getUsers()
      ]);
      
      // Filter subjects taught by this teacher
      const mySubjects = subRes.data.filter(s => s.teacher_id === currentUser.id);
      setSubjects(mySubjects);
      
      // Assignments for my subjects
      const subjectIds = mySubjects.map(s => s.id);
      setAssignments(assignRes.data.filter(a => subjectIds.includes(a.subject_id)));
      
      // All students (in a real app, only students enrolled in their subjects)
      setStudents(userRes.data.filter(u => u.role === 'student'));
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home, active: activeTab === 'overview', onClick: setActiveTab },
    { id: 'classes', label: 'My Classes', icon: BookOpen, active: activeTab === 'classes', onClick: setActiveTab },
    { id: 'assignments', label: 'Assignments', icon: CheckSquare, active: activeTab === 'assignments', onClick: setActiveTab },
    { id: 'students', label: 'Students', icon: Users, active: activeTab === 'students', onClick: setActiveTab },
  ];

  // --- Handlers: Assignments ---
  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
          ...assignForm,
          subject_id: parseInt(assignForm.subject_id),
          student_id: parseInt(assignForm.student_id)
      };
      if (editingAssign) {
        await apiService.updateAssignment(editingAssign.id, payload);
      } else {
        await apiService.createAssignment(payload);
      }
      setShowAssignModal(false);
      fetchData(user);
    } catch (error) {
      alert("Error saving assignment");
    }
  };

  const deleteAssign = async (id) => {
    if(window.confirm('Delete this assignment?')) {
      await apiService.deleteAssignment(id);
      fetchData(user);
    }
  };

  const getSubjectName = (id) => {
      const s = subjects.find(sub => sub.id === id);
      return s ? s.name : 'Unknown Subject';
  };
  
  const getStudentName = (id) => {
      const s = students.find(stu => stu.id === id);
      return s ? s.name : 'Unknown Student';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6 fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Dashboard Overview</h2>
              <button 
                onClick={() => {
                  setEditingAssign(null);
                  setAssignForm({ title: '', subject_id: subjects[0]?.id || '', due_date: '', status: 'Pending', student_id: students[0]?.id || '' });
                  setShowAssignModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm text-sm font-medium">
                <Plus size={16} /> New Assignment
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-2xl flex flex-col justify-center hover-lift transition-all-300">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-3xl font-bold text-text-primary">{subjects.length}</h3>
                <p className="text-sm text-text-secondary mt-1">Active Classes</p>
              </div>
              <div className="glass p-6 rounded-2xl flex flex-col justify-center hover-lift transition-all-300">
                <div className="w-12 h-12 bg-success/10 text-success rounded-xl flex items-center justify-center mb-4">
                  <Users size={24} />
                </div>
                <h3 className="text-3xl font-bold text-text-primary">{students.length}</h3>
                <p className="text-sm text-text-secondary mt-1">Total Students</p>
              </div>
              <div className="glass p-6 rounded-2xl flex flex-col justify-center hover-lift transition-all-300">
                <div className="w-12 h-12 bg-warning/10 text-warning rounded-xl flex items-center justify-center mb-4">
                  <CheckSquare size={24} />
                </div>
                <h3 className="text-3xl font-bold text-text-primary">{assignments.length}</h3>
                <p className="text-sm text-text-secondary mt-1">Assignments Posted</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-bg-surface border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4">My Subjects</h3>
                <div className="space-y-3">
                  {subjects.map(subject => (
                    <div key={subject.id} className="flex justify-between items-center p-4 rounded-lg border border-border bg-bg-primary">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {subject.code.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{subject.name}</p>
                          <p className="text-xs text-text-secondary mt-1">{subject.code} • {subject.credits} Credits</p>
                        </div>
                      </div>
                      <button className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors">
                        <FileText size={18} />
                      </button>
                    </div>
                  ))}
                  {subjects.length === 0 && <p className="text-sm text-text-secondary">No subjects assigned.</p>}
                </div>
              </div>

              <div className="bg-bg-surface border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Recent Assignments</h3>
                <div className="space-y-3">
                  {assignments.slice(-4).reverse().map(assignment => (
                    <div key={assignment.id} className="flex justify-between items-center p-3 rounded-lg border border-border bg-bg-primary">
                      <div>
                        <p className="font-medium text-sm">{assignment.title}</p>
                        <p className="text-xs text-text-secondary">Due: {assignment.due_date}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-md font-medium ${assignment.status === 'Completed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                        {assignment.status}
                      </span>
                    </div>
                  ))}
                  {assignments.length === 0 && <p className="text-sm text-text-secondary">No assignments found.</p>}
                </div>
              </div>
            </div>
          </div>
        );
      case 'classes':
        return (
          <div className="space-y-6 fade-in">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Classes</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map(c => (
                    <div key={c.id} className="glass p-6 rounded-2xl border border-border shadow-sm hover-lift relative group flex flex-col">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                            <BookOpen size={24} />
                        </div>
                        <h3 className="text-lg font-bold mb-1">{c.name}</h3>
                        <p className="text-sm text-text-secondary mb-4 font-mono">{c.code}</p>
                        <div className="mt-auto pt-4 border-t border-border flex justify-between items-center text-sm">
                            <span className="font-medium text-text-secondary">{c.credits} Credits</span>
                        </div>
                    </div>
                ))}
                {subjects.length === 0 && <p className="col-span-full text-center text-text-secondary py-10">You are not assigned to any classes.</p>}
             </div>
          </div>
        );
      case 'assignments':
        return (
          <div className="space-y-6 fade-in">
             <div className="bg-bg-surface border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">Manage Assignments</h3>
                  <button 
                    onClick={() => {
                        setEditingAssign(null);
                        setAssignForm({ title: '', subject_id: subjects[0]?.id || '', due_date: '', status: 'Pending', student_id: students[0]?.id || '' });
                        setShowAssignModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus size={16}/> Create Assignment
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border text-text-secondary text-sm">
                        <th className="pb-3 font-medium">Title</th>
                        <th className="pb-3 font-medium">Subject</th>
                        <th className="pb-3 font-medium">Student</th>
                        <th className="pb-3 font-medium">Due Date</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.map((a) => (
                        <tr key={a.id} className="border-b border-border last:border-0 hover:bg-bg-primary transition-colors">
                          <td className="py-4 font-medium text-sm text-text-primary">{a.title}</td>
                          <td className="py-4 text-sm text-text-secondary">{getSubjectName(a.subject_id)}</td>
                          <td className="py-4 text-sm text-text-secondary">{getStudentName(a.student_id)}</td>
                          <td className="py-4 text-sm text-text-secondary">{a.due_date}</td>
                          <td className="py-4 text-sm capitalize">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                              a.status === 'Completed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                            }`}>
                              {a.status}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => { setEditingAssign(a); setAssignForm(a); setShowAssignModal(true); }}
                                  className="p-2 text-text-secondary hover:text-primary bg-bg-primary border border-border rounded-lg transition-colors"
                                ><Edit size={16}/></button>
                                <button 
                                  onClick={() => deleteAssign(a.id)}
                                  className="p-2 text-text-secondary hover:text-danger bg-bg-primary border border-border rounded-lg transition-colors"
                                ><Trash size={16}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {assignments.length === 0 && (
                          <tr><td colSpan="6" className="text-center py-8 text-text-secondary text-sm">No assignments found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
          </div>
        );
      case 'students':
        return (
          <div className="space-y-6 fade-in">
             <div className="bg-bg-surface border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-6">Student Directory</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border text-text-secondary text-sm">
                        <th className="pb-3 font-medium">Student</th>
                        <th className="pb-3 font-medium">Email</th>
                        <th className="pb-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id} className="border-b border-border last:border-0 hover:bg-bg-primary transition-colors">
                          <td className="py-4 flex items-center gap-3">
                            <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full bg-border" />
                            <span className="font-medium text-sm">{student.name}</span>
                          </td>
                          <td className="py-4 text-sm text-text-secondary">{student.email}</td>
                          <td className="py-4 text-right">
                            <button className="text-primary hover:underline text-sm font-medium">View Profile</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
          </div>
        )
      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-bg-primary">
      <Sidebar menuItems={menuItems} />
      
      <div className="flex-1 flex flex-col w-full min-w-0">
        <Header title={menuItems.find(i => i.id === activeTab)?.label} user={user} />
        
        <main className="flex-1 p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
            <div className="bg-bg-surface w-full max-w-md rounded-2xl border border-border shadow-xl p-6">
                <h3 className="text-xl font-bold mb-4">{editingAssign ? 'Edit Assignment' : 'New Assignment'}</h3>
                <form onSubmit={handleAssignSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Title</label>
                        <input required type="text" value={assignForm.title} onChange={e=>setAssignForm({...assignForm, title: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Subject</label>
                        <select required value={assignForm.subject_id} onChange={e=>setAssignForm({...assignForm, subject_id: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-primary">
                            <option value="">Select Subject</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Student</label>
                        <select required value={assignForm.student_id} onChange={e=>setAssignForm({...assignForm, student_id: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-primary">
                            <option value="">Select Student</option>
                            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Due Date</label>
                        <input required type="date" value={assignForm.due_date} onChange={e=>setAssignForm({...assignForm, due_date: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Status</label>
                        <select value={assignForm.status} onChange={e=>setAssignForm({...assignForm, status: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-primary">
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className="flex gap-3 justify-end mt-6">
                        <button type="button" onClick={()=>setShowAssignModal(false)} className="px-4 py-2 rounded-lg bg-bg-primary border border-border text-text-secondary hover:text-text-primary transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">Save</button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default TeacherDashboard;
