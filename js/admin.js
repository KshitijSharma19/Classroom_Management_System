/**
 * admin.js - Admin Dashboard Logic
 */

class AdminDashboard {
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

    // Make switchSection global for dropdown
    window.switchSection = (target) => {
      const link = document.querySelector(`.nav-link[data-target="${target}"]`);
      if (link) link.click();
    };

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
        case 'users': this.renderUsers(); break;
        case 'courses': this.renderCourses(); break;
        case 'fees': this.renderFees(); break;
        case 'notices': this.renderNotices(); break;
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
    const students = users.filter(u => u.role === 'student').length;
    const teachers = users.filter(u => u.role === 'teacher').length;
    const courses = store.get('subjects') || [];
    
    let html = `
      <div class="fade-in">
        <h2 class="text-2xl font-bold mb-6">System Overview</h2>
        
        <!-- Dashboard Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="glass p-6 rounded-2xl border border-border shadow-sm hover-lift cursor-pointer" onclick="switchSection('users')">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-text-secondary text-sm font-medium mb-1">Total Students</p>
                <h3 class="text-3xl font-bold text-primary">${students * 125}</h3>
              </div>
              <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <i class="fas fa-user-graduate text-xl"></i>
              </div>
            </div>
          </div>
          
          <div class="glass p-6 rounded-2xl border border-border shadow-sm hover-lift cursor-pointer" onclick="switchSection('users')">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-text-secondary text-sm font-medium mb-1">Total Teachers</p>
                <h3 class="text-3xl font-bold text-success">${teachers * 12}</h3>
              </div>
              <div class="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success">
                <i class="fas fa-chalkboard-teacher text-xl"></i>
              </div>
            </div>
          </div>

          <div class="glass p-6 rounded-2xl border border-border shadow-sm hover-lift cursor-pointer" onclick="switchSection('courses')">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-text-secondary text-sm font-medium mb-1">Total Courses</p>
                <h3 class="text-3xl font-bold text-warning">${courses.length * 4}</h3>
              </div>
              <div class="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center text-warning">
                <i class="fas fa-book text-xl"></i>
              </div>
            </div>
          </div>

          <div class="glass p-6 rounded-2xl border border-border shadow-sm hover-lift">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-text-secondary text-sm font-medium mb-1">Overall Attendance</p>
                <h3 class="text-3xl font-bold text-danger">88%</h3>
              </div>
              <div class="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center text-danger">
                <i class="fas fa-chart-line text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 glass p-6 rounded-2xl border border-border shadow-sm">
            <h3 class="text-lg font-bold mb-4">University Growth</h3>
            <div class="chart-container">
              <canvas id="systemGrowthChart"></canvas>
            </div>
          </div>
          
          <div class="glass p-6 rounded-2xl border border-border shadow-sm">
            <h3 class="text-lg font-bold mb-4">Department Distribution</h3>
            <div class="chart-container relative">
              <canvas id="deptDistributionChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;

    this.contentArea.innerHTML = html;

    // Growth Chart
    const isDark = document.documentElement.classList.contains('dark');
    const ctxGrowth = document.getElementById('systemGrowthChart').getContext('2d');
    this.charts.growth = new Chart(ctxGrowth, {
      type: 'line',
      data: {
        labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
        datasets: [
          {
            label: 'Students',
            data: [500, 800, 1200, 1500, 2000, 2500],
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Teachers',
            data: [50, 70, 100, 120, 150, 180],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { grid: { color: isDark ? '#334155' : '#e2e8f0' }, ticks: { color: isDark ? '#cbd5e1' : '#475569' } },
          x: { grid: { display: false }, ticks: { color: isDark ? '#cbd5e1' : '#475569' } }
        },
        plugins: {
          legend: { labels: { color: isDark ? '#cbd5e1' : '#475569' } }
        }
      }
    });

    // Dept Chart
    const ctxDept = document.getElementById('deptDistributionChart').getContext('2d');
    this.charts.dept = new Chart(ctxDept, {
      type: 'doughnut',
      data: {
        labels: ['Computer Science', 'Electrical', 'Mechanical', 'Civil'],
        datasets: [{
          data: [45, 25, 20, 10],
          backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { position: 'bottom', labels: { color: isDark ? '#cbd5e1' : '#475569', padding: 20 } }
        }
      }
    });
  }

  renderUsers() {
    // Generate dummy list based on store
    const users = store.get('users') || [];
    let displayUsers = [
        ...users,
        { id: 4, name: 'Alice Johnson', email: 'alice@school.com', role: 'student' },
        { id: 5, name: 'Dr. Robert Smith', email: 'robert@school.com', role: 'teacher' },
        { id: 6, name: 'Charlie Brown', email: 'charlie@school.com', role: 'student' },
        { id: 7, name: 'Emma Wilson', email: 'emma@school.com', role: 'teacher' }
    ];

    window.openAddUserModal = () => {
        ui.showConfirmModal('Add User', `
            <div class="space-y-4 text-left mt-4">
                <div><label class="text-xs font-bold">Name</label><input type="text" id="add-user-name" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary"></div>
                <div><label class="text-xs font-bold">Email</label><input type="email" id="add-user-email" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary"></div>
                <div><label class="text-xs font-bold">Role</label>
                    <select id="add-user-role" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary">
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>
        `, () => {
            const name = document.getElementById('add-user-name').value;
            const email = document.getElementById('add-user-email').value;
            const role = document.getElementById('add-user-role').value;
            
            if(name && email) {
                store.insert('users', {
                    name, email, role, password: 'password', 
                    avatar: `https://ui-avatars.com/api/?name=${name.replace(' ','+')}&background=random&color=fff`
                });
                ui.showToast('User added successfully!', 'success');
                this.loadSection('users'); // re-render
            } else {
                ui.showToast('Please fill all fields', 'error');
            }
        });
    };

    window.openEditUserModal = (id) => {
        const users = store.get('users') || [];
        const user = users.find(u => u.id === id);
        if(!user) return;
        
        ui.showConfirmModal('Edit User', `
            <div class="space-y-4 text-left mt-4">
                <div><label class="text-xs font-bold">Name</label><input type="text" id="edit-user-name" value="${user.name}" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary"></div>
                <div><label class="text-xs font-bold">Email</label><input type="email" id="edit-user-email" value="${user.email}" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary"></div>
                <div><label class="text-xs font-bold">Role</label>
                    <select id="edit-user-role" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary">
                        <option value="student" ${user.role === 'student' ? 'selected' : ''}>Student</option>
                        <option value="teacher" ${user.role === 'teacher' ? 'selected' : ''}>Teacher</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </div>
            </div>
        `, () => {
            const name = document.getElementById('edit-user-name').value;
            const email = document.getElementById('edit-user-email').value;
            const role = document.getElementById('edit-user-role').value;
            
            if(name && email) {
                store.update('users', id, { name, email, role });
                ui.showToast('User updated successfully!', 'success');
                this.loadSection('users');
            }
        });
    };

    let html = `
      <div class="fade-in h-full flex flex-col">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Manage Users</h2>
          <button class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent-hover transition-colors font-medium shadow-md" onclick="openAddUserModal()">
            <i class="fas fa-plus mr-2"></i> Add User
          </button>
        </div>

        <div class="glass flex-1 rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
          <!-- Filters -->
          <div class="p-4 border-b border-border flex flex-wrap gap-4 items-center justify-between bg-bg-surface/50">
            <div class="relative">
                <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
                <input type="text" placeholder="Search by name, email..." class="pl-10 pr-4 py-2 rounded-lg border border-border bg-bg-primary text-sm focus:outline-none focus:border-primary w-full sm:w-64 transition-all-300">
            </div>
            <div class="flex gap-2">
                <select class="px-3 py-2 rounded-lg border border-border bg-bg-primary text-sm focus:outline-none focus:border-primary">
                    <option>All Roles</option>
                    <option>Student</option>
                    <option>Teacher</option>
                    <option>Admin</option>
                </select>
                <button class="px-3 py-2 rounded-lg border border-border bg-bg-primary text-text-secondary hover:bg-bg-surface transition-colors">
                    <i class="fas fa-filter"></i>
                </button>
            </div>
          </div>
          
          <!-- Table -->
          <div class="overflow-x-auto flex-1 custom-scrollbar">
            <table class="w-full text-left border-collapse">
              <thead class="sticky top-0 bg-bg-surface border-b border-border shadow-sm">
                <tr class="text-text-secondary text-sm">
                  <th class="p-4 font-medium">User Details</th>
                  <th class="p-4 font-medium">Role</th>
                  <th class="p-4 font-medium">Status</th>
                  <th class="p-4 font-medium">Last Login</th>
                  <th class="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border-color">
                ${displayUsers.map(u => {
                    const roleColor = u.role === 'admin' ? 'danger' : (u.role === 'teacher' ? 'success' : 'accent-color');
                    return `
                      <tr class="hover:bg-bg-surface/50 transition-colors group">
                        <td class="p-4">
                            <div class="flex items-center gap-3">
                                <img src="${u.avatar || `https://ui-avatars.com/api/?name=${u.name.replace(' ','+')}&background=random&color=fff`}" class="w-10 h-10 rounded-full border-2 border-bg-primary">
                                <div>
                                    <div class="font-bold">${u.name}</div>
                                    <div class="text-xs text-text-secondary">${u.email}</div>
                                </div>
                            </div>
                        </td>
                        <td class="p-4">
                            <span class="px-2.5 py-1 bg-${roleColor}/10 text-${roleColor} font-bold rounded-md text-xs capitalize">${u.role}</span>
                        </td>
                        <td class="p-4">
                            <span class="flex items-center gap-1.5 text-xs font-medium text-success"><div class="w-2 h-2 rounded-full bg-success"></div> Active</span>
                        </td>
                        <td class="p-4 text-sm text-text-secondary">Just now</td>
                        <td class="p-4 text-right">
                            <div class="flex justify-end gap-2">
                                <button class="w-8 h-8 rounded-lg bg-bg-primary border border-border text-text-secondary hover:text-primary hover:border-primary transition-colors" title="Edit" onclick="openEditUserModal(${u.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="w-8 h-8 rounded-lg bg-bg-primary border border-border text-text-secondary hover:text-danger hover:border-danger transition-colors" title="Delete" onclick="ui.showConfirmModal('Delete User', 'Are you sure you want to permanently delete this user?', () => this.parentElement.parentElement.parentElement.remove())">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                      </tr>
                    `
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    this.contentArea.innerHTML = html;
  }

  renderCourses() {
    const subjects = store.get('subjects') || [];
    
    window.openAddCourseModal = () => {
        ui.showConfirmModal('Add Course', `
            <div class="space-y-4 text-left mt-4">
                <div><label class="text-xs font-bold">Course Name</label><input type="text" id="add-course-name" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary"></div>
                <div><label class="text-xs font-bold">Course Code</label><input type="text" id="add-course-code" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary"></div>
                <div><label class="text-xs font-bold">Credits</label><input type="number" id="add-course-credits" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary"></div>
                <div><label class="text-xs font-bold">Teacher ID</label><input type="number" id="add-course-teacher" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary"></div>
            </div>
        `, () => {
            const name = document.getElementById('add-course-name').value;
            const code = document.getElementById('add-course-code').value;
            const credits = parseInt(document.getElementById('add-course-credits').value);
            const teacherId = parseInt(document.getElementById('add-course-teacher').value);
            
            if(name && code && credits && teacherId) {
                store.insert('subjects', { name, code, credits, teacherId });
                ui.showToast('Course added successfully!', 'success');
                this.loadSection('courses');
            } else {
                ui.showToast('Please fill all fields', 'error');
            }
        });
    };

    window.openEditCourseModal = (id) => {
        const courses = store.get('subjects') || [];
        const course = courses.find(c => c.id === id);
        if(!course) return;
        
        ui.showConfirmModal('Edit Course', `
            <div class="space-y-4 text-left mt-4">
                <div><label class="text-xs font-bold">Course Name</label><input type="text" id="edit-course-name" value="${course.name}" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary"></div>
                <div><label class="text-xs font-bold">Course Code</label><input type="text" id="edit-course-code" value="${course.code}" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary"></div>
                <div><label class="text-xs font-bold">Credits</label><input type="number" id="edit-course-credits" value="${course.credits}" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary"></div>
                <div><label class="text-xs font-bold">Teacher ID</label><input type="number" id="edit-course-teacher" value="${course.teacherId}" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary"></div>
            </div>
        `, () => {
            const name = document.getElementById('edit-course-name').value;
            const code = document.getElementById('edit-course-code').value;
            const credits = parseInt(document.getElementById('edit-course-credits').value);
            const teacherId = parseInt(document.getElementById('edit-course-teacher').value);
            
            if(name && code && credits && teacherId) {
                store.update('subjects', id, { name, code, credits, teacherId });
                ui.showToast('Course updated successfully!', 'success');
                this.loadSection('courses');
            }
        });
    };
    
    window.deleteCourse = (id) => {
        ui.showConfirmModal('Delete', 'Delete course?', () => {
            store.delete('subjects', id);
            ui.showToast('Course deleted', 'success');
            this.loadSection('courses');
        });
    }

    this.contentArea.innerHTML = `
      <div class="fade-in">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Courses & Subjects</h2>
          <button class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent-hover transition-colors font-medium shadow-md" onclick="openAddCourseModal()">
            <i class="fas fa-plus mr-2"></i> Add Course
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${subjects.map(s => `
              <div class="glass p-6 rounded-2xl border border-border shadow-sm hover-lift relative group flex flex-col">
                <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="w-8 h-8 rounded bg-bg-surface border border-border text-text-secondary hover:text-primary shadow-sm" title="Edit" onclick="openEditCourseModal(${s.id})"><i class="fas fa-edit text-xs"></i></button>
                    <button class="w-8 h-8 rounded bg-bg-surface border border-border text-text-secondary hover:text-danger shadow-sm" title="Delete" onclick="deleteCourse(${s.id})"><i class="fas fa-trash text-xs"></i></button>
                </div>
                
                <div class="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 text-xl">
                    <i class="fas fa-book"></i>
                </div>
                
                <h3 class="text-lg font-bold mb-1">${s.name}</h3>
                <p class="text-sm text-text-secondary mb-4 font-mono">${s.code}</p>
                
                <div class="mt-auto pt-4 border-t border-border flex justify-between items-center text-sm">
                    <span class="font-medium text-text-secondary"><i class="fas fa-star text-warning mr-1"></i> ${s.credits} Credits</span>
                    <span class="font-medium text-text-primary"><i class="fas fa-user-tie text-primary mr-1"></i> Prof. ID: ${s.teacherId}</span>
                </div>
              </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderFees() {
    this.contentArea.innerHTML = `
      <div class="fade-in h-full flex flex-col items-center justify-center text-center">
        <div class="w-32 h-32 bg-success/10 rounded-full flex items-center justify-center text-success mb-6 animate-pulse">
            <i class="fas fa-file-invoice-dollar text-5xl"></i>
        </div>
        <h2 class="text-2xl font-bold mb-2">Fee Management Module</h2>
        <p class="text-text-secondary max-w-md">This module integrates with payment gateways to track student fee status, generate receipts, and manage scholarships. Available in premium version.</p>
      </div>
    `;
  }

  renderNotices() {
    const announcements = store.get('announcements') || [];
    
    window.openAddNoticeModal = () => {
        ui.showConfirmModal('Create Notice', `
            <div class="space-y-4 text-left mt-4">
                <div><label class="text-xs font-bold">Title</label><input type="text" id="add-notice-title" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary"></div>
                <div><label class="text-xs font-bold">Content</label><textarea id="add-notice-content" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary" rows="3"></textarea></div>
            </div>
        `, () => {
            const title = document.getElementById('add-notice-title').value;
            const content = document.getElementById('add-notice-content').value;
            if(title && content) {
                store.insert('announcements', {
                    title, content, date: new Date().toISOString().split('T')[0]
                });
                ui.showToast('Notice added successfully!', 'success');
                this.loadSection('notices'); // re-render
            } else {
                ui.showToast('Please fill all fields', 'error');
            }
        });
    };
    
    window.deleteNotice = (id) => {
        ui.showConfirmModal('Delete', 'Delete notice?', () => {
            store.delete('announcements', id);
            ui.showToast('Notice deleted', 'success');
            this.loadSection('notices');
        });
    }

    window.openEditNoticeModal = (id) => {
        const announcements = store.get('announcements') || [];
        const notice = announcements.find(n => n.id === id);
        if(!notice) return;
        
        ui.showConfirmModal('Edit Notice', `
            <div class="space-y-4 text-left mt-4">
                <div><label class="text-xs font-bold">Title</label><input type="text" id="edit-notice-title" value="${notice.title}" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary"></div>
                <div><label class="text-xs font-bold">Content</label><textarea id="edit-notice-content" class="w-full px-3 py-2 border rounded-lg bg-bg-surface text-text-primary" rows="3">${notice.content}</textarea></div>
            </div>
        `, () => {
            const title = document.getElementById('edit-notice-title').value;
            const content = document.getElementById('edit-notice-content').value;
            if(title && content) {
                store.update('announcements', id, { title, content });
                ui.showToast('Notice updated successfully!', 'success');
                this.loadSection('notices');
            }
        });
    };

    this.contentArea.innerHTML = `
      <div class="fade-in max-w-4xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Notice Board Management</h2>
          <button class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent-hover transition-colors font-medium shadow-md" onclick="openAddNoticeModal()">
            <i class="fas fa-bullhorn mr-2"></i> Create Notice
          </button>
        </div>
        
        <div class="space-y-4">
            ${announcements.map(a => `
                <div class="glass p-5 rounded-2xl border border-border shadow-sm hover-lift flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 class="text-lg font-bold text-text-primary mb-1">${a.title}</h3>
                        <p class="text-sm text-text-secondary mb-2">${a.content}</p>
                        <span class="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded"><i class="far fa-calendar-alt mr-1"></i> ${a.date}</span>
                    </div>
                    <div class="flex gap-2">
                        <button class="px-3 py-1.5 text-sm rounded bg-bg-primary border border-border hover:text-primary transition-colors" onclick="openEditNoticeModal(${a.id})">Edit</button>
                        <button class="px-3 py-1.5 text-sm rounded bg-bg-primary border border-border hover:text-danger transition-colors" onclick="deleteNotice(${a.id})">Delete</button>
                    </div>
                </div>
            `).join('')}
        </div>
      </div>
    `;
  }

  renderSettings() {
    this.contentArea.innerHTML = `
      <div class="fade-in max-w-3xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">System Settings</h2>
        
        <div class="glass p-6 rounded-2xl border border-border shadow-sm mb-6">
            <h3 class="text-lg font-bold mb-4 border-b border-border pb-2">Appearance</h3>
            <div class="flex items-center justify-between">
                <div>
                    <h4 class="font-medium text-text-primary">Dark Mode</h4>
                    <p class="text-sm text-text-secondary">Toggle global dark theme</p>
                </div>
                <button class="w-12 h-6 bg-border-color rounded-full relative transition-colors duration-300" onclick="themeManager.toggleTheme(); this.classList.toggle('bg-primary'); this.querySelector('div').classList.toggle('translate-x-6')">
                    <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform duration-300 ${document.documentElement.classList.contains('dark') ? 'translate-x-6' : ''}"></div>
                </button>
            </div>
        </div>

        <div class="glass p-6 rounded-2xl border border-border shadow-sm mb-6">
            <h3 class="text-lg font-bold mb-4 border-b border-border pb-2">Danger Zone</h3>
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h4 class="font-medium text-text-primary">Reset Database</h4>
                    <p class="text-sm text-text-secondary">Clear all mock data from LocalStorage</p>
                </div>
                <button class="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90 transition-colors font-medium text-sm shadow-md" onclick="ui.showConfirmModal('Reset DB', 'This will wipe all data. Are you sure?', () => { localStorage.clear(); window.location.href='index.html'; })">
                    Reset DB
                </button>
            </div>
        </div>
      </div>
    `;
    
    // Initial state for toggle
    const toggleBtn = document.querySelector('.bg-border-color.rounded-full');
    if(document.documentElement.classList.contains('dark') && toggleBtn) {
        toggleBtn.classList.add('bg-primary');
    }
  }
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('admin.html') && auth.getCurrentUser()) {
    new AdminDashboard();
  }
});
