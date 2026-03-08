import React, { useEffect, useRef } from 'react';

const NeuralNetworkAnimation = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width, height;
        let animationFrameId;

        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 30 : 80;
        const particles = [];
        const connectionDistance = 150;

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.z = Math.random() * width; // Depth simulator
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 1.5 + 0.5;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(251, 211, 77, 0.4)'; // Gold-ish
                ctx.fill();
            }
        }

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            init();
        };

        const init = () => {
            particles.length = 0;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);

                        // Dynamic opacity based on distance
                        const alpha = (1 - dist / connectionDistance) * 0.15;
                        ctx.strokeStyle = `rgba(181, 136, 99, ${alpha})`; // Bronze
                        ctx.lineWidth = 0.5;
                        ctx.stroke();

                        // Occasional pulse effect
                        if (Math.random() > 0.9995) {
                            // This is handled by a separate logic if needed, 
                            // but keep it simple and clean first
                        }
                    }
                }
            }

            particles.forEach(p => {
                p.update();
                p.draw();
            });

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

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />;
};

const HeroIsometricBackground = () => {
    return (
        <div className="absolute inset-0 w-full h-full bg-[#0F172A] z-0 overflow-hidden">
            {/* 1. Deep Space Gradient Base */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#1e293b]"></div>

            {/* 2. The Premium Background Image (Optimized Opacity) */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2500"
                    alt="ShineFiling Digital Landscape"
                    className="w-full h-full object-cover opacity-30 select-none pointer-events-none"
                />

                {/* Visual Depth Gradients */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#020617] to-transparent"></div>
            </div>

            {/* 3. Neural Network Particle Animation */}
            <NeuralNetworkAnimation />

            {/* 4. Elegant Glowing Nebulas (Soft Movement) */}
            <div className="absolute top-[30%] left-[20%] w-[600px] h-[600px] bg-bronze/5 rounded-full blur-[150px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[130px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

            {/* 5. Subtle Technical Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
            </div>
        </div>
    );
};

export default HeroIsometricBackground;
