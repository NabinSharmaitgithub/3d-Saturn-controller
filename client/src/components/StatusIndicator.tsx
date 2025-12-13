import { Hand, Pause, Play, ZoomIn, RotateCw } from 'lucide-react';

interface StatusIndicatorProps {
  isTracking: boolean;
  isPlaying: boolean;
  currentGesture?: string;
}

export default function StatusIndicator({ 
  isTracking, 
  isPlaying,
  currentGesture 
}: StatusIndicatorProps) {
  return (
    <div 
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20"
      data-testid="indicator-status"
    >
      <div className="flex items-center gap-4 px-6 py-3 rounded-full backdrop-blur-md bg-black/40 border border-white/10">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isTracking ? 'bg-green-400 animate-pulse' : 'bg-white/30'}`} />
          <span className="text-sm text-white/70">
            {isTracking ? 'Tracking' : 'No hand detected'}
          </span>
        </div>

        <div className="w-px h-4 bg-white/20" />

        <div className="flex items-center gap-2">
          {isPlaying ? (
            <Play className="w-4 h-4 text-purple-400" />
          ) : (
            <Pause className="w-4 h-4 text-orange-400" />
          )}
          <span className="text-sm text-white/70">
            {isPlaying ? 'Playing' : 'Frozen'}
          </span>
        </div>

        {currentGesture && (
          <>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              {currentGesture === 'rotate' && <RotateCw className="w-4 h-4 text-blue-400" />}
              {currentGesture === 'zoom' && <ZoomIn className="w-4 h-4 text-blue-400" />}
              {currentGesture === 'hand' && <Hand className="w-4 h-4 text-blue-400" />}
              <span className="text-sm text-white/70 capitalize">{currentGesture}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
