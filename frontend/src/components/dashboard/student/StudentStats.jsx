import React from 'react';
import { Clock, BookOpen, Trophy } from 'lucide-react';
import StatCard from '../common/StatCard';

const StudentStats = ({ profile }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <StatCard
                title="Hours Studied"
                value={profile?.stats?.hoursStudied || 0}
                icon={Clock}
                color="text-blue-400"
            />
            <StatCard
                title="Courses Completed"
                value={profile?.stats?.coursesCompleted || 0}
                icon={BookOpen}
                color="text-green-400"
            />
            <StatCard
                title="Current Streak"
                value={`${profile?.streak || 0} Days`}
                icon={Trophy}
                color="text-yellow-400"
            />
        </div>
    );
};

export default StudentStats;
