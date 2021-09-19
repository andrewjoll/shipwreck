import * as THREE from 'three';
import Config from './Config';

export default class Scene extends THREE.Scene {
  constructor() {
    super();

    this.background = new THREE.Color(0x888888);

    this.createGrid();
  }

  createGrid() {
    const grid = new THREE.GridHelper(
      Config.WORLD_SIZE * 2,
      Config.WORLD_RESOLUTION * 2,
      new THREE.Color(0xaaaaaa),
      new THREE.Color(0x999999)
    );

    // this.add(grid);
  }
}
