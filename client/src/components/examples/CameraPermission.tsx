import CameraPermission from '../CameraPermission';

export default function CameraPermissionExample() {
  return (
    <div className="w-full h-screen bg-black relative">
      <CameraPermission
        onRequestPermission={() => console.log('Camera permission requested')}
        onSkip={() => console.log('Skipped camera permission')}
        error={null}
      />
    </div>
  );
}
