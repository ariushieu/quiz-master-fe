const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Create headers with auth
const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
});

// ===== AUTH API =====
export const authAPI = {
    register: async (username, email, password) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    login: async (email, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    getMe: async () => {
        const res = await fetch(`${API_URL}/auth/me`, {
            headers: authHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    }
};

// ===== SETS API =====
export const setsAPI = {
    getAll: async () => {
        const res = await fetch(`${API_URL}/sets`, {
            headers: authHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    getOne: async (id) => {
        const res = await fetch(`${API_URL}/sets/${id}`, {
            headers: authHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    create: async (title, description, cards) => {
        const res = await fetch(`${API_URL}/sets`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ title, description, cards })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    update: async (id, title, description, cards) => {
        const res = await fetch(`${API_URL}/sets/${id}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify({ title, description, cards })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    delete: async (id) => {
        const res = await fetch(`${API_URL}/sets/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    }
};

// ===== STUDY API =====
export const studyAPI = {
    getCards: async (setId) => {
        const res = await fetch(`${API_URL}/study/${setId}`, {
            headers: authHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    submitReview: async (setId, cardIndex, quality) => {
        const res = await fetch(`${API_URL}/study/${setId}/review`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ cardIndex, quality })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    getStats: async () => {
        const res = await fetch(`${API_URL}/study/stats/overview`, {
            headers: authHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    }
};

// ===== STATS API =====
export const statsAPI = {
    getMyStats: async () => {
        const res = await fetch(`${API_URL}/stats/me`, {
            headers: authHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    getAchievements: async () => {
        const res = await fetch(`${API_URL}/stats/achievements`, {
            headers: authHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    getLeaderboard: async () => {
        const res = await fetch(`${API_URL}/stats/leaderboard`, {
            headers: authHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    getUserProfile: async (username) => {
        const res = await fetch(`${API_URL}/stats/user/${username}`, {
            headers: authHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    }
};

// ===== UPLOAD API =====
export const uploadAPI = {
    uploadAvatar: async (file) => {
        const formData = new FormData();
        formData.append('avatar', file);

        const res = await fetch(`${API_URL}/upload/avatar`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            body: formData
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    deleteAvatar: async () => {
        const res = await fetch(`${API_URL}/upload/avatar`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    }
};
