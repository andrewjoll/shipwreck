import { Mesh, PlaneGeometry, ShaderMaterial, Texture } from 'three';
import Config from './Config';
import * as Material from './helpers/Material';

export default class Water extends Mesh {
  material: ShaderMaterial;

  constructor(terrainDepth: Texture) {
    const geometry = new PlaneGeometry(
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
