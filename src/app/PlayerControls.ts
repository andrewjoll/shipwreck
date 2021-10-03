import { Camera, MOUSE } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class DebugControls extends OrbitControls {
  constructor(object: Camera, domElement: HTMLElement) {
    super(object, domElement);

    this.enableZoom = false;
    this.enablePan = false;
    this.enableDamping = true;

    this.maxDistance = 200;
    this.minPolarAngle = Math.PI * 0.1;

    this.mouseButtons = {
      LEFT: null,
      MIDDLE: null,
      RIGHT: MOUSE.ROTATE,
    };
  }
}
