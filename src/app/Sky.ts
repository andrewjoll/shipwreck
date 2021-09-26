import { BoxGeometry, Mesh, ShaderMaterial, SphereGeometry } from 'three';
import Config from './Config';
import * as Material from './helpers/Material';

export default class Sky extends Mesh {
  material: ShaderMaterial;

  constructor() {
    const geometry = new SphereGeometry(Config.WATER_SIZE * 0.5);

    const material = Material.SkyMain();

    super(geometry, material);
  }

  update(time: number) {
    // this.material.uniforms.time.value = time / 100;
  }
}
