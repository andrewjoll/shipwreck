import * as THREE from 'three';
import Config from '@/Config';
import { Color } from 'three';

export default class Scene extends THREE.Scene {
  constructor() {
    super();

    this.background = new THREE.Color(0.25, 0.55, 0.71);

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
