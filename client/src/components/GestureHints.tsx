import { useState } from 'react';
import { X, RotateCw, FlipHorizontal, ZoomIn, Hand, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GestureHint {
  icon: typeof RotateCw;
  action: string;
  gesture: string;
}

const hints: GestureHint[] = [
  { icon: RotateCw, action: 'Rotate Saturn', gesture: 'Rotate your hand' },
  { icon: FlipHorizontal, action: 'Flip Saturn', gesture: 'Flip palm to back' },
  { icon: ZoomIn, action: 'Zoom In/Out', gesture: 'Pinch gesture' },
  { icon: Hand, action: 'Play particles', gesture: 'Open hand' },
  { icon: Pause, action: 'Freeze particles', gesture: 'Closed fist' },
];

interface GestureHintsProps {
  isVisible?: boolean;
  onDismiss?: () => void;
}

export default function GestureHints({ isVisible = true, onDismiss }: GestureHintsProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed top-4 left-4 z-30 max-w-xs"
      data-testid="panel-gesture-hints"
    >
      <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between gap-4 p-4 border-b border-white/10">
          <h3 className="text-sm font-medium text-white/90">Hand Gestures</h3>
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="text-white/60"
              onClick={() => setIsExpanded(!isExpanded)}
              data-testid="button-toggle-hints"
            >
              {isExpanded ? (
                <X className="w-4 h-4" />
              ) : (
                <Hand className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="p-4 space-y-3">
            {hints.map((hint, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3"
                data-testid={`hint-gesture-${index}`}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-md bg-purple-500/20 flex items-center justify-center">
                  <hint.icon className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/90 truncate">
                    {hint.action}
                  </p>
                  <p className="text-xs text-white/50 truncate">
                    {hint.gesture}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
