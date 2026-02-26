import React, { useState, useRef, useEffect } from 'react';
import {
    Camera, User, Mail, Phone, MapPin, Globe, Calendar, Users as GenderIcon,
    Briefcase, FileText, Loader2, CheckCircle2, AlertCircle, Lock, Eye, EyeOff, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';

/* ─── small reusable field ─────────────────────────────── */
const Field = ({ label, icon: Icon, children }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider pl-1 flex items-center gap-1.5"
            style={{ color: 'var(--color-text-muted)' }}>
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {label}
        </label>
        {children}
    </div>
);

const inputClass =
    'w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-theme focus:border-transparent transition-all';

const inputStyle = (darkMode) => ({
    background: darkMode ? '#1A1D27' : '#F9FAFB',
    border: `1px solid ${darkMode ? '#2D3249' : '#E5E7EB'}`,
    color: darkMode ? '#F1F5F9' : '#111827',
});

/* ─── toast ────────────────────────────────────────────── */
const Toast = ({ type, msg, onDone }) => {
    useEffect(() => {
        const t = setTimeout(onDone, 3500);
        return () => clearTimeout(t);
    }, [onDone]);
    const isOk = type === 'success';
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl font-semibold text-sm"
            style={{
                background: isOk ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#ef4444,#dc2626)',
                color: '#fff',
            }}
        >
            {isOk ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {msg}
        </motion.div>
    );
};

/* ═══════════════════════════════════════════════════════ */
const EditProfilePage = () => {
    const { user, updateProfile } = useAuth();
    const { darkMode } = useTheme();
    const fileInputRef = useRef(null);

    /* profile form state */
    const [form, setForm] = useState({
        name: '',
        bio: '',
        phone: '',
        location: '',
        website: '',
        dateOfBirth: '',
        gender: '',
        occupation: '',
        title: '',
        avatar: '',
    });

    /* password form state */
    const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
    const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });

    /* ui state */
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isPwSaving, setIsPwSaving] = useState(false);
    const [toast, setToast] = useState(null); // { type, msg }

    /* seed form from user */
    useEffect(() => {
        if (!user) return;
        const dob = user.dateOfBirth
            ? new Date(user.dateOfBirth).toISOString().split('T')[0]
            : '';
        setForm({
            name: user.name || '',
            bio: user.bio || '',
            phone: user.phone || '',
            location: user.location || '',
            website: user.website || '',
            dateOfBirth: dob,
            gender: user.gender || '',
            occupation: user.occupation || '',
            title: user.title || '',
            avatar: user.avatar || '',
        });
    }, [user]);

    const showToast = (type, msg) => setToast({ type, msg });

    /* ── avatar upload ── */
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { showToast('error', 'Image must be under 2 MB'); return; }

        setIsUploading(true);
        const fd = new FormData();
        fd.append('file', file);
        try {
            const res = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            setForm(f => ({ ...f, avatar: res.data.url }));
            showToast('success', 'Photo uploaded! Click Save Changes to apply.');
        } catch (error) {
            console.error("Upload error:", error.response?.data || error);
            showToast('error', error.response?.data?.error || 'Upload failed');
        }
        finally { setIsUploading(false); }
    };

    /* ── save profile ── */
    const handleSave = async () => {
        if (!form.name.trim()) { showToast('error', 'Name cannot be empty'); return; }
        setIsSaving(true);
        try {
            await updateProfile(form);
            showToast('success', 'Profile saved successfully!');
        } catch (error) {
            console.error("Save profile error:", error.response?.data || error);
            showToast('error', error.response?.data?.error || 'Failed to save profile');
        }
        finally { setIsSaving(false); }
    };

    /* ── change password ── */
    const handleChangePassword = async () => {
        if (!pwForm.current || !pwForm.newPw) { showToast('error', 'Fill in all password fields'); return; }
        if (pwForm.newPw !== pwForm.confirm) { showToast('error', 'Passwords do not match'); return; }
        if (pwForm.newPw.length < 6) { showToast('error', 'New password must be at least 6 characters'); return; }
        setIsPwSaving(true);
        try {
            await api.put('/auth/change-password', { currentPassword: pwForm.current, newPassword: pwForm.newPw });
            showToast('success', 'Password changed!');
            setPwForm({ current: '', newPw: '', confirm: '' });
        } catch (err) {
            showToast('error', err?.response?.data?.error || 'Password change failed');
        } finally { setIsPwSaving(false); }
    };

    /* ── theming shortcuts ── */
    const card = {
        background: darkMode ? '#1A1D27' : '#FFFFFF',
        border: `1px solid ${darkMode ? '#2D3249' : '#E5E7EB'}`,
    };
    const textPrimary = { color: darkMode ? '#F1F5F9' : '#111827' };
    const textMuted = { color: darkMode ? '#64748B' : '#9CA3AF' };
    const sep = { borderColor: darkMode ? '#2D3249' : '#F3F4F6' };
    const pgBg = { background: darkMode ? '#0F1117' : '#F3F4F7' };

    const inputSt = inputStyle(darkMode);

    return (
        <div className="flex-1 overflow-y-auto" style={pgBg}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

                {/* ── Page Header ── */}
                <div>
                    <h1 className="text-2xl font-black" style={textPrimary}>Edit Profile</h1>
                    <p className="text-sm mt-1" style={textMuted}>
                        Manage your personal information and account settings
                    </p>
                </div>

                {/* ══ Identity Card (avatar + top info) ══════════════ */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl overflow-hidden shadow-sm"
                    style={card}
                >
                    {/* gradient banner */}
                    <div
                        className="h-28 relative"
                        style={{ background: 'linear-gradient(135deg, var(--color-theme) 0%, #8B5CF6 100%)' }}
                    >
                        <div className="absolute inset-0 opacity-20"
                            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
                        />
                    </div>

                    {/* avatar + name row */}
                    <div className="px-6 pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
                            {/* avatar */}
                            <div className="relative flex-shrink-0">
                                <div
                                    className="w-24 h-24 rounded-2xl overflow-hidden border-4 shadow-lg flex items-center justify-center"
                                    style={{
                                        borderColor: darkMode ? '#1A1D27' : '#fff',
                                        background: form.avatar ? 'transparent' : 'var(--color-theme-light)',
                                    }}
                                >
                                    {isUploading ? (
                                        <Loader2 className="w-8 h-8 animate-spin text-theme" />
                                    ) : form.avatar ? (
                                        <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-3xl font-black uppercase text-theme">
                                            {form.name?.[0] || user?.name?.[0] || 'U'}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-theme text-white flex items-center justify-center shadow-lg hover:bg-theme-hover transition-all border-2 disabled:opacity-50"
                                    style={{ borderColor: darkMode ? '#1A1D27' : '#fff' }}
                                >
                                    <Camera className="w-4 h-4" />
                                </button>
                                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                            </div>

                            {/* name / email summary */}
                            <div className="sm:mb-2 flex-1 min-w-0">
                                <h2 className="text-xl font-black truncate" style={textPrimary}>{user?.name || 'Your Name'}</h2>
                                <p className="text-sm truncate" style={textMuted}>{user?.email}</p>
                                {form.occupation && <p className="text-xs font-medium mt-0.5 text-theme">{form.occupation}</p>}
                            </div>

                            {form.avatar && (
                                <button
                                    onClick={() => setForm(f => ({ ...f, avatar: '' }))}
                                    className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors sm:mb-2"
                                >
                                    Remove Photo
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* ══ Personal Info ══════════════════════════════════ */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.07 }}
                    className="rounded-2xl shadow-sm"
                    style={card}
                >
                    <div className="px-6 py-5 border-b" style={sep}>
                        <h3 className="font-bold text-base" style={textPrimary}>Personal Information</h3>
                        <p className="text-xs mt-0.5" style={textMuted}>Update your basic profile details</p>
                    </div>
                    <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Field label="Full Name" icon={User}>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                placeholder="Your full name"
                                className={inputClass}
                                style={inputSt}
                            />
                        </Field>

                        <Field label="Email" icon={Mail}>
                            <div
                                className={`${inputClass} opacity-60 cursor-not-allowed select-none`}
                                style={{ ...inputSt, pointerEvents: 'none' }}
                            >
                                {user?.email}
                            </div>
                        </Field>

                        <Field label="Date of Birth" icon={Calendar}>
                            <input
                                type="date"
                                value={form.dateOfBirth}
                                onChange={e => setForm(f => ({ ...f, dateOfBirth: e.target.value }))}
                                className={inputClass}
                                style={inputSt}
                            />
                        </Field>

                        <Field label="Gender" icon={GenderIcon}>
                            <select
                                value={form.gender}
                                onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                                className={inputClass}
                                style={inputSt}
                            >
                                <option value="">Prefer not to say</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Non-binary">Non-binary</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                        </Field>

                        <Field label="Occupation / Title" icon={Briefcase}>
                            <input
                                type="text"
                                value={form.occupation}
                                onChange={e => setForm(f => ({ ...f, occupation: e.target.value }))}
                                placeholder="e.g. Software Engineer, Student"
                                className={inputClass}
                                style={inputSt}
                            />
                        </Field>

                        <Field label="Academic / Prof. Title" icon={Briefcase}>
                            <input
                                type="text"
                                value={form.title}
                                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                placeholder="e.g. PhD in CS, MSc AI"
                                className={inputClass}
                                style={inputSt}
                            />
                        </Field>

                        <div className="sm:col-span-2">
                            <Field label="Bio" icon={FileText}>
                                <textarea
                                    value={form.bio}
                                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                                    placeholder="Tell us a bit about yourself…"
                                    rows={3}
                                    maxLength={300}
                                    className={`${inputClass} resize-none`}
                                    style={inputSt}
                                />
                                <p className="text-right text-xs mt-1" style={textMuted}>{form.bio.length}/300</p>
                            </Field>
                        </div>
                    </div>
                </motion.div>

                {/* ══ Contact & Links ═════════════════════════════════ */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 }}
                    className="rounded-2xl shadow-sm"
                    style={card}
                >
                    <div className="px-6 py-5 border-b" style={sep}>
                        <h3 className="font-bold text-base" style={textPrimary}>Contact & Links</h3>
                        <p className="text-xs mt-0.5" style={textMuted}>How people can reach you online</p>
                    </div>
                    <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Field label="Phone Number" icon={Phone}>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                placeholder="+91 98765 43210"
                                className={inputClass}
                                style={inputSt}
                            />
                        </Field>

                        <Field label="Location" icon={MapPin}>
                            <input
                                type="text"
                                value={form.location}
                                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                                placeholder="City, Country"
                                className={inputClass}
                                style={inputSt}
                            />
                        </Field>

                        <div className="sm:col-span-2">
                            <Field label="Website / LinkedIn / GitHub" icon={Globe}>
                                <input
                                    type="url"
                                    value={form.website}
                                    onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                                    placeholder="https://yourwebsite.com"
                                    className={inputClass}
                                    style={inputSt}
                                />
                            </Field>
                        </div>
                    </div>
                </motion.div>

                {/* ══ Save Button ═════════════════════════════════════ */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.16 }}
                    className="flex justify-end"
                >
                    <button
                        onClick={handleSave}
                        disabled={isSaving || isUploading}
                        className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg, var(--color-theme) 0%, #8B5CF6 80%)' }}
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {isSaving ? 'Saving…' : 'Save Changes'}
                    </button>
                </motion.div>

                {/* ══ Change Password ══════════════════════════════════ */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-2xl shadow-sm"
                    style={card}
                >
                    <div className="px-6 py-5 border-b" style={sep}>
                        <h3 className="font-bold text-base" style={textPrimary}>Change Password</h3>
                        <p className="text-xs mt-0.5" style={textMuted}>Update your account password</p>
                    </div>
                    <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {[
                            { key: 'current', label: 'Current Password' },
                            { key: 'newPw', label: 'New Password' },
                            { key: 'confirm', label: 'Confirm New Password' },
                        ].map(({ key, label }) => (
                            <Field key={key} label={label} icon={Lock}>
                                <div className="relative">
                                    <input
                                        type={showPw[key] ? 'text' : 'password'}
                                        value={pwForm[key]}
                                        onChange={e => setPwForm(p => ({ ...p, [key]: e.target.value }))}
                                        placeholder="••••••••"
                                        className={`${inputClass} pr-10`}
                                        style={inputSt}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPw(s => ({ ...s, [key]: !s[key] }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                                        style={textMuted}
                                    >
                                        {showPw[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </Field>
                        ))}
                    </div>
                    <div className="px-6 pb-6 flex justify-end">
                        <button
                            onClick={handleChangePassword}
                            disabled={isPwSaving}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white shadow-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                            style={{ background: darkMode ? '#374151' : '#111827' }}
                        >
                            {isPwSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                            {isPwSaving ? 'Changing…' : 'Change Password'}
                        </button>
                    </div>
                </motion.div>

            </div>

            {/* ── Toast ── */}
            <AnimatePresence>
                {toast && (
                    <Toast key={toast.msg} type={toast.type} msg={toast.msg} onDone={() => setToast(null)} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default EditProfilePage;
