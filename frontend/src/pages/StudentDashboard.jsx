import React, { useState, useEffect } from 'react';
import { Home, BookOpen, Calendar, CheckSquare, BarChart, Clock, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import apiService from '../api/apiService';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  
  const [assignments, setAssignments] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/');
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'student') {
      navigate('/');
      return;
    }
    
    setUser(parsedUser);

    const fetchData = async () => {
      try {
        const [assignmentsRes, timetableRes, attendanceRes, gradesRes, subjectsRes] = await Promise.all([
          apiService.getAssignments(),
          apiService.getTimetable(parsedUser.id),
          apiService.getAttendance(parsedUser.id),
          apiService.getGrades(parsedUser.id),
          apiService.getSubjects()
        ]);
        
        // Filter assignments for this student
        setAssignments(assignmentsRes.data.filter(a => a.student_id === parsedUser.id));
        setTimetable(timetableRes.data);
        setAttendanceData(attendanceRes.data);
        setGrades(gradesRes.data);
        setSubjects(subjectsRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [navigate]);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home, active: activeTab === 'overview', onClick: setActiveTab },
    { id: 'courses', label: 'My Courses', icon: BookOpen, active: activeTab === 'courses', onClick: setActiveTab },
    { id: 'timetable', label: 'Timetable', icon: Calendar, active: activeTab === 'timetable', onClick: setActiveTab },
    { id: 'assignments', label: 'Assignments', icon: CheckSquare, active: activeTab === 'assignments', onClick: setActiveTab },
    { id: 'grades', label: 'Grades & Attendance', icon: BarChart, active: activeTab === 'grades', onClick: setActiveTab },
  ];

  const getSubjectName = (id) => {
    const sub = subjects.find(s => s.id === id);
    return sub ? sub.name : 'Unknown Subject';
  };

  const renderContent = () => {
    // Calculate Attendance Percentage
    const totalDays = attendanceData.length;
    const presentDays = attendanceData.filter(a => a.status === 'Present').length;
    const attendancePercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 'N/A';

    // Calculate CGPA (Average Score / 10 for CGPA representation)
    const totalScore = grades.reduce((acc, grade) => acc + grade.score, 0);
    const cgpa = grades.length > 0 ? ((totalScore / grades.length) / 10).toFixed(2) : 'N/A';

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6 fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-2xl flex flex-col justify-center hover-lift transition-all-300">
                <p className="text-text-secondary text-sm font-medium mb-1">Attendance</p>
                <h3 className="text-3xl font-bold text-primary">{attendancePercentage}%</h3>
                <p className="text-xs text-success mt-2">Overall status</p>
              </div>
              <div className="glass p-6 rounded-2xl flex flex-col justify-center hover-lift transition-all-300">
                <p className="text-text-secondary text-sm font-medium mb-1">Pending Assignments</p>
                <h3 className="text-3xl font-bold text-warning">{assignments.filter(a => a.status === 'Pending').length}</h3>
                <p className="text-xs text-text-secondary mt-2">Active tasks</p>
              </div>
              <div className="glass p-6 rounded-2xl flex flex-col justify-center hover-lift transition-all-300">
                <p className="text-text-secondary text-sm font-medium mb-1">Current CGPA</p>
                <h3 className="text-3xl font-bold text-accent">{cgpa}</h3>
                <p className="text-xs text-success mt-2">Overall Performance</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-bg-surface border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Recent Assignments</h3>
                <div className="space-y-3">
                  {assignments.slice(0, 4).map(assignment => (
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

              <div className="bg-bg-surface border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Today's Schedule</h3>
                <div className="space-y-4">
                  {timetable.length > 0 ? (
                    timetable.map((item, index) => (
                      <div key={item.id} className={`flex gap-4 items-start relative pl-4 border-l-2 ${index === 0 ? 'border-primary' : 'border-border'}`}>
                        <div className={`absolute w-3 h-3 bg-bg-surface border-2 rounded-full -left-[7px] top-1 ${index === 0 ? 'border-primary' : 'border-border'}`}></div>
                        <div>
                          <p className={`text-xs font-semibold mb-1 ${index === 0 ? 'text-primary' : 'text-text-secondary'}`}>{item.time}</p>
                          <h4 className="font-medium text-sm">{getSubjectName(item.subject_id)}</h4>
                          <p className="text-xs text-text-secondary">{item.room}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-text-secondary">No classes scheduled for today.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 'courses':
        return (
          <div className="space-y-6 fade-in">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Enrolled Courses</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map(c => (
                    <div key={c.id} className="glass p-6 rounded-2xl border border-border shadow-sm hover-lift flex flex-col">
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
             </div>
          </div>
        );
      case 'timetable':
        return (
          <div className="space-y-6 fade-in">
             <div className="bg-bg-surface border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-6">Weekly Schedule</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border text-text-secondary text-sm">
                        <th className="pb-3 font-medium">Time</th>
                        <th className="pb-3 font-medium">Subject</th>
                        <th className="pb-3 font-medium">Room</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timetable.map((item) => (
                        <tr key={item.id} className="border-b border-border last:border-0 hover:bg-bg-primary transition-colors">
                          <td className="py-4 flex items-center gap-2 font-medium text-sm text-text-primary">
                            <Clock size={16} className="text-primary"/> {item.time}
                          </td>
                          <td className="py-4 text-sm font-medium">{getSubjectName(item.subject_id)}</td>
                          <td className="py-4 text-sm text-text-secondary">{item.room}</td>
                        </tr>
                      ))}
                      {timetable.length === 0 && (
                          <tr><td colSpan="3" className="text-center py-8 text-text-secondary text-sm">No classes scheduled.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
          </div>
        );
      case 'assignments':
        return (
          <div className="space-y-6 fade-in">
             <div className="bg-bg-surface border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4">All Assignments</h3>
                <div className="space-y-3">
                  {assignments.map(assignment => (
                    <div key={assignment.id} className="flex justify-between items-center p-4 rounded-lg border border-border bg-bg-primary hover:border-primary transition-colors cursor-pointer">
                      <div>
                        <p className="font-bold text-sm">{assignment.title}</p>
                        <p className="text-xs text-text-secondary mt-1">Due: {assignment.due_date} • {getSubjectName(assignment.subject_id)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-xs px-3 py-1 rounded-md font-medium ${assignment.status === 'Completed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                          {assignment.status}
                        </span>
                        <button className="text-xs font-medium text-primary hover:underline">Submit / View</button>
                      </div>
                    </div>
                  ))}
                  {assignments.length === 0 && <p className="text-sm text-text-secondary">No assignments found.</p>}
                </div>
              </div>
          </div>
        );
      case 'grades':
        return (
          <div className="space-y-6 fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-bg-surface border border-border rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-6">Grades</h3>
                    <div className="space-y-4">
                      {grades.map(g => (
                        <div key={g.id} className="flex justify-between items-center border-b border-border pb-3 last:border-0">
                          <div className="flex items-center gap-3">
                              <Award size={18} className="text-accent" />
                              <span className="text-sm font-medium">{getSubjectName(g.subject_id)}</span>
                          </div>
                          <span className="font-bold text-text-primary">{g.score.toFixed(1)} / 100</span>
                        </div>
                      ))}
                      {grades.length === 0 && <p className="text-sm text-text-secondary">No grades available.</p>}
                    </div>
                 </div>
                 <div className="bg-bg-surface border border-border rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-6">Attendance Record</h3>
                    <div className="space-y-4">
                      {attendanceData.map(a => (
                        <div key={a.id} className="flex justify-between items-center border-b border-border pb-3 last:border-0">
                          <span className="text-sm font-medium">{a.date}</span>
                          <span className={`text-xs px-2 py-1 rounded-md font-medium ${a.status === 'Present' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                              {a.status}
                          </span>
                        </div>
                      ))}
                      {attendanceData.length === 0 && <p className="text-sm text-text-secondary">No attendance records found.</p>}
                    </div>
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
    </div>
  );
};

export default StudentDashboard;
