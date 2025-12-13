import SaturnCanvas from '../SaturnCanvas';

export default function SaturnCanvasExample() {
  return (
    <div className="w-full h-screen">
      <SaturnCanvas 
        controls={{ 
          rotation: 0, 
          flipAngle: 0, 
          zoom: 5, 
          isPlaying: true 
        }} 
      />
    </div>
  );
}
