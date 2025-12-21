import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/reading`;

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

const getPassages = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching reading passages:', error);
        throw error;
    }
};

const getPassageById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching reading passage ${id}:`, error);
        throw error;
    }
};

const createPassage = async (passageData) => {
    try {
        const response = await axios.post(API_URL, passageData, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error creating reading passage:', error);
        throw error;
    }
};

const updatePassage = async (id, passageData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, passageData, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error updating reading passage:', error);
        throw error;
    }
};

const deletePassage = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error deleting reading passage:', error);
        throw error;
    }
};

export default {
    getPassages,
    getPassageById,
    createPassage,
    updatePassage,
    deletePassage
};
