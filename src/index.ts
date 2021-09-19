import './scss/index.scss';

import * as THREE from 'three';
import Debug from './app/helpers/Debug';
import Event from './app/helpers/Event';
import { renderDepth } from './app/helpers/Terrain';
import { Pathfinding } from 'three-pathfinding';
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

Debug.setScene(scene);

const terrain = new Terrain();
scene.add(terrain);

const depthTexture = renderDepth(terrain, renderer);

const navMesh = terrain.getNavMesh();

scene.add(navMesh);
scene.add(terrain.getHelpers());

const mouse = new Mouse(scene, terrain);

let clickLocations: THREE.Vector3[] = [];

Event.on('terrain:click', (event) => {
  Debug.addMarker(event.position);

  clickLocations.push(event.position);

  if (Debug.markers.length === 2) {
    const startGroup = pathfinding.getGroup('island', clickLocations[0]);

    const path = pathfinding.findPath(
      clickLocations[0],
      clickLocations[1],
      'island',
      startGroup
    );

    path.unshift(clickLocations[0]);

    Debug.addPath(path);
  } else if (Debug.markers.length > 2) {
    Debug.clearMarkers();
    Debug.clearPath();
    clickLocations = [];
  }
});

const pathfinding = new Pathfinding();
pathfinding.setZoneData('island', Pathfinding.createZone(navMesh.geometry));

const water = new Water(depthTexture);
scene.add(water);

const hemiLight = new THREE.HemisphereLight(0xfcffd1, 0xa8a08e, 0.5);
hemiLight.position.set(0, 100, 100);
scene.add(hemiLight);

const light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.set(100, 100, 100);
scene.add(light);

const controls = new Controls(camera, renderer.domElement);

// Debug.addTexture(depthTexture);

const update = (time: number) => {
  requestAnimationFrame(update);

  renderer.preRender();

  controls.update();
  mouse.update(camera);

  water.update(time);

  renderer.render(scene, camera);

  renderer.postRender();
};

update(0);
