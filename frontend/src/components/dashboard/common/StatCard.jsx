import React from 'react';

const StatCard = ({ title, value, icon: Icon, color, className = "" }) => (
    <div className={`bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-gray-600 transition shadow-lg relative overflow-hidden group ${className}`}>
        <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full transition group-hover:scale-110`}></div>
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
                <p className="text-sm text-gray-400 font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-white">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl bg-gray-700/50 ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    </div>
);

export default StatCard;
