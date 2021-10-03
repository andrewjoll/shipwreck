import { Entity } from '@/entities';
import Tree from '@/entities/Tree';
import {
  Color,
  ConeGeometry,
  CylinderGeometry,
  Euler,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Quaternion,
  Raycaster,
  Scene,
  Sphere,
  SphereGeometry,
  Vector3,
} from 'three';
import { randFloat, randInt } from 'three/src/math/MathUtils';
import Config from '@/Config';
import * as Material from '@helpers/Material';
import EntityHelper from '@helpers/EntityHelper';

export const addObjects = (scene: Scene, terrain: Mesh): Entity[] => {
  addRocks(scene, terrain);

  return addTreeClusters(scene, terrain);
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
    mesh.setColorAt(
      i,
      new Color(randFloat(0.95, 1), randFloat(0.95, 1), randFloat(0.95, 1))
    );
  }

  mesh.layers.enable(Config.LAYER_PICKABLE);

  scene.add(mesh);
};

const addTreeClusters = (scene: Scene, terrain: Mesh): Tree[] => {
  const trees: Tree[] = [];

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
    trees.push(...fillTreeCluster(scene, terrain, sphere));
  });

  return trees;
};

const fillTreeCluster = (
  scene: Scene,
  terrain: Mesh,
  sphere: Sphere
): Tree[] => {
  const rayCaster = new Raycaster();
  const rayDirection = new Vector3(0, -1, 0);
  const up = new Vector3(0, 1, 0);

  const diameter = sphere.radius * 2;

  const rows = Math.floor(sphere.radius / 10);
  const step = diameter / rows;

  const treePoints: Vector3[] = [];
  const treeNormals: Vector3[] = [];

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
            treeNormals.push(intersection.face.normal);
          }
        }
      }
    }
  }

  return addTreeInstances(scene, treePoints, treeNormals);
};

const addTreeInstances = (
  scene: Scene,
  positions: Vector3[],
  normals: Vector3[]
): Tree[] => {
  const trees: Tree[] = [];

  const geometry = new ConeGeometry(5, 20, 5);
  geometry.translate(0, 15, 0);

  const material = Material.TreeMain(false);

  const mesh = new InstancedMesh(geometry, material, positions.length);
  mesh.userData = {
    entities: [],
  };

  // Trunk
  const trunkGeometry = new CylinderGeometry(1.5, 1.5, 10, 4, 1);
  trunkGeometry.translate(0, 5, 0);

  const trunkMaterial = Material.TreeMain(true);
  const trunkMesh = new InstancedMesh(
    trunkGeometry,
    trunkMaterial,
    positions.length
  );
  mesh.add(trunkMesh);

  // Trunk end

  const matrix = new Matrix4();
  const rotation = new Euler();
  const quaternion = new Quaternion();
  const scale = new Vector3(1, 1, 1);

  for (let i = 0; i < positions.length; i++) {
    rotation.y = Math.random() * 2 * Math.PI;

    // Orient the tree towards the surface normal, for nicer falling animation
    // todo: refactor
    setDirection(normals[i], quaternion);
    quaternion.setFromAxisAngle(new Vector3(0, 0, 1), 0);
    quaternion.setFromAxisAngle(new Vector3(1, 0, 0), 0);

    // quaternion.setFromEuler(rotation);

    scale.x = scale.z = randFloat(0.8, 1.0);
    scale.y = randFloat(0.5, 1.0);

    matrix.compose(positions[i], quaternion, scale);

    mesh.setMatrixAt(i, matrix);
    trunkMesh.setMatrixAt(i, matrix);

    const tree = new Tree(i, mesh);
    EntityHelper.setObjectEntity(mesh, tree, i);

    trees.push(tree);
  }

  mesh.layers.enable(Config.LAYER_PICKABLE);

  scene.add(mesh);

  // trunkMesh.instanceMatrix.needsUpdate = true;

  return trees;
};

const setDirection = (normal: Vector3, quaternion: Quaternion) => {
  const axis = new Vector3();

  // vector is assumed to be normalized
  if (normal.y > 0.99999) {
    quaternion.set(0, 0, 0, 1);
  } else if (normal.y < -0.99999) {
    quaternion.set(1, 0, 0, 0);
  } else {
    axis.set(normal.z, 0, -normal.x).normalize();
    const radians = Math.acos(normal.y);
    quaternion.setFromAxisAngle(axis, radians);
  }
};
