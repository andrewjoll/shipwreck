import Camera from '@/Camera';
import Renderer from '@/Renderer';
import Scene from '@/Scene';
import worldManager from '@managers/WorldManager';
import entityManager from '@managers/EntityManager';
import Mouse from '@/Mouse';
import Controls from './Controls';
import Debug from '@helpers/Debug';

export default class Game {
  renderer: Renderer;
  camera: Camera;
  scene: Scene;
  mouse: Mouse;
  controls: Controls;

  lastTime: number = 0;
  deltaTime: number = 0;

  constructor() {}

  init() {
    console.debug('Game::init');

    this.renderer = new Renderer();

    this.camera = new Camera(this.renderer);
    this.scene = new Scene();

    Debug.setScene(this.scene);

    this.mouse = new Mouse(this.scene);
    this.controls = new Controls(this.camera, this.renderer.domElement);

    worldManager.init(this);
    entityManager.init(this);

    this.update(0);
  }

  start() {
    worldManager.create();

    entityManager.addPlayer(worldManager.findStartingLocation());
  }

  update = (time: number) => {
    this.deltaTime = (time - this.lastTime) / 1000;
    this.lastTime = time;

    requestAnimationFrame(this.update);

    this.renderer.preRender();

    this.controls.update();
    this.mouse.update(this.camera);

    worldManager.update(time);
    entityManager.update(time, this.deltaTime);

    this.renderer.render(this.scene, this.camera);

    this.renderer.postRender();
  };
}
