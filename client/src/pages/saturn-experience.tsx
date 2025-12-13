import { useState, useEffect, useRef, useCallback } from 'react';
import SaturnCanvas from '@/components/SaturnCanvas';
import GestureHints from '@/components/GestureHints';
import LoadingOverlay from '@/components/LoadingOverlay';
import CameraPermission from '@/components/CameraPermission';
import StatusIndicator from '@/components/StatusIndicator';
import SettingsPanel from '@/components/SettingsPanel';
import FPSCounter from '@/components/FPSCounter';
import { HandTracker, GestureState } from '@/lib/hand-tracking';
import type { SaturnControls } from '@/lib/saturn-scene';

type AppState = 'loading' | 'permission' | 'ready';

export default function SaturnExperience() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [loadingStatus, setLoadingStatus] = useState('Initializing Saturn...');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentGesture, setCurrentGesture] = useState<string | undefined>();
  
  const [controls, setControls] = useState<SaturnControls>({
    rotation: 0,
    flipAngle: 0,
    zoom: 5,
    isPlaying: true
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const handTrackerRef = useRef<HandTracker | null>(null);

  useEffect(() => {
    const initScene = async () => {
      setLoadingStatus('Loading particle system...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLoadingStatus('Preparing shaders...');
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setLoadingStatus('Ready!');
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setAppState('permission');
    };

    initScene();
  }, []);

  const handleGestureUpdate = useCallback((state: GestureState) => {
    setIsTracking(state.isTracking);
    setIsPlaying(state.isPlaying);
    
    if (state.isTracking) {
      setControls({
        rotation: state.rotation,
        flipAngle: state.flipAngle,
        zoom: state.zoom,
        isPlaying: state.isPlaying
      });

      if (Math.abs(state.flipAngle) > 0.3) {
        setCurrentGesture('flip');
      } else {
        setCurrentGesture('rotate');
      }
    } else {
      setCurrentGesture(undefined);
    }
  }, []);

  const handleRequestPermission = async () => {
    try {
      setCameraError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        handTrackerRef.current = new HandTracker();
        await handTrackerRef.current.initialize(videoRef.current, handleGestureUpdate);
        await handTrackerRef.current.start();
        
        setCameraEnabled(true);
      }

      setAppState('ready');
    } catch (error) {
      console.error('Camera permission denied:', error);
      setCameraError('Camera access denied. Please enable camera permissions to use hand tracking.');
    }
  };

  const handleSkipCamera = () => {
    setAppState('ready');
    setCameraEnabled(false);
  };

  const handleToggleCamera = async (enabled: boolean) => {
    if (enabled) {
      await handleRequestPermission();
    } else {
      handTrackerRef.current?.stop();
      setCameraEnabled(false);
      setIsTracking(false);
    }
  };

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          setControls(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
          setIsPlaying(prev => !prev);
          break;
        case 'ArrowLeft':
          setControls(prev => ({ ...prev, rotation: prev.rotation - 0.1 }));
          break;
        case 'ArrowRight':
          setControls(prev => ({ ...prev, rotation: prev.rotation + 0.1 }));
          break;
        case 'ArrowUp':
          setControls(prev => ({ ...prev, flipAngle: Math.min(1, prev.flipAngle + 0.1) }));
          break;
        case 'ArrowDown':
          setControls(prev => ({ ...prev, flipAngle: Math.max(-1, prev.flipAngle - 0.1) }));
          break;
        case '+':
        case '=':
          setControls(prev => ({ ...prev, zoom: Math.max(2, prev.zoom - 0.5) }));
          break;
        case '-':
          setControls(prev => ({ ...prev, zoom: Math.min(10, prev.zoom + 0.5) }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  useEffect(() => {
    return () => {
      handTrackerRef.current?.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black" data-testid="page-saturn-experience">
      <video
        ref={videoRef}
        className="hidden"
        playsInline
        muted
      />

      <SaturnCanvas controls={controls} />

      <LoadingOverlay isLoading={appState === 'loading'} status={loadingStatus} />

      {appState === 'permission' && (
        <CameraPermission
          onRequestPermission={handleRequestPermission}
          onSkip={handleSkipCamera}
          error={cameraError}
        />
      )}

      {appState === 'ready' && (
        <>
          <GestureHints isVisible={showHints} />
          <SettingsPanel
            showHints={showHints}
            onToggleHints={setShowHints}
            cameraEnabled={cameraEnabled}
            onToggleCamera={handleToggleCamera}
          />
          <StatusIndicator
            isTracking={isTracking}
            isPlaying={isPlaying}
            currentGesture={currentGesture}
          />
          <FPSCounter isVisible={true} />
        </>
      )}
    </div>
  );
}
