import React from 'react';

const TeacherDoubts = ({ doubts }) => {
    return (
        <div className="space-y-4">
            {doubts.map(doubt => (
                <div key={doubt._id} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-white">{doubt.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${doubt.status === 'answered' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {doubt.status}
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">{doubt.description}</p>
                    <div className="text-xs text-gray-500">
                        Current Answers: {doubt.answers.length}
                    </div>
                </div>
            ))}
            {doubts.length === 0 && (
                <div className="text-center text-gray-500 mt-10">No doubts raised yet.</div>
            )}
        </div>
    );
};

export default TeacherDoubts;
