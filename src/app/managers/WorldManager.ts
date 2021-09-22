import Terrain from '@/Terrain';
import {
  Intersection,
  Mesh,
  Raycaster,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import { renderDepth } from '@helpers/Terrain';
import Water from '@/Water';
import { addObjects } from '@helpers/TerrainObject';
import { Manager } from '@/managers';
import Game from '@/Game';
import Config from '@/Config';
import { Pathfinding } from 'three-pathfinding';

class WorldManager implements Manager {
  scene: Scene;
  terrain: Terrain;
  navMesh: Mesh;
  renderer: WebGLRenderer;
  water: Water;

  isReady: boolean = false;

  rayCaster: Raycaster;
  pathfinding: Pathfinding;
  pathfindingZone: 'world';

  constructor() {}

  init(game: Game) {
    console.debug('WorldManager::init');

    this.rayCaster = new Raycaster();
    this.pathfinding = new Pathfinding();

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

    this.pathfinding.setZoneData(
      this.pathfindingZone,
      Pathfinding.createZone(this.navMesh.geometry)
    );

    this.scene.add(this.terrain);
    this.scene.add(this.navMesh);

    const depthTexture = renderDepth(this.terrain, this.renderer);

    this.water = new Water(depthTexture);
    this.scene.add(this.water);

    addObjects(this.scene, this.terrain);

    this.isReady = true;

    this.findStartingLocation();
  }

  update(time: number) {
    if (!this.isReady) {
      return;
    }

    this.water.update(time);
  }

  findStartingLocation(): Vector3 {
    const divisionsPerCycle = 24;
    let radius = Config.WORLD_SIZE * Config.WORLD_LAND_SCALE;
    const radiusStep = radius / 10;
    const up = new Vector3(0, 1, 0);
    const circumfrenceStep = (Math.PI * 2) / divisionsPerCycle;

    while (radius > 100) {
      for (let i = 0; i < divisionsPerCycle; i++) {
        const position = new Vector3(
          Math.sin(circumfrenceStep * i) * radius,
          0,
          Math.cos(circumfrenceStep * i) * radius
        );

        const intersection = this.getIntersection(position);
        const pathGroup = this.getGroup(position);

        const height = intersection.point.y;
        const angle = intersection.face.normal.dot(up);

        // Find a nice flat spot near the water, on the main pathfinding mesh
        if (height > Config.WATER_HEIGHT && angle > 0.9 && pathGroup === 0) {
          position.y = height;
          return position;
        }
      }

      radius -= radiusStep;
    }

    throw new Error("Couldn't find a starting location");
  }

  getGroup(position: Vector3): number | null {
    return this.pathfinding.getGroup(this.pathfindingZone, position);
  }

  getPath(from: Vector3, to: Vector3): Vector3[] {
    const startGroup = this.pathfinding.getGroup(this.pathfindingZone, from);
    const endGroup = this.pathfinding.getGroup(this.pathfindingZone, to);

    const distance = from.distanceTo(to);

    console.debug({ from, to, startGroup, endGroup, distance });

    if (startGroup === null) {
      console.error('Cannot get starting group', { from, startGroup });
      return [];
    }

    const path = this.pathfinding.findPath(
      from,
      to,
      this.pathfindingZone,
      startGroup
    );

    return path || [];
  }

  getHeight(position: Vector3) {
    if (!this.isReady) {
      return 0;
    }

    const intersection = this.getIntersection(position);

    if (intersection) {
      return intersection.point.y;
    }

    return 0;
  }

  getIntersection(position: Vector3): Intersection | null {
    this.rayCaster.set(
      new Vector3(position.x, Config.WORLD_HEIGHT * 2, position.z),
      new Vector3(0, -1, 0)
    );

    const [intersection] = this.rayCaster.intersectObject(this.terrain);

    return intersection;
  }
}

const manager = new WorldManager();

export default manager;
