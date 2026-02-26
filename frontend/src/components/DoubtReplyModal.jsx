import React, { useState, useRef } from 'react';
import { X, Mic, Square, Paperclip, Send, Loader, PhoneCall } from 'lucide-react';
import api from '../api/axios';

const DoubtReplyModal = ({ doubt, onClose, onReplySuccess }) => {
    const [replyContent, setReplyContent] = useState('');
    const [audioBlob, setAudioBlob] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const timerRef = useRef(null);
    const [sending, setSending] = useState(false);

    const [attachmentUrl, setAttachmentUrl] = useState('');

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            const chunks = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                setAudioBlob(blob);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);

            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Microphone access denied or not available.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            clearInterval(timerRef.current);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);

        try {
            let audioUrl = null;
            if (audioBlob) {
                audioUrl = "https://example.com/audio-ex-" + Date.now() + ".mp3";
            }

            const payload = {
                content: replyContent,
                audioUrl: audioUrl,
                attachments: attachmentUrl ? [{ type: 'link', url: attachmentUrl, name: 'Attachment' }] : []
            };

            await api.post(`/doubts/${doubt._id}/reply`, payload);
            alert("Reply sent successfully!");
            onReplySuccess();
            onClose();

        } catch (error) {
            console.error("Error sending reply:", error);
            alert("Failed to send reply.");
        } finally {
            setSending(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <div className="bg-surface rounded-2xl w-full max-w-lg border border-ui shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-ui-light flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-primary">Reply to Student</h3>
                        <p className="text-muted-clr text-xs mt-1">Replying to: {doubt.title}</p>
                    </div>
                    <button onClick={onClose} className="text-muted-clr hover:text-primary">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Original Query Context */}
                    <div className="bg-page p-4 rounded-lg border border-ui-light text-sm text-secondary italic">
                        "{doubt.description}"
                    </div>

                    {/* Text Reply */}
                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2">Your Answer</label>
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            rows="4"
                            className="w-full bg-page border border-ui rounded-lg px-4 py-3 text-primary focus:ring-2 focus:ring-theme outline-none resize-none"
                            placeholder="Type your explanation here..."
                        ></textarea>
                    </div>

                    {/* Audio Recorder */}
                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2">Voice Note (Optional)</label>
                        <div className="flex items-center space-x-4">
                            {!isRecording && !audioBlob && (
                                <button
                                    type="button"
                                    onClick={startRecording}
                                    className="flex items-center space-x-2 bg-surface-2 hover:bg-gray-200 text-primary px-4 py-2 rounded-full transition-colors"
                                >
                                    <Mic className="w-4 h-4" />
                                    <span>Record Audio</span>
                                </button>
                            )}

                            {isRecording && (
                                <button
                                    type="button"
                                    onClick={stopRecording}
                                    className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full animate-pulse transition-colors"
                                >
                                    <Square className="w-4 h-4" />
                                    <span>Stop ({formatTime(recordingTime)})</span>
                                </button>
                            )}

                            {audioBlob && (
                                <div className="flex items-center space-x-3 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                    <span className="text-emerald-600 text-sm">Audio Recorded</span>
                                    <button onClick={() => setAudioBlob(null)} className="text-muted-clr hover:text-primary ml-2"><X className="w-3 h-3" /></button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Simple Link Attachment */}
                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2">Resource Link (Video/Doc)</label>
                        <input
                            type="url"
                            className="w-full bg-page border border-ui rounded-lg px-4 py-2 text-primary focus:ring-2 focus:ring-theme outline-none text-sm"
                            placeholder="e.g. https://docs.google.com/..."
                            value={attachmentUrl}
                            onChange={(e) => setAttachmentUrl(e.target.value)}
                        />
                    </div>
                </div>

                <div className="p-6 border-t border-ui-light bg-page flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={sending}
                        className="bg-theme hover:bg-theme-hover text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {sending ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        {sending ? "Sending..." : "Send Reply"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoubtReplyModal;
