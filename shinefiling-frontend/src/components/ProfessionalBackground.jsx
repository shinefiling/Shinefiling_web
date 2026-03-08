import React, { useCallback } from 'react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const ProfessionalBackground = () => {
    const particlesInit = useCallback(async engine => {
        await loadSlim(engine);
    }, []);

    return (
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
            <Particles
                id="tsparticles"
                init={particlesInit}
                options={{
                    fullScreen: { enable: false },
                    background: {
                        color: {
                            value: "transparent",
                        },
                    },
                    fpsLimit: 120,
                    interactivity: {
                        events: {
                            onClick: {
                                enable: true,
                                mode: "push",
                            },
                            onHover: {
                                enable: true,
                                mode: "grab",
                            },
                            resize: true,
                        },
                        modes: {
                            push: {
                                quantity: 4,
                            },
                            grab: {
                                distance: 140,
                                links: {
                                    opacity: 1
                                }
                            },
                        },
                    },
                    particles: {
                        color: {
                            value: ["#043E52", "#ED6E3F"], // Navy and Bronze Mix
                        },
                        links: {
                            color: "#ED6E3F", // Bronze Connections
                            distance: 150,
                            enable: true,
                            opacity: 0.25,
                            width: 1,
                        },
                        move: {
                            direction: "none",
                            enable: true,
                            outModes: {
                                default: "bounce",
                            },
                            random: false,
                            speed: 0.8,
                            straight: false,
                        },
                        number: {
                            density: {
                                enable: true,
                                area: 800,
                            },
                            value: 100, // Slightly denser for better effect
                        },
                        opacity: {
                            value: 0.6, // Higher opacity for visibility
                        },
                        shape: {
                            type: ["circle", "triangle"], // Mixed shapes for visual interest
                        },
                        size: {
                            value: { min: 2, max: 4 },
                        },
                    },
                    detectRetina: true,
                }}
                className="w-full h-full"
            />
        </div>
    );
};

export default ProfessionalBackground;
