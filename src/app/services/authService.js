const STORAGE_KEY = 'studentFeedback_currentUser';

export const authService = {
  login: (email, password) => {
    // Mock authentication - in a real app, this would call an API

    if (email === 'admin@university.edu' && password === 'admin123') {
      const user = {
        id: 'admin1',
        name: 'Admin User',
        email: 'admin@university.edu',
        role: 'admin',
        department: 'Administration'
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return user;

    } else if (email === 'harsha@university.edu' && password === 'student123') {
      const user = {
        id: 'S001',
        name: 'Harsha',
        email: 'harsha@university.edu',
        role: 'student',
        studentId: 'S001',
        department: 'Computer Science'
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return user;

    } else if (email === 'shyam@university.edu' && password === 'student123') {
      const user = {
        id: 'S002',
        name: 'Shyam',
        email: 'shyam@university.edu',
        role: 'student',
        studentId: 'S002',
        department: 'Computer Science'
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return user;

    } else if (email === 'yaswanth@university.edu' && password === 'student123') {
      const user = {
        id: 'S003',
        name: 'Yaswanth',
        email: 'yaswanth@university.edu',
        role: 'student',
        studentId: 'S003',
        department: 'Computer Science'
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return user;
    }

    return null;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem(STORAGE_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  isAuthenticated: () => {
    return authService.getCurrentUser() !== null;
  }
};