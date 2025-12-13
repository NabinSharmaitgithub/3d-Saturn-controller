import LoadingOverlay from '../LoadingOverlay';

export default function LoadingOverlayExample() {
  return (
    <div className="w-full h-screen bg-black">
      <LoadingOverlay isLoading={true} status="Loading Saturn particles..." />
    </div>
  );
}
