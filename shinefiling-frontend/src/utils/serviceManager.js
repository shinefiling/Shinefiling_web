
const STORAGE_KEY = 'shinefiling_inactive_services';

// Get list of inactive service IDs
export const getInactiveServices = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Error reading service status", e);
        return [];
    }
};

// Toggle status of a service
export const toggleServiceStatus = (serviceName) => {
    try {
        const current = getInactiveServices();
        let updated;
        if (current.includes(serviceName)) {
            updated = current.filter(s => s !== serviceName); // Make Active
        } else {
            updated = [...current, serviceName]; // Make Inactive
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        // Dispatch custom event for real-time UI updates across components
        window.dispatchEvent(new Event('serviceStatusChanged'));

        return updated;
    } catch (e) {
        console.error("Error updating service status", e);
        return [];
    }
};

// Check if a service is active
export const isServiceActive = (serviceName, inactiveList = null) => {
    const list = inactiveList || getInactiveServices();
    return !list.includes(serviceName);
};
