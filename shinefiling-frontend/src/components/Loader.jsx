import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = true }) => {
    return (
        <div className={fullScreen ? "fixed inset-0 flex items-center justify-center bg-[#F2F1EF]/90 backdrop-blur-sm z-[9999]" : "relative p-20 flex items-center justify-center"}>
            <div className="flex flex-col items-center justify-center gap-6">

                {/* Animated Bars Container */}
                <div className="flex items-center gap-2 h-16">
                    {/* Bar 1 - Navy */}
                    <motion.div
                        className="w-3 bg-[#032D3C] rounded-full"
                        animate={{
                            height: ["20%", "80%", "20%"],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0
                        }}
                    />

                    {/* Bar 2 - Gold */}
                    <motion.div
                        className="w-3 bg-[#D9A55B] rounded-full"
                        animate={{
                            height: ["20%", "100%", "20%"],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.2
                        }}
                    />

                    {/* Bar 3 - Navy */}
                    <motion.div
                        className="w-3 bg-[#032D3C] rounded-full"
                        animate={{
                            height: ["20%", "80%", "20%"],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.4
                        }}
                    />

                    {/* Bar 4 - Gold */}
                    <motion.div
                        className="w-3 bg-[#D9A55B] rounded-full"
                        animate={{
                            height: ["20%", "60%", "20%"],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.6
                        }}
                    />
                </div>

                {/* Brand Text - Gradient of the 2 colors */}
                <div className="flex flex-col items-center">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#032D3C] to-[#D9A55B] font-black text-xl tracking-widest uppercase drop-shadow-sm">ShineFiling</span>
                    <div className="flex gap-1 mt-1">
                        <motion.div
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                            className="w-1.5 h-1.5 bg-[#032D3C] rounded-full"
                        />
                        <motion.div
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                            className="w-1.5 h-1.5 bg-[#D9A55B] rounded-full"
                        />
                        <motion.div
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                            className="w-1.5 h-1.5 bg-[#032D3C] rounded-full"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Loader;
