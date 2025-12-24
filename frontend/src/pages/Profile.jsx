import React, { useState, useEffect } from "react";
import {
    Camera,
    Mail,
    User,
    Phone,
    Briefcase,
    FileText,
    Loader,
    CheckCircle,
} from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import { getImageUrl } from '../utils/helpers';
import api from "../../services/api"; // Changed from axios direct import to match project structure if needed, or keep axios

const InputField = ({ label, icon, name, value, onChange, placeholder, disabled, type = "text" }) => (
    <div className="space-y-1.5 group">
        <label className="text-sm font-medium text-gray-400 group-focus-within:text-purple-400 transition-colors">
            {label}
        </label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-500 transition-colors">
                {icon}
            </div>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-600"
            />
        </div>
    </div>
);

const Profile = () => {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "", // Added phone field
        title: "", // Added title field
        bio: "",
        avatar: "",
        createdAt: ""
    });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/profile/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Ensure fields exist
            setProfile({
                ...res.data,
                phone: res.data.phone || "",
                title: res.data.title || "",
                bio: res.data.bio || "",
                avatar: res.data.avatar || "",
                createdAt: res.data.createdAt || ""
            });
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
            toast.error("Failed to load profile");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            toast.error("Format not supported. Please upload JPG or PNG.");
            return;
        }
        if (file.size > 2 * 1024 * 1024) { // 2MB
            toast.error("File size too large. Max 2MB.");
            return;
        }

        const formData = new FormData();
        formData.append("avatar", file);

        setUploading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await api.post("/profile/upload-avatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            setProfile({ ...profile, avatar: res.data.avatar });
            setUploading(false);
            toast.success("Profile photo updated!");
        } catch (err) {
            console.error(err);
            setUploading(false);
            toast.error(err.response?.data?.message || "Image upload failed");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            await api.put("/profile/update", profile, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSaving(false);
            toast.success("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            setSaving(false);
            toast.error("Update failed. Please try again.");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <Loader className="w-12 h-12 text-purple-500 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-6 md:p-12">
            <Toaster position="top-right" />

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT CARD: IDENTITY */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="sticky top-8">
                        <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-8 flex flex-col items-center text-center shadow-xl relative overflow-hidden">
                            {/* Decorative Background */}
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-900/40 to-transparent pointer-events-none"></div>

                            <div className="relative mb-6 group w-32 h-32">
                                {/* Avatar Ring */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-500 group-hover:duration-200"></div>

                                <div className="absolute inset-0.5 rounded-full overflow-hidden border-2 border-gray-800">
                                    {profile.avatar ? (
                                        <img
                                            src={getImageUrl(profile.avatar)}
                                            alt={profile.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                                            <span className="text-4xl font-bold text-gray-400">
                                                {profile.name ? profile.name[0] : "U"}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Upload Progress Loader */}
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20 rounded-full">
                                        <Loader className="w-8 h-8 text-white animate-spin" />
                                    </div>
                                )}

                                {/* UPLOAD OVERLAY */}
                                <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 cursor-pointer rounded-full z-20 transition-opacity duration-300">
                                    <Camera className="text-white w-8 h-8" />
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg"
                                        className="hidden"
                                        onChange={handleImageChange}
                                        disabled={uploading}
                                    />
                                </label>
                            </div>

                            <h2 className="text-xl font-bold text-white mb-1">{profile.name || "User"}</h2>
                            <p className="text-purple-400 font-medium mb-6">
                                {profile.title || ""}
                            </p>

                            <div className="mt-6 border-t border-gray-700 pt-4 text-sm w-full">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-400">Status</span>
                                    <span className="text-green-400 bg-green-400/10 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide">Active</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-400">Joined</span>
                                    <span className="text-gray-200">
                                        {profile.createdAt
                                            ? new Date(profile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
                                            : "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT FORM */}
                <div className="lg:col-span-8">
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-lg">
                        <h3 className="text-2xl font-bold mb-6 text-white flex items-center">
                            <User className="w-6 h-6 mr-3 text-purple-500" />
                            Profile Settings
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField
                                    label="Full Name"
                                    icon={<User />}
                                    name="name"
                                    value={profile.name}
                                    onChange={handleChange}
                                    placeholder="Your full name"
                                />

                                <InputField
                                    label="Title / Role"
                                    icon={<Briefcase />}
                                    name="title"
                                    value={profile.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Senior Developer"
                                />

                                <InputField
                                    label="Email"
                                    icon={<Mail />}
                                    value={profile.email}
                                    disabled
                                />

                                <InputField
                                    label="Phone"
                                    icon={<Phone />}
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleChange}
                                    placeholder="+1 234 567 890"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-300 flex items-center mb-1">
                                    <FileText className="w-4 h-4 mr-2 text-purple-500" />
                                    Bio
                                </label>
                                <textarea
                                    name="bio"
                                    value={profile.bio}
                                    onChange={handleChange}
                                    maxLength={300}
                                    rows="4"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder-gray-600 resize-none"
                                    placeholder="Tell us about yourself..."
                                />
                                <p className="text-xs text-gray-400 text-right mt-1">
                                    {profile.bio ? profile.bio.length : 0}/300
                                </p>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-700/30 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                    {saving && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
