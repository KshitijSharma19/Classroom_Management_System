/**
 * student.js - Student Dashboard Logic
 */

class StudentDashboard {
  constructor() {
    this.user = auth.getCurrentUser();
    this.contentArea = document.getElementById('main-content');
    this.charts = {}; // Store chart instances to destroy them before re-rendering

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

        // Close sidebar on mobile after click
        if (window.innerWidth < 1024) {
          document.getElementById('sidebar').classList.remove('sidebar-open');
        }
      });
    });

    // Make switchSection available globally for the dropdown
    window.switchSection = (target) => {
      const link = document.querySelector(`.nav-link[data-target="${target}"]`);
      if (link) link.click();
    };

    // Logout from dropdown
    const dropLogout = document.getElementById('dropdown-logout');
    if (dropLogout) {
      dropLogout.addEventListener('click', (e) => {
        e.preventDefault();
        ui.showConfirmModal('Logout', 'Are you sure you want to log out?', () => auth.logout());
      });
    }
  }

  loadSection(section) {
    // Clear existing charts
    Object.values(this.charts).forEach(chart => chart.destroy());
    this.charts = {};

    this.contentArea.innerHTML = '<div class="flex justify-center items-center h-full"><i class="fas fa-spinner fa-spin text-3xl text-primary"></i></div>';

    // Simulate slight network delay
    setTimeout(() => {
      switch (section) {
        case 'dashboard': this.renderDashboard(); break;
        case 'courses': this.renderCourses(); break;
        case 'assignments': this.renderAssignments(); break;
        case 'grades': this.renderGrades(); break;
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
    const attendance = store.get(`attendance_${this.user.id}`);
    const semesters = store.get(`semesters_${this.user.id}`);
    const assignments = store.get('assignments');

    // Calculate current CGPA
    let cgpa = 0;
    if (semesters && semesters.length > 0) {
      const totalSgpa = semesters.reduce((sum, sem) => sum + sem.sgpa, 0);
      cgpa = (totalSgpa / semesters.length).toFixed(2);
    }

    const pendingAssignments = assignments ? assignments.filter(a => a.status === 'Pending').length : 0;

    let html = `
      <div class="fade-in">
        <h2 class="text-2xl font-bold mb-6">Welcome back, ${this.user.name.split(' ')[0]}! 👋</h2>
        
        <!-- Dashboard Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="glass p-6 rounded-2xl border border-border shadow-sm hover-lift">
            <div class="flex justify-between items-start mb-4">
              <div>
                <p class="text-text-secondary text-sm font-medium mb-1">Attendance</p>
                <h3 class="text-3xl font-bold text-primary">${attendance ? attendance.percentage : 0}%</h3>
              </div>
              <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <i class="fas fa-calendar-check text-xl"></i>
              </div>
            </div>
            <div class="w-full bg-border-color rounded-full h-2">
              <div class="bg-primary h-2 rounded-full" style="width: ${attendance ? attendance.percentage : 0}%"></div>
            </div>
          </div>
          
          <div class="glass p-6 rounded-2xl border border-border shadow-sm hover-lift">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-text-secondary text-sm font-medium mb-1">Current CGPA</p>
                <h3 class="text-3xl font-bold text-success">${cgpa}</h3>
              </div>
              <div class="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success">
                <i class="fas fa-chart-line text-xl"></i>
              </div>
            </div>
          </div>

          <div class="glass p-6 rounded-2xl border border-border shadow-sm hover-lift">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-text-secondary text-sm font-medium mb-1">Pending Assignments</p>
                <h3 class="text-3xl font-bold text-warning">${pendingAssignments}</h3>
              </div>
              <div class="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center text-warning">
                <i class="fas fa-tasks text-xl"></i>
              </div>
            </div>
          </div>

          <div class="glass p-6 rounded-2xl border border-border shadow-sm hover-lift">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-text-secondary text-sm font-medium mb-1">Upcoming Exams</p>
                <h3 class="text-3xl font-bold text-danger">2</h3>
              </div>
              <div class="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center text-danger">
                <i class="fas fa-clock text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Chart Area -->
          <div class="lg:col-span-2 glass p-6 rounded-2xl border border-border shadow-sm">
            <h3 class="text-lg font-bold mb-4">Academic Progress</h3>
            <div class="chart-container">
              <canvas id="progressChart"></canvas>
            </div>
          </div>
          
          <!-- Side area -->
          <div class="space-y-6">
            <!-- Announcements -->
            <div class="glass p-6 rounded-2xl border border-border shadow-sm h-full">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold">Announcements</h3>
                <button class="text-primary text-sm hover:underline">View All</button>
              </div>
              <div class="space-y-4">
                ${store.get('announcements').map(a => `
                  <div class="p-3 bg-bg-surface rounded-xl border border-border hover:border-primary transition-colors cursor-pointer">
                    <h4 class="font-bold text-sm mb-1">${a.title}</h4>
                    <p class="text-xs text-text-secondary mb-2">${a.content}</p>
                    <span class="text-xs text-primary font-medium"><i class="far fa-calendar-alt mr-1"></i> ${a.date}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.contentArea.innerHTML = html;

    // Render Progress Chart (CGPA over semesters)
    if (semesters && semesters.length > 0) {
      const ctx = document.getElementById('progressChart').getContext('2d');
      const isDark = document.documentElement.classList.contains('dark');
      const textColor = isDark ? '#cbd5e1' : '#475569';
      const gridColor = isDark ? '#334155' : '#e2e8f0';

      this.charts.progress = new Chart(ctx, {
        type: 'line',
        data: {
          labels: semesters.map(s => `Sem ${s.sem}`),
          datasets: [{
            label: 'SGPA',
            data: semesters.map(s => s.sgpa),
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#4f46e5',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: false,
              min: 5,
              max: 10,
              grid: { color: gridColor },
              ticks: { color: textColor }
            },
            x: {
              grid: { display: false },
              ticks: { color: textColor }
            }
          }
        }
      });
    }
  }

  renderCourses() {
    // Generate some mock courses
    const courses = [
      { id: 'CS201', name: 'Data Structures', prof: 'Dr. Alan Turing', progress: 75, nextClass: 'Tomorrow, 10:00 AM' },
      { id: 'CS301', name: 'Web Development', prof: 'Dr. Ada Lovelace', progress: 90, nextClass: 'Today, 2:00 PM' },
      { id: 'CS401', name: 'Database Management', prof: 'Dr. E.F. Codd', progress: 40, nextClass: 'Wednesday, 11:30 AM' },
      { id: 'CS501', name: 'Machine Learning', prof: 'Dr. Geoffrey Hinton', progress: 60, nextClass: 'Thursday, 9:00 AM' }
    ];

    let html = `
      <div class="fade-in">
        <h2 class="text-2xl font-bold mb-6">My Courses</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          ${courses.map(course => `
            <div class="glass p-6 rounded-2xl border border-border shadow-sm hover-lift flex flex-col">
              <div class="flex justify-between items-start mb-4">
                <div class="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl shadow-sm">
                  <i class="fas fa-book"></i>
                </div>
                <span class="px-2.5 py-1 bg-surface border border-border text-xs font-bold rounded-lg text-text-secondary">${course.id}</span>
              </div>
              
              <h3 class="text-xl font-bold mb-1">${course.name}</h3>
              <p class="text-sm text-text-secondary mb-6"><i class="fas fa-user-tie mr-2"></i>${course.prof}</p>
              
              <div class="mt-auto">
                <div class="flex justify-between text-xs font-bold text-text-secondary mb-2">
                  <span>Syllabus Progress</span>
                  <span>${course.progress}%</span>
                </div>
                <div class="w-full bg-border rounded-full h-2 mb-4">
                  <div class="bg-primary h-2 rounded-full" style="width: ${course.progress}%"></div>
                </div>
                
                <div class="p-3 bg-surface border border-border rounded-xl text-sm font-medium flex justify-between items-center">
                  <span class="text-text-secondary"><i class="far fa-clock mr-1"></i> Next Class</span>
                  <span class="text-primary">${course.nextClass}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    this.contentArea.innerHTML = html;
  }

  renderAssignments() {
    const assignments = store.get('assignments') || [];

    let html = `
      <div class="fade-in">
        <div class="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 class="text-2xl font-bold">Assignments</h2>
          <div class="flex gap-2">
            <select class="px-3 py-1.5 rounded-lg border border-border bg-surface text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
              <option>All Subjects</option>
              <option>Data Structures</option>
              <option>Web Development</option>
            </select>
            <select class="px-3 py-1.5 rounded-lg border border-border bg-surface text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
              <option>All Status</option>
              <option>Pending</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${assignments.map(a => {
      const isCompleted = a.status === 'Completed';
      const statusColor = isCompleted ? 'success' : 'warning';
      const statusIcon = isCompleted ? 'fa-check-circle' : 'fa-hourglass-half';

      return `
              <div class="glass p-5 rounded-2xl border border-border shadow-sm hover-lift relative overflow-hidden group flex flex-col">
                <div class="absolute top-0 right-0 w-16 h-16 bg-${statusColor}/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
                
                <div class="flex justify-between items-start mb-4 relative z-10">
                  <span class="px-2.5 py-1 bg-${statusColor}/10 text-${statusColor} text-xs font-bold rounded-md flex items-center gap-1 border border-${statusColor}/20">
                    <i class="fas ${statusIcon}"></i> ${a.status}
                  </span>
                  <span class="text-xs text-text-secondary font-medium px-2 py-1 bg-surface rounded-md border border-border"><i class="far fa-clock text-danger"></i> Due: ${a.dueDate}</span>
                </div>
                
                <h3 class="text-lg font-bold mb-1 relative z-10">${a.title}</h3>
                <p class="text-sm text-text-secondary mb-6 relative z-10"><i class="fas fa-book-open text-xs mr-1 text-primary"></i> ${a.subject}</p>
                
                <div class="mt-auto relative z-10">
                  ${isCompleted ?
          `<button class="w-full py-2.5 bg-surface border border-border text-text-secondary rounded-xl text-sm font-bold cursor-not-allowed flex items-center justify-center gap-2">
                        <i class="fas fa-check"></i> Submitted
                     </button>` :
          `<button class="w-full py-2.5 bg-gradient-primary text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all text-sm font-bold flex items-center justify-center gap-2">
                        <i class="fas fa-cloud-upload-alt"></i> Submit Work
                     </button>`
        }
                </div>
              </div>
            `;
    }).join('')}
        </div>
      </div>
    `;
    this.contentArea.innerHTML = html;
  }

  renderGrades() {
    const marks = store.get(`marks_${this.user.id}`) || [];
    const semesters = store.get(`semesters_${this.user.id}`) || [];
    
    // Calculate current CGPA
    let cgpa = 0;
    if (semesters && semesters.length > 0) {
      const totalSgpa = semesters.reduce((sum, sem) => sum + sem.sgpa, 0);
      cgpa = (totalSgpa / semesters.length).toFixed(2);
    }

    let html = `
      <div class="fade-in max-w-6xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Grades & Reports</h2>
        
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="glass p-6 rounded-2xl border border-border shadow-sm flex items-center justify-between">
            <div>
              <p class="text-text-secondary text-sm font-medium mb-1">Cumulative GPA</p>
              <h3 class="text-3xl font-bold text-success">${cgpa}</h3>
            </div>
            <div class="w-14 h-14 bg-success/10 text-success rounded-full flex items-center justify-center text-2xl shadow-inner">
              <i class="fas fa-award"></i>
            </div>
          </div>
          
          <div class="glass p-6 rounded-2xl border border-border shadow-sm flex items-center justify-between">
            <div>
              <p class="text-text-secondary text-sm font-medium mb-1">Total Credits Earned</p>
              <h3 class="text-3xl font-bold text-primary">64</h3>
            </div>
            <div class="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl shadow-inner">
              <i class="fas fa-certificate"></i>
            </div>
          </div>

          <div class="glass p-6 rounded-2xl border border-border shadow-sm flex items-center justify-between">
            <div>
              <p class="text-text-secondary text-sm font-medium mb-1">Current Semester</p>
              <h3 class="text-3xl font-bold text-warning">4th</h3>
            </div>
            <div class="w-14 h-14 bg-warning/10 text-warning rounded-full flex items-center justify-center text-2xl shadow-inner">
              <i class="fas fa-calendar-alt"></i>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div class="glass p-6 rounded-2xl border border-border shadow-sm">
            <h3 class="text-lg font-bold mb-4">CGPA Trend</h3>
            <div class="chart-container h-64">
              <canvas id="cgpaTrendChart"></canvas>
            </div>
          </div>
          
          <div class="glass p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-center items-center text-center">
             <div class="relative w-32 h-32 mb-4">
                <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path class="text-surface" stroke-dasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3.8"/>
                  <path class="text-success" stroke-dasharray="${(cgpa/10)*100}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3.8" stroke-linecap="round"/>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center flex-col">
                  <span class="text-3xl font-bold text-success">${cgpa}</span>
                </div>
              </div>
             <h3 class="text-xl font-bold mb-2">First Class with Distinction</h3>
             <p class="text-text-secondary text-sm px-4">You are currently in the top 10% of your class. Maintain this performance in the upcoming exams!</p>
          </div>
        </div>

        <h3 class="text-xl font-bold mb-4">Current Semester Marks</h3>
        <div class="glass rounded-2xl border border-border shadow-sm overflow-hidden mb-6">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-surface border-b border-border text-text-secondary text-sm">
                  <th class="p-4 font-medium">Subject</th>
                  <th class="p-4 font-medium text-center">Internal (30)</th>
                  <th class="p-4 font-medium text-center">Mid Sem (50)</th>
                  <th class="p-4 font-medium text-center">End Sem (100)</th>
                  <th class="p-4 font-medium text-center">Total</th>
                  <th class="p-4 font-medium text-center">Grade</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                ${marks.map(m => {
                  const p = (m.total / m.outOf) * 100;
                  let grade = 'F';
                  if (p >= 90) grade = 'O';
                  else if (p >= 80) grade = 'A+';
                  else if (p >= 70) grade = 'A';
                  else if (p >= 60) grade = 'B+';
                  else if (p >= 50) grade = 'B';
                  
                  const gradeClass = grade === 'F' ? 'text-danger bg-danger/10' : 'text-success bg-success/10';
                  
                  return `
                    <tr class="hover:bg-surface/50 transition-colors">
                      <td class="p-4 font-bold">${m.subject}</td>
                      <td class="p-4 text-center text-text-secondary">${m.internal}</td>
                      <td class="p-4 text-center text-text-secondary">${m.mid}</td>
                      <td class="p-4 text-center text-text-secondary">${m.end}</td>
                      <td class="p-4 text-center font-bold">${m.total} <span class="text-xs text-text-secondary font-normal">/ ${m.outOf}</span></td>
                      <td class="p-4 text-center">
                        <span class="px-2 py-1 rounded-md text-xs font-bold border ${gradeClass.replace('text', 'border')} ${gradeClass}">${grade}</span>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    this.contentArea.innerHTML = html;

    if (semesters && semesters.length > 0) {
      const ctx = document.getElementById('cgpaTrendChart').getContext('2d');
      const isDark = document.documentElement.classList.contains('dark');
      const textColor = isDark ? '#cbd5e1' : '#475569';
      const gridColor = isDark ? '#334155' : '#e2e8f0';

      this.charts.cgpaTrend = new Chart(ctx, {
        type: 'line',
        data: {
          labels: semesters.map(s => `Semester ${s.sem}`),
          datasets: [{
            label: 'SGPA',
            data: semesters.map(s => s.sgpa),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: false, min: 5, max: 10, grid: { color: gridColor }, ticks: { color: textColor } },
            x: { grid: { display: false }, ticks: { color: textColor } }
          }
        }
      });
    }
  }

  renderNotices() {
    const announcements = store.get('announcements') || [];
    
    let html = `
      <div class="fade-in max-w-4xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Notice Board</h2>
          <div class="relative">
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
            <input type="text" placeholder="Search notices..." class="pl-10 pr-4 py-2 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-64 transition-all">
          </div>
        </div>
        
        <div class="space-y-4">
          ${announcements.map((a, i) => {
            const colors = ['primary', 'warning', 'success', 'danger'];
            const color = colors[i % colors.length];
            return `
              <div class="glass p-6 rounded-2xl border border-border shadow-sm hover-lift flex flex-col sm:flex-row gap-6 relative overflow-hidden group cursor-pointer">
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-${color} transform origin-left transition-transform group-hover:scale-x-[4]"></div>
                
                <div class="flex-shrink-0 w-14 h-14 bg-${color}/10 text-${color} rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                  <i class="fas fa-bullhorn"></i>
                </div>
                
                <div class="flex-1">
                  <div class="flex flex-wrap justify-between items-start gap-2 mb-2">
                    <h3 class="text-lg font-bold group-hover:text-${color} transition-colors">${a.title}</h3>
                    <span class="text-xs font-bold text-text-secondary bg-surface border border-border px-3 py-1.5 rounded-full flex items-center shadow-sm">
                      <i class="far fa-calendar-alt mr-2 text-${color}"></i> ${a.date}
                    </span>
                  </div>
                  <p class="text-text-secondary text-sm leading-relaxed">${a.content}</p>
                </div>
              </div>
            `;
          }).join('')}
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
                <span class="px-3 py-1 bg-surface text-text-secondary rounded-lg text-xs font-bold border border-border">STU-2023-${this.user.id.toString().padStart(4, '0')}</span>
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
                    <label class="block text-sm font-medium text-text-secondary mb-2">Date of Birth</label>
                    <input type="date" class="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm" value="2002-05-15">
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-text-secondary mb-2">Home Address</label>
                    <textarea class="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm" rows="3" placeholder="Enter your full address...">123 Campus Drive, Apt 4B, University City, State 12345</textarea>
                  </div>
                </div>
                
                <div class="flex justify-end pt-4 border-t border-border">
                  <button type="button" class="px-6 py-2.5 bg-gradient-primary text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all text-sm font-bold flex items-center gap-2">
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
  // We only run this if auth.js didn't redirect us
  if (window.location.pathname.includes('student.html') && auth.getCurrentUser()) {
    new StudentDashboard();
  }
});
