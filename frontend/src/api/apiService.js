import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
});

export const apiService = {
  login: (email, password) => {
    return api.post('/login', null, { params: { email, password } });
  },
  
  // Users
  getUsers: () => api.get('/users/'),
  createUser: (data) => api.post('/users/', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),

  // Subjects
  getSubjects: () => api.get('/subjects/'),
  createSubject: (data) => api.post('/subjects/', data),
  updateSubject: (id, data) => api.put(`/subjects/${id}`, data),
  deleteSubject: (id) => api.delete(`/subjects/${id}`),
  
  // Assignments
  getAssignments: () => api.get('/assignments/'),
  createAssignment: (data) => api.post('/assignments/', data),
  updateAssignment: (id, data) => api.put(`/assignments/${id}`, data),
  deleteAssignment: (id) => api.delete(`/assignments/${id}`),
  
  // Announcements
  getAnnouncements: () => api.get('/announcements/'),
  createAnnouncement: (data) => api.post('/announcements/', data),
  updateAnnouncement: (id, data) => api.put(`/announcements/${id}`, data),
  deleteAnnouncement: (id) => api.delete(`/announcements/${id}`),
  
  // Grades
  getGrades: (studentId) => api.get(`/grades/${studentId}`),
  createGrade: (data) => api.post('/grades/', data),
  
  // Attendance
  getAttendance: (studentId) => api.get(`/attendance/${studentId}`),
  createAttendance: (data) => api.post('/attendance/', data),
  
  // Timetable
  getTimetable: (studentId) => api.get(`/timetable/${studentId}`),
  
  // System Status
  getSystemStatus: () => api.get('/system-status')
};

export default apiService;
