/**
 * teacher.js - Teacher Dashboard Logic
 */

class TeacherDashboard {
  constructor() {
    this.user = auth.getCurrentUser();
    this.contentArea = document.getElementById('main-content');
    this.charts = {};
    
    this.initNavigation();
    this.loadSection('dashboard');
  }

  initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active class
        navLinks.forEach(l => {
          l.classList.remove('bg-primary/10', 'text-primary', 'border-r-4', 'border-primary', 'active');
          l.classList.add('text-text-secondary');
        });
        
        link.classList.add('bg-primary/10', 'text-primary', 'border-r-4', 'border-primary', 'active');
        link.classList.remove('text-text-secondary');
        
        const target = link.getAttribute('data-target');
        this.loadSection(target);
        
        if (window.innerWidth < 1024) {
          document.getElementById('sidebar').classList.remove('sidebar-open');
        }
      });
    });

    const dropLogout = document.getElementById('dropdown-logout');
    if (dropLogout) {
      dropLogout.addEventListener('click', (e) => {
        e.preventDefault();
        ui.showConfirmModal('Logout', 'Are you sure you want to log out?', () => auth.logout());
      });
    }
  }

  loadSection(section) {
    Object.values(this.charts).forEach(chart => chart.destroy());
    this.charts = {};

    this.contentArea.innerHTML = '<div class="flex justify-center items-center h-full"><i class="fas fa-spinner fa-spin text-3xl text-primary"></i></div>';
    
    setTimeout(() => {
      switch (section) {
        case 'dashboard': this.renderDashboard(); break;
        case 'students': this.renderStudents(); break;
        case 'attendance': this.renderAttendance(); break;
        case 'marks': this.renderMarks(); break;
        case 'assignments': this.renderAssignments(); break;
        case 'analytics': this.renderAnalytics(); break;
        case 'classes': this.renderClasses(); break;
        case 'settings': this.renderSettings(); break;
        default: this.renderDashboard();
      }
    }, 200);
  }

  // ==========================================
  // Render Methods
  // ==========================================

  renderDashboard() {
    const users = store.get('users') || [];
    const students = users.filter(u => u.role === 'student');
    const assignments = store.get('assignments') || [];
    
    let html = `
      <div class="fade-in">
        <h2 class="text-2xl font-bold mb-6">Overview, Prof. ${this.user.name.split(' ')[1]}</h2>
        
        <!-- Dashboard Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="glass p-6 rounded-2xl border border-border shadow-sm hover-lift">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-text-secondary text-sm font-medium mb-1">Total Classes</p>
                <h3 class="text-3xl font-bold text-primary">3</h3>
              </div>
              <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <i class="fas fa-chalkboard text-xl"></i>
              </div>
            </div>
          </div>
          
          <div class="glass p-6 rounded-2xl border border-border shadow-sm hover-lift cursor-pointer" onclick="document.querySelector('[data-target=students]').click()">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-text-secondary text-sm font-medium mb-1">Total Students</p>
                <h3 class="text-3xl font-bold text-success">${students.length * 45}</h3>
              </div>
              <div class="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success">
                <i class="fas fa-users text-xl"></i>
              </div>
            </div>
          </div>

          <div class="glass p-6 rounded-2xl border border-border shadow-sm hover-lift cursor-pointer" onclick="document.querySelector('[data-target=assignments]').click()">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-text-secondary text-sm font-medium mb-1">Active Assignments</p>
                <h3 class="text-3xl font-bold text-warning">${assignments.length}</h3>
              </div>
              <div class="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center text-warning">
                <i class="fas fa-file-alt text-xl"></i>
              </div>
            </div>
          </div>

          <div class="glass p-6 rounded-2xl border border-border shadow-sm hover-lift">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-text-secondary text-sm font-medium mb-1">Today's Attendance</p>
                <h3 class="text-3xl font-bold text-primary">85%</h3>
              </div>
              <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <i class="fas fa-user-check text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="glass p-6 rounded-2xl border border-border shadow-sm">
            <h3 class="text-lg font-bold mb-4">Class Performance (Data Structures)</h3>
            <div class="chart-container">
              <canvas id="classPerformanceChart"></canvas>
            </div>
          </div>
          
          <div class="glass p-6 rounded-2xl border border-border shadow-sm">
             <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold">Today's Schedule</h3>
                <button class="text-primary text-sm"><i class="fas fa-plus mr-1"></i> Add Class</button>
             </div>
             <div class="space-y-4">
                <div class="flex items-center gap-4 p-3 bg-bg-surface rounded-xl border border-border">
                   <div class="w-2 h-12 bg-primary rounded-full"></div>
                   <div class="flex-1">
                      <h4 class="font-bold">Data Structures (CS201)</h4>
                      <p class="text-sm text-text-secondary">Room 302 • Year 2</p>
                   </div>
                   <div class="text-right">
                      <p class="font-bold text-primary">09:00 AM</p>
                      <button class="text-xs px-2 py-1 bg-primary text-white rounded mt-1">Start</button>
                   </div>
                </div>
                
                <div class="flex items-center gap-4 p-3 bg-bg-surface rounded-xl border border-border">
                   <div class="w-2 h-12 bg-warning rounded-full"></div>
                   <div class="flex-1">
                      <h4 class="font-bold">Web Development (CS301)</h4>
                      <p class="text-sm text-text-secondary">Lab 1 • Year 3</p>
                   </div>
                   <div class="text-right">
                      <p class="font-bold text-text-primary">10:00 AM</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    `;

    this.contentArea.innerHTML = html;

    // Render Performance Chart
    const ctx = document.getElementById('classPerformanceChart').getContext('2d');
    const isDark = document.documentElement.classList.contains('dark');
    this.charts.performance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['O', 'A+', 'A', 'B+', 'B', 'F'],
        datasets: [{
          label: 'Number of Students',
          data: [5, 15, 10, 8, 4, 3],
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)',
            'rgba(52, 211, 153, 0.8)',
            'rgba(96, 165, 250, 0.8)',
            'rgba(251, 191, 36, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ],
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: isDark ? '#334155' : '#e2e8f0' },
            ticks: { color: isDark ? '#cbd5e1' : '#475569', stepSize: 5 }
          },
          x: {
            grid: { display: false },
            ticks: { color: isDark ? '#cbd5e1' : '#475569' }
          }
        }
      }
    });
  }

  renderStudents() {
    // Generate dummy students based on store users
    const users = store.get('users') || [];
    let students = users.filter(u => u.role === 'student');
    
    // Add some more mock students for display
    if(students.length < 5) {
        students = [
            ...students,
            { id: 4, name: 'Alice Johnson', email: 'alice@school.com', roll: 'STU-0002', grade: 'A' },
            { id: 5, name: 'Bob Williams', email: 'bob@school.com', roll: 'STU-0003', grade: 'B+' },
            { id: 6, name: 'Charlie Brown', email: 'charlie@school.com', roll: 'STU-0004', grade: 'A+' }
        ];
    } else {
        students = students.map(s => ({...s, roll: `STU-${s.id.toString().padStart(4, '0')}`, grade: 'A'}))
    }

    window.openAddStudentModal = () => {
        ui.showConfirmModal('Add Student', `
            <div class="space-y-4 text-left mt-4">
                <div><label class="text-xs font-bold">Name</label><input type="text" id="add-student-name" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary"></div>
                <div><label class="text-xs font-bold">Email</label><input type="email" id="add-student-email" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary"></div>
                <div><label class="text-xs font-bold">Roll Number</label><input type="text" id="add-student-roll" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary"></div>
                <div><label class="text-xs font-bold">Initial Grade</label><input type="text" id="add-student-grade" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary"></div>
            </div>
        `, () => {
            const name = document.getElementById('add-student-name').value;
            const email = document.getElementById('add-student-email').value;
            const roll = document.getElementById('add-student-roll').value;
            const grade = document.getElementById('add-student-grade').value || 'N/A';
            
            if(name && email && roll) {
                store.insert('users', {
                    name, email, role: 'student', password: 'password', roll, grade,
                    avatar: `https://ui-avatars.com/api/?name=${name.replace(' ','+')}&background=random&color=fff`
                });
                ui.showToast('Student added successfully!', 'success');
                this.loadSection('students');
            } else {
                ui.showToast('Please fill required fields', 'error');
            }
        });
    };

    window.openEditStudentModal = (id) => {
        const users = store.get('users') || [];
        const student = users.find(u => u.id === id);
        if(!student) return;

        ui.showConfirmModal('Edit Student', `
            <div class="space-y-4 text-left mt-4">
                <div><label class="text-xs font-bold">Name</label><input type="text" id="edit-student-name" value="${student.name}" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary"></div>
                <div><label class="text-xs font-bold">Email</label><input type="email" id="edit-student-email" value="${student.email}" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary"></div>
                <div><label class="text-xs font-bold">Roll Number</label><input type="text" id="edit-student-roll" value="${student.roll || ''}" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary"></div>
                <div><label class="text-xs font-bold">Grade</label><input type="text" id="edit-student-grade" value="${student.grade || ''}" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary"></div>
            </div>
        `, () => {
            const name = document.getElementById('edit-student-name').value;
            const email = document.getElementById('edit-student-email').value;
            const roll = document.getElementById('edit-student-roll').value;
            const grade = document.getElementById('edit-student-grade').value;
            
            if(name && email) {
                store.update('users', id, { name, email, roll, grade });
                ui.showToast('Student updated successfully!', 'success');
                this.loadSection('students');
            }
        });
    };

    window.deleteStudent = (id) => {
        ui.showConfirmModal('Delete Student', 'Remove this student?', () => {
            store.delete('users', id);
            ui.showToast('Student removed', 'success');
            this.loadSection('students');
        });
    };

    let html = `
      <div class="fade-in h-full flex flex-col">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Manage Students</h2>
          <button class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent-hover transition-colors font-medium shadow-md" onclick="openAddStudentModal()">
            <i class="fas fa-user-plus mr-2"></i> Add Student
          </button>
        </div>

        <div class="glass flex-1 rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
          <!-- Filters -->
          <div class="p-4 border-b border-border flex flex-wrap gap-4 items-center justify-between bg-bg-surface/50">
            <div class="relative">
                <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
                <input type="text" placeholder="Search students..." class="pl-10 pr-4 py-2 rounded-lg border border-border bg-bg-primary text-sm focus:outline-none focus:border-primary w-full sm:w-64 transition-all-300">
            </div>
            <div class="flex gap-2">
                <select class="px-3 py-2 rounded-lg border border-border bg-bg-primary text-sm focus:outline-none focus:border-primary">
                    <option>All Classes</option>
                    <option>Year 1</option>
                    <option>Year 2</option>
                </select>
            </div>
          </div>
          
          <!-- Table -->
          <div class="overflow-x-auto flex-1 custom-scrollbar">
            <table class="w-full text-left border-collapse">
              <thead class="sticky top-0 bg-bg-surface border-b border-border shadow-sm">
                <tr class="text-text-secondary text-sm">
                  <th class="p-4 font-medium"><input type="checkbox" class="rounded text-primary focus:ring-primary"></th>
                  <th class="p-4 font-medium cursor-pointer hover:text-primary">Student <i class="fas fa-sort ml-1"></i></th>
                  <th class="p-4 font-medium">Roll Number</th>
                  <th class="p-4 font-medium">Email</th>
                  <th class="p-4 font-medium text-center">Avg Grade</th>
                  <th class="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border-color">
                ${students.map(s => `
                  <tr class="hover:bg-bg-surface/50 transition-colors group">
                    <td class="p-4"><input type="checkbox" class="rounded text-primary focus:ring-primary border-border"></td>
                    <td class="p-4">
                        <div class="flex items-center gap-3">
                            <img src="${s.avatar || `https://ui-avatars.com/api/?name=${s.name.replace(' ','+')}&background=random&color=fff`}" class="w-8 h-8 rounded-full">
                            <span class="font-bold">${s.name}</span>
                        </div>
                    </td>
                    <td class="p-4 text-text-secondary">${s.roll || `STU-${s.id}`}</td>
                    <td class="p-4 text-text-secondary">${s.email}</td>
                    <td class="p-4 text-center">
                        <span class="px-2.5 py-1 bg-success/10 text-success font-bold rounded-md text-xs">${s.grade}</span>
                    </td>
                    <td class="p-4 text-right">
                        <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button class="w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors" title="Edit" onclick="openEditStudentModal(${s.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="w-8 h-8 rounded-lg bg-danger/10 text-danger hover:bg-danger hover:text-white transition-colors" title="Delete" onclick="deleteStudent(${s.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div class="p-4 border-t border-border flex justify-between items-center bg-bg-surface/50">
            <span class="text-sm text-text-secondary">Showing 1 to ${students.length} of ${students.length} entries</span>
            <div class="flex gap-1">
                <button class="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-text-secondary hover:bg-bg-primary transition-colors disabled:opacity-50" disabled><i class="fas fa-chevron-left text-xs"></i></button>
                <button class="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center transition-colors">1</button>
                <button class="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-text-secondary hover:bg-bg-primary transition-colors disabled:opacity-50" disabled><i class="fas fa-chevron-right text-xs"></i></button>
            </div>
          </div>
        </div>
      </div>
    `;
    this.contentArea.innerHTML = html;
  }

  renderAttendance() {
    this.contentArea.innerHTML = `
      <div class="fade-in max-w-5xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Mark Attendance</h2>
        
        <div class="glass p-6 rounded-2xl border border-border shadow-sm mb-6">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium text-text-secondary mb-1">Class/Subject</label>
                    <select class="w-full px-4 py-2 rounded-lg border border-border bg-bg-surface focus:ring-2 focus:ring-primary focus:border-transparent">
                        <option>Data Structures (CS201)</option>
                        <option>Web Development (CS301)</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-text-secondary mb-1">Date</label>
                    <input type="date" class="w-full px-4 py-2 rounded-lg border border-border bg-bg-surface focus:ring-2 focus:ring-primary focus:border-transparent" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="flex items-end">
                    <button class="w-full py-2 bg-primary text-white rounded-lg hover:bg-accent-hover transition-colors font-bold shadow-md">Fetch Roster</button>
                </div>
            </div>
        </div>

        <div class="glass rounded-2xl border border-border shadow-sm overflow-hidden">
            <div class="p-4 border-b border-border flex justify-between items-center bg-bg-surface/50">
                <h3 class="font-bold">Student Roster</h3>
                <div class="flex gap-2">
                    <button class="px-3 py-1.5 bg-success/10 text-success border border-success/20 rounded-lg text-sm font-medium hover:bg-success hover:text-white transition-colors" onclick="document.querySelectorAll('.attendance-radio[value=present]').forEach(r => r.checked = true)">Mark All Present</button>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-bg-surface border-b border-border text-text-secondary text-sm">
                            <th class="p-4 font-medium">Roll No</th>
                            <th class="p-4 font-medium">Student Name</th>
                            <th class="p-4 font-medium text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border-color">
                        <!-- Mock Rows -->
                        <tr class="hover:bg-bg-surface/50 transition-colors">
                            <td class="p-4 text-text-secondary">STU-0001</td>
                            <td class="p-4 font-bold">John Doe</td>
                            <td class="p-4">
                                <div class="flex justify-center gap-4">
                                    <label class="flex items-center gap-1 cursor-pointer text-success font-medium">
                                        <input type="radio" name="att_1" value="present" class="attendance-radio text-success focus:ring-success" checked> Present
                                    </label>
                                    <label class="flex items-center gap-1 cursor-pointer text-danger font-medium">
                                        <input type="radio" name="att_1" value="absent" class="attendance-radio text-danger focus:ring-danger"> Absent
                                    </label>
                                </div>
                            </td>
                        </tr>
                        <tr class="hover:bg-bg-surface/50 transition-colors">
                            <td class="p-4 text-text-secondary">STU-0002</td>
                            <td class="p-4 font-bold">Alice Johnson</td>
                            <td class="p-4">
                                <div class="flex justify-center gap-4">
                                    <label class="flex items-center gap-1 cursor-pointer text-success font-medium">
                                        <input type="radio" name="att_2" value="present" class="attendance-radio text-success focus:ring-success" checked> Present
                                    </label>
                                    <label class="flex items-center gap-1 cursor-pointer text-danger font-medium">
                                        <input type="radio" name="att_2" value="absent" class="attendance-radio text-danger focus:ring-danger"> Absent
                                    </label>
                                </div>
                            </td>
                        </tr>
                        <tr class="hover:bg-bg-surface/50 transition-colors bg-danger/5">
                            <td class="p-4 text-text-secondary">STU-0003</td>
                            <td class="p-4 font-bold">Bob Williams</td>
                            <td class="p-4">
                                <div class="flex justify-center gap-4">
                                    <label class="flex items-center gap-1 cursor-pointer text-success font-medium">
                                        <input type="radio" name="att_3" value="present" class="attendance-radio text-success focus:ring-success"> Present
                                    </label>
                                    <label class="flex items-center gap-1 cursor-pointer text-danger font-medium">
                                        <input type="radio" name="att_3" value="absent" class="attendance-radio text-danger focus:ring-danger" checked> Absent
                                    </label>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="p-4 border-t border-border bg-bg-surface/50 flex justify-end">
                <button class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-accent-hover transition-colors font-bold shadow-md" onclick="ui.showToast('Attendance saved successfully!', 'success')">Save Attendance</button>
            </div>
        </div>
      </div>
    `;
  }

  renderMarks() {
    this.contentArea.innerHTML = `
      <div class="fade-in max-w-5xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Upload Marks</h2>
        
        <div class="glass p-6 rounded-2xl border border-border shadow-sm mb-6 flex flex-wrap gap-4 items-end">
            <div class="flex-1 min-w-[200px]">
                <label class="block text-sm font-medium text-text-secondary mb-1">Subject</label>
                <select class="w-full px-4 py-2 rounded-lg border border-border bg-bg-surface focus:ring-2 focus:ring-primary">
                    <option>Data Structures (CS201)</option>
                </select>
            </div>
            <div class="flex-1 min-w-[200px]">
                <label class="block text-sm font-medium text-text-secondary mb-1">Exam Type</label>
                <select class="w-full px-4 py-2 rounded-lg border border-border bg-bg-surface focus:ring-2 focus:ring-primary">
                    <option>Mid Semester (50)</option>
                    <option>Internal (30)</option>
                    <option>End Semester (100)</option>
                </select>
            </div>
            <button class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-accent-hover transition-colors font-bold shadow-md h-[42px]">Load Students</button>
        </div>

        <div class="glass rounded-2xl border border-border shadow-sm overflow-hidden">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-bg-surface border-b border-border text-text-secondary text-sm">
                        <th class="p-4 font-medium">Roll No</th>
                        <th class="p-4 font-medium">Student Name</th>
                        <th class="p-4 font-medium w-48 text-center">Marks Obtained</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border-color">
                    <tr class="hover:bg-bg-surface/50 transition-colors">
                        <td class="p-4 text-text-secondary">STU-0001</td>
                        <td class="p-4 font-bold">John Doe</td>
                        <td class="p-4">
                            <input type="number" min="0" max="50" value="45" class="w-full text-center px-3 py-1.5 rounded-lg border border-border bg-bg-surface focus:ring-2 focus:ring-primary">
                        </td>
                    </tr>
                    <tr class="hover:bg-bg-surface/50 transition-colors">
                        <td class="p-4 text-text-secondary">STU-0002</td>
                        <td class="p-4 font-bold">Alice Johnson</td>
                        <td class="p-4">
                            <input type="number" min="0" max="50" value="42" class="w-full text-center px-3 py-1.5 rounded-lg border border-border bg-bg-surface focus:ring-2 focus:ring-primary">
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="p-4 border-t border-border bg-bg-surface/50 flex justify-end">
                <button class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-accent-hover transition-colors font-bold shadow-md" onclick="ui.showToast('Marks uploaded successfully!', 'success')">Submit Marks</button>
            </div>
        </div>
      </div>
    `;
  }

  renderAssignments() {
    const assignments = store.get('assignments') || [];
    
    window.openAddAssignmentModal = () => {
        ui.showConfirmModal('Create Assignment', `
            <div class="space-y-4 text-left mt-4">
                <div><label class="text-xs font-bold">Title</label><input type="text" id="add-assign-title" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary"></div>
                <div><label class="text-xs font-bold">Subject</label>
                    <select id="add-assign-subject" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary">
                        <option>Data Structures</option>
                        <option>Web Development</option>
                        <option>Database Management</option>
                    </select>
                </div>
                <div><label class="text-xs font-bold">Due Date</label><input type="date" id="add-assign-date" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary"></div>
            </div>
        `, () => {
            const title = document.getElementById('add-assign-title').value;
            const subject = document.getElementById('add-assign-subject').value;
            const dueDate = document.getElementById('add-assign-date').value;
            
            if(title && dueDate) {
                store.insert('assignments', {
                    title, subject, dueDate, status: 'Pending'
                });
                ui.showToast('Assignment created successfully!', 'success');
                this.loadSection('assignments'); // re-render
            } else {
                ui.showToast('Please fill all fields', 'error');
            }
        });
    };
    
    window.deleteAssignment = (id) => {
        ui.showConfirmModal('Delete Assignment', 'Are you sure?', () => {
            store.delete('assignments', id);
            ui.showToast('Assignment deleted', 'success');
            this.loadSection('assignments');
        });
    };

    this.contentArea.innerHTML = `
      <div class="fade-in">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Manage Assignments</h2>
          <button class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent-hover transition-colors font-medium shadow-md" onclick="openAddAssignmentModal()">
            <i class="fas fa-plus mr-2"></i> Create Assignment
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${assignments.map(a => `
              <div class="glass p-5 rounded-2xl border border-border shadow-sm hover-lift relative group flex flex-col">
                <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="w-8 h-8 rounded bg-bg-surface border border-border text-text-secondary hover:text-primary shadow-sm" title="Edit" onclick="openEditAssignmentModal(${a.id})"><i class="fas fa-edit text-xs"></i></button>
                    <button class="w-8 h-8 rounded bg-bg-surface border border-border text-text-secondary hover:text-danger shadow-sm" title="Delete" onclick="deleteAssignment(${a.id})"><i class="fas fa-trash text-xs"></i></button>
                </div>
                
                <h3 class="text-lg font-bold mb-1 pr-16">${a.title}</h3>
                <p class="text-sm text-text-secondary mb-4"><i class="fas fa-book-open text-xs mr-1"></i> ${a.subject}</p>
                
                <div class="mt-auto pt-4 border-t border-border flex justify-between items-center">
                    <span class="text-xs font-bold text-danger bg-danger/10 px-2.5 py-1 rounded-md"><i class="far fa-clock mr-1"></i> Due: ${a.dueDate}</span>
                    <button class="text-sm font-bold text-primary hover:underline">View Submissions (12/45)</button>
                </div>
              </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderAnalytics() {
    this.contentArea.innerHTML = `
      <div class="fade-in h-full flex flex-col items-center justify-center text-center">
        <div class="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 animate-bounce">
            <i class="fas fa-chart-pie text-5xl"></i>
        </div>
        <h2 class="text-2xl font-bold mb-2">Advanced Analytics</h2>
        <p class="text-text-secondary max-w-md">Detailed performance analytics, trend reports, and class comparative charts will be available in the next major update.</p>
      </div>
    `;
  }

  renderClasses() {
    const classes = [
      { id: 'CS201', name: 'Data Structures', room: 'Room 302', students: 45, time: 'Mon, Wed, Fri 09:00 AM' },
      { id: 'CS301', name: 'Web Development', room: 'Lab 1', students: 30, time: 'Tue, Thu 10:00 AM' },
      { id: 'CS401', name: 'Database Management', room: 'Room 205', students: 40, time: 'Wed, Fri 01:00 PM' }
    ];

    let html = `
      <div class="fade-in h-full flex flex-col">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">My Classes</h2>
          <button class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent-hover transition-colors font-medium shadow-md" onclick="ui.showToast('Feature coming soon!', 'info')">
            <i class="fas fa-plus mr-2"></i> Add Class
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${classes.map(c => `
            <div class="glass p-6 rounded-2xl border border-border shadow-sm hover-lift flex flex-col">
              <div class="flex justify-between items-start mb-4">
                <div class="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl shadow-sm">
                  <i class="fas fa-chalkboard"></i>
                </div>
                <span class="px-2.5 py-1 bg-surface border border-border text-xs font-bold rounded-lg text-text-secondary">${c.id}</span>
              </div>
              
              <h3 class="text-xl font-bold mb-1">${c.name}</h3>
              <p class="text-sm text-text-secondary mb-4"><i class="fas fa-map-marker-alt text-xs mr-2"></i>${c.room}</p>
              
              <div class="mt-auto pt-4 border-t border-border flex justify-between items-center text-sm font-medium">
                  <span class="text-text-secondary"><i class="fas fa-users mr-1"></i> ${c.students} Students</span>
                  <span class="text-primary"><i class="far fa-clock mr-1"></i> ${c.time.split(' ')[2]} ${c.time.split(' ')[3]}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    this.contentArea.innerHTML = html;
  }

  renderSettings() {
    let html = `
      <div class="fade-in max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Settings</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Profile Picture & Quick Stats -->
          <div class="lg:col-span-1 space-y-6">
            <div class="glass p-6 rounded-2xl border border-border shadow-sm text-center relative overflow-hidden">
              <div class="h-24 bg-gradient-to-br from-primary to-accent-color absolute top-0 left-0 right-0 z-0"></div>
              
              <div class="relative z-10 mt-8 mb-4">
                <img src="${this.user.avatar}" class="w-32 h-32 rounded-full border-4 border-bg-primary bg-surface object-cover mx-auto shadow-xl">
                <button class="absolute bottom-0 right-1/2 transform translate-x-12 bg-primary text-white w-10 h-10 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center border-2 border-bg-primary">
                  <i class="fas fa-camera"></i>
                </button>
              </div>
              
              <h3 class="text-xl font-bold relative z-10">${this.user.name}</h3>
              <p class="text-sm text-text-secondary relative z-10 mb-4">${this.user.email}</p>
              
              <div class="flex justify-center gap-2 mb-4 relative z-10">
                <span class="px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold border border-primary/20 capitalize">${this.user.role}</span>
                <span class="px-3 py-1 bg-surface text-text-secondary rounded-lg text-xs font-bold border border-border">FAC-2023-${this.user.id.toString().padStart(4, '0')}</span>
              </div>
            </div>
            
            <div class="glass p-6 rounded-2xl border border-border shadow-sm">
              <h4 class="font-bold mb-4">App Preferences</h4>
              <div class="flex items-center justify-between p-3 bg-surface rounded-xl border border-border mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-text-primary text-bg-primary flex items-center justify-center"><i class="fas fa-moon"></i></div>
                  <div>
                    <p class="text-sm font-bold">Dark Mode</p>
                    <p class="text-xs text-text-secondary">Toggle app theme</p>
                  </div>
                </div>
                <button class="w-12 h-6 bg-border rounded-full relative transition-colors duration-300 ${document.documentElement.classList.contains('dark') ? 'bg-primary' : ''}" onclick="themeManager.toggleTheme(); this.classList.toggle('bg-primary'); this.querySelector('div').classList.toggle('translate-x-6')">
                    <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform duration-300 ${document.documentElement.classList.contains('dark') ? 'translate-x-6' : ''}"></div>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Details Form -->
          <div class="lg:col-span-2">
            <div class="glass p-6 rounded-2xl border border-border shadow-sm mb-6">
              <h3 class="text-lg font-bold mb-6 flex items-center gap-2"><i class="fas fa-user-edit text-primary"></i> Personal Information</h3>
              
              <form class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
                    <input type="text" class="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm" value="${this.user.name}">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
                    <input type="email" class="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text-secondary cursor-not-allowed shadow-sm" value="${this.user.email}" readonly disabled>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-text-secondary mb-2">Phone Number</label>
                    <input type="text" class="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm" placeholder="+1 234 567 8900" value="+1 987 654 3210">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-text-secondary mb-2">Department</label>
                    <input type="text" class="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm" value="Computer Science">
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-text-secondary mb-2">Office Address</label>
                    <textarea class="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm" rows="3" placeholder="Enter your office address...">Room 404, Tech Building, University Campus</textarea>
                  </div>
                </div>
                
                <div class="flex justify-end pt-4 border-t border-border">
                  <button type="button" class="px-6 py-2.5 bg-gradient-primary text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all text-sm font-bold flex items-center gap-2" onclick="ui.showToast('Profile updated successfully!', 'success')">
                    <i class="fas fa-save"></i> Save Changes
                  </button>
                </div>
              </form>
            </div>
            
            <div class="glass p-6 rounded-2xl border border-border shadow-sm border-l-4 border-l-danger">
              <h3 class="text-lg font-bold mb-2 text-danger">Security</h3>
              <p class="text-sm text-text-secondary mb-6">Manage your account security and password.</p>
              
              <button class="px-4 py-2 bg-danger/10 text-danger border border-danger/20 rounded-xl hover:bg-danger hover:text-white transition-all text-sm font-bold flex items-center gap-2">
                <i class="fas fa-key"></i> Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    this.contentArea.innerHTML = html;
  }
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('teacher.html') && auth.getCurrentUser()) {
    new TeacherDashboard();
  }
});
