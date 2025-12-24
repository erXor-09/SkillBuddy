import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TopicDetailModal from '../components/TopicDetailModal';

import StudentSidebar from '../components/dashboard/student/StudentSidebar';
import StudentStats from '../components/dashboard/student/StudentStats';
import StudentLearningJourney from '../components/dashboard/student/StudentLearningJourney';
import SearchBar from '../components/dashboard/common/SearchBar';
import NotificationPopover from '../components/dashboard/common/NotificationPopover';
import { getImageUrl } from '../utils/helpers';

const StudentDashboard = ({ user, profile, onLogout, fetchProfile }) => {
    const navigate = useNavigate();
    const [selectedTopic, setSelectedTopic] = useState(null); // { moduleId, topicId }

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden font-sans">
            {/* Modal */}
            {selectedTopic && (
                <TopicDetailModal
                    moduleId={selectedTopic.moduleId}
                    topicId={selectedTopic.topicId}
                    onClose={() => setSelectedTopic(null)}
                    onUpdate={() => {
                        fetchProfile(); // Refresh data without full reload
                    }}
                />
            )}

            <StudentSidebar onLogout={onLogout} />

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 flex items-center justify-between px-8 z-50 relative">
                    <div className="text-xl font-medium">
                        Welcome back, <span className="text-purple-400 font-bold">{user.name}</span>
                    </div>
                    <div className="flex items-center space-x-6">
                        <SearchBar />
                        <NotificationPopover />
                        <Link to="/profile" className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-lg font-bold hover:ring-2 hover:ring-purple-400 transition-all overflow-hidden">
                            {user.avatar ? (
                                <img
                                    src={getImageUrl(user.avatar)}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                user.name ? user.name[0] : 'U'
                            )}
                        </Link>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <StudentStats profile={profile} />

                    <StudentLearningJourney
                        profile={profile}
                        onTopicClick={(moduleId, topicId) => setSelectedTopic({ moduleId, topicId })}
                    />
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
