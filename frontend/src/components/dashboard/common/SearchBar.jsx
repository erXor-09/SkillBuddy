import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios'; // Adjust path if needed

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const wrapperRef = useRef(null);

    // Debounce Search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim()) {
                setLoading(true);
                try {
                    const res = await api.get(`/search?q=${query}`);
                    setResults(res.data.courses || []);
                    setIsOpen(true);
                } catch (error) {
                    console.error("Search failed", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

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

    const handleSelect = (courseId) => {
        navigate(`/courses/${courseId}`); // Assuming course detail route
        setIsOpen(false);
        setQuery('');
    };

    return (
        <div ref={wrapperRef} className="relative hidden md:block w-96">
            <div className={`flex items-center bg-gray-900 border ${isOpen ? 'border-purple-500 ring-1 ring-purple-500' : 'border-gray-700'} rounded-lg px-4 py-2 transition-all`}>
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                    type="text"
                    placeholder="Search courses, topics..."
                    className="bg-transparent border-none outline-none text-white w-full placeholder-gray-500 text-sm"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query && setIsOpen(true)}
                />
                {loading && <Loader className="w-4 h-4 text-purple-400 animate-spin ml-2" />}
                {query && !loading && (
                    <button onClick={() => { setQuery(''); setIsOpen(false); }} className="text-gray-500 hover:text-white ml-2">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-2xl mt-2 z-50 overflow-hidden">
                    {results.length > 0 ? (
                        <div className="py-2">
                            <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Courses</h3>
                            {results.map(course => (
                                <div
                                    key={course._id}
                                    onClick={() => handleSelect(course._id)}
                                    className="px-4 py-3 hover:bg-white/5 cursor-pointer border-l-2 border-transparent hover:border-purple-500 transition-colors"
                                >
                                    <div className="text-sm font-medium text-white">{course.title}</div>
                                    <div className="text-xs text-gray-400 truncate">{course.description}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            No results found for "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
