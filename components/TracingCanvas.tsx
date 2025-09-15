import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameMode } from '../types.ts';

interface DrawingCanvasProps {
  word: string;
  strokeColor: string;
  onDone: (hasDrawn: boolean, accuracy: number, canvasDataUrl: string) => void;
  mode: GameMode;
  isPaused: boolean;
  startAtMs: number | null;
}

const TRACING_TIME_SECONDS = 20;

const getFontSize = (length: number): number => {
    if (length <= 5) return 150;
    if (length <= 7) return 120;
    if (length <= 9) return 95;
    if (length <= 11) return 75;
    if (length <= 13) return 65;
    return 55;
};

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ word, strokeColor, onDone, mode, isPaused, startAtMs }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const userCanvasRef = useRef<HTMLCanvasElement | null>(null); // Offscreen canvas for user strokes
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TRACING_TIME_SECONDS);

  // Initialize the offscreen canvas for user drawings
  useEffect(() => {
    if (canvasRef.current && !userCanvasRef.current) {
        userCanvasRef.current = document.createElement('canvas');
        userCanvasRef.current.width = canvasRef.current.width;
        userCanvasRef.current.height = canvasRef.current.height;
    }
  }, []);


  const drawWordTemplate = useCallback((ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const fontSize = getFontSize(word.length);
    const fontHeight = fontSize * 0.7;
    const baseline_y = (canvas.height + fontHeight) / 2 - (fontSize * 0.1);
    const topline_y = baseline_y - fontHeight;
    const midline_y = baseline_y - (fontHeight / 2);

    // Draw guidelines for both modes
    ctx.strokeStyle = '#e5e7eb'; // gray-200
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 3]); // Dotted lines

    // Baseline
    ctx.beginPath();
    ctx.moveTo(0, baseline_y);
    ctx.lineTo(canvas.width, baseline_y);
    ctx.stroke();
    
    // Top line
    ctx.beginPath();
    ctx.moveTo(0, topline_y);
    ctx.lineTo(canvas.width, topline_y);
    ctx.stroke();

    // Mid line
    ctx.beginPath();
    ctx.moveTo(0, midline_y);
    ctx.lineTo(canvas.width, midline_y);
    ctx.stroke();
    
    ctx.setLineDash([]); // Reset line dash

    if (mode === GameMode.TRACE) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.font = `${fontSize}px "Fredoka One"`;
        ctx.strokeStyle = '#d1d5db'; // gray-300 for trace guide
        ctx.lineWidth = 2;
        ctx.setLineDash([1, 5]); // Fine dots for the word
        ctx.strokeText(word, canvas.width / 2, baseline_y);
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
    const fontHeight = fontSize * 0.7;
    const baseline_y = (canvas.height + fontHeight) / 2 - (fontSize * 0.1);

    templateCtx.strokeStyle = 'black'; // color doesn't matter, just need alpha
    templateCtx.lineWidth = TEMPLATE_LINE_WIDTH;
    templateCtx.lineCap = 'round';
    templateCtx.lineJoin = 'round';
    templateCtx.textAlign = 'center';
    templateCtx.textBaseline = 'alphabetic';
    templateCtx.font = `${fontSize}px "Fredoka One"`;
    templateCtx.strokeText(word, canvas.width / 2, baseline_y);

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

  const handleClear = () => {
    // Clear visible canvas and redraw template
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    drawWordTemplate(context);
    setHasDrawn(false);

    // Clear the hidden user canvas
    const userCanvas = userCanvasRef.current;
    if (userCanvas) {
        const userCtx = userCanvas.getContext('2d');
        userCtx?.clearRect(0, 0, userCanvas.width, userCanvas.height);
    }
  };

  const handleDone = () => {
    setTimeLeft(0);
    finishAttempt();
  }
  
  const handleTouchStart = (handler: () => void) => (event: React.TouchEvent) => {
    event.preventDefault(); // Prevents firing onClick and other browser actions
    handler();
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Prevent default behavior for all events, especially touch events
    event.preventDefault();
    
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
        context.beginPath();
        context.moveTo(x, y);
    }
    
    // Start path on hidden user canvas
    const userCanvas = userCanvasRef.current;
    if(userCanvas) {
        const userCtx = userCanvas.getContext('2d');
        if(userCtx) {
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
        event.preventDefault();
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
        context.strokeStyle = strokeColor;
        context.lineWidth = 16;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.stroke();
    }
    
    // Draw on hidden user canvas
    const userCanvas = userCanvasRef.current;
    if (userCanvas) {
        const userCtx = userCanvas.getContext('2d');
        if (userCtx) {
            userCtx.lineTo(x, y);
            userCtx.strokeStyle = 'black'; // Color doesn't matter, only alpha
            userCtx.lineWidth = 16;
            userCtx.lineCap = 'round';
            userCtx.lineJoin = 'round';
            userCtx.stroke();
        }
    }
  }, [isDrawing, strokeColor]);

  const stopDrawing = (event?: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    // Prevent default behavior for touch events
    if (event) {
      event.preventDefault();
    }
    
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
    <div className="flex flex-col items-center gap-4 w-full">
      <div className={`text-5xl font-display ${timerColorClass}`}>
        {timeLeft}
      </div>
      <canvas
        ref={canvasRef}
        width="550"
        height="300"
        className="bg-white rounded-2xl cursor-crosshair shadow-inner border-2 border-slate-200"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        onTouchCancel={stopDrawing}
        style={{ touchAction: 'none' }}
      />
      <div className="flex items-center gap-4">
        <button
          onClick={handleClear}
          onTouchStart={handleTouchStart(handleClear)}
          disabled={!hasDrawn || isPaused}
          className="px-8 py-3 text-2xl font-display text-white bg-red-500 rounded-full shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-red-600 transition-all transform hover:scale-105"
          aria-label="Clear drawing"
        >
          Clear
        </button>
        <button 
          onClick={handleDone}
          onTouchStart={handleTouchStart(handleDone)}
          disabled={!hasDrawn || isPaused}
          className="px-8 py-3 text-2xl font-display text-white bg-green-500 rounded-full shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-600 transition-all transform hover:scale-105"
        >
          Done!
        </button>
      </div>
    </div>
  );
};

export default DrawingCanvas;