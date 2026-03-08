import React, { useState, useEffect } from 'react';
import {
    File, UploadCloud, Trash2, Search, Filter, FileText, Image as ImageIcon,
    Download, Eye, Clock, Database, HardDrive, CheckCircle, X, Folder,
    Users, MessageSquare, Award, Monitor, User, Building, FileCheck,
    LayoutGrid, List as ListIcon, MoreVertical, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllFiles, uploadFile, deleteFile, BASE_URL } from '../../../../api';

const FOLDERS = [
    { id: 'all', label: 'All Files', icon: HardDrive, color: 'text-slate-500 dark:text-slate-400' },
    { id: 'client_docs', label: 'Client Documents', icon: Users, color: 'text-blue-500' },
    { id: 'director_docs', label: 'Director Proofs', icon: User, color: 'text-indigo-500' },
    { id: 'company_docs', label: 'Company Docs', icon: Building, color: 'text-orange-500' },
    { id: 'fssai_docs', label: 'FSSAI Files', icon: FileCheck, color: 'text-green-500' },
    { id: 'service_files', label: 'Service Files', icon: FileText, color: 'text-purple-500' },
    { id: 'chats', label: 'Chat Attachments', icon: MessageSquare, color: 'text-pink-500' },
    { id: 'certificates', label: 'Certificates', icon: Award, color: 'text-yellow-500' },
    { id: 'marketing', label: 'Marketing Assets', icon: Monitor, color: 'text-red-500' },
    { id: 'others', label: 'Other Files', icon: Folder, color: 'text-gray-400' },
];

