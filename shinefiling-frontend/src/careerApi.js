import axios from 'axios';

// You might want to get this from an environment variable or a shared config
const BASE_URL = 'http://localhost:8080';

export const getPublicJobs = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/careers/jobs`);
        return response.data;
    } catch (error) {
        console.error("Error fetching public jobs", error);
        return [];
    }
};

export const getAdminJobs = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/careers/admin/jobs`);
        return response.data;
    } catch (error) {
        console.error("Error fetching admin jobs", error);
        return [];
    }
};

export const createJob = async (jobData) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/careers/admin/jobs`, jobData);
        return response.data;
    } catch (error) {
        console.error("Error creating job", error);
        throw error;
    }
};

export const deleteJob = async (id) => {
    try {
        await axios.delete(`${BASE_URL}/api/careers/admin/jobs/${id}`);
    } catch (error) {
        console.error("Error deleting job", error);
        throw error;
    }
};
