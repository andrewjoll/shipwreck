import Terrain from '@/Terrain';
import { Mesh, Raycaster, Scene, Vector2, Vector3, WebGLRenderer } from 'three';
import { renderDepth } from '@helpers/Terrain';
import Water from '@/Water';
import { addObjects } from '@helpers/TerrainObject';
import { Manager } from '@/managers';
import Game from '@/Game';
import Config from '@/Config';

class WorldManager implements Manager {
  scene: Scene;
  terrain: Terrain;
  navMesh: Mesh;
  renderer: WebGLRenderer;
  water: Water;

  isReady: boolean = false;

  rayCaster: Raycaster;

  constructor() {}

  init(game: Game) {
    console.debug('WorldManager::init');

    this.rayCaster = new Raycaster();

    this.scene = game.scene;
    this.renderer = game.renderer;
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

  getHeight(position: Vector3) {
    if (!this.isReady) {
      return 0;
    }

    this.rayCaster.set(
      new Vector3(position.x, Config.WORLD_HEIGHT * 2, position.z),
      new Vector3(0, -1, 0)
    );

    const [intersection] = this.rayCaster.intersectObject(this.terrain);

    if (intersection) {
      return intersection.point.y;
    }

    return 0;
  }
}

const manager = new WorldManager();

export default manager;
