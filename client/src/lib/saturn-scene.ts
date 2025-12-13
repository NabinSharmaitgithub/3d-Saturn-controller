import * as THREE from 'three';

export interface SaturnControls {
  rotation: number;
  flipAngle: number;
  zoom: number;
  isPlaying: boolean;
}

export class SaturnScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private particles: THREE.Points | null = null;
  private ringParticles: THREE.Points | null = null;
  private starField: THREE.Points | null = null;
  private animationId: number | null = null;
  private clock: THREE.Clock;
  private controls: SaturnControls = {
    rotation: 0,
    flipAngle: 0,
    zoom: 5,
    isPlaying: true
  };
  private targetRotation: number = 0;
  private targetFlipAngle: number = 0;
  private targetZoom: number = 5;
  private particlePositions: Float32Array | null = null;
  private ringPositions: Float32Array | null = null;

  constructor(container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();

    this.camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 1);
    container.appendChild(this.renderer.domElement);

    this.createStarField();
    this.createSaturnParticles();
    this.createRingParticles();
    this.addLighting();

    window.addEventListener('resize', () => this.onResize(container));
  }

  private createStarField(): void {
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const radius = 50 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const brightness = 0.5 + Math.random() * 0.5;
      colors[i3] = brightness;
      colors[i3 + 1] = brightness;
      colors[i3 + 2] = brightness;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    this.starField = new THREE.Points(geometry, material);
    this.scene.add(this.starField);
  }

  private createSaturnParticles(): void {
    const particleCount = 8000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const purpleColor = new THREE.Color(0x8B5CF6);
    const blueColor = new THREE.Color(0x3B82F6);
    const orangeColor = new THREE.Color(0xF97316);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 1 + (Math.random() - 0.5) * 0.1;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.9;
      positions[i3 + 2] = radius * Math.cos(phi);

      const colorChoice = Math.random();
      let color: THREE.Color;
      if (colorChoice < 0.4) {
        color = purpleColor;
      } else if (colorChoice < 0.7) {
        color = blueColor;
      } else {
        color = orangeColor;
      }

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = 0.02 + Math.random() * 0.03;
    }

    this.particlePositions = positions.slice();

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  private createRingParticles(): void {
    const particleCount = 6000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const innerRadius = 1.4;
    const outerRadius = 2.2;

    const purpleColor = new THREE.Color(0x8B5CF6);
    const blueColor = new THREE.Color(0x60A5FA);
    const orangeColor = new THREE.Color(0xFB923C);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radiusVariation = Math.random();
      const radius = innerRadius + radiusVariation * (outerRadius - innerRadius);
      const heightVariation = (Math.random() - 0.5) * 0.05;

      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = heightVariation;
      positions[i3 + 2] = Math.sin(angle) * radius;

      const distanceFromCenter = (radius - innerRadius) / (outerRadius - innerRadius);
      let color: THREE.Color;
      if (distanceFromCenter < 0.33) {
        color = orangeColor;
      } else if (distanceFromCenter < 0.66) {
        color = purpleColor;
      } else {
        color = blueColor;
      }

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    this.ringPositions = positions.slice();

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    this.ringParticles = new THREE.Points(geometry, material);
    this.ringParticles.rotation.x = Math.PI * 0.15;
    this.scene.add(this.ringParticles);
  }

  private addLighting(): void {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x8B5CF6, 1, 100);
    pointLight1.position.set(5, 5, 5);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x3B82F6, 0.8, 100);
    pointLight2.position.set(-5, -5, 5);
    this.scene.add(pointLight2);
  }

  private onResize(container: HTMLElement): void {
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }

  public updateControls(controls: Partial<SaturnControls>): void {
    if (controls.rotation !== undefined) this.targetRotation = controls.rotation;
    if (controls.flipAngle !== undefined) this.targetFlipAngle = controls.flipAngle;
    if (controls.zoom !== undefined) this.targetZoom = Math.max(2, Math.min(10, controls.zoom));
    if (controls.isPlaying !== undefined) this.controls.isPlaying = controls.isPlaying;
  }

  private animateParticles(time: number): void {
    if (!this.particles || !this.particlePositions || !this.controls.isPlaying) return;

    const positions = this.particles.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const originalX = this.particlePositions[i];
      const originalY = this.particlePositions[i + 1];
      const originalZ = this.particlePositions[i + 2];
      
      const noise = Math.sin(time * 2 + i * 0.01) * 0.01;
      positions[i] = originalX + noise;
      positions[i + 1] = originalY + Math.cos(time * 1.5 + i * 0.01) * 0.01;
      positions[i + 2] = originalZ + Math.sin(time * 1.8 + i * 0.02) * 0.01;
    }

    this.particles.geometry.attributes.position.needsUpdate = true;
  }

  private animateRings(time: number): void {
    if (!this.ringParticles || !this.ringPositions || !this.controls.isPlaying) return;

    const positions = this.ringParticles.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const originalX = this.ringPositions[i];
      const originalZ = this.ringPositions[i + 2];
      
      const angle = Math.atan2(originalZ, originalX);
      const radius = Math.sqrt(originalX * originalX + originalZ * originalZ);
      const newAngle = angle + time * 0.1 * (1 / radius);
      
      positions[i] = Math.cos(newAngle) * radius;
      positions[i + 2] = Math.sin(newAngle) * radius;
    }

    this.ringParticles.geometry.attributes.position.needsUpdate = true;
  }

  public animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);

    const time = this.clock.getElapsedTime();

    this.controls.rotation += (this.targetRotation - this.controls.rotation) * 0.05;
    this.controls.flipAngle += (this.targetFlipAngle - this.controls.flipAngle) * 0.05;
    this.controls.zoom += (this.targetZoom - this.controls.zoom) * 0.05;

    if (this.particles) {
      this.particles.rotation.y = this.controls.rotation;
      this.particles.rotation.x = this.controls.flipAngle;
    }

    if (this.ringParticles) {
      this.ringParticles.rotation.y = this.controls.rotation;
      this.ringParticles.rotation.z = this.controls.flipAngle * 0.5;
    }

    this.camera.position.z = this.controls.zoom;

    this.animateParticles(time);
    this.animateRings(time);

    if (this.starField) {
      this.starField.rotation.y = time * 0.01;
    }

    this.renderer.render(this.scene, this.camera);
  };

  public start(): void {
    this.animate();
  }

  public dispose(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.renderer.dispose();
    this.scene.clear();
  }
}
