import React, { useState, useRef } from 'react';
import { X, Upload, User, Loader2, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const EditProfileModal = ({ onClose }) => {
    const { user, updateProfile } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatar || null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 2MB validation
        if (file.size > 2 * 1024 * 1024) {
            setError('Image must be less than 2MB');
            return;
        }
        setError('');

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setAvatarUrl(res.data.url);
        } catch (err) {
            console.error('Upload Error:', err);
            setError('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            setError('Name cannot be empty');
            return;
        }

        setIsSaving(true);
        setError('');
        try {
            await updateProfile({ name, avatar: avatarUrl || '' });
            onClose();
        } catch (err) {
            setError('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-surface rounded-2xl w-full max-w-sm border border-ui shadow-xl overflow-hidden"
            >
                <div className="p-5 border-b border-ui-light flex justify-between items-center bg-page/50">
                    <h3 className="text-xl font-bold text-primary">Edit Profile</h3>
                    <button onClick={onClose} className="p-1 rounded-full text-muted-clr hover:text-primary hover:bg-surface-2 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6 flex flex-col items-center">
                    {/* Avatar Selection */}
                    <div className="relative group">
                        <div
                            className={`w-28 h-28 rounded-full flex items-center justify-center overflow-hidden border-4 border-gray-50 shadow-sm ${!avatarUrl ? 'bg-theme-light text-theme' : 'bg-surface-2'}`}
                        >
                            {isUploading ? (
                                <Loader2 className="w-8 h-8 animate-spin text-theme" />
                            ) : avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl font-black uppercase text-theme">
                                    {name ? name[0] : user?.name?.[0] || 'U'}
                                </span>
                            )}
                        </div>

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-theme text-white flex items-center justify-center shadow-lg hover:bg-theme-hover transition-colors border-2 border-white disabled:opacity-50"
                        >
                            <Camera className="w-4 h-4" />
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                    {avatarUrl && (
                        <button
                            onClick={() => setAvatarUrl(null)}
                            className="text-xs text-red-500 font-bold hover:text-red-700 mt-[-1rem]"
                        >
                            Remove Photo
                        </button>
                    )}

                    {error && (
                        <div className="w-full p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100 text-center">
                            {error}
                        </div>
                    )}

                    <div className="w-full space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-muted-clr uppercase tracking-wider pl-1">Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-clr" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-page border border-ui rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-theme focus:border-transparent transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 opacity-60 pointer-events-none">
                            <label className="text-xs font-bold text-muted-clr uppercase tracking-wider pl-1">Email</label>
                            <div className="w-full px-4 py-2 bg-surface-2 border border-ui rounded-lg text-secondary font-medium">
                                {user?.email}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-ui-light flex justify-end gap-3 bg-page/50">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg font-bold text-secondary hover:text-primary hover:bg-surface-2 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || isUploading}
                        className="px-6 py-2 rounded-lg font-bold bg-theme text-white hover:bg-theme-hover transition-colors flex items-center justify-center min-w-[100px] shadow-sm disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default EditProfileModal;
