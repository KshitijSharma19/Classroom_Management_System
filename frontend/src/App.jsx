import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import StudentLayout from './components/StudentLayout';
import StudentDashboard from './pages/student/DashboardOverview';
import Courses from './pages/student/Courses';
import Assignments from './pages/student/Assignments';
import Grades from './pages/student/Grades';
import NoticeBoard from './pages/student/NoticeBoard';
import Settings from './pages/student/Settings';

const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

import TeacherLayout from './components/TeacherLayout';
import TeacherDashboard from './pages/teacher/DashboardOverview';
import TeacherClasses from './pages/teacher/Classes';
import TeacherStudents from './pages/teacher/Students';
import TeacherAssignments from './pages/teacher/Assignments';
import TeacherNoticeBoard from './pages/teacher/NoticeBoard';
import TeacherSettings from './pages/teacher/Settings';

import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/DashboardOverview';
import AdminUsers from './pages/admin/Users';
import AdminSubjects from './pages/admin/Subjects';
import AdminSettings from './pages/admin/Settings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/student" element={
        <PrivateRoute role="student">
          <StudentLayout />
        </PrivateRoute>
      }>
        <Route index element={<StudentDashboard />} />
        <Route path="courses" element={<Courses />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="grades" element={<Grades />} />
        <Route path="notices" element={<NoticeBoard />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="/teacher" element={
        <PrivateRoute role="teacher">
          <TeacherLayout />
        </PrivateRoute>
      }>
        <Route index element={<TeacherDashboard />} />
        <Route path="classes" element={<TeacherClasses />} />
        <Route path="students" element={<TeacherStudents />} />
        <Route path="assignments" element={<TeacherAssignments />} />
        <Route path="notices" element={<TeacherNoticeBoard />} />
        <Route path="settings" element={<TeacherSettings />} />
      </Route>
      <Route path="/admin" element={
        <PrivateRoute role="admin">
          <AdminLayout />
        </PrivateRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="subjects" element={<AdminSubjects />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}

export default App;
