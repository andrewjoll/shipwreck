import {
  BufferAttribute,
  BufferGeometry,
  Color,
  ConeGeometry,
  Float32BufferAttribute,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneBufferGeometry,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Scene,
  Texture,
  Vector3,
} from 'three';
import { Pane } from 'tweakpane';

class Debug {
  debugMode: boolean = false;
  debugObjects: Object3D[] = [];
  pane: Pane;
  scene: Scene;
  markers: Object3D[] = [];
  path: Object3D;

  constructor() {
    this.pane = new Pane();

    this.pane
      .addInput(this, 'debugMode', { label: 'Debug mode' })
      .on('change', () => {
        this.toggleDebug();
      });
  }

  setScene(scene: Scene) {
    this.scene = scene;
  }

  toggleDebug() {
    this.debugObjects.forEach(
      (object: Object3D) => (object.visible = this.debugMode)
    );
  }

  addMesh(mesh: Object3D) {
    mesh.visible = this.debugMode;

    this.debugObjects.push(mesh);
  }

  addFolder(title: string) {
    return this.pane.addFolder({ title });
  }

  addMarker(position: Vector3) {
    const geometry = new ConeGeometry(5, 20, 3);
    geometry.translate(0, -10, 0);
    geometry.rotateX(Math.PI);

    const marker = new Mesh(geometry, new MeshNormalMaterial());

    marker.position.copy(position);
    this.scene.add(marker);

    this.markers.push(marker);
  }

  addTexture(texture: Texture) {
    const geometry = new PlaneGeometry(2048, 2048, 1, 1);

    const material = new MeshStandardMaterial({
      color: new Color(1, 1, 1),
      map: texture,
    });

    const mesh = new Mesh(geometry, material);
    mesh.position.set(0, 1024, -2048);
    this.scene.add(mesh);
  }

  addPath(points: Vector3[]) {
    const pathGeometry = new BufferGeometry().setFromPoints(
      points.map((point: Vector3) => {
        point.y += 2;
        return point;
      })
    );

    const pathMaterial = new PointsMaterial({
      color: 0x000000,
      size: 5,
    });

    const lineMaterial = new LineBasicMaterial({
      color: 0xffffff,
      linewidth: 5,
    });

    const lineMesh = new Line(pathGeometry, lineMaterial);
    const pathMesh = new Points(pathGeometry, pathMaterial);

    this.path = new Object3D();
    this.path.add(lineMesh);
    this.path.add(pathMesh);

    this.scene.add(this.path);
  }

  clearPath() {
    this.scene.remove(this.path);
    this.path = null;
  }

  clearMarkers() {
    this.markers.forEach((marker) => {
      this.scene.remove(marker);
    });

    this.markers = [];
  }
}

const debug = new Debug();

export default debug;
