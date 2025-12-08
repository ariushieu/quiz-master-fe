// AI Service - calls backend API (server-side Gemini)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
});

export const aiAPI = {
    async explainCard(term, definition) {
        const res = await fetch(`${API_URL}/ai/explain`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ term, definition })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data.explanation;
    },

    async chat(term, definition, question, history = []) {
        const res = await fetch(`${API_URL}/ai/chat`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ term, definition, question, history })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data.response;
    },

    async generateQuizHint(term, definition) {
        try {
            const res = await fetch(`${API_URL}/ai/hint`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({ term, definition })
            });

            if (!res.ok) return null;
            const data = await res.json();
            return data.hint;
        } catch {
            return null;
        }
    }
};
