import './scss/index.scss';
import { loadManifest } from '@helpers/Loader';
import Game from '@/Game';

import manifest from './manifest';

const init = async () => {
  await loadManifest(manifest);

  const game = new Game();

  game.init();

  game.start();
};

init();

/*
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

*/
