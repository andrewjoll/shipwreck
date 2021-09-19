import Config from './Config';
import { SimplifyModifier } from 'three/examples/jsm/modifiers/SimplifyModifier';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper';
import * as Material from './helpers/Material';

import * as Easing from './helpers/Easing';
import Debug from './helpers/Debug';
import {
  BufferAttribute,
  Color,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  Vector2,
  Vector3,
} from 'three';

export default class Terrain extends Mesh {
  constructor() {
    let geometry = new PlaneGeometry(
      Config.WORLD_SIZE,
      Config.WORLD_SIZE,
      Config.WORLD_RESOLUTION - 1,
      Config.WORLD_RESOLUTION - 1
    );

    const material = Material.TerrainMain();

    super(geometry, material);

    const data = this.generateHeight(Config.WORLD_RESOLUTION);

    this.geometry.rotateX(-Math.PI / 2);

    for (let i = 0; i < geometry.attributes.position.count; i++) {
      this.geometry.attributes.position.setY(i, data[i]);
    }

    this.layers.enable(10);

    // const modifier = new SimplifyModifier();
    // this.geometry = modifier.modify(
    //   this.geometry,
    //   this.geometry.attributes.position.count * 0.5
    // );

    this.geometry.computeVertexNormals();
  }

  getHelpers() {
    const helper = new VertexNormalsHelper(this, 5, 0x00ff00);
    Debug.addMesh(helper);

    return helper;
  }

  getNavMesh() {
    const geometry = this.geometry.clone();

    const newIndex = [];
    const index = geometry.index.array;

    const vertex = new Vector3();
    const normal = new Vector3();
    const up = new Vector3(0, 1, 0);

    for (let i = 0; i < geometry.index.count; i += 3) {
      vertex.fromBufferAttribute(geometry.attributes.position, index[i]);
      normal.fromBufferAttribute(geometry.attributes.normal, index[i]);

      const angle = normal.dot(up);

      if (angle > 0.8 && vertex.y > 5) {
        newIndex.push(index[i]);
        newIndex.push(index[i + 1]);
        newIndex.push(index[i + 2]);
      }
    }

    geometry.setIndex(new BufferAttribute(new Uint16Array(newIndex), 1));

    const wireframeMaterial = new MeshStandardMaterial({
      color: new Color(1, 0, 0),
      flatShading: true,
      wireframe: true,
      opacity: 0.3,
      transparent: true,
    });

    const surfaceMaterial = new MeshStandardMaterial({
      color: new Color(1, 0, 0),
      flatShading: true,
      opacity: 0.05,
      transparent: true,
    });

    const mesh = new Mesh(geometry, wireframeMaterial);
    const fillMesh = new Mesh(geometry, surfaceMaterial);

    mesh.position.setY(2);

    mesh.add(fillMesh);

    Debug.addMesh(mesh);

    return mesh;
  }

  generateHeight(width: number) {
    const size = width * width;
    const data = new Float32Array(size);
    const perlin = new ImprovedNoise();
    const z = Math.random() * 100;

    let quality = 1;

    const worldCenter = new Vector2(width / 2, width / 2);

    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < size; i++) {
        const x = i % width;
        const y = ~~(i / width);

        data[i] += Math.abs(
          perlin.noise(x / quality, y / quality, z) * quality * 1.75
        );
      }

      quality *= 3;
    }

    const targetHeight = MathUtils.randInt(
      Config.WORLD_HEIGHT * 0.5,
      Config.WORLD_HEIGHT * 1.5
    );

    const frequencyX = 3;
    const frequencyY = 3;
    const offsetX = Math.random() * 1000;
    const offsetY = Math.random() * 1000;
    const amplitude = MathUtils.randInt(8, 12);

    for (let i = 0; i < size; i++) {
      const x = i % width;
      const y = ~~(i / width);

      const point = new Vector2(x, y);

      let distance = point.distanceTo(worldCenter);

      const normalisedDistance = distance / width;

      // Wobble the edges to make it less circular
      distance +=
        Math.sin((x + offsetX) / frequencyX) *
        Math.cos((y + offsetY) / frequencyY) *
        amplitude *
        Easing.easeInOutCubic(normalisedDistance);

      distance = distance / width;

      const minLand = 0.2 - MathUtils.smoothstep(distance, 0.4, 0.5);

      const mask = minLand + Easing.easeInOutCubic(1 - distance * 3.5);

      data[i] *= Math.max(mask, 0);
    }

    const maxHeight = Math.max(...data);

    for (let i = 0; i < size; i++) {
      data[i] = (data[i] / maxHeight) * targetHeight;
    }

    return data;
  }
}
