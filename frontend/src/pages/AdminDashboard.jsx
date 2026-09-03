import React, { useState, useEffect } from 'react';
import { Home, Users, Settings, Bell, Shield, Database, GraduationCap, UserCheck, BookOpen, Plus, Edit, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import apiService from '../api/apiService';
import { useTheme } from '../context/ThemeContext';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  
  // Data State
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);
  
  // Modal State - Users
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'student', password: '' });
  
  // Modal State - Courses
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({ name: '', code: '', credits: 3, teacher_id: 1 });
  
  // Modal State - Announcements
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [editingAnn, setEditingAnn] = useState(null);
  const [annForm, setAnnForm] = useState({ title: '', content: '', date: '' });

  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/');
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'admin') {
      navigate('/');
      return;
    }
    
    setUser(parsedUser);
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [usersRes, statusRes, coursesRes, annRes] = await Promise.all([
        apiService.getUsers(),
        apiService.getSystemStatus(),
        apiService.getSubjects(),
        apiService.getAnnouncements()
      ]);
      setUsers(usersRes.data);
      setSystemStatus(statusRes.data);
      setCourses(coursesRes.data);
      setAnnouncements(annRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'System Overview', icon: Home, active: activeTab === 'overview', onClick: setActiveTab },
    { id: 'users', label: 'User Management', icon: Users, active: activeTab === 'users', onClick: setActiveTab },
    { id: 'courses', label: 'Courses', icon: BookOpen, active: activeTab === 'courses', onClick: setActiveTab },
    { id: 'announcements', label: 'Announcements', icon: Bell, active: activeTab === 'announcements', onClick: setActiveTab },
    { id: 'settings', label: 'System Settings', icon: Settings, active: activeTab === 'settings', onClick: setActiveTab },
  ];

  const studentsCount = users.filter(u => u.role === 'student').length;
  const teachersCount = users.filter(u => u.role === 'teacher').length;
  const adminsCount = users.filter(u => u.role === 'admin').length;

  // --- Handlers: Users ---
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await apiService.updateUser(editingUser.id, {
          name: userForm.name,
          email: userForm.email,
          role: userForm.role,
          avatar: editingUser.avatar
        });
      } else {
        await apiService.createUser({
          ...userForm,
          avatar: `https://ui-avatars.com/api/?name=${userForm.name.replace(' ','+')}`
        });
      }
      setShowUserModal(false);
      fetchData();
    } catch (error) {
      alert("Error saving user: " + (error.response?.data?.detail || error.message));
    }
  };

  const deleteUser = async (id) => {
    if(window.confirm('Delete this user?')) {
      await apiService.deleteUser(id);
      fetchData();
    }
  };

  // --- Handlers: Courses ---
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await apiService.updateSubject(editingCourse.id, courseForm);
      } else {
        await apiService.createSubject(courseForm);
      }
      setShowCourseModal(false);
      fetchData();
    } catch (error) {
      alert("Error saving course");
    }
  };

  const deleteCourse = async (id) => {
    if(window.confirm('Delete this course?')) {
      await apiService.deleteSubject(id);
      fetchData();
    }
  };

  // --- Handlers: Announcements ---
  const handleAnnSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
          ...annForm,
          date: annForm.date || new Date().toISOString().split('T')[0]
      };
      if (editingAnn) {
        await apiService.updateAnnouncement(editingAnn.id, payload);
      } else {
        await apiService.createAnnouncement(payload);
      }
      setShowAnnModal(false);
      fetchData();
    } catch (error) {
      alert("Error saving announcement");
    }
  };

  const deleteAnn = async (id) => {
    if(window.confirm('Delete this announcement?')) {
      await apiService.deleteAnnouncement(id);
      fetchData();
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6 fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="glass p-6 rounded-2xl flex flex-col justify-center hover-lift transition-all-300">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                  <Users size={20} />
                </div>
                <h3 className="text-2xl font-bold text-text-primary">{users.length}</h3>
                <p className="text-xs text-text-secondary mt-1">Total Users</p>
              </div>
              <div className="glass p-6 rounded-2xl flex flex-col justify-center hover-lift transition-all-300">
                <div className="w-10 h-10 bg-success/10 text-success rounded-xl flex items-center justify-center mb-4">
                  <GraduationCap size={20} />
                </div>
                <h3 className="text-2xl font-bold text-text-primary">{studentsCount}</h3>
                <p className="text-xs text-text-secondary mt-1">Students</p>
              </div>
              <div className="glass p-6 rounded-2xl flex flex-col justify-center hover-lift transition-all-300">
                <div className="w-10 h-10 bg-warning/10 text-warning rounded-xl flex items-center justify-center mb-4">
                  <UserCheck size={20} />
                </div>
                <h3 className="text-2xl font-bold text-text-primary">{teachersCount}</h3>
                <p className="text-xs text-text-secondary mt-1">Teachers</p>
              </div>
              <div className="glass p-6 rounded-2xl flex flex-col justify-center hover-lift transition-all-300">
                <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-4">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-2xl font-bold text-text-primary">{courses.length}</h3>
                <p className="text-xs text-text-secondary mt-1">Total Courses</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-bg-surface border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4">System Status</h3>
                <div className="space-y-4">
                   {systemStatus ? (
                     <>
                       <div className="flex justify-between items-center">
                         <div className="flex items-center gap-3">
                           <Database className="text-success" size={20} />
                           <span className="text-sm font-medium">Database Connection</span>
                         </div>
                         <span className={`text-xs px-2 py-1 ${systemStatus.database === 'Connected' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'} rounded-md`}>
                           {systemStatus.database}
                         </span>
                       </div>
                       <div className="flex justify-between items-center">
                         <div className="flex items-center gap-3">
                           <Shield className="text-success" size={20} />
                           <span className="text-sm font-medium">Authentication API</span>
                         </div>
                         <span className={`text-xs px-2 py-1 ${systemStatus.api === 'Running' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'} rounded-md`}>
                           {systemStatus.api}
                         </span>
                       </div>
                       <div className="flex justify-between items-center">
                         <div className="flex items-center gap-3">
                           <Bell className="text-primary" size={20} />
                           <span className="text-sm font-medium">System Uptime</span>
                         </div>
                         <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md">
                           {systemStatus.uptime}
                         </span>
                       </div>
                     </>
                   ) : (
                     <p className="text-sm text-text-secondary">Loading system status...</p>
                   )}
                </div>
              </div>

              <div className="bg-bg-surface border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Recent Users</h3>
                <div className="space-y-3">
                  {users.slice(-5).reverse().map(u => (
                    <div key={u.id} className="flex justify-between items-center p-3 rounded-lg border border-border bg-bg-primary">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="font-medium text-sm">{u.name}</p>
                          <p className="text-xs text-text-secondary">{u.email}</p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-md font-medium bg-bg-surface border border-border capitalize">
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="space-y-6 fade-in">
             <div className="bg-bg-surface border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">Manage Users</h3>
                  <button 
                    onClick={() => { setEditingUser(null); setUserForm({name:'', email:'', role:'student', password:''}); setShowUserModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus size={16}/> Add User
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border text-text-secondary text-sm">
                        <th className="pb-3 font-medium">Name</th>
                        <th className="pb-3 font-medium">Email</th>
                        <th className="pb-3 font-medium">Role</th>
                        <th className="pb-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b border-border last:border-0 hover:bg-bg-primary transition-colors">
                          <td className="py-4 flex items-center gap-3">
                            <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full bg-border" />
                            <span className="font-medium text-sm">{u.name}</span>
                          </td>
                          <td className="py-4 text-sm text-text-secondary">{u.email}</td>
                          <td className="py-4 text-sm text-text-secondary capitalize">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                              u.role === 'admin' ? 'bg-danger/10 text-danger' :
                              u.role === 'teacher' ? 'bg-warning/10 text-warning' :
                              'bg-primary/10 text-primary'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => { setEditingUser(u); setUserForm(u); setShowUserModal(true); }}
                                  className="p-2 text-text-secondary hover:text-primary bg-bg-primary border border-border rounded-lg transition-colors"
                                ><Edit size={16}/></button>
                                <button 
                                  onClick={() => deleteUser(u.id)}
                                  className="p-2 text-text-secondary hover:text-danger bg-bg-primary border border-border rounded-lg transition-colors"
                                ><Trash size={16}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
          </div>
        );
      case 'courses':
        return (
          <div className="space-y-6 fade-in">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Courses & Subjects</h2>
                <button 
                  onClick={() => { setEditingCourse(null); setCourseForm({name:'', code:'', credits:3, teacher_id: 1}); setShowCourseModal(true); }}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus size={16}/> Add Course
                </button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(c => (
                    <div key={c.id} className="glass p-6 rounded-2xl border border-border shadow-sm hover-lift relative group flex flex-col">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={()=> {setEditingCourse(c); setCourseForm(c); setShowCourseModal(true);}} className="w-8 h-8 rounded-lg bg-bg-surface border border-border text-text-secondary hover:text-primary shadow-sm flex items-center justify-center"><Edit size={14}/></button>
                            <button onClick={()=> deleteCourse(c.id)} className="w-8 h-8 rounded-lg bg-bg-surface border border-border text-text-secondary hover:text-danger shadow-sm flex items-center justify-center"><Trash size={14}/></button>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                            <BookOpen size={24} />
                        </div>
                        <h3 className="text-lg font-bold mb-1">{c.name}</h3>
                        <p className="text-sm text-text-secondary mb-4 font-mono">{c.code}</p>
                        <div className="mt-auto pt-4 border-t border-border flex justify-between items-center text-sm">
                            <span className="font-medium text-text-secondary">{c.credits} Credits</span>
                            <span className="font-medium text-text-primary">Teacher ID: {c.teacher_id}</span>
                        </div>
                    </div>
                ))}
             </div>
          </div>
        );
      case 'announcements':
        return (
          <div className="space-y-6 fade-in">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Notice Board</h2>
                <button 
                  onClick={() => { setEditingAnn(null); setAnnForm({title:'', content:'', date:''}); setShowAnnModal(true); }}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus size={16}/> Create Notice
                </button>
             </div>
             <div className="space-y-4">
                {announcements.map(a => (
                    <div key={a.id} className="glass p-5 rounded-2xl border border-border shadow-sm hover-lift flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-text-primary mb-1">{a.title}</h3>
                            <p className="text-sm text-text-secondary mb-2">{a.content}</p>
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">{a.date}</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={()=> {setEditingAnn(a); setAnnForm(a); setShowAnnModal(true);}} className="px-3 py-1.5 text-sm rounded-lg bg-bg-primary border border-border hover:text-primary transition-colors">Edit</button>
                            <button onClick={()=> deleteAnn(a.id)} className="px-3 py-1.5 text-sm rounded-lg bg-bg-primary border border-border hover:text-danger transition-colors">Delete</button>
                        </div>
                    </div>
                ))}
             </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6 fade-in max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">System Settings</h2>
            
            <div className="glass p-6 rounded-2xl border border-border shadow-sm">
                <h3 className="text-lg font-bold mb-4 border-b border-border pb-2">Appearance</h3>
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-text-primary">Dark Mode</h4>
                        <p className="text-sm text-text-secondary">Toggle global dark theme</p>
                    </div>
                    <button 
                        onClick={toggleTheme}
                        className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isDarkMode ? 'bg-primary' : 'bg-border'}`}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : ''}`}></div>
                    </button>
                </div>
            </div>

            <div className="glass p-6 rounded-2xl border border-border shadow-sm">
                <h3 className="text-lg font-bold mb-4 border-b border-border pb-2">Danger Zone</h3>
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-text-primary">Reset Database</h4>
                        <p className="text-sm text-text-secondary">Clear local session data</p>
                    </div>
                    <button 
                        onClick={() => {
                            if(window.confirm('Are you sure you want to clear your local session?')) {
                                localStorage.clear();
                                navigate('/');
                            }
                        }}
                        className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90 transition-colors font-medium text-sm shadow-md"
                    >
                        Reset Session
                    </button>
                </div>
            </div>
          </div>
        );
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

      {/* Modals */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
            <div className="bg-bg-surface w-full max-w-md rounded-2xl border border-border shadow-xl p-6">
                <h3 className="text-xl font-bold mb-4">{editingUser ? 'Edit User' : 'Add User'}</h3>
                <form onSubmit={handleUserSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Name</label>
                        <input required type="text" value={userForm.name} onChange={e=>setUserForm({...userForm, name: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Email</label>
                        <input required type="email" value={userForm.email} onChange={e=>setUserForm({...userForm, email: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-primary" />
                    </div>
                    {!editingUser && (
                    <div>
                        <label className="block text-sm font-bold mb-1">Password</label>
                        <input required type="password" value={userForm.password} onChange={e=>setUserForm({...userForm, password: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-primary" />
                    </div>
                    )}
                    <div>
                        <label className="block text-sm font-bold mb-1">Role</label>
                        <select value={userForm.role} onChange={e=>setUserForm({...userForm, role: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-primary">
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex gap-3 justify-end mt-6">
                        <button type="button" onClick={()=>setShowUserModal(false)} className="px-4 py-2 rounded-lg bg-bg-primary border border-border text-text-secondary hover:text-text-primary transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">Save</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {showCourseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
            <div className="bg-bg-surface w-full max-w-md rounded-2xl border border-border shadow-xl p-6">
                <h3 className="text-xl font-bold mb-4">{editingCourse ? 'Edit Course' : 'Add Course'}</h3>
                <form onSubmit={handleCourseSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Course Name</label>
                        <input required type="text" value={courseForm.name} onChange={e=>setCourseForm({...courseForm, name: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Course Code</label>
                        <input required type="text" value={courseForm.code} onChange={e=>setCourseForm({...courseForm, code: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Credits</label>
                        <input required type="number" value={courseForm.credits} onChange={e=>setCourseForm({...courseForm, credits: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Teacher ID</label>
                        <input required type="number" value={courseForm.teacher_id} onChange={e=>setCourseForm({...courseForm, teacher_id: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-primary" />
                    </div>
                    <div className="flex gap-3 justify-end mt-6">
                        <button type="button" onClick={()=>setShowCourseModal(false)} className="px-4 py-2 rounded-lg bg-bg-primary border border-border text-text-secondary hover:text-text-primary transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">Save</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {showAnnModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
            <div className="bg-bg-surface w-full max-w-md rounded-2xl border border-border shadow-xl p-6">
                <h3 className="text-xl font-bold mb-4">{editingAnn ? 'Edit Notice' : 'Create Notice'}</h3>
                <form onSubmit={handleAnnSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Title</label>
                        <input required type="text" value={annForm.title} onChange={e=>setAnnForm({...annForm, title: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Content</label>
                        <textarea required value={annForm.content} onChange={e=>setAnnForm({...annForm, content: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-primary" rows="4"></textarea>
                    </div>
                    <div className="flex gap-3 justify-end mt-6">
                        <button type="button" onClick={()=>setShowAnnModal(false)} className="px-4 py-2 rounded-lg bg-bg-primary border border-border text-text-secondary hover:text-text-primary transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">Save</button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
