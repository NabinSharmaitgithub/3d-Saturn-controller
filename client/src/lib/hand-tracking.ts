import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

export interface GestureState {
  rotation: number;
  flipAngle: number;
  zoom: number;
  isPlaying: boolean;
  isTracking: boolean;
}

export type GestureCallback = (state: GestureState) => void;

export class HandTracker {
  private hands: Hands | null = null;
  private camera: Camera | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private callback: GestureCallback | null = null;
  private lastPalmAngle: number = 0;
  private lastPinchDistance: number = 0;
  private currentRotation: number = 0;
  private isInitialized: boolean = false;

  public async initialize(
    videoElement: HTMLVideoElement,
    callback: GestureCallback
  ): Promise<void> {
    this.videoElement = videoElement;
    this.callback = callback;

    this.hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });

    this.hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5
    });

    this.hands.onResults(this.onResults.bind(this));

    this.camera = new Camera(videoElement, {
      onFrame: async () => {
        if (this.hands && this.videoElement) {
          await this.hands.send({ image: this.videoElement });
        }
      },
      width: 640,
      height: 480
    });

    this.isInitialized = true;
  }

  public async start(): Promise<void> {
    if (this.camera) {
      await this.camera.start();
    }
  }

  public stop(): void {
    if (this.camera) {
      this.camera.stop();
    }
  }

  private onResults(results: Results): void {
    if (!this.callback) return;

    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      this.callback({
        rotation: this.currentRotation,
        flipAngle: 0,
        zoom: 5,
        isPlaying: true,
        isTracking: false
      });
      return;
    }

    const landmarks = results.multiHandLandmarks[0];
    
    const wrist = landmarks[0];
    const middleMcp = landmarks[9];
    const palmAngle = Math.atan2(
      middleMcp.y - wrist.y,
      middleMcp.x - wrist.x
    );

    if (this.lastPalmAngle !== 0) {
      let angleDiff = palmAngle - this.lastPalmAngle;
      if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      this.currentRotation += angleDiff * 2;
    }
    this.lastPalmAngle = palmAngle;

    const palmZ = wrist.z;
    const flipAngle = Math.max(-1, Math.min(1, palmZ * 10));

    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const pinchDistance = Math.sqrt(
      Math.pow(thumbTip.x - indexTip.x, 2) +
      Math.pow(thumbTip.y - indexTip.y, 2) +
      Math.pow(thumbTip.z - indexTip.z, 2)
    );

    let zoom = 5;
    if (this.lastPinchDistance !== 0) {
      const pinchDelta = (pinchDistance - this.lastPinchDistance) * 20;
      zoom = 5 - pinchDelta * 10;
    }
    this.lastPinchDistance = pinchDistance;

    const fingerTips = [landmarks[8], landmarks[12], landmarks[16], landmarks[20]];
    const fingerBases = [landmarks[5], landmarks[9], landmarks[13], landmarks[17]];
    
    let extendedFingers = 0;
    for (let i = 0; i < 4; i++) {
      if (fingerTips[i].y < fingerBases[i].y) {
        extendedFingers++;
      }
    }

    const isPlaying = extendedFingers >= 3;

    this.callback({
      rotation: this.currentRotation,
      flipAngle: flipAngle,
      zoom: Math.max(2, Math.min(10, zoom)),
      isPlaying: isPlaying,
      isTracking: true
    });
  }

  public dispose(): void {
    this.stop();
    this.hands = null;
    this.camera = null;
  }
}
