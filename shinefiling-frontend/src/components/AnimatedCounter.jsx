import React, { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const AnimatedCounter = ({ from = 0, to, duration = 2, className = "" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [count, setCount] = useState(from);

    useEffect(() => {
        if (isInView) {
            let startTime;
            let animationFrame;

            const animate = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

                // Easing function (easeOutExpo) for professional feel
                const easeOut = (x) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x));

                const currentCount = Math.floor(easeOut(progress) * (to - from) + from);
                setCount(currentCount);

                if (progress < 1) {
                    animationFrame = requestAnimationFrame(animate);
                }
            };

            animationFrame = requestAnimationFrame(animate);
            return () => cancelAnimationFrame(animationFrame);
        }
    }, [isInView, from, to, duration]);

    return <span ref={ref} className={className}>{count}</span>;
};

export default AnimatedCounter;
