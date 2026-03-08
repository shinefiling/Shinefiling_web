import { BASE_URL } from '../api';

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'documents');

    try {
        const response = await fetch(`${BASE_URL}/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed with status: ${response.status}`);
        }

        const data = await response.json();
        return data.fileUrl;
    } catch (error) {
        console.error("File upload error:", error);
        throw error;
    }
};
