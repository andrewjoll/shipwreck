import Terrain from '@/Terrain';
import { Mesh, Scene, WebGLRenderer } from 'three';
import { renderDepth } from '@helpers/Terrain';
import Water from '@/Water';
import { addObjects } from '@helpers/TerrainObject';

class WorldManager {
  scene: Scene;
  terrain: Terrain;
  navMesh: Mesh;
  renderer: WebGLRenderer;
  water: Water;

  isReady: boolean = false;

  constructor() {}

  init(scene: Scene, renderer: WebGLRenderer) {
    console.debug('WorldManager::init');

    this.scene = scene;
    this.renderer = renderer;
  }

  unload() {
    console.debug('WorldManager::unload');

    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }

    this.isReady = false;
  }

  create() {
    console.debug('WorldManager::create');

    this.terrain = new Terrain();
    this.navMesh = this.terrain.getNavMesh();

    this.scene.add(this.terrain);

    const depthTexture = renderDepth(this.terrain, this.renderer);

    this.water = new Water(depthTexture);
    this.scene.add(this.water);

    addObjects(this.scene, this.terrain);

    this.isReady = true;
  }

  update(time: number) {
    if (!this.isReady) {
      return;
    }

    this.water.update(time);
  }
}

const manager = new WorldManager();

export default manager;
