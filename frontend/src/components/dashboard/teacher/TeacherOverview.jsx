import React from 'react';
import { Users, BookOpen, MessageCircle } from 'lucide-react';
import StatCard from '../common/StatCard';

const TeacherOverview = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
                icon={Users}
                title="Total Students"
                value={stats.students}
                color="text-blue-400"
            />
            <StatCard
                icon={BookOpen}
                title="Active Courses"
                value={stats.courses}
                color="text-purple-400"
            />
            <StatCard
                icon={MessageCircle}
                title="Pending Doubts"
                value={stats.doubts}
                color="text-pink-400"
            />
        </div>
    );
};

export default TeacherOverview;
