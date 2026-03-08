
// Default Permissions Configuration
const DEFAULT_PERMISSIONS = {
    'SUB_ADMIN': {
        'dashboard': true,
        'user_mgmt': true,
        'agent_admin_mgmt': true,
        'financials': true,
        'reports': true,
        'content_mod': true,
        'service_mgmt': true,
        'ai_mgmt': true,
        'logs': true,
        'order_mgmt': true,
        'admin_controls': true,
        'notifications': true,
        'cms': true,
        'file_manager': true
    },
    'AGENT_ADMIN': {
        'dashboard': true,
        'agent_onboarding': true,
        'performance': true,
        'lead_assignment': true,
        'agent_support': true,
        'financials': false
    },
    'CLIENT': {
        'overview': true,
        'new-filing': true,
        'orders': true,
        'payments': true,
        'profile': true,
        'support': true,
        'notifications': true
    },
    'EMPLOYEE': {
        'dashboard': true,
        'tasks': true
    }
};

// Keys for LocalStorage
const STORAGE_KEY = 'shinefiling_permissions';

/**
 * Get all permissions matrix
 */
export const getPermissions = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error("Failed to parse permissions", e);
    }
    return DEFAULT_PERMISSIONS;
};

/**
 * Save permissions matrix
 * @param {Object} newPermissions 
 */
export const savePermissions = (newPermissions) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPermissions));
    // Dispatch event for components to listen to changes
    window.dispatchEvent(new Event('permissionsUpdated'));
};

/**
 * Check if a role has access to a specific module
 * @param {String} role 
 * @param {String} module 
 */
export const hasPermission = (role, module) => {
    if (role === 'MASTER_ADMIN') return true; // Super Admin has all access

    // Normalize logic for legacy or specific roles
    if (role === 'ADMIN') role = 'SUB_ADMIN'; // Treat generic ADMIN as SUB_ADMIN for permission lookup

    const perms = getPermissions();
    const rolePerms = perms[role];

    if (!rolePerms) return false;

    return rolePerms[module] === true;
};

/**
 * Reset to defaults
 */
export const resetPermissions = () => {
    savePermissions(DEFAULT_PERMISSIONS);
    return DEFAULT_PERMISSIONS;
};

/**
 * Get dashboard path based on user role
 * @param {String} role 
 */
export const getDashboardPath = (role) => {
    if (!role) return '/';
    const upperRole = role.toUpperCase();

    if (upperRole === 'MASTER_ADMIN' || upperRole === 'SUB_ADMIN' || upperRole === 'AGENT_ADMIN' || upperRole.includes('ADMIN')) {
        return '/admin-dashboard';
    }
    if (upperRole === 'AGENT') return '/agent-dashboard';
    if (upperRole === 'CA') return '/ca-dashboard';
    if (upperRole === 'EMPLOYEE') return '/employee-dashboard';

    return '/dashboard';
};

