import * as THREE from 'three';

export default class Camera extends THREE.PerspectiveCamera {
  renderer: THREE.Renderer;

  constructor(renderer: THREE.Renderer) {
    super(75, 1.0, 0.1, 10000);

    this.renderer = renderer;

    window.addEventListener('resize', this.resize.bind(this));

    this.resize();

    this.position.set(0, 200, 200);
    this.lookAt(0, 0, 0);
  }

  get width() {
    return window.innerWidth;
  }

  get height() {
    return window.innerHeight;
  }

  resize() {
    this.aspect = this.width / this.height;
    this.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
  }
}
