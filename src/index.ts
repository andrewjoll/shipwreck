import './scss/index.scss';

import * as THREE from 'three';

import Renderer from './app/Renderer';
import Camera from './app/Camera';
import Scene from './app/Scene';
import Controls from './app/Controls';
import Terrain from './app/Terrain';

const renderer = new Renderer();

const camera = new Camera(renderer);

const scene = new Scene();

const loader = new THREE.ImageLoader();

loader.load(
  require('./assets/height-32-test.png').default,
  (image) => {
    const terrain = new Terrain(image);
    scene.add(terrain);
  },
  undefined,
  function (event) {
    console.log(event);
  }
);

const controls = new Controls(camera, renderer.domElement);

const update = () => {
  requestAnimationFrame(update);

  renderer.preRender();

  controls.update();

  renderer.render(scene, camera);

  renderer.postRender();
};

update();
