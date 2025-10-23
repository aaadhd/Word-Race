import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameMode } from '../types.ts';
import SpriteAnimation from './SpriteAnimation.tsx';

interface DrawingCanvasProps {
  word: string;
  strokeColor: string;
  onDone: (hasDrawn: boolean, accuracy: number, canvasDataUrl: string) => void;
  mode: GameMode;
  isPaused: boolean;
  startAtMs: number | null;
  onTimerChange?: (timeLeft: number) => void;
  currentRound?: number;
  playAnimation?: boolean;
}

const TRACING_TIME_SECONDS = 20;

const getFontSize = (length: number): number => {
    if (length <= 5) return 120;
    if (length <= 7) return 96;
    if (length <= 9) return 76;
    if (length <= 11) return 60;
    if (length <= 13) return 52;
    return 44;
};

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ word, strokeColor, onDone, mode, isPaused, startAtMs, onTimerChange, currentRound = 1, playAnimation = false }) => {
  console.log('TracingCanvas - strokeColor:', strokeColor, 'isTeamB:', strokeColor === '#ef4444');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const userCanvasRef = useRef<HTMLCanvasElement | null>(null); // Offscreen canvas for user strokes
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TRACING_TIME_SECONDS);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize the offscreen canvas for user drawings and set up non-passive event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && !userCanvasRef.current) {
        userCanvasRef.current = document.createElement('canvas');
        userCanvasRef.current.width = canvas.width;
        userCanvasRef.current.height = canvas.height;

        // Add non-passive event listeners to prevent default touch behaviors
        const preventDefaultHandler = (e: TouchEvent) => {
          e.preventDefault();
        };

        canvas.addEventListener('touchstart', preventDefaultHandler, { passive: false });
        canvas.addEventListener('touchmove', preventDefaultHandler, { passive: false });
        canvas.addEventListener('touchend', preventDefaultHandler, { passive: false });

        return () => {
          canvas.removeEventListener('touchstart', preventDefaultHandler);
          canvas.removeEventListener('touchmove', preventDefaultHandler);
          canvas.removeEventListener('touchend', preventDefaultHandler);
        };
    }
  }, []);

  const drawWordTemplate = useCallback((ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Reset context state to prevent any carry-over
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    const fontSize = getFontSize(word.length);
    // Use font metrics to get accurate measurements
    ctx.font = `${fontSize}px "Fredoka One"`;
    ctx.textBaseline = 'alphabetic';
    const metrics = ctx.measureText(word);
    const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    // Center the text vertically, accounting for both ascent and descent
    const baseline_y = canvas.height / 2 + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
    
    // Calculate line spacing based on word length
    // 1-6 letters: same spacing (129.6px), 7+ letters: decreasing spacing
    const baseSpacing = 130; // Fixed spacing for 1-6 letters (108px * 1.2)
    const spacingReduction = 14; // Reduction per character after 6 letters (12px * 1.2)
    const minSpacing = 72; // Minimum spacing (60px * 1.2)
    const lineSpacing = word.length <= 6 
      ? baseSpacing 
      : Math.max(baseSpacing - ((word.length - 6) * spacingReduction), minSpacing);
    
    const topline_y = baseline_y - lineSpacing;
    const midline_y = baseline_y - lineSpacing / 2;

    // Draw guidelines for both modes
    ctx.strokeStyle = '#9ca3af'; // gray-400 (30% darker)
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 3]); // Dotted lines

    // Canvas is 450px wide, center everything in the canvas
    const canvasCenterX = canvas.width / 2; // Center of canvas (225px)

    // Fixed line length of 400px
    const lineLength = 400; // Fixed line length
    const lineMargin = canvasCenterX - lineLength / 2; // Start from center minus half length (25px from left)
    const lineEndMargin = canvasCenterX + lineLength / 2; // End at center plus half length (425px)

    // Baseline
    ctx.beginPath();
    ctx.moveTo(lineMargin, baseline_y);
    ctx.lineTo(lineEndMargin, baseline_y);
    ctx.stroke();
    
    // Top line
    ctx.beginPath();
    ctx.moveTo(lineMargin, topline_y);
    ctx.lineTo(lineEndMargin, topline_y);
    ctx.stroke();

    // Mid line
    ctx.beginPath();
    ctx.moveTo(lineMargin, midline_y);
    ctx.lineTo(lineEndMargin, midline_y);
    ctx.stroke();
    
    ctx.setLineDash([]); // Reset line dash

    if (mode === GameMode.TRACE) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.font = `${fontSize}px "Fredoka One"`;
        ctx.strokeStyle = '#374151'; // gray-700 (더 진한 색상)
        ctx.lineWidth = 2; // 더 두꺼운 선
        ctx.setLineDash([1, 5]); // Fine dots for the word
        // Center text at the center of the 3 lines with visual offset adjustment
        const textCenterX = (lineMargin + lineEndMargin) / 2;
        const visualOffset = -5; // Adjust this value to visually center the text
        ctx.strokeText(word, textCenterX + visualOffset, baseline_y);
        ctx.setLineDash([]);
    }
  }, [word, mode]);

  const calculateAccuracy = useCallback((): number => {
    const canvas = canvasRef.current;
    const userCanvas = userCanvasRef.current;
    if (!canvas || !userCanvas || !hasDrawn) return 0;

    const userCtx = userCanvas.getContext('2d', { willReadFrequently: true });
    if (!userCtx) return 0;
    
    const USER_LINE_WIDTH = 16;
    const TEMPLATE_LINE_WIDTH = 30; // Wider "corridor" to be more forgiving

    // Create a hidden canvas for the template path
    const templateCanvas = document.createElement('canvas');
    templateCanvas.width = canvas.width;
    templateCanvas.height = canvas.height;
    const templateCtx = templateCanvas.getContext('2d');
    if (!templateCtx) return 0;
    
    // Draw the template path on the hidden canvas
    const fontSize = getFontSize(word.length);
    templateCtx.font = `${fontSize}px "Fredoka One"`;
    templateCtx.textBaseline = 'alphabetic';
    templateCtx.textAlign = 'center';
    const metrics = templateCtx.measureText(word);
    
    // Use same baseline calculation as drawWordTemplate (moved down by 5%)
    const baseline_y = canvas.height / 2 + metrics.actualBoundingBoxAscent / 2 + canvas.height * 0.05;
    
    // Use same visual offset as in drawWordTemplate
    const visualOffset = -5;
    
    // Use same line spacing calculation as drawWordTemplate
    const baseSpacing = 130; // Fixed spacing for 1-6 letters (108px * 1.2)
    const spacingReduction = 14; // Reduction per character after 6 letters (12px * 1.2)
    const minSpacing = 72; // Minimum spacing (60px * 1.2)
    const lineSpacing = word.length <= 6 
      ? baseSpacing 
      : Math.max(baseSpacing - ((word.length - 6) * spacingReduction), minSpacing);
    
    // Use same center calculation as drawWordTemplate
    const canvasCenterX = canvas.width / 2;
    const lineLength = 400; // Fixed line length
    const lineMargin = canvasCenterX - lineLength / 2;
    const lineEndMargin = canvasCenterX + lineLength / 2;
    const textCenterX = (lineMargin + lineEndMargin) / 2;

    templateCtx.strokeStyle = 'black'; // color doesn't matter, just need alpha
    templateCtx.lineWidth = TEMPLATE_LINE_WIDTH;
    templateCtx.lineCap = 'round';
    templateCtx.lineJoin = 'round';
    templateCtx.strokeText(word, textCenterX + visualOffset, baseline_y);

    // Get pixel data from the user-only canvas and the template canvas
    const userData = userCtx.getImageData(0, 0, userCanvas.width, userCanvas.height);
    const templateData = templateCtx.getImageData(0, 0, templateCanvas.width, templateCanvas.height);
    
    let overlapPixels = 0;
    let userDrawnPixels = 0;
    let totalTemplatePixels = 0;

    // Iterate through all pixels and compare alpha channels
    for (let i = 0; i < userData.data.length; i += 4) {
        const isUserPixel = userData.data[i + 3] > 128;
        const isTemplatePixel = templateData.data[i + 3] > 128;

        if (isUserPixel) {
            userDrawnPixels++;
        }
        if (isTemplatePixel) {
            totalTemplatePixels++;
        }
        if (isUserPixel && isTemplatePixel) {
            overlapPixels++;
        }
    }
    
    if (userDrawnPixels === 0 || totalTemplatePixels === 0) {
        return 0;
    }

    // Precision: Of all the pixels the user drew, how many were on the template path?
    const precision = overlapPixels / userDrawnPixels;
    
    // Recall (Coverage): Of all the template path pixels, how many did the user cover?
    const rawCoverage = overlapPixels / totalTemplatePixels;
    
    // Adjust coverage because the user's line is thinner than the template's forgiving path.
    const coverageAdjustmentFactor = TEMPLATE_LINE_WIDTH / USER_LINE_WIDTH;
    const adjustedCoverage = Math.min(1.0, rawCoverage * coverageAdjustmentFactor);
    
    // F1 Score: The harmonic mean of precision and recall.
    if (precision + adjustedCoverage === 0) {
        return 0;
    }
    const f1Score = 2 * (precision * adjustedCoverage) / (precision + adjustedCoverage);

    return Math.round(f1Score * 100);
  }, [word, hasDrawn]);


  const finishAttempt = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      onDone(false, 0, '');
      return;
    }

    const accuracy = mode === GameMode.TRACE ? calculateAccuracy() : 0;
    const dataUrl = (mode === GameMode.DRAW && hasDrawn) ? canvas.toDataURL('image/png') : '';

    onDone(hasDrawn, accuracy, dataUrl);
  }, [mode, hasDrawn, onDone, calculateAccuracy]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    drawWordTemplate(context);
  }, [word, drawWordTemplate]);

  // 공유 시작시각 기반 타이머: 모든 인스턴스가 같은 절대시간을 기준으로 계산
  useEffect(() => {
    if (isPaused || startAtMs == null) return;

    const compute = () => {
      const elapsedSec = Math.floor((Date.now() - startAtMs) / 1000);
      const remaining = Math.max(0, TRACING_TIME_SECONDS - elapsedSec);
      setTimeLeft(remaining);
      if (remaining === 0) {
        finishAttempt();
      }
    };

    compute();
    const id = setInterval(compute, 250); // 더 촘촘히 갱신해 드리프트 방지
    return () => clearInterval(id);
  }, [isPaused, startAtMs, finishAttempt]);

  // 타이머 값이 변경될 때마다 부모 컴포넌트에 알림
  useEffect(() => {
    if (onTimerChange) {
      onTimerChange(timeLeft);
    }
  }, [timeLeft, onTimerChange]);

  const handleClear = () => {
    // Clear visible canvas and redraw template
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Draw template (this resets context internally)
    drawWordTemplate(context);

    setHasDrawn(false);

    // Clear the hidden user canvas
    const userCanvas = userCanvasRef.current;
    if (userCanvas) {
        const userCtx = userCanvas.getContext('2d');
        if (userCtx) {
            userCtx.clearRect(0, 0, userCanvas.width, userCanvas.height);
            // Reset user canvas drawing state
            userCtx.lineWidth = 16;
            userCtx.lineCap = 'round';
            userCtx.lineJoin = 'round';
            userCtx.setLineDash([]);
            userCtx.strokeStyle = 'black';
        }
    }
  };

  const handleDone = () => {
    setIsCompleted(true);
    setTimeLeft(0);
    finishAttempt();
  }
  
  const handleTouchStart = (handler: () => void) => (event: React.TouchEvent) => {
    // preventDefault()는 네이티브 이벤트 리스너에서 처리됨
    handler();
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // preventDefault()는 네이티브 이벤트 리스너에서 처리됨
    
    let coords;
    if ('touches' in event) {
        if (event.targetTouches.length === 0) return;
        coords = { x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY };
    } else {
        coords = { x: event.clientX, y: event.clientY };
    }
    const rect = canvas.getBoundingClientRect();
    // 캔버스 실제 크기에 맞게 좌표 정규화
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (coords.x - rect.left) * scaleX;
    const y = (coords.y - rect.top) * scaleY;

    // Start path on visible canvas
    const context = canvas.getContext('2d');
    if (context) {
        // Set user drawing state only when starting to draw
        context.strokeStyle = strokeColor;
        context.lineWidth = 16;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.setLineDash([]);
        context.beginPath();
        context.moveTo(x, y);
    }
    
    // Start path on hidden user canvas
    const userCanvas = userCanvasRef.current;
    if(userCanvas) {
        const userCtx = userCanvas.getContext('2d');
        if(userCtx) {
            // Set user drawing state only when starting to draw
            userCtx.strokeStyle = 'black';
            userCtx.lineWidth = 16;
            userCtx.lineCap = 'round';
            userCtx.lineJoin = 'round';
            userCtx.setLineDash([]);
            userCtx.beginPath();
            userCtx.moveTo(x, y);
        }
    }

    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = useCallback((event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get coordinates relative to the visible canvas
    let coords;
    if ('touches' in event) {
        if (event.targetTouches.length === 0) return;
        coords = { x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY };
    } else {
        coords = { x: event.clientX, y: event.clientY };
    }
    const rect = canvas.getBoundingClientRect();
    // 캔버스 실제 크기에 맞게 좌표 정규화
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (coords.x - rect.left) * scaleX;
    const y = (coords.y - rect.top) * scaleY;

    // Draw on visible canvas
    const context = canvas.getContext('2d');
    if (context) {
        context.lineTo(x, y);
        context.stroke();
    }
    
    // Draw on hidden user canvas
    const userCanvas = userCanvasRef.current;
    if (userCanvas) {
        const userCtx = userCanvas.getContext('2d');
        if (userCtx) {
            userCtx.lineTo(x, y);
            userCtx.stroke();
        }
    }
  }, [isDrawing, strokeColor]);

  const stopDrawing = (event?: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    // preventDefault()는 네이티브 이벤트 리스너에서 처리됨
    
    // End path on visible canvas
    const canvas = canvasRef.current;
    if (canvas) {
        const context = canvas.getContext('2d');
        context?.closePath();
    }
    
    // End path on hidden canvas
    const userCanvas = userCanvasRef.current;
    if(userCanvas) {
        const userCtx = userCanvas.getContext('2d');
        userCtx?.closePath();
    }
    setIsDrawing(false);
  };

  const timerColorClass = timeLeft > 10 ? 'text-green-500' : timeLeft > 5 ? 'text-yellow-500' : 'text-red-500 animate-pulse';

  return (
    <div className="flex flex-col items-center gap-2 w-full relative">
      <canvas
        ref={canvasRef}
        width="450"
        height="300"
        className="bg-transparent rounded-2xl cursor-crosshair relative z-10"
        style={{ backgroundColor: 'transparent', touchAction: 'none' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        onTouchCancel={stopDrawing}
      />
      <div className="flex items-center gap-4">
        <button
          onClick={handleClear}
          onTouchStart={handleTouchStart(handleClear)}
          disabled={!hasDrawn || isPaused}
          className="px-8 py-3 text-2xl font-display text-white bg-red-500 rounded-full shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-red-600 transition-all transform hover:scale-105 active:scale-100"
          style={{ WebkitTapHighlightColor: 'transparent' }}
          aria-label="Clear drawing"
        >
          Clear
        </button>
        <button
          onClick={handleDone}
          onTouchStart={handleTouchStart(handleDone)}
          disabled={!hasDrawn || isPaused}
          className={`px-8 py-3 text-2xl font-display text-white bg-green-500 rounded-full shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-600 transition-all transform hover:scale-105 active:scale-100 ${
            isCompleted ? 'ring-4 ring-yellow-400 ring-opacity-75' : ''
          }`}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          Done!
        </button>
      </div>
    </div>
  );
};

export default DrawingCanvas;