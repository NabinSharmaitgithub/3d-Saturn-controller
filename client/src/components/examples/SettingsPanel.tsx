import { useState } from 'react';
import SettingsPanel from '../SettingsPanel';

export default function SettingsPanelExample() {
  const [showHints, setShowHints] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(false);

  return (
    <div className="w-full h-screen bg-black relative">
      <SettingsPanel
        showHints={showHints}
        onToggleHints={setShowHints}
        cameraEnabled={cameraEnabled}
        onToggleCamera={setCameraEnabled}
      />
    </div>
  );
}
