/**
 * theme.js - Handles Dark/Light Mode
 */

class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme');
    this.initTheme();
  }

  initTheme() {
    // Check local storage or system preference
    if (this.theme === 'dark' || (!this.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      this.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      this.theme = 'light';
    }
  }

  toggleTheme() {
    if (this.theme === 'light') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      this.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      this.theme = 'light';
    }
    
    // Update theme toggle icon if it exists
    this.updateIcon();
  }
  
  updateIcon() {
    const icon = document.getElementById('theme-toggle-icon');
    if (icon) {
      if (this.theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
    }
  }
}

const themeManager = new ThemeManager();

// Wait for DOM to load before setting up icon
document.addEventListener('DOMContentLoaded', () => {
  themeManager.updateIcon();
  
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      themeManager.toggleTheme();
    });
  }
});
