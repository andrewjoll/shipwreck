import * as THREE from 'three';

export default class Scene extends THREE.Scene {
  constructor() {
    super();

    this.background = new THREE.Color(0x888888);

    this.createGrid();
  }

  createGrid() {
    const grid = new THREE.GridHelper(
      1024,
      32,
      new THREE.Color(0xffffff),
      new THREE.Color(0xaaaaaa)
    );

    this.add(grid);
  }
}
