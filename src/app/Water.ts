import * as THREE from 'three';
import { BufferAttribute, Vector3 } from 'three';
import Config from './Config';
import Debug from './helpers/Debug';
import * as Material from './helpers/Material';

export default class Water extends THREE.Mesh {
  material: THREE.ShaderMaterial;

  constructor(terrainDepth: THREE.Texture) {
    const geometry = new THREE.PlaneGeometry(
      Config.WATER_SIZE,
      Config.WATER_SIZE,
      Config.WATER_RESOLUTION - 1,
      Config.WATER_RESOLUTION - 1
    );

    const material = Material.WaterMain(terrainDepth);

    super(geometry, material);

    geometry.rotateX(-Math.PI / 2);

    this.position.y = Config.WATER_HEIGHT;
  }

  update(time: number) {
    this.material.uniforms.time.value = time / 100;
  }
}
