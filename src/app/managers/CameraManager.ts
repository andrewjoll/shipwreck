import Camera from '@/Camera';
import Game from '@/Game';
import { Manager } from '@/managers';
import entityManager from '@managers/EntityManager';
import worldManager from '@managers/WorldManager';
import { CameraHelper, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import Debug from '@helpers/Debug';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import PlayerControls from '@/PlayerControls';
import DebugControls from '@/DebugControls';

const CAMERA_DEBUG = 0;
const CAMERA_PLAYER = 1;

class CameraManager implements Manager {
  protected cameras: PerspectiveCamera[] = [];
  protected controls: OrbitControls[] = [];

  protected activeCameraIndex: number = null;

  protected renderer: WebGLRenderer;
  protected scene: Scene;

  init(game: Game): void {
    this.renderer = game.renderer;
    this.scene = game.scene;

    // Default / debug camera
    this.addCamera(true);

    // Player camera
    this.addCamera(false);
    this.setActiveCamera(1);

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

    folder
      .addInput(this, 'activeCameraIndex', {
        label: 'Active',
        options: {
          Debug: 0,
          Player: 1,
        },
      })
      .on('change', (event) => {
        this.setActiveCamera(this.activeCameraIndex);
      });
  }

  addCamera(debug: boolean): void {
    const camera = new Camera();

    this.cameras.push(camera);

    const controls = debug
      ? new DebugControls(camera, this.renderer.domElement)
      : new PlayerControls(camera, this.renderer.domElement);

    this.controls.push(controls);

    const helper = new CameraHelper(camera);
    this.scene.add(helper);

    Debug.addMesh(helper);
  }

  setActiveCamera(index: number): void {
    this.activeCameraIndex = index;

    this.controls.forEach((controls, i) => (controls.enabled = index === i));
  }

  getActiveCamera(): PerspectiveCamera {
    return this.cameras[this.activeCameraIndex];
  }

  start(): void {
    const player = entityManager.getPlayer();
    const playerPosition = player.getPosition();

    const directionToCentre = worldManager.directionToCentre(playerPosition);

    this.cameras.forEach((camera) => {
      camera.position.set(
        playerPosition.x + directionToCentre.x * 200,
        200,
        playerPosition.z + directionToCentre.z * 200
      );
    });
  }

  resize(): void {
    this.cameras.forEach((camera) => {
      camera.aspect = this.width / this.height;
      camera.updateProjectionMatrix();
    });

    this.renderer.setSize(this.width, this.height);
  }

  update(time: number, deltaTime: number): void {
    const player = entityManager.getPlayer();

    if (player) {
      const playerPosition = player.getPosition();

      this.controls[CAMERA_PLAYER].target = playerPosition;
      this.cameras[CAMERA_PLAYER].position.setY(playerPosition.y + 100);
    }

    this.controls[this.activeCameraIndex].update();
  }
}

const cameraManager = new CameraManager();

export default cameraManager;
