import Camera from '@/Camera';
import Controls from '@/Controls';
import Game from '@/Game';
import { Manager } from '@/managers';
import { CameraHelper, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import Debug from '@helpers/Debug';

class CameraManager implements Manager {
  protected cameras: PerspectiveCamera[] = [];
  protected activeCameraIndex: number = null;

  protected renderer: WebGLRenderer;
  protected scene: Scene;

  protected controls: Controls;

  init(game: Game): void {
    this.renderer = game.renderer;
    this.scene = game.scene;

    // Default / debug camera
    this.addCamera();
    this.setActiveCamera(0);
    this.controls = new Controls(this.cameras[0], this.renderer.domElement);

    // Player camera
    this.addCamera();

    window.addEventListener('resize', this.resize.bind(this));

    this.resize();

    this.addDebugFields();
  }

  get width() {
    return window.innerWidth;
  }

  get height() {
    return window.innerHeight;
  }

  addDebugFields(): void {
    const folder = Debug.addFolder('Camera');
    folder.addInput(this, 'activeCameraIndex', {
      label: 'Active',
      options: {
        Debug: 0,
        Player: 1,
      },
    });
  }

  addCamera(): void {
    const camera = new Camera();

    this.cameras.push(camera);

    const helper = new CameraHelper(camera);
    this.scene.add(helper);

    Debug.addMesh(helper);
  }

  setActiveCamera(index: number): void {
    this.activeCameraIndex = index;
  }

  getActiveCamera(): PerspectiveCamera {
    return this.cameras[this.activeCameraIndex];
  }

  resize(): void {
    this.cameras.forEach((camera) => {
      camera.aspect = this.width / this.height;
      camera.updateProjectionMatrix();
    });

    this.renderer.setSize(this.width, this.height);
  }

  update(time: number, deltaTime: number): void {
    this.controls.update();
  }
}

const cameraManager = new CameraManager();

export default cameraManager;
