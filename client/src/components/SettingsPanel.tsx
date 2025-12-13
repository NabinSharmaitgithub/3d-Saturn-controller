import { useState } from 'react';
import { Settings, X, Eye, EyeOff, Camera, CameraOff, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SettingsPanelProps {
  showHints: boolean;
  onToggleHints: (value: boolean) => void;
  cameraEnabled: boolean;
  onToggleCamera: (value: boolean) => void;
}

export default function SettingsPanel({
  showHints,
  onToggleHints,
  cameraEnabled,
  onToggleCamera
}: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-30" data-testid="panel-settings">
      <Button
        size="icon"
        variant="ghost"
        className="text-white/60 backdrop-blur-md bg-black/40 border border-white/10"
        onClick={() => setIsOpen(!isOpen)}
        data-testid="button-settings-toggle"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
      </Button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-64 p-4 rounded-lg backdrop-blur-md bg-black/60 border border-white/10 space-y-4">
          <h3 className="text-sm font-medium text-white/90 mb-4">Settings</h3>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {showHints ? (
                <Eye className="w-4 h-4 text-white/60" />
              ) : (
                <EyeOff className="w-4 h-4 text-white/60" />
              )}
              <Label htmlFor="hints" className="text-sm text-white/80">
                Show hints
              </Label>
            </div>
            <Switch
              id="hints"
              checked={showHints}
              onCheckedChange={onToggleHints}
              data-testid="switch-hints"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {cameraEnabled ? (
                <Camera className="w-4 h-4 text-white/60" />
              ) : (
                <CameraOff className="w-4 h-4 text-white/60" />
              )}
              <Label htmlFor="camera" className="text-sm text-white/80">
                Hand tracking
              </Label>
            </div>
            <Switch
              id="camera"
              checked={cameraEnabled}
              onCheckedChange={onToggleCamera}
              data-testid="switch-camera"
            />
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-white/50 mb-2 flex items-center gap-1">
              <Keyboard className="w-3 h-3" />
              Keyboard shortcuts
            </p>
            <div className="space-y-1 text-xs text-white/40">
              <p>Space - Play/Pause</p>
              <p>Arrow keys - Rotate</p>
              <p>+/- - Zoom</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
