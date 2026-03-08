import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Calculator, Percent, Shield, Landmark, IndianRupee, PieChart } from 'lucide-react';

const FloatingIconsAnimation = () => {
    // Configuration for floating icons
    const icons = [
        { Icon: FileText, color: "#ED6E3F", size: 40, x: "10%", delay: 0 },
        { Icon: Calculator, color: "#043E52", size: 30, x: "25%", delay: 2 },
        { Icon: Percent, color: "#ED6E3F", size: 35, x: "40%", delay: 1 },
        { Icon: Shield, color: "#043E52", size: 45, x: "60%", delay: 3 },
        { Icon: Landmark, color: "#ED6E3F", size: 30, x: "75%", delay: 0.5 },
        { Icon: IndianRupee, color: "#043E52", size: 35, x: "85%", delay: 2.5 },
        { Icon: PieChart, color: "#ED6E3F", size: 40, x: "95%", delay: 1.5 },

        { Icon: FileText, color: "#043E52", size: 25, x: "15%", delay: 4 },
        { Icon: IndianRupee, color: "#ED6E3F", size: 30, x: "50%", delay: 3.5 },
        { Icon: Calculator, color: "#043E52", size: 35, x: "80%", delay: 4.5 },
    ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {icons.map((item, index) => (
                <motion.div
                    key={index}
                    initial={{ y: "120%", opacity: 0, x: item.x }}
                    animate={{
                        y: "-20%",
                        opacity: [0, 0.4, 0.4, 0],
                        rotate: [0, 10, -10, 0]
                    }}
                    transition={{
                        duration: 15 + Math.random() * 10, // Slow floating (15-25s)
                        repeat: Infinity,
                        delay: item.delay,
                        ease: "linear",
                        times: [0, 0.2, 0.8, 1]
                    }}
                    className="absolute bottom-0"
                    style={{ left: item.x }}
                >
                    <item.Icon
                        size={item.size}
                        color={item.color}
                        strokeWidth={1.5}
                        className="opacity-20" // Base opacity
                    />
                </motion.div>
            ))}
        </div>
    );
};

export default FloatingIconsAnimation;
