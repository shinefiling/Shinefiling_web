import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Plus, Trash2, Save, X } from 'lucide-react';
import { getAdminJobs, createJob, deleteJob } from '../../../../careerApi';

const CareersControl = () => {
    const [jobs, setJobs] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newJob, setNewJob] = useState({
        title: '',
        location: 'Remote',
        type: 'Full-time',
        description: '',
        department: 'Engineering'
    });
    const [isLoading, setIsLoading] = useState(false);

    // Load jobs on mount
    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const data = await getAdminJobs();
            setJobs(data);
        } catch (error) {
            console.error("Failed to load jobs", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddJob = async (e) => {
        e.preventDefault();
        try {
            await createJob(newJob);
            await fetchJobs(); // Refresh list
            setIsAdding(false);
            setNewJob({ title: '', location: 'Remote', type: 'Full-time', description: '', department: 'Engineering' });
        } catch (error) {
            alert('Failed to save job');
        }
    };

    const handleDeleteJob = async (id) => {
        if (window.confirm('Are you sure you want to delete this job posting?')) {
            try {
                await deleteJob(id);
                fetchJobs(); // Refresh list
            } catch (error) {
                alert('Failed to delete job');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-[#043E52]">Careers & Hiring</h2>
                    <p className="text-[#3D4D55] text-sm">Manage job openings and valid applications.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#043E52] text-white rounded-lg font-bold hover:bg-[#ED6E3F] transition-colors shadow-lg shadow-[#043E52]/20"
                >
                    <Plus size={18} /> Post New Job
                </button>
            </div>

            {/* Visual Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-[#3D4D55] font-bold uppercase">Active Openings</p>
                        <h3 className="text-2xl font-black text-[#043E52]">{jobs.length}</h3>
                    </div>
                    <div className="p-3 bg-[#FDFBF7] text-[#ED6E3F] rounded-lg border border-[#ED6E3F]/20"><Briefcase size={24} /></div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-[#3D4D55] font-bold uppercase">Total Applications</p>
                        <h3 className="text-2xl font-black text-[#043E52]">0</h3>
                    </div>
                    <div className="p-3 bg-[#FDFBF7] text-[#ED6E3F] rounded-lg border border-[#ED6E3F]/20"><Briefcase size={24} /></div>
                </div>
            </div>

            {/* Add Job Modal/Form */}
            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-200 animate-in zoom-in-95 max-w-2xl w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-xl text-[#043E52]">Post New Job</h3>
                            <button onClick={() => setIsAdding(false)} className="text-[#3D4D55] hover:text-[#043E52] bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAddJob} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-xs font-bold text-[#3D4D55] mb-1">Job Title</label>
                                <input
                                    required
                                    type="text"
                                    value={newJob.title}
                                    onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ED6E3F]/20 focus:border-[#ED6E3F] outline-none text-sm text-[#043E52]"
                                    placeholder="e.g. Legal Associate"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#3D4D55] mb-1">Department</label>
                                <select
                                    value={newJob.department}
                                    onChange={e => setNewJob({ ...newJob, department: e.target.value })}
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ED6E3F]/20 focus:border-[#ED6E3F] outline-none text-sm font-bold text-[#043E52]"
                                >
                                    <option>Legal</option>
                                    <option>Engineering</option>
                                    <option>Sales</option>
                                    <option>Marketing</option>
                                    <option>Operations</option>
                                    <option>Finance</option>
                                    <option>Tech</option>
                                    <option>HR</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#3D4D55] mb-1">Location</label>
                                <input
                                    type="text"
                                    value={newJob.location}
                                    onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ED6E3F]/20 focus:border-[#ED6E3F] outline-none text-sm text-[#043E52]"
                                    placeholder="e.g. Remote, Bangalore"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#3D4D55] mb-1">Job Type</label>
                                <select
                                    value={newJob.type}
                                    onChange={e => setNewJob({ ...newJob, type: e.target.value })}
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ED6E3F]/20 focus:border-[#ED6E3F] outline-none text-sm font-bold text-[#043E52]"
                                >
                                    <option>Full-time</option>
                                    <option>Part-time</option>
                                    <option>Contract</option>
                                    <option>Internship</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-[#3D4D55] mb-1">Description</label>
                                <textarea
                                    required
                                    value={newJob.description}
                                    onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ED6E3F]/20 focus:border-[#ED6E3F] outline-none text-sm h-32 resize-none text-[#043E52]"
                                    placeholder="Brief description of the role..."
                                />
                            </div>
                            <div className="col-span-2 flex justify-end gap-2 mt-2">
                                <button type="button" onClick={() => setIsAdding(false)} className="px-5 py-2.5 text-sm font-bold text-[#3D4D55] hover:bg-gray-100 rounded-lg transition">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-[#043E52] hover:bg-[#ED6E3F] rounded-lg shadow-lg shadow-[#043E52]/20 transition">Post Job</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Job List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[300px]">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-[#043E52]">Current Job Openings</h3>
                    <div className="flex items-center gap-2">
                        {isLoading && <span className="text-xs text-[#ED6E3F] animate-pulse">Refreshing...</span>}
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Live on Website</span>
                    </div>
                </div>
                {jobs.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center h-full">
                        <Briefcase size={48} className="mb-4 opacity-20" />
                        <p className="text-sm font-medium">No active job postings found.</p>
                        <p className="text-xs mt-1 opacity-70">Click "Post New Job" to add one.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {jobs.map((job) => (
                            <div key={job.id} className="p-5 hover:bg-gray-50 transition-colors flex justify-between items-center group">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1.5">
                                        <h4 className="font-bold text-[#043E52] text-lg">{job.title}</h4>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${job.department === 'Legal' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>{job.department}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                                        <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#ED6E3F]" /> {job.location}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                        <span className="flex items-center gap-1.5">{job.type}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
                                    <button
                                        onClick={() => handleDeleteJob(job.id)}
                                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Job"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CareersControl;
