import * as THREE from 'three';
import Stats from 'stats.js';

export default class Renderer extends THREE.WebGLRenderer {
  stats: Stats;

  constructor() {
    super({
      powerPreference: 'high-performance',
      antialias: false,
    });

    document.body.appendChild(this.domElement);

    this.createStats();
  }

  createStats() {
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);
  }

  preRender() {
    this.stats.begin();
  }

  postRender() {
    this.stats.end();
  }
}
