import { useEffect, useState, useRef } from 'react';

interface FPSCounterProps {
  isVisible?: boolean;
}

export default function FPSCounter({ isVisible = true }: FPSCounterProps) {
  const [fps, setFps] = useState(60);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    if (!isVisible) return;

    let animationId: number;

    const measureFPS = () => {
      frameCountRef.current++;
      const now = performance.now();
      const elapsed = now - lastTimeRef.current;

      if (elapsed >= 1000) {
        setFps(Math.round((frameCountRef.current * 1000) / elapsed));
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const getColor = () => {
    if (fps >= 55) return 'text-green-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div 
      className="fixed bottom-4 right-4 z-20 px-2 py-1 rounded backdrop-blur-sm bg-black/30 border border-white/10"
      data-testid="counter-fps"
    >
      <span className={`text-xs font-mono ${getColor()}`}>
        {fps} FPS
      </span>
    </div>
  );
}
