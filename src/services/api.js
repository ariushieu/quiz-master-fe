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

    getMe: async (timezoneOffset) => {
        const url = timezoneOffset !== undefined
            ? `${API_URL}/auth/me?timezoneOffset=${timezoneOffset}`
            : `${API_URL}/auth/me`;

        const res = await fetch(url, {
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

    create: async (title, description, cards, isPublic = false) => {
        const res = await fetch(`${API_URL}/sets`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ title, description, cards, isPublic })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    update: async (id, title, description, cards, isPublic) => {
        const body = { title, description, cards };
        if (isPublic !== undefined) body.isPublic = isPublic;

        const res = await fetch(`${API_URL}/sets/${id}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(body)
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
    },

    getPublicSets: async () => {
        const res = await fetch(`${API_URL}/sets/public`, {
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

    submitReview: async (setId, cardIndex, quality, timezoneOffset) => {
        const res = await fetch(`${API_URL}/study/${setId}/review`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ cardIndex, quality, timezoneOffset })
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
    },

    trackTime: async (duration) => {
        const timezoneOffset = new Date().getTimezoneOffset();
        const res = await fetch(`${API_URL}/study/track-time`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ duration, timezoneOffset })
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
    },

    claimQuest: async () => {
        const res = await fetch(`${API_URL}/stats/claim-quest`, {
            method: 'POST',
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

// ===== ADMIN API =====
export const adminAPI = {
    getUsers: async () => {
        const res = await fetch(`${API_URL}/admin/users`, {
            headers: authHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    getBadges: async () => {
        const res = await fetch(`${API_URL}/admin/badges`, {
            headers: authHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    grantBadge: async (userId, badgeId) => {
        const res = await fetch(`${API_URL}/admin/badge/grant`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ userId, badgeId })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    revokeBadge: async (userId, badgeId) => {
        const res = await fetch(`${API_URL}/admin/badge/revoke`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ userId, badgeId })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    }
};
