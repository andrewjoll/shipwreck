import Stats from 'stats.js';
import { WebGLRenderer, Vector2 } from 'three';

export default class Renderer extends WebGLRenderer {
  stats: Stats;

  savedSize: Vector2;

  constructor() {
    super({
      powerPreference: 'high-performance',
      antialias: false,
    });

    this.savedSize = new Vector2();

    this.domElement.classList.add('game');
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

  saveSize() {
    this.getSize(this.savedSize);
  }

  restoreSize() {
    this.setSize(this.savedSize.width, this.savedSize.height);
  }
}
