import Camera from '@/Camera';
import Renderer from '@/Renderer';
import Scene from '@/Scene';
import worldManager from '@managers/WorldManager';
import entityManager from '@managers/EntityManager';
import cameraManager from '@managers/CameraManager';
import Mouse from '@/Mouse';
import Debug from '@helpers/Debug';

export default class Game {
  renderer: Renderer;
  scene: Scene;
  mouse: Mouse;

  lastTime: number = 0;
  deltaTime: number = 0;

  constructor() {}

  init() {
    console.debug('Game::init');

    this.renderer = new Renderer();

    this.scene = new Scene();

    Debug.setScene(this.scene);

    this.mouse = new Mouse(this.scene);

    worldManager.init(this);
    entityManager.init(this);
    cameraManager.init(this);
  }

  start() {
    worldManager.create();

    entityManager.addEntities(worldManager.addEntities());
    entityManager.addPlayer(worldManager.findStartingLocation());
    cameraManager.start();

    this.update(0);
  }

  update = (time: number) => {
    this.deltaTime = (time - this.lastTime) / 1000;
    this.lastTime = time;

    requestAnimationFrame(this.update);

    this.renderer.preRender();

    this.mouse.update(cameraManager.getActiveCamera());

    worldManager.update(time);
    entityManager.update(time, this.deltaTime);
    cameraManager.update(time, this.deltaTime);

    this.renderer.render(this.scene, cameraManager.getActiveCamera());

    this.renderer.postRender();
  };
}
