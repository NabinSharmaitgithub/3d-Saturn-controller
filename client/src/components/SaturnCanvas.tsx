import { useEffect, useRef, useCallback } from 'react';
import { SaturnScene, SaturnControls } from '@/lib/saturn-scene';

interface SaturnCanvasProps {
  controls?: Partial<SaturnControls>;
  className?: string;
}

export default function SaturnCanvas({ controls, className = '' }: SaturnCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SaturnScene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    sceneRef.current = new SaturnScene(containerRef.current);
    sceneRef.current.start();

    return () => {
      sceneRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (sceneRef.current && controls) {
      sceneRef.current.updateControls(controls);
    }
  }, [controls]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full bg-black ${className}`}
      data-testid="canvas-saturn"
    />
  );
}
