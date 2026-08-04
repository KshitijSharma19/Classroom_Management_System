/**
 * components.js - Reusable UI Components and Interactions
 */

class UIComponents {
  constructor() {
    this.initToastContainer();
    this.setupSidebar();
    this.setupDropdowns();
    this.setupLogout();
    this.populateProfileInfo();
  }

  // Toast Notification System
  initToastContainer() {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
  }

  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    // Icon based on type
    let icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    
    toast.className = `toast toast-${type} glass`;
    toast.innerHTML = `
      <div class="flex items-center gap-3">
        <i class="fas ${icon} text-lg"></i>
        <p class="font-medium">${message}</p>
      </div>
      <button class="text-text-secondary hover:text-text-primary transition-colors" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 300); // Wait for fade out animation
    }, 3000);
  }

  // Confirmation Modal
  showConfirmModal(title, message, onConfirm) {
    // Remove existing modal if any
    const existing = document.getElementById('confirm-modal');
    if (existing) existing.remove();
    
    const modal = document.createElement('div');
    modal.id = 'confirm-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm fade-in';
    
    modal.innerHTML = `
      <div class="bg-bg-surface border border-border rounded-xl shadow-xl w-full max-w-md p-6 slide-up">
        <h3 class="text-xl font-bold mb-2">${title}</h3>
        <p class="text-text-secondary mb-6">${message}</p>
        <div class="flex justify-end gap-3">
          <button id="modal-cancel" class="px-4 py-2 rounded-lg border border-border hover:bg-bg-primary transition-colors font-medium">Cancel</button>
          <button id="modal-confirm" class="px-4 py-2 rounded-lg bg-primary text-white hover:bg-accent-hover transition-colors font-medium shadow-md hover:shadow-lg">Confirm</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('modal-cancel').addEventListener('click', () => modal.remove());
    document.getElementById('modal-confirm').addEventListener('click', () => {
      onConfirm();
      modal.remove();
    });
  }

  // Sidebar Toggle for Mobile
  setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const closeBtn = document.getElementById('sidebar-close');
    
    if (sidebar && toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.add('sidebar-open');
      });
    }
    
    if (sidebar && closeBtn) {
      closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('sidebar-open');
      });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth < 1024 && sidebar && sidebar.classList.contains('sidebar-open')) {
        if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
          sidebar.classList.remove('sidebar-open');
        }
      }
    });
  }

  // Profile Dropdown
  setupDropdowns() {
    const profileBtn = document.getElementById('profile-btn');
    const profileDropdown = document.getElementById('profile-dropdown');
    
    if (profileBtn && profileDropdown) {
      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('hidden');
      });
      
      // Close when clicking outside
      document.addEventListener('click', (e) => {
        if (!profileDropdown.contains(e.target) && !profileDropdown.classList.contains('hidden')) {
          profileDropdown.classList.add('hidden');
        }
      });
    }
  }

  // Logout functionality
  setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showConfirmModal('Logout', 'Are you sure you want to log out?', () => {
          auth.logout();
        });
      });
    }
  }

  // Populate Profile Information in Navbar/Sidebar
  populateProfileInfo() {
    const user = auth.getCurrentUser();
    if (!user) return;

    // Navbar Avatar
    const navAvatar = document.getElementById('nav-avatar');
    if (navAvatar) navAvatar.src = user.avatar;

    // Sidebar User Info
    const sidebarName = document.getElementById('sidebar-user-name');
    const sidebarRole = document.getElementById('sidebar-user-role');
    
    if (sidebarName) sidebarName.textContent = user.name;
    if (sidebarRole) sidebarRole.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
  }
}

let ui;
// Initialize components on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  ui = new UIComponents();
});
