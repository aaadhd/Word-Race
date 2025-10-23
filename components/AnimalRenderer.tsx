import React, { RefObject } from 'react';

interface AnimalConfig {
  name: string;
  videoSrc: string;
  imageSrc: string;
  height: string;
  scaleX: number;
  side: 'left' | 'right';
}

interface AnimalRendererProps {
  animal: AnimalConfig;
  videoRef: RefObject<HTMLVideoElement>;
  showVideo: boolean; // isPaused && !hideResultModal
}

const AnimalRenderer: React.FC<AnimalRendererProps> = ({ animal, videoRef, showVideo }) => {
  const { name, videoSrc, imageSrc, height, scaleX, side } = animal;

  const justifyClass = side === 'left' ? 'justify-start' : 'justify-end';
  const objectPosition = side === 'left' ? 'left bottom' : 'right bottom';
  const transformOrigin = side === 'left' ? 'left center' : 'right center';

  const commonStyle = {
    height,
    objectFit: 'contain' as const,
    objectPosition,
    transform: `translate3d(0, 0, 0) scaleX(${scaleX})`,
    transformOrigin,
    willChange: 'auto' as const,
    backfaceVisibility: 'hidden' as const
  };

  return (
    <div
      className={`absolute ${side}-0 w-1/2 flex items-end ${justifyClass} pointer-events-none z-0`}
      style={{ bottom: '-2%' }}
    >
      {showVideo ? (
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="w-auto"
          style={commonStyle}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        <img
          src={imageSrc}
          alt={name}
          className="w-auto"
          style={commonStyle}
        />
      )}
    </div>
  );
};

export default AnimalRenderer;
