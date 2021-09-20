import Camera from '@/Camera';
import Renderer from '@/Renderer';
import Scene from '@/Scene';
import worldManager from '@managers/WorldManager';
import Mouse from '@/Mouse';
import Controls from './Controls';

export default class Game {
  renderer: Renderer;
  camera: Camera;
  scene: Scene;
  mouse: Mouse;
  controls: Controls;

  constructor() {}

  init() {
    console.debug('Game::init');

    this.renderer = new Renderer();

    this.camera = new Camera(this.renderer);
    this.scene = new Scene();

    this.mouse = new Mouse(this.scene);
    this.controls = new Controls(this.camera, this.renderer.domElement);

    worldManager.init(this.scene, this.renderer);

    this.update(0);
  }

  start() {
    worldManager.create();
  }

  update = (time: number) => {
    requestAnimationFrame(this.update);

    this.renderer.preRender();

    this.controls.update();
    this.mouse.update(this.camera);

    worldManager.update(time);

    this.renderer.render(this.scene, this.camera);

    this.renderer.postRender();
  };
}
