import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import api from '../../../api/axios';

const NotificationPopover = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
            setUnreadCount(res.data.filter(n => !n.read).length);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Optional: Poll every minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error marking read", error);
        }
    };

    const markAllRead = async () => {
        try {
            await api.put('/notifications/mark-all-read');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Error marking all read", error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
            case 'alert': return <XCircle className="w-5 h-5 text-red-400" />;
            default: return <Info className="w-5 h-5 text-blue-400" />;
        }
    };

    return (
        <div ref={wrapperRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                title="Notifications"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-gray-800 animate-pulse"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-12 right-0 w-80 sm:w-96 bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-sm">
                        <h3 className="font-bold text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
                            >
                                <Check className="w-3 h-3" /> Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? (
                            notifications.map(notification => (
                                <div
                                    key={notification._id}
                                    className={`p-4 border-b border-white/5 hover:bg-white/10 transition-colors relative group ${!notification.read ? 'bg-purple-900/20' : ''}`}
                                    onClick={() => !notification.read && markAsRead(notification._id)}
                                >
                                    <div className="flex gap-4">
                                        <div className="mt-1 flex-shrink-0">
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={`text-sm font-medium mb-1 ${!notification.read ? 'text-white' : 'text-gray-400'}`}>
                                                {notification.title}
                                            </h4>
                                            <p className="text-xs text-gray-400 leading-relaxed">
                                                {notification.message}
                                            </p>
                                            <span className="text-[10px] text-gray-600 mt-2 block">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        {!notification.read && (
                                            <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 text-center">
                                <Bell className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">No notifications yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationPopover;
