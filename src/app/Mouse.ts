import {
  Camera,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  Mesh,
  ConeGeometry,
  MeshNormalMaterial,
} from 'three';
import Debug from './helpers/Debug';

import Event from './helpers/Event';

export default class Mouse {
  position: Vector2;
  worldPosition: Vector3;
  normalizedPosition: Vector2;
  rayCaster: Raycaster;
  scene: Scene;
  worldCursor: Mesh;
  terrain: Mesh;
  isOnTerrain: boolean;

  constructor(scene: Scene, terrain: Mesh) {
    this.position = new Vector2();
    this.worldPosition = new Vector3();
    this.normalizedPosition = new Vector2();
    this.terrain = terrain;
    this.isOnTerrain = false;

    this.rayCaster = new Raycaster();
    this.rayCaster.layers.set(10);

    this.scene = scene;

    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('click', this.handleMouseClick.bind(this));

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
    folder.addMonitor(this, 'isOnTerrain', {
      label: 'On NavMesh',
    });
  }

  createWorldCursor() {
    const geometryHelper = new ConeGeometry(5, 20, 3);
    geometryHelper.translate(0, -10, 0);
    geometryHelper.rotateX(Math.PI / 2);
    geometryHelper.rotateY(-Math.PI);

    this.worldCursor = new Mesh(geometryHelper, new MeshNormalMaterial());
    this.scene.add(this.worldCursor);
  }

  handleMouseClick(event: MouseEvent) {
    if (this.isOnTerrain) {
      Event.emit('terrain:click', {
        position: this.worldPosition.clone(),
      });
    }
  }

  handleMouseMove(event: MouseEvent) {
    this.position.set(event.x, event.y);

    this.normalizedPosition.set(
      (event.x / window.innerWidth) * 2 - 1,
      -(event.y / window.innerHeight) * 2 + 1
    );
  }

  update(camera: Camera) {
    this.rayCaster.setFromCamera(this.normalizedPosition, camera);
    const intersects = this.rayCaster.intersectObject(this.terrain);

    if (intersects.length) {
      this.isOnTerrain = true;

      const { point, face } = intersects[0];

      this.worldPosition.set(point.x, point.y, point.z);

      const normal = face.normal.clone();
      this.worldCursor.position.copy(point);
      this.worldCursor.lookAt(normal.add(point));
    } else {
      this.isOnTerrain = false;

      this.worldCursor.lookAt(this.worldPosition.add(new Vector3(0, 100, 0)));
    }
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }
}
