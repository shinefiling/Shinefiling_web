import axios from 'axios';

import { BASE_URL } from './api';

export const getPublicJobs = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/careers/jobs`);
        return response.data;
    } catch (error) {
        console.error("Error fetching public jobs", error);
        return [];
    }
};

export const getAdminJobs = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/careers/admin/jobs`);
        return response.data;
    } catch (error) {
        console.error("Error fetching admin jobs", error);
        return [];
    }
};

export const createJob = async (jobData) => {
    try {
        const response = await axios.post(`${BASE_URL}/careers/admin/jobs`, jobData);
        return response.data;
    } catch (error) {
        console.error("Error creating job", error);
        throw error;
    }
};

export const deleteJob = async (id) => {
    try {
        await axios.delete(`${BASE_URL}/careers/admin/jobs/${id}`);
    } catch (error) {
        console.error("Error deleting job", error);
        throw error;
    }
};
