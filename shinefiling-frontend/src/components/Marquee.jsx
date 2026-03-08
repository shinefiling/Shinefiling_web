import React from "react";
import { motion } from "framer-motion";

const Marquee = ({ children, speed = 20 }) => {
    return (
        <div className="overflow-hidden flex gap-10 select-none mask-linear-gradient">
            <motion.div
                initial={{ x: 0 }}
                animate={{ x: "-50%" }}
                transition={{
                    repeat: Infinity,
                    duration: speed,
                    ease: "linear",
                    repeatType: "loop"
                }}
                className="flex gap-10 min-w-max items-center will-change-transform"
            >
                {children}
                {children}
            </motion.div>
        </div>
    );
};

export default Marquee;
