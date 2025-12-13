import FPSCounter from '../FPSCounter';

export default function FPSCounterExample() {
  return (
    <div className="w-full h-screen bg-black relative">
      <FPSCounter isVisible={true} />
    </div>
  );
}
