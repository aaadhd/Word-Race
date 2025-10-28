import React, { useState } from 'react';

interface RippleButtonProps {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

interface Ripple {
  x: number;
  y: number;
  size: number;
  id: number;
}

const RippleButton: React.FC<RippleButtonProps> = ({ onClick, className = '', children, disabled = false }) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple: Ripple = {
      x,
      y,
      size,
      id: Date.now()
    };

    setRipples([...ripples, newRipple]);

    setTimeout(() => {
      setRipples(ripples => ripples.filter(r => r.id !== newRipple.id));
    }, 600);

    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
      disabled={disabled}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="ripple-effect"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size
          }}
        />
      ))}
    </button>
  );
};

export default RippleButton;
