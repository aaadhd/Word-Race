
import React, { useEffect, useState } from 'react';

interface ConfettiProps {
    trigger?: boolean;
    type?: 'success' | 'error';
    count?: number;
}

const Confetti: React.FC<ConfettiProps> = ({ trigger = true, type = 'success', count = 100 }) => {
    const [show, setShow] = useState(trigger);

    useEffect(() => {
        if (trigger) {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [trigger]);

    if (!show) return null;

    const confetti = Array.from({ length: count }).map((_, index) => {
        const colors = type === 'success'
            ? ['#fbbf24', '#f59e0b', '#22c55e', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e']
            : ['#ef4444', '#dc2626', '#f87171', '#fca5a5'];

        const style: React.CSSProperties = {
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${(Math.random() * 1.5 + 2) * 0.8}s`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        };
        return <div key={index} className="confetti" style={style}></div>;
    });

    return <div className="confetti-container">{confetti}</div>;
};

// We need to inject the CSS for the confetti animation into the document head
// as we can't create a separate CSS file.
const css = `
.confetti-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
    z-index: 999;
}
.confetti {
    position: absolute;
    width: 10px;
    height: 20px;
    top: -30px;
    opacity: 0.8;
    animation: fall linear forwards;
}
@keyframes fall {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
    }
}
`;

// Check if the stylesheet is already added to prevent duplicates on re-render
if (!document.getElementById('confetti-styles')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'confetti-styles';
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
}


export default Confetti;