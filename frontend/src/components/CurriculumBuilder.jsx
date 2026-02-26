import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, GripVertical, CheckSquare, Square, Upload, X, FileText, Calendar, Check, Edit } from 'lucide-react';
import api from '../api/axios';

const CurriculumBuilder = ({ courseId, initialModules = [], initialSyllabus = {}, initialTitle = '', initialDescription = '', onClose, onSave }) => {
    const standardizeModules = (mods) => {
        return mods.map(m => ({
            ...m,
            id: m.id || m._id || Math.random().toString(36).substr(2, 9),
            timePlan: m.timePlan || '',
            topics: m.topics.map(t => ({
                ...t,
                id: t.id || t._id || Math.random().toString(36).substr(2, 9),
                isChecked: t.isChecked || false,
                teacherStatus: t.teacherStatus || 'not_covered'
            }))
        }));
    };

    const [modules, setModules] = useState(standardizeModules(initialModules));
    const [syllabus, setSyllabus] = useState({
        fileUrl: initialSyllabus?.fileUrl || '',
        fileName: initialSyllabus?.fileName || '',
        checklist: initialSyllabus?.checklist || []
    });

    const [courseTitle, setCourseTitle] = useState(initialTitle);
    const [courseDescription, setCourseDescription] = useState(initialDescription);
    const [previewFile, setPreviewFile] = useState(null);

    useEffect(() => {
        setCourseTitle(initialTitle);
        setCourseDescription(initialDescription);
    }, [initialTitle, initialDescription]);

    const [newChecklistItem, setNewChecklistItem] = useState('');
    const [saving, setSaving] = useState(false);

    const addChecklistItem = () => {
        if (!newChecklistItem.trim()) return;
        const newItem = {
            id: Math.random().toString(36).substr(2, 9),
            item: newChecklistItem,
            isChecked: false
        };
        setSyllabus({ ...syllabus, checklist: [...syllabus.checklist, newItem] });
        setNewChecklistItem('');
    };

    const toggleChecklistItem = (id) => {
        const updatedList = syllabus.checklist.map(item =>
            item.id === id ? { ...item, isChecked: !item.isChecked } : item
        );
        setSyllabus({ ...syllabus, checklist: updatedList });
    };

    const deleteChecklistItem = (id) => {
        const updatedList = syllabus.checklist.filter(item => item.id !== id);
        setSyllabus({ ...syllabus, checklist: updatedList });
    };

    const handleAddModule = () => {
        setModules([...modules, {
            id: Math.random().toString(36).substr(2, 9),
            title: "New Module",
            timePlan: "",
            topics: []
        }]);
    };

    const handleAddTopic = (moduleIndex) => {
        const updatedModules = [...modules];
        updatedModules[moduleIndex].topics.push({
            id: Math.random().toString(36).substr(2, 9),
            title: "New Topic",
            teacherStatus: 'not_covered',
            isChecked: false
        });
        setModules(updatedModules);
    };

    const handleModuleChange = (index, field, value) => {
        const newModules = [...modules];
        newModules[index][field] = value;
        setModules(newModules);
    };

    const handleTopicChange = (mIndex, tIndex, field, value) => {
        const newModules = [...modules];
        newModules[mIndex].topics[tIndex][field] = value;
        setModules(newModules);
    };

    const handleDeleteModule = (index) => {
        if (confirm("Delete this module and all its topics?")) {
            const newModules = [...modules];
            newModules.splice(index, 1);
            setModules(newModules);
        }
    };

    const handleDeleteTopic = (mIndex, tIndex) => {
        const newModules = [...modules];
        newModules[mIndex].topics.splice(tIndex, 1);
        setModules(newModules);
    };

    const handleAddResource = (mIndex, tIndex) => {
        const newModules = [...modules];
        if (!newModules[mIndex].topics[tIndex].resources) {
            newModules[mIndex].topics[tIndex].resources = [];
        }
        newModules[mIndex].topics[tIndex].resources.push({
            type: 'video',
            title: '',
            url: ''
        });
        setModules(newModules);
    };

    const handleResourceChange = (mIndex, tIndex, rIndex, field, value) => {
        const newModules = [...modules];
        newModules[mIndex].topics[tIndex].resources[rIndex][field] = value;
        setModules(newModules);
    };

    const handleDeleteResource = (mIndex, tIndex, rIndex) => {
        const newModules = [...modules];
        newModules[mIndex].topics[tIndex].resources.splice(rIndex, 1);
        setModules(newModules);
    };

    const handleSyllabusUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/upload', formData, {
                headers: { 'Content-Type': null }
            });

            setSyllabus({
                ...syllabus,
                fileUrl: response.data.url,
                fileName: file.name
            });
            alert('Syllabus uploaded successfully!');
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.error || error.message || 'Syllabus upload failed';
            alert('Syllabus upload failed: ' + msg);
        }
    };

    const handleFileUpload = async (e, mIndex, tIndex, rIndex) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/upload', formData, {
                headers: { 'Content-Type': null }
            });

            const newModules = [...modules];
            const resource = newModules[mIndex].topics[tIndex].resources[rIndex];

            resource.url = response.data.url;
            resource.title = resource.title || file.name;

            if (response.data.type?.startsWith('video')) resource.type = 'video';
            else if (response.data.type?.startsWith('audio')) resource.type = 'audio';
            else if (response.data.type?.includes('pdf') || response.data.type?.includes('officedocument')) resource.type = 'article';

            setModules(newModules);
            alert('File uploaded successfully!');
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.error || error.message || 'Upload failed';
            alert('Upload failed: ' + msg);
        }
    };

    const saveCurriculum = async () => {
        setSaving(true);
        try {
            await api.put(`/courses/${courseId}/modules`, {
                modules,
                syllabus,
                title: courseTitle,
                description: courseDescription
            });
            alert("Curriculum and course details saved successfully!");
            if (onSave) onSave();
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.error || "Failed to save.";
            alert(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-page absolute inset-0 z-50 flex flex-col">
            <header className="bg-surface border-b border-ui p-4 flex flex-col gap-4 shadow-sm">
                <div className="flex justify-between items-start">
                    <div className="flex-1 mr-4">
                        {/* Title Editing */}
                        <div className="flex items-center gap-2 mb-2">
                            <input
                                value={courseTitle}
                                onChange={(e) => setCourseTitle(e.target.value)}
                                className="bg-transparent text-2xl font-bold text-primary focus:outline-none focus:border-b-2 border-theme placeholder-gray-400 transition-all w-full md:w-1/2"
                                placeholder="Course Title"
                            />
                            <Edit size={16} className="text-muted-clr" />
                        </div>
                        {/* Description Editing */}
                        <textarea
                            value={courseDescription}
                            onChange={(e) => setCourseDescription(e.target.value)}
                            className="bg-page text-sm text-secondary w-full rounded-lg p-2 border border-transparent focus:border-ui focus:outline-none resize-none"
                            rows={2}
                            placeholder="Course Description"
                        />
                    </div>

                    <div className="flex space-x-3 items-start">
                        <button onClick={onClose} className="px-4 py-2 text-secondary hover:text-primary">Cancel</button>
                        <button
                            onClick={saveCurriculum}
                            disabled={saving}
                            className="bg-theme hover:bg-theme-hover text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm"
                        >
                            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto space-y-6">

                    {/* SYLLABUS & ROADMAP SECTION */}
                    <div className="bg-surface border border-ui-light rounded-none p-6 mb-8 shadow-sm">
                        <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                            <FileText className="text-theme" /> Syllabus & Roadmap
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* File Upload */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-secondary">Upload Syllabus Document</label>
                                <div className="border-2 border-dashed border-ui rounded-xl p-6 text-center hover:bg-page transition-colors">
                                    {syllabus.fileUrl ? (
                                        <div className="flex items-center justify-between bg-page p-3 rounded-lg border border-ui-light">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <FileText className="text-blue-500 flex-shrink-0" size={20} />
                                                <button
                                                    onClick={() => setPreviewFile({ url: syllabus.fileUrl, name: syllabus.fileName })}
                                                    className="text-sm text-primary truncate hover:text-theme underline focus:outline-none text-left"
                                                >
                                                    {syllabus.fileName || 'Syllabus.pdf'}
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => setSyllabus({ ...syllabus, fileUrl: '', fileName: '' })}
                                                className="text-muted-clr hover:text-red-500 p-1"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer flex flex-col items-center gap-2">
                                            <Upload className="text-muted-clr w-8 h-8" />
                                            <span className="text-secondary text-sm font-medium">Click to upload PDF/Doc</span>
                                            <input type="file" className="hidden" onChange={handleSyllabusUpload} accept=".pdf,.doc,.docx" />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Checklist / Roadmap */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-secondary">Track Progress / Milestones</label>
                                <div className="space-y-2">
                                    {syllabus.checklist.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 bg-page p-2 rounded-lg border border-ui-light">
                                            <button
                                                onClick={() => toggleChecklistItem(item.id)}
                                                className={item.isChecked ? "text-emerald-500" : "text-muted-clr hover:text-secondary"}
                                            >
                                                {item.isChecked ? <CheckSquare size={18} /> : <Square size={18} />}
                                            </button>
                                            <span className={`flex-1 text-sm ${item.isChecked ? 'text-muted-clr line-through' : 'text-primary'}`}>
                                                {item.item}
                                            </span>
                                            <button onClick={() => deleteChecklistItem(item.id)} className="text-gray-300 hover:text-red-500">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newChecklistItem}
                                        onChange={(e) => setNewChecklistItem(e.target.value)}
                                        placeholder="Add milestone..."
                                        className="flex-1 bg-page border border-ui rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-theme"
                                        onKeyDown={(e) => e.key === 'Enter' && addChecklistItem()}
                                    />
                                    <button
                                        onClick={addChecklistItem}
                                        className="bg-surface-2 hover:bg-gray-200 text-primary p-2 rounded-lg"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {modules.map((module, mIndex) => (
                        <div key={module.id} className="bg-surface border border-ui-light rounded-none overflow-hidden shadow-sm">
                            {/* Module Header */}
                            <div className="bg-page p-4 flex items-center gap-4 flex-wrap border-b border-ui-light">
                                <GripVertical className="text-muted-clr cursor-move" />
                                <div className="flex-1 min-w-[200px]">
                                    <input
                                        type="text"
                                        value={module.title}
                                        onChange={(e) => handleModuleChange(mIndex, 'title', e.target.value)}
                                        className="bg-transparent text-lg font-bold text-primary w-full focus:outline-none focus:border-b-2 border-theme placeholder-gray-400 transition-all px-2 py-1 rounded hover:bg-surface-2"
                                        placeholder="Enter Module Name..."
                                    />
                                </div>

                                <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-lg border border-ui">
                                    <Calendar size={14} className="text-muted-clr" />
                                    <input
                                        type="text"
                                        value={module.timePlan || ''}
                                        onChange={(e) => handleModuleChange(mIndex, 'timePlan', e.target.value)}
                                        placeholder="Time Plan (e.g. Week 1)"
                                        className="bg-transparent text-sm text-secondary w-32 focus:outline-none placeholder-gray-400"
                                    />
                                </div>

                                <button onClick={() => handleDeleteModule(mIndex)} className="text-muted-clr hover:text-red-500 ml-2">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Topics List */}
                            <div className="p-4 space-y-3">
                                {module.topics.map((topic, tIndex) => (
                                    <div key={topic.id} className="bg-page p-4 rounded-lg border border-ui-light hover:border-ui transition-colors">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleTopicChange(mIndex, tIndex, 'isChecked', !topic.isChecked)}
                                                className={`flex-shrink-0 transition-colors ${topic.isChecked ? 'text-emerald-500' : 'text-muted-clr hover:text-secondary'}`}
                                                title="Mark as Covered"
                                            >
                                                {topic.isChecked ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                                            </button>

                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={topic.title}
                                                    onChange={(e) => handleTopicChange(mIndex, tIndex, 'title', e.target.value)}
                                                    className={`bg-transparent w-full text-base font-semibold focus:outline-none ${topic.isChecked ? 'text-muted-clr line-through' : 'text-primary'}`}
                                                    placeholder="Topic Title"
                                                />
                                            </div>

                                            <select
                                                value={topic.teacherStatus}
                                                onChange={(e) => handleTopicChange(mIndex, tIndex, 'teacherStatus', e.target.value)}
                                                className={`text-xs bg-surface border border-ui rounded px-2 py-1 outline-none cursor-pointer ${topic.teacherStatus === 'completed' ? 'text-emerald-600' :
                                                    topic.teacherStatus === 'in_progress' ? 'text-amber-600' :
                                                        'text-secondary'
                                                    }`}
                                            >
                                                <option value="not_covered">Not Covered</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="completed">Completed</option>
                                            </select>

                                            <button onClick={() => handleDeleteTopic(mIndex, tIndex)} className="text-gray-300 hover:text-red-500 opacity-60 hover:opacity-100">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Resources Section */}
                                        <div className="ml-8 border-l-2 border-ui pl-4 space-y-2">
                                            {topic.resources && topic.resources.map((res, rIndex) => (
                                                <div key={rIndex} className="flex gap-2 items-center text-sm">
                                                    <select
                                                        value={res.type}
                                                        onChange={(e) => handleResourceChange(mIndex, tIndex, rIndex, 'type', e.target.value)}
                                                        className="bg-surface text-secondary rounded px-2 py-1 border border-ui outline-none w-28"
                                                    >
                                                        <option value="video">Video</option>
                                                        <option value="article">Document</option>
                                                        <option value="link">Link</option>
                                                        <option value="audio">Audio</option>
                                                        <option value="quiz">Quiz</option>
                                                        <option value="documentation">Documentation</option>
                                                        <option value="assignment">Assignment</option>
                                                    </select>
                                                    <input
                                                        type="text"
                                                        value={res.title}
                                                        onChange={(e) => handleResourceChange(mIndex, tIndex, rIndex, 'title', e.target.value)}
                                                        placeholder="Resource Title"
                                                        className="bg-transparent border-b border-ui text-primary w-1/3 focus:border-theme outline-none"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={res.url}
                                                        onChange={(e) => handleResourceChange(mIndex, tIndex, rIndex, 'url', e.target.value)}
                                                        placeholder={res.type === 'link' ? "External URL" : "File URL or Upload"}
                                                        className="bg-transparent border-b border-ui text-secondary w-1/3 focus:border-theme outline-none"
                                                    />

                                                    {['video', 'article', 'audio'].includes(res.type) && (
                                                        <label className="cursor-pointer text-muted-clr hover:text-theme p-1">
                                                            <Upload className="w-4 h-4" />
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                onChange={(e) => handleFileUpload(e, mIndex, tIndex, rIndex)}
                                                                accept={
                                                                    res.type === 'video' ? 'video/*' :
                                                                        res.type === 'audio' ? 'audio/*' :
                                                                            '*'
                                                                }
                                                            />
                                                        </label>
                                                    )}

                                                    <button onClick={() => handleDeleteResource(mIndex, tIndex, rIndex)} className="text-gray-300 hover:text-red-500 p-1">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => handleAddResource(mIndex, tIndex)}
                                                className="text-xs text-theme hover:text-theme-hover flex items-center gap-1 mt-2"
                                            >
                                                <Plus className="w-3 h-3" /> Add Resource
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={() => handleAddTopic(mIndex)}
                                    className="w-full py-2 border-2 border-dashed border-ui rounded-lg text-muted-clr hover:text-theme hover:border-theme/50 hover:bg-theme-light transition-all text-sm font-medium flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Add Topic
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={handleAddModule}
                        className="w-full py-4 bg-surface border border-ui-light rounded-none text-muted-clr hover:text-theme hover:bg-theme-light transition-all font-bold flex items-center justify-center gap-2 shadow-sm"
                    >
                        <Plus className="w-5 h-5" /> Add New Module
                    </button>
                </div>
            </div>
            {/* File Preview Modal */}
            {previewFile && (
                <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-surface w-full max-w-5xl h-[85vh] rounded-2xl flex flex-col overflow-hidden border border-ui shadow-2xl">
                        <div className="flex justify-between items-center p-4 bg-page border-b border-ui">
                            <h3 className="text-primary font-bold truncate">{previewFile.name}</h3>
                            <button onClick={() => setPreviewFile(null)} className="text-muted-clr hover:text-primary">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 bg-surface relative flex flex-col items-center justify-center p-4">
                            {previewFile.url.endsWith('.pdf') ? (
                                <iframe src={previewFile.url} className="w-full h-full" title="PDF Preview" />
                            ) : (
                                <>
                                    {previewFile.url.includes('localhost') || previewFile.url.includes('127.0.0.1') ? (
                                        <div className="text-center space-y-4">
                                            <div className="text-amber-600 font-bold text-xl">Preview Unavailable Locally</div>
                                            <p className="text-secondary max-w-md mx-auto">
                                                Google Docs Viewer cannot preview files hosted on <b>localhost</b>.
                                                This feature will work automatically when deployed to a public server.
                                            </p>
                                        </div>
                                    ) : (
                                        <iframe
                                            src={`https://docs.google.com/gview?url=${encodeURIComponent(previewFile.url)}&embedded=true`}
                                            className="w-full h-full absolute inset-0"
                                            title="Doc Preview"
                                        />
                                    )}
                                </>
                            )}

                            {(!previewFile.url.endsWith('.pdf') || previewFile.url.includes('localhost')) && (
                                <a
                                    href={previewFile.url}
                                    download
                                    className="mt-6 inline-flex items-center gap-2 bg-theme hover:bg-theme-hover text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-sm"
                                >
                                    <Upload className="rotate-180 w-5 h-5" /> Download File
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurriculumBuilder;
