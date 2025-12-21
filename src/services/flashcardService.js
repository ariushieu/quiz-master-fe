import axios from 'axios';

const API_url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const getSets = async () => {
    const response = await axios.get(`${API_url}/sets`, getAuthHeader());
    return response.data;
};

export const getSetById = async (id) => {
    const response = await axios.get(`${API_url}/sets/${id}`, getAuthHeader());
    return response.data;
};

export const createSet = async (setData) => {
    const response = await axios.post(`${API_url}/sets`, setData, getAuthHeader());
    return response.data;
};

export const updateSet = async (id, setData) => {
    const response = await axios.put(`${API_url}/sets/${id}`, setData, getAuthHeader());
    return response.data;
};

export const deleteSet = async (id) => {
    const response = await axios.delete(`${API_url}/sets/${id}`, getAuthHeader());
    return response.data;
};

export default {
    getSets,
    getSetById,
    createSet,
    updateSet,
    deleteSet
};
