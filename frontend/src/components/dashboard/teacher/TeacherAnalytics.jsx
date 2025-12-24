import React from 'react';
import { BarChart } from 'lucide-react';

const TeacherAnalytics = () => (
    <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700">
        <BarChart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Analytics Dashboard</h3>
        <p className="text-gray-400">Detailed analytics and progress tracking coming soon.</p>
    </div>
);

export default TeacherAnalytics;
