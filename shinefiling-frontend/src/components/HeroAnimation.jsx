import React, { useEffect, useRef } from 'react';

const HeroAnimation = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width, height;
        let animationFrameId;
        let connections = [];

        const initParticles = () => {
            // Circuit Lines (Left side)
            // Simulating vertical data flow lines
            connections = [];
            for (let i = 0; i < 15; i++) {
                connections.push({
                    x: Math.random() * (width * 0.4), // Left side only
                    y: height + Math.random() * 100,
                    speed: Math.random() * 2 + 1,
                    length: Math.random() * 100 + 50,
                    color: 'rgba(0, 255, 255, 0.3)' // Cyan
                });
            }
        };

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // --- 1. Circuit Lines (Left Side of Design) ---
            connections.forEach(line => {
                line.y -= line.speed;
                if (line.y < -line.length) line.y = height + line.length;

                // Draw "Digital Rain" or Circuit Path
                const gradient = ctx.createLinearGradient(line.x, line.y, line.x, line.y + line.length);
                gradient.addColorStop(0, 'rgba(0, 255, 255, 0)');
                gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.5)');
                gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');

                ctx.beginPath();
                ctx.moveTo(line.x, line.y);
                ctx.lineTo(line.x, line.y + line.length);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.stroke();

                // Blinking node at head
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(line.x, line.y, 2, 0, Math.PI * 2);
                ctx.fill();
            });

            // --- 2. Earth/Globe Animations (Right Side) ---
            // REMOVED: 3D Scene now handles the globe.
            // Leaving this empty to prevent double-rendering of globe concepts.

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />
    );
};

export default HeroAnimation;
