/**
 * store.js - Handles LocalStorage Operations and Mock Data Generation
 */

class Store {
  constructor() {
    this.initMockData();
  }

  // Generic Get and Set for LocalStorage
  get(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Insert a new item into an array stored at 'key'
  insert(key, item) {
    const list = this.get(key) || [];
    // Auto-increment ID if missing
    if (!item.id) {
        const maxId = list.reduce((max, i) => (i.id > max ? i.id : max), 0);
        item.id = maxId + 1;
    }
    list.push(item);
    this.set(key, list);
    return item;
  }

  // Delete an item by ID from an array stored at 'key'
  delete(key, id) {
    const list = this.get(key) || [];
    const filtered = list.filter(item => item.id !== id);
    this.set(key, filtered);
  }

  // Update an item by ID
  update(key, id, newData) {
    const list = this.get(key) || [];
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
        list[index] = { ...list[index], ...newData };
        this.set(key, list);
        return list[index];
    }
    return null;
  }

  // Initialization of mock data if it doesn't exist
  initMockData() {
    if (!this.get('initialized')) {
      // Mock Users
      const users = [
        { id: 1, name: 'John Doe', role: 'student', email: 'student@school.com', password: 'password', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff' },
        { id: 2, name: 'Jane Smith', role: 'teacher', email: 'teacher@school.com', password: 'password', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=10b981&color=fff' },
        { id: 3, name: 'Admin User', role: 'admin', email: 'admin@school.com', password: 'password', avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=4f46e5&color=fff' }
      ];
      this.set('users', users);

      // Mock Courses & Subjects
      const subjects = [
        { id: 101, name: 'Data Structures', code: 'CS201', credits: 4, teacherId: 2 },
        { id: 102, name: 'Web Development', code: 'CS301', credits: 3, teacherId: 2 },
        { id: 103, name: 'Database Management', code: 'CS401', credits: 4, teacherId: 2 }
      ];
      this.set('subjects', subjects);

      // Mock Attendance (Student View)
      const attendance = {
        totalClasses: 45,
        attendedClasses: 38,
        percentage: ((38 / 45) * 100).toFixed(2),
        monthlyData: [85, 90, 75, 88, 92, 85], // Jan-Jun percentages
        subjectWise: [
          { subject: 'Data Structures', attended: 15, total: 15 },
          { subject: 'Web Development', attended: 12, total: 15 },
          { subject: 'Database Management', attended: 11, total: 15 }
        ]
      };
      this.set('attendance_1', attendance); // user 1 attendance

      // Mock Marks (Student View)
      const marks = [
        { subject: 'Data Structures', internal: 28, mid: 45, end: 85, total: 158, outOf: 200 },
        { subject: 'Web Development', internal: 25, mid: 42, end: 80, total: 147, outOf: 200 },
        { subject: 'Database Management', internal: 22, mid: 40, end: 75, total: 137, outOf: 200 }
      ];
      this.set('marks_1', marks);

      // Mock Assignments
      const assignments = [
        { id: 1, title: 'Build a Portfolio', subject: 'Web Development', dueDate: '2023-12-15', status: 'Pending' },
        { id: 2, title: 'Binary Tree Implementation', subject: 'Data Structures', dueDate: '2023-11-20', status: 'Completed' },
        { id: 3, title: 'SQL Normalization', subject: 'Database Management', dueDate: '2023-11-25', status: 'Completed' }
      ];
      this.set('assignments', assignments);

      // Mock CGPA Data
      const semesters = [
        { sem: 1, sgpa: 8.5 },
        { sem: 2, sgpa: 8.8 },
        { sem: 3, sgpa: 8.2 }
      ];
      this.set('semesters_1', semesters);

      // Mock Timetable (Today)
      const timetable = [
        { time: '09:00 AM - 10:00 AM', subject: 'Data Structures', room: 'Room 302' },
        { time: '10:00 AM - 11:00 AM', subject: 'Web Development', room: 'Lab 1' },
        { time: '11:30 AM - 12:30 PM', subject: 'Database Management', room: 'Room 304' }
      ];
      this.set('timetable', timetable);

      // Mock Announcements
      const announcements = [
        { id: 1, title: 'Mid-Sem Exams Scheduled', date: '2023-10-15', content: 'Exams will start from next week.' },
        { id: 2, title: 'Holiday on Friday', date: '2023-10-20', content: 'College will remain closed.' }
      ];
      this.set('announcements', announcements);

      // Mark initialized
      this.set('initialized', true);
    }
  }
}

// Global instance
const store = new Store();
