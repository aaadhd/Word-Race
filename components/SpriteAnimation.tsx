import React, { useEffect, useRef } from 'react';

interface SpriteAnimationProps {
  spriteSheet: string;
  frameWidth: number;
  frameHeight: number;
  framesPerRow: number;
  totalFrames: number;
  frameRate: number; // frames per second
  className?: string;
  scale?: number;
  loop?: boolean; // whether to loop the animation
  autoPlay?: boolean; // whether to start playing immediately
}

const SpriteAnimation: React.FC<SpriteAnimationProps> = ({
  spriteSheet,
  frameWidth,
  frameHeight,
  framesPerRow,
  totalFrames,
  frameRate,
  className = '',
  scale = 1,
  loop = true,
  autoPlay = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIndexRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const animationFrameIdRef = useRef<number>();
  const hasCompletedRef = useRef(false);
  const isPlayingRef = useRef(autoPlay);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Improve image rendering quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const image = new Image();
    image.src = spriteSheet;

    const drawFrame = (frameIndex: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const row = Math.floor(frameIndex / framesPerRow);
      const col = frameIndex % framesPerRow;
      ctx.drawImage(
        image,
        col * frameWidth,
        row * frameHeight,
        frameWidth,
        frameHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );
    };

    const animate = (currentTime: number) => {
      // Stop animation if not playing or (not looping and already completed)
      if (!isPlayingRef.current || (!loop && hasCompletedRef.current)) {
        return;
      }

      const deltaTime = currentTime - lastFrameTimeRef.current;
      const frameDuration = 1000 / frameRate;

      if (deltaTime >= frameDuration) {
        // Draw the current frame
        drawFrame(frameIndexRef.current);

        // Move to next frame
        frameIndexRef.current += 1;

        // Check if animation completed
        if (frameIndexRef.current >= totalFrames) {
          if (loop) {
            frameIndexRef.current = 0;
          } else {
            frameIndexRef.current = totalFrames - 1; // Stay on last frame
            hasCompletedRef.current = true;
            isPlayingRef.current = false;
          }
        }

        lastFrameTimeRef.current = currentTime;
      }

      if (isPlayingRef.current && (loop || !hasCompletedRef.current)) {
        animationFrameIdRef.current = requestAnimationFrame(animate);
      }
    };

    image.onload = () => {
      // Draw first frame
      drawFrame(0);
      
      if (autoPlay) {
        animationFrameIdRef.current = requestAnimationFrame(animate);
      }
    };

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [spriteSheet, frameWidth, frameHeight, framesPerRow, totalFrames, frameRate, loop, autoPlay]);

  // Update playing state when autoPlay changes
  useEffect(() => {
    if (autoPlay && !hasCompletedRef.current) {
      isPlayingRef.current = true;
      lastFrameTimeRef.current = performance.now();
      animationFrameIdRef.current = requestAnimationFrame((time) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const animate = (currentTime: number) => {
          if (!isPlayingRef.current || (!loop && hasCompletedRef.current)) {
            return;
          }

          const deltaTime = currentTime - lastFrameTimeRef.current;
          const frameDuration = 1000 / frameRate;

          if (deltaTime >= frameDuration) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const row = Math.floor(frameIndexRef.current / framesPerRow);
            const col = frameIndexRef.current % framesPerRow;
            
            const image = new Image();
            image.src = spriteSheet;
            ctx.drawImage(
              image,
              col * frameWidth,
              row * frameHeight,
              frameWidth,
              frameHeight,
              0,
              0,
              canvas.width,
              canvas.height
            );

            frameIndexRef.current += 1;

            if (frameIndexRef.current >= totalFrames) {
              if (loop) {
                frameIndexRef.current = 0;
              } else {
                frameIndexRef.current = totalFrames - 1;
                hasCompletedRef.current = true;
                isPlayingRef.current = false;
              }
            }

            lastFrameTimeRef.current = currentTime;
          }

          if (isPlayingRef.current && (loop || !hasCompletedRef.current)) {
            animationFrameIdRef.current = requestAnimationFrame(animate);
          }
        };

        animate(time);
      });
    }
  }, [autoPlay, loop, frameRate, frameWidth, frameHeight, framesPerRow, totalFrames, spriteSheet]);

  return (
    <canvas
      ref={canvasRef}
      width={frameWidth * scale}
      height={frameHeight * scale}
      className={className}
      style={{
        imageRendering: 'high-quality',
        WebkitFontSmoothing: 'antialiased',
      }}
    />
  );
};

export default SpriteAnimation;

