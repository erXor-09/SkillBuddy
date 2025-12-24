import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import RoadmapTree from '../../RoadmapTree'; // Adjust path as needed, assuming it's in src/components

const StudentLearningJourney = ({ profile, onTopicClick }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-800/30 rounded-3xl p-8 border border-gray-800/50 shadow-2xl relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-gray-900/0 to-transparent pointer-events-none"></div>

            <h2 className="text-3xl font-bold mb-10 flex items-center justify-center relative z-10">
                <BookOpen className="w-8 h-8 mr-3 text-purple-400" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Your Learning Journey</span>
            </h2>

            {profile?.currentPath ? (
                <RoadmapTree
                    modules={profile.currentPath.modules}
                    onTopicClick={onTopicClick}
                />
            ) : (
                <div className="text-center py-20 bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
                    <p className="text-gray-400 text-lg">No learning path generated yet.</p>
                    <button onClick={() => navigate('/onboarding')} className="mt-4 text-purple-400 font-bold hover:underline">Go to Onboarding</button>
                </div>
            )}
        </div>
    );
};

export default StudentLearningJourney;
