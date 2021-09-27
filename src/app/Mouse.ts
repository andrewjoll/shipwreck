import {
  Camera,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  Mesh,
  ConeGeometry,
  MeshNormalMaterial,
  InstancedMesh,
  BoxHelper,
  Matrix4,
  Quaternion,
  Object3D,
} from 'three';

import Debug from '@helpers/Debug';
import Event from '@helpers/Event';
import Config from './Config';
import EntityHelper from '@helpers/EntityHelper';
import { Entity } from './entities';

export default class Mouse {
  position: Vector2;
  worldPosition: Vector3;
  normalizedPosition: Vector2;
  rayCaster: Raycaster;
  scene: Scene;
  worldCursor: Mesh;
  isOnTerrain: boolean = false;
  slope: number = 0;

  selectionBox: BoxHelper;
  selectionObject: Object3D;
  selectionInstancedId: number;
  selectionUuid: string;
  selectionEntity: Entity | null;

  constructor(scene: Scene) {
    this.position = new Vector2();
    this.worldPosition = new Vector3();
    this.normalizedPosition = new Vector2();

    this.rayCaster = new Raycaster();
    this.rayCaster.layers.set(Config.LAYER_PICKABLE);

    this.scene = scene;

    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('click', this.handleMouseClick.bind(this));

    this.createWorldCursor();

    this.addDebugFields();
  }

  addDebugFields() {
    const folder = Debug.addFolder('Mouse');
    folder.expanded = false;

    folder.addMonitor(this.position, 'x', { label: 'Screen X' });
    folder.addMonitor(this.position, 'y', { label: 'Screen Y' });

    folder.addSeparator();

    folder.addMonitor(this.worldPosition, 'x', { label: 'World X' });
    folder.addMonitor(this.worldPosition, 'y', { label: 'World Y' });
    folder.addMonitor(this.worldPosition, 'z', { label: 'World Z' });
    folder.addMonitor(this, 'isOnTerrain', {
      label: 'NavMesh',
    });

    folder.addMonitor(this, 'slope', {
      label: 'Slope',
    });
  }

  createWorldCursor() {
    const geometryHelper = new ConeGeometry(5, 20, 3);
    geometryHelper.translate(0, -10, 0);
    geometryHelper.rotateX(Math.PI / 2);
    geometryHelper.rotateY(-Math.PI);

    this.worldCursor = new Mesh(geometryHelper, new MeshNormalMaterial());
    this.scene.add(this.worldCursor);

    this.selectionBox = new BoxHelper(this.worldCursor);
    this.scene.add(this.selectionBox);
  }

  handleMouseClick(event: MouseEvent) {
    if (this.selectionEntity) {
      Event.emit('entity:click', {
        entity: this.selectionEntity,
      });
    }
    // } else {
    //   Event.emit('player:moveTo', {
    //     position: this.worldPosition.clone(),
    //   });
    // }
  }

  handleMouseMove(event: MouseEvent) {
    this.position.set(event.x, event.y);

    this.normalizedPosition.set(
      (event.x / window.innerWidth) * 2 - 1,
      -(event.y / window.innerHeight) * 2 + 1
    );
  }

  setSelection(object: Object3D, instanceId: number): void {
    this.selectionUuid = object.uuid;

    this.selectionObject = object;
    this.selectionInstancedId = instanceId;
    this.selectionEntity = EntityHelper.getEntityFromObject(object, instanceId);

    this.selectionBox.setFromObject(object);
    this.selectionBox.visible = true;

    if (instanceId !== undefined) {
      const matrix = new Matrix4();
      const translation = new Vector3();
      const scale = new Vector3();
      const rotation = new Quaternion();
      (object as InstancedMesh).getMatrixAt(instanceId, matrix);
      matrix.decompose(translation, rotation, scale);

      this.selectionBox.position.copy(translation);
      this.selectionBox.scale.copy(scale);
      this.selectionBox.rotation.setFromQuaternion(rotation);
    } else {
      this.selectionBox.position.copy(object.position);
      this.selectionBox.scale.copy(object.scale);
      this.selectionBox.rotation.setFromQuaternion(
        new Quaternion().setFromEuler(object.rotation)
      );
    }

    this.selectionBox.updateMatrix();
  }

  clearSelection(): void {
    this.selectionObject = null;
    this.selectionInstancedId = null;
    this.selectionBox.visible = false;
    this.selectionEntity = null;
  }

  update(camera: Camera) {
    this.rayCaster.setFromCamera(this.normalizedPosition, camera);
    const intersections = this.rayCaster.intersectObjects(this.scene.children);

    if (intersections.length) {
      this.isOnTerrain = true; // @todo: not entirely correct

      const { point, face, object, instanceId } = intersections[0];

      if (object.uuid !== this.selectionUuid) {
        this.setSelection(object, instanceId);
      }

      this.worldPosition.set(point.x, point.y, point.z);

      const normal = face.normal.clone();

      this.slope = Math.acos(Config.UP.dot(normal));

      this.worldCursor.position.copy(point);
      this.worldCursor.lookAt(normal.add(point));
    } else {
      this.isOnTerrain = false;

      this.clearSelection();

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
