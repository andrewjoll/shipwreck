import {
  ConeGeometry,
  Euler,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  Quaternion,
  Raycaster,
  Scene,
  Sphere,
  SphereGeometry,
  Vector3,
} from 'three';
import { randFloat, randInt } from 'three/src/math/MathUtils';
import Config from '../Config';
import * as Material from './Material';

export const addObjects = (scene: Scene, terrain: Mesh) => {
  addTreeClusters(scene, terrain);
  addRocks(scene, terrain);
};

const addRocks = (scene: Scene, terrain: Mesh) => {
  const rayCaster = new Raycaster();
  const rayDirection = new Vector3(0, -1, 0);

  const scaledWorld = Config.WORLD_SIZE * Config.WORLD_LAND_SCALE;
  const halfWorldSize = scaledWorld * 0.5;

  const maxRocks = 50;
  const maxAttempts = 100;
  let attempts = 0;

  const rockPositions: Vector3[] = [];

  while (rockPositions.length < maxRocks && attempts < maxAttempts) {
    attempts++;

    let x = -halfWorldSize + Math.random() * scaledWorld;
    let y = -halfWorldSize + Math.random() * scaledWorld;

    const position = new Vector3(x, 100, y);

    rayCaster.set(position, rayDirection);
    const [intersection] = rayCaster.intersectObject(terrain);

    if (intersection) {
      if (intersection.point.y < Config.GRASS_HEIGHT) {
        rockPositions.push(intersection.point);
      }
    }
  }

  addRockInstances(scene, rockPositions);
};

const addRockInstances = (scene: Scene, positions: Vector3[]) => {
  const geometry = new SphereGeometry(5, 5, 4);
  //   geometry.translate(0, 15, 0);

  const material = Material.RockMain();

  const mesh = new InstancedMesh(geometry, material, positions.length);

  const matrix = new Matrix4();
  const rotation = new Euler();
  const quaternion = new Quaternion();
  const scale = new Vector3(1, 1, 1);

  for (let i = 0; i < positions.length; i++) {
    rotation.x = Math.random() * 2 * Math.PI;
    rotation.y = Math.random() * 2 * Math.PI;
    rotation.z = Math.random() * 2 * Math.PI;

    quaternion.setFromEuler(rotation);

    scale.x = scale.y = scale.z = randFloat(0.5, 2.0);

    matrix.compose(positions[i], quaternion, scale);

    mesh.setMatrixAt(i, matrix);
  }

  scene.add(mesh);
};

const addTreeClusters = (scene: Scene, terrain: Mesh) => {
  const rayCaster = new Raycaster();
  const rayDirection = new Vector3(0, -1, 0);

  const scaledWorld = Config.WORLD_SIZE * Config.WORLD_LAND_SCALE;
  const halfWorldSize = scaledWorld * 0.5;

  const maxSpheres = 5;
  const maxAttempts = 100;
  let attempts = 0;

  const spheres: Sphere[] = [];

  while (spheres.length < maxSpheres && attempts < maxAttempts) {
    attempts++;

    let x = -halfWorldSize + Math.random() * scaledWorld;
    let y = -halfWorldSize + Math.random() * scaledWorld;

    const position = new Vector3(x, 100, y);

    rayCaster.set(position, rayDirection);
    const [intersection] = rayCaster.intersectObject(terrain);

    if (intersection) {
      if (intersection.point.y > Config.GRASS_HEIGHT) {
        const testSphere = new Sphere(position, randInt(100, 300));

        let isOverlapping = false;

        for (let s = 0; s < spheres.length; s++) {
          if (spheres[s].intersectsSphere(testSphere)) {
            isOverlapping = true;
            break;
          }
        }

        if (!isOverlapping) {
          spheres.push(testSphere);
        }
      }
    }
  }

  spheres.forEach((sphere) => {
    fillTreeCluster(scene, terrain, sphere);
  });
};

const fillTreeCluster = (scene: Scene, terrain: Mesh, sphere: Sphere) => {
  const rayCaster = new Raycaster();
  const rayDirection = new Vector3(0, -1, 0);
  const up = new Vector3(0, 1, 0);

  const diameter = sphere.radius * 2;

  const rows = Math.floor(sphere.radius / 10);
  const step = diameter / rows;

  const treePoints: Vector3[] = [];

  for (let x = 0; x < rows; x++) {
    for (let z = 0; z < rows; z++) {
      let xPos = sphere.center.x + (-sphere.radius + step * x);
      let zPos = sphere.center.z + (-sphere.radius + step * z);

      xPos += -20 + Math.random() * 40;
      zPos += -20 + Math.random() * 40;

      const position = new Vector3(xPos, 100, zPos);

      if (sphere.containsPoint(position)) {
        rayCaster.set(position, rayDirection);
        const [intersection] = rayCaster.intersectObject(terrain);

        if (intersection) {
          const angle = intersection.face.normal.dot(up);

          if (intersection.point.y > Config.GRASS_HEIGHT && angle > 0.8) {
            treePoints.push(intersection.point);
          }
        }
      }
    }
  }

  addTreeInstances(scene, treePoints);
};

const addTreeInstances = (scene: Scene, positions: Vector3[]) => {
  const geometry = new ConeGeometry(5, 20, 5);
  geometry.translate(0, 15, 0);

  const material = Material.TreeMain();

  const mesh = new InstancedMesh(geometry, material, positions.length);

  const matrix = new Matrix4();
  const rotation = new Euler();
  const quaternion = new Quaternion();
  const scale = new Vector3(1, 1, 1);

  for (let i = 0; i < positions.length; i++) {
    rotation.y = Math.random() * 2 * Math.PI;
    quaternion.setFromEuler(rotation);

    scale.x = scale.y = scale.z = randFloat(0.5, 1.0);

    matrix.compose(positions[i], quaternion, scale);

    mesh.setMatrixAt(i, matrix);
  }

  mesh.layers.enable(10);

  scene.add(mesh);
};
