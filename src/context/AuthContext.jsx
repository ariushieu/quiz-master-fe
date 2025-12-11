import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const timezoneOffset = new Date().getTimezoneOffset();
                const userData = await authAPI.getMe(timezoneOffset);
                setUser(userData);
            } catch (error) {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        const data = await authAPI.login(email, password);
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return data;
    };

    const register = async (username, email, password) => {
        const data = await authAPI.register(username, email, password);
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        // Clear quest progress to avoid stale state for next user
        localStorage.removeItem('quest_explore');
        localStorage.removeItem('quest_create');
        localStorage.removeItem('quest_study');
        localStorage.removeItem('quest_quiz');
        localStorage.removeItem('quest_completed');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
