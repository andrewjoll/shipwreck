import * as THREE from 'three';
import Config from './Config';
import { SimplifyModifier } from 'three/examples/jsm/modifiers/SimplifyModifier';
import ImprovedNoise from './ImprovedNoise';
// import { SimplifyModifier } from './SimplifyModifier';

export default class Terrain extends THREE.Mesh {
  constructor() {
    let geometry = new THREE.PlaneGeometry(
      Config.WORLD_SIZE,
      Config.WORLD_SIZE,
      Config.WORLD_RESOLUTION - 1,
      Config.WORLD_RESOLUTION - 1
    );

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.84, 0.77, 0.55),
      flatShading: true,
      // wireframe: true,
    });

    super(geometry, material);

    const data = this.generateHeight(Config.WORLD_RESOLUTION);

    geometry.rotateX(-Math.PI / 2);

    const stepSize = (Config.WORLD_SIZE / Config.WORLD_RESOLUTION) * 0.5;

    for (let i = 0; i < geometry.attributes.position.count; i++) {
      geometry.attributes.position.setXYZ(
        i,
        geometry.attributes.position.getX(i) + Math.random() * 5,
        data[i] * 10,
        geometry.attributes.position.getZ(i) + Math.random() * 5
      );
    }

    // const modifier = new SimplifyModifier();
    // this.geometry = modifier.modify(
    //   geometry,
    //   geometry.attributes.position.count * 0.5
    // );
  }

  generateHeight(width: number) {
    const size = width * width;
    const data = new Float32Array(size);
    const perlin = new ImprovedNoise();
    const z = Math.random() * 100;

    let quality = 1;

    const peakCenter = new THREE.Vector2(
      Math.random() * width,
      Math.random() * width
    );
    const worldCenter = new THREE.Vector2(width / 2, width / 2);

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

    function randomBetween(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const targetHeight = randomBetween(
      Config.WORLD_HEIGHT * 0.5,
      Config.WORLD_HEIGHT * 1.5
    );
    const frequencyX = 3;
    const frequencyY = 3;
    const offsetX = Math.random() * 1000;
    const offsetY = Math.random() * 1000;
    const amplitude = randomBetween(8, 12);

    function easeInOutCubic(x: number): number {
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }

    function easeInQuart(x: number): number {
      return x * x * x * x;
    }

    function smoothstep(min: number, max: number, value: number) {
      var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
      return x * x * (3 - 2 * x);
    }

    for (let i = 0; i < size; i++) {
      const x = i % width;
      const y = ~~(i / width);

      const point = new THREE.Vector2(x, y);

      let distance = point.distanceTo(worldCenter);
      let peakDistance = point.distanceTo(peakCenter);

      const normalisedDistance = distance / width;
      const normalisedPeakDistance = peakDistance / width;

      // Wobble the edges to make it less circular
      distance +=
        Math.sin((x + offsetX) / frequencyX) *
        Math.cos((y + offsetY) / frequencyY) *
        amplitude *
        easeInOutCubic(normalisedDistance);

      distance = distance / width;

      const minLand = 0.2 - smoothstep(0.4, 0.5, distance);

      const mask = minLand + easeInOutCubic(1 - distance * 3.5);

      // data[i] = Math.max(mask * targetHeight, 0);

      data[i] *= Math.max(mask, 0);
    }

    const maxHeight = Math.max(...data);

    for (let i = 0; i < size; i++) {
      data[i] = (data[i] / maxHeight) * targetHeight;
    }

    return data;
  }
}
