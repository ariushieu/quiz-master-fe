const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

export const grammarService = {
  // Get all lessons with optional filters
  getLessons: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.level) params.append('level', filters.level);
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);

    const res = await fetch(`${API_URL}/grammar?${params.toString()}`, {
      headers: authHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  // Get single lesson
  getLesson: async (id) => {
    const res = await fetch(`${API_URL}/grammar/${id}`, {
      headers: authHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  // Create lesson (admin)
  createLesson: async (lessonData) => {
    const res = await fetch(`${API_URL}/grammar`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(lessonData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  // Update lesson (admin)
  updateLesson: async (id, lessonData) => {
    const res = await fetch(`${API_URL}/grammar/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(lessonData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  // Delete lesson (admin)
  deleteLesson: async (id) => {
    const res = await fetch(`${API_URL}/grammar/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  // Submit answers
  submitAnswers: async (lessonId, answers) => {
    const res = await fetch(`${API_URL}/grammar/${lessonId}/submit`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ answers })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  // Get progress for a lesson
  getLessonProgress: async (lessonId) => {
    const res = await fetch(`${API_URL}/grammar/${lessonId}/progress`, {
      headers: authHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  // Get all user progress
  getUserProgress: async () => {
    const res = await fetch(`${API_URL}/grammar/user/progress`, {
      headers: authHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  }
};