const FileManager = ({ defaultFolder = 'all' }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFolder, setSelectedFolder] = useState(defaultFolder);
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'

    useEffect(() => {
        if (defaultFolder) setSelectedFolder(defaultFolder);
    }, [defaultFolder]);

    useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        try {
            setLoading(true);
            const data = await getAllFiles();
            if (Array.isArray(data)) setFiles(data);
        } catch (e) {
            console.error("Failed to load files", e);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const category = selectedFolder === 'all' ? 'others' : selectedFolder;
            await uploadFile(file, category);
            await loadFiles();
        } catch (e) {
            alert("Upload failed: " + e.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this file?")) return;
        try {
            await deleteFile(id);
            setFiles(prev => prev.filter(f => f.id !== id));
        } catch (e) {
            alert("Delete failed");
        }
    };

    const formatSize = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (type) => {
        if (!type) return <File size={24} className="text-slate-400" />;
        if (type.includes('image')) return <ImageIcon size={24} className="text-purple-500" />;
        if (type.includes('pdf')) return <FileText size={24} className="text-red-500" />;
        return <File size={24} className="text-blue-500" />;
    };

    const filteredFiles = files.filter(f => {
        const matchesSearch = (f.originalFileName || f.fileName || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFolder = selectedFolder === 'all' || f.category === selectedFolder || (!f.category && selectedFolder === 'others');
        return matchesSearch && matchesFolder;
    });

    const activeFolder = FOLDERS.find(f => f.id === selectedFolder) || FOLDERS[0];

    return (
        <div className="flex flex-col bg-[#F8FAFC] dark:bg-slate-900 min-h-[600px] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm font-[Roboto,sans-serif]">

            {/* Header Toolbar */}
            <div className="h-20 px-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl sticky top-0 z-20 rounded-t-2xl">
                <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500 mb-0.5">
                        <HardDrive size={12} />
                        <span>File Storage</span>
                        <ChevronRight size={12} />
                        <span className="text-slate-600 dark:text-slate-300">{activeFolder.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                            <activeFolder.icon className={activeFolder.color} size={24} /> {activeFolder.label}
                        </h2>
                        <span className="text-xs font-bold bg-orange-50 dark:bg-orange-500/10 text-[#F97316] px-2.5 py-1 rounded-full border border-orange-100 dark:border-orange-500/20">
                            {filteredFiles.length} files
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative group">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-[#F97316] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search files..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-all w-64 shadow-sm font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                    </div>

                    {/* View Toggle */}
                    <div className="p-1 bg-slate-100 dark:bg-slate-700/50 rounded-xl flex border border-slate-200 dark:border-slate-700">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 text-[#F97316] shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
                        >
                            <ListIcon size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-white dark:bg-slate-600 text-[#F97316] shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
                        >
                            <LayoutGrid size={18} />
                        </button>
                    </div>

                    {/* Upload Button */}
                    <label className={`
                        px-6 py-2.5 bg-[#F97316] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 
                        hover:bg-orange-600 hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98]
                        transition-all duration-200 cursor-pointer flex items-center gap-2.5
                        ${uploading ? 'opacity-70 pointer-events-none' : ''}
                    `}>
                        {uploading ? <Clock size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                        <span className="text-sm">Upload</span>
                        <input type="file" className="hidden" onChange={handleFileUpload} />
                    </label>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-8 bg-[#F8FAFC] dark:bg-slate-900 rounded-b-2xl">

                {/* Folder Grid (Only in 'All Files') */}
                {selectedFolder === 'all' && !searchQuery && (
                    <div className="mb-10">
                        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-4 uppercase tracking-wider">Folders</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {FOLDERS.filter(f => f.id !== 'all').map(folder => (
                                <button
                                    key={folder.id}
                                    onClick={() => setSelectedFolder(folder.id)}
                                    className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500/30 transition text-left flex items-center gap-3 group"
                                >
                                    <div className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 group-hover:scale-110 transition duration-300`}>
                                        <folder.icon className={folder.color} size={20} />
                                    </div>
                                    <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{folder.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-4 uppercase tracking-wider">
                    {selectedFolder === 'all' ? 'Recent Files' : 'Files'}
                </h3>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-500 animate-pulse">
                        <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full mb-4"></div>
                        <p>Loading your files...</p>
                    </div>
                ) : filteredFiles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-300 dark:text-slate-600">
                        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                            <activeFolder.icon size={48} className="opacity-20 text-slate-500 dark:text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-500 dark:text-slate-400">No content in {activeFolder.label}</h3>
                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">Upload documents to get started.</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {viewMode === 'list' ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
                            >
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px] tracking-wider border-b border-slate-100 dark:border-slate-700">
                                        <tr>
                                            <th className="px-6 py-4 pl-8">Name</th>
                                            <th className="px-6 py-4">Size</th>
                                            <th className="px-6 py-4">Type</th>
                                            <th className="px-6 py-4">Uploaded At</th>
                                            <th className="px-6 py-4 text-right pr-8">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                                        {filteredFiles.map((file) => (
                                            <tr key={file.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition duration-150 group">
                                                <td className="px-6 py-4 pl-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-2.5 bg-slate-100 dark:bg-slate-700 rounded-xl group-hover:bg-white dark:group-hover:bg-slate-600 group-hover:shadow-sm transition border border-transparent group-hover:border-slate-100 dark:group-hover:border-slate-500">
                                                            {getFileIcon(file.contentType)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-700 dark:text-slate-200 line-clamp-1 max-w-[200px]">{file.originalFileName || file.fileName}</p>
                                                            <a
                                                                href={`${BASE_URL.replace('/api', '')}${file.url}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-[11px] text-[#F97316] hover:text-orange-600 hover:underline flex items-center gap-1 mt-0.5"
                                                            >
                                                                View File <Eye size={10} />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-mono text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{formatSize(file.size)}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 capitalize">{file.contentType?.split('/')[1] || 'Unknown'}</span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-400 dark:text-slate-500 text-xs font-medium">
                                                    {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-right pr-8">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition duration-200">
                                                        <a
                                                            href={`${BASE_URL.replace('/api', '')}${file.url}`}
                                                            download
                                                            className="p-2 text-slate-400 dark:text-slate-500 hover:text-[#F97316] dark:hover:text-[#F97316] hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-full transition"
                                                        >
                                                            <Download size={16} />
                                                        </a>
                                                        <button
                                                            onClick={() => handleDelete(file.id)}
                                                            className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                            >
                                {filteredFiles.map((file) => (
                                    <div key={file.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-[#F97316]/20 transition group relative">
                                        <div className="aspect-square bg-slate-50 dark:bg-slate-700/50 rounded-xl mb-4 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-700">
                                            {file.contentType?.includes('image') ? (
                                                <img
                                                    src={`${BASE_URL.replace('/api', '')}${file.url}`}
                                                    alt={file.fileName}
                                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition duration-500"
                                                />
                                            ) : (
                                                <div className="scale-150 transform group-hover:scale-125 transition duration-300">
                                                    {getFileIcon(file.contentType)}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-700 dark:text-slate-200 text-sm truncate mb-1">{file.originalFileName || file.fileName}</p>
                                            <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                                                <span>{formatSize(file.size)}</span>
                                                <span>{file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : ''}</span>
                                            </div>
                                        </div>

                                        {/* Overlay Actions */}
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleDelete(file.id)}
                                                className="p-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-red-500 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                            <a
                                                href={`${BASE_URL.replace('/api', '')}${file.url}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-[#F97316] rounded-full shadow-sm hover:bg-[#F97316] hover:text-white transition"
                                            >
                                                <Eye size={12} />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default FileManager;
