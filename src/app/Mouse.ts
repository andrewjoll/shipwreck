import {
  Camera,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
} from 'three';
import Debug from './helpers/Debug';

export default class Mouse {
  position: Vector2;
  worldPosition: Vector3;
  normalizedPosition: Vector2;
  rayCaster: Raycaster;
  scene: Scene;
  worldCursor: Mesh;

  constructor(scene: Scene) {
    this.position = new Vector2();
    this.worldPosition = new Vector3();
    this.normalizedPosition = new Vector2();

    this.rayCaster = new Raycaster();
    this.rayCaster.layers.set(10);

    this.scene = scene;

    window.addEventListener('mousemove', this.handleMouseMove.bind(this));

    this.createWorldCursor();

    this.addDebugFields();
  }

  addDebugFields() {
    const folder = Debug.addFolder('Mouse');

    folder.addMonitor(this.position, 'x', { label: 'Screen X' });
    folder.addMonitor(this.position, 'y', { label: 'Screen Y' });

    folder.addSeparator();

    folder.addMonitor(this.worldPosition, 'x', { label: 'World X' });
    folder.addMonitor(this.worldPosition, 'y', { label: 'World Y' });
    folder.addMonitor(this.worldPosition, 'z', { label: 'World Z' });
  }

  createWorldCursor() {
    const geometry = new BoxGeometry(2, 10, 2);
    const material = new MeshBasicMaterial({ color: 0x00ff00 });
    this.worldCursor = new Mesh(geometry, material);

    this.worldCursor.position.set(0, 200, 0);
    this.scene.add(this.worldCursor);
  }

  handleMouseMove(event: MouseEvent) {
    this.position.set(event.x, event.y);

    this.normalizedPosition.set(
      (event.x / window.innerWidth) * 2 - 1,
      -(event.y / window.innerHeight) * 2 + 1
    );
  }

  update(scene: Scene, camera: Camera) {
    this.rayCaster.setFromCamera(this.normalizedPosition, camera);
    const intersects = this.rayCaster.intersectObjects(scene.children);

    if (intersects.length) {
      const { point } = intersects[0];

      this.worldPosition.set(point.x, point.y, point.z);
      this.worldCursor.position.set(point.x, point.y + 5, point.z);
    }
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }
}
