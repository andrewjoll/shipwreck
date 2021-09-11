import * as THREE from 'three';
import Config from './Config';

export default class Water extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.PlaneGeometry(
      Config.WATER_SIZE,
      Config.WATER_SIZE,
      Config.WATER_RESOLUTION - 1,
      Config.WATER_RESOLUTION - 1
    );

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.25, 0.55, 0.71),
      opacity: 0.5,
      transparent: true,
    });

    super(geometry, material);

    geometry.rotateX(-Math.PI / 2);

    this.position.y = Config.WATER_HEIGHT;
  }
}
