
import React from 'react';

const CONFETTI_COUNT = 150;

const Confetti: React.FC = () => {
    const confetti = Array.from({ length: CONFETTI_COUNT }).map((_, index) => {
        const style: React.CSSProperties = {
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
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
    animation: fall linear infinite;
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