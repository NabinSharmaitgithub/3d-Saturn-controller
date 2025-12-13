import { Camera, Hand, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraPermissionProps {
  onRequestPermission: () => void;
  onSkip: () => void;
  error?: string | null;
}

export default function CameraPermission({ 
  onRequestPermission, 
  onSkip,
  error 
}: CameraPermissionProps) {
  return (
    <div 
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      data-testid="modal-camera-permission"
    >
      <div className="max-w-md mx-4 p-8 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
          <Camera className="w-10 h-10 text-purple-400" />
        </div>

        <h2 className="text-2xl font-semibold text-white mb-3">
          Enable Hand Tracking
        </h2>
        
        <p className="text-white/60 mb-6 leading-relaxed">
          Control Saturn with your hands! We need camera access to track your gestures. 
          Your video stays on your device and is never stored.
        </p>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300 text-left">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button
            onClick={onRequestPermission}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
            data-testid="button-enable-camera"
          >
            <Hand className="w-4 h-4 mr-2" />
            Enable Camera
          </Button>
          
          <Button
            variant="ghost"
            onClick={onSkip}
            className="w-full text-white/50"
            data-testid="button-skip-camera"
          >
            Skip for now
          </Button>
        </div>

        <p className="mt-6 text-xs text-white/40">
          You can enable this later from the settings
        </p>
      </div>
    </div>
  );
}
