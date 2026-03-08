import React from 'react';
import { Rocket, Star, Clock, Bell } from 'lucide-react';

const ComingSoon = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 animate-in fade-in zoom-in duration-500">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-brand-gold blur-3xl opacity-20 rounded-full"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-brand-gold to-yellow-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-yellow-500/30 transform rotate-6 border border-white/20">
                    <Rocket size={48} className="text-white drop-shadow-md" />
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg transform -rotate-12 animate-bounce">
                    <Star size={24} className="text-yellow-500 fill-yellow-500" />
                </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600 mb-6 tracking-tight">
                Employee Dashboard
                <span className="block text-2xl md:text-3xl font-bold text-brand-gold mt-2">Coming Soon</span>
            </h2>

            <p className="text-lg text-slate-500 max-w-lg mb-10 leading-relaxed font-medium">
                We're building a powerful new experience for our employees.
                Stay tuned for a comprehensive dashboard designed to streamline your workflow.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
                <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-md border border-slate-100 min-w-[200px]">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Clock size={20} />
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-bold text-slate-400 uppercase">Estimated Arrival</p>
                        <p className="text-sm font-bold text-slate-700">Coming Soon</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-md border border-slate-100 min-w-[200px]">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                        <Bell size={20} />
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-bold text-slate-400 uppercase">Status</p>
                        <p className="text-sm font-bold text-slate-700">In Development</p>
                    </div>
                </div>
            </div>

            <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 w-full max-w-md">
                <p className="text-sm font-semibold text-slate-500">
                    This feature is currently under active development.
                </p>
            </div>
        </div>
    );
};

export default ComingSoon;
