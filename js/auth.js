/**
 * auth.js - Handles Authentication and Route Protection
 */

class Auth {
  constructor() {
    this.currentUser = store.get('currentUser');
  }

  login(email, password, role) {
    const users = store.get('users');
    const user = users.find(u => u.email === email && u.password === password && u.role === role);
    
    if (user) {
      store.set('currentUser', user);
      this.currentUser = user;
      
      // Redirect based on role
      if (role === 'student') window.location.href = 'student.html';
      if (role === 'teacher') window.location.href = 'teacher.html';
      if (role === 'admin') window.location.href = 'admin.html';
      
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  }

  // Check if user is allowed on the current page
  protectRoute(requiredRole) {
    if (!this.currentUser) {
      window.location.href = 'index.html';
      return;
    }
    
    if (requiredRole && this.currentUser.role !== requiredRole) {
      // Redirect to their actual dashboard if they try to access wrong one
      if (this.currentUser.role === 'student') window.location.href = 'student.html';
      if (this.currentUser.role === 'teacher') window.location.href = 'teacher.html';
      if (this.currentUser.role === 'admin') window.location.href = 'admin.html';
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }
}

const auth = new Auth();
