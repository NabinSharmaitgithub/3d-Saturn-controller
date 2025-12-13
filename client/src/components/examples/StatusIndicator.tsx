import StatusIndicator from '../StatusIndicator';

export default function StatusIndicatorExample() {
  return (
    <div className="w-full h-screen bg-black relative">
      <StatusIndicator 
        isTracking={true} 
        isPlaying={true}
        currentGesture="rotate"
      />
    </div>
  );
}
