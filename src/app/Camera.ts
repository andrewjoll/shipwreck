import * as THREE from 'three';

export default class Camera extends THREE.PerspectiveCamera {
  constructor() {
    super(75, 1.0, 32, 1024);

    this.position.set(0, 500, 500);
    this.lookAt(0, 0, 0);
  }
}
