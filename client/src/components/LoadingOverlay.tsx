import { useEffect, useState } from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
  status?: string;
}

export default function LoadingOverlay({ isLoading, status = 'Initializing...' }: LoadingOverlayProps) {
  const [isVisible, setIsVisible] = useState(isLoading);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setIsVisible(false), 500);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [isLoading]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-500 ${
        isLoading ? 'opacity-100' : 'opacity-0'
      }`}
      data-testid="overlay-loading"
    >
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-blue-500/40 animate-pulse" />
        <div className="absolute inset-4 rounded-full border-2 border-orange-500/50 animate-spin" style={{ animationDuration: '3s' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-orange-500 animate-pulse" />
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-white/90" data-testid="text-loading-status">
          {status}
        </p>
        <p className="text-sm text-white/50">
          Preparing your cosmic experience
        </p>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-purple-500/50"
              style={{
                animation: 'bounce 1s infinite',
                animationDelay: `${i * 0.15}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
