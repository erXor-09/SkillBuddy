export const getImageUrl = (avatarPath) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith('http')) return avatarPath;

    // Remove /api from base URL if it exists, to match the stored paths which might include /api or /uploads
    const baseUrl = import.meta.env.VITE_BACKEND_URL.replace('/api', '');

    // Ensure avatarPath starts with / if not present
    const cleanPath = avatarPath.startsWith('/') ? avatarPath : `/${avatarPath}`;

    return `${baseUrl}${cleanPath}`;
};
