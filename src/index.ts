import './scss/index.scss';

import * as THREE from 'three';
import Debug from './app/helpers/Debug';

import Renderer from './app/Renderer';
import Camera from './app/Camera';
import Scene from './app/Scene';
import Controls from './app/Controls';
import Terrain from './app/Terrain';
import Water from './app/Water';
import Mouse from './app/Mouse';

const renderer = new Renderer();

const camera = new Camera(renderer);
const scene = new Scene();
const mouse = new Mouse(scene);

const terrain = new Terrain();
scene.add(terrain);

const water = new Water();
scene.add(water);

const hemiLight = new THREE.HemisphereLight(0xfcffd1, 0xa8a08e, 0.5);
hemiLight.position.set(0, 100, 100);
scene.add(hemiLight);

const light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.set(100, 100, 100);
scene.add(light);

const controls = new Controls(camera, renderer.domElement);

const update = () => {
  requestAnimationFrame(update);

  renderer.preRender();

  controls.update();
  mouse.update(scene, camera);

  renderer.render(scene, camera);

  renderer.postRender();
};

update();
