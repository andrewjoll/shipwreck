import Health from '@/components/Health';
import Mesh from '@/components/Mesh';
import Motion from '@/components/Motion';
import { Entity } from '@/entities';
import { CylinderGeometry, MeshBasicMaterial, Vector3 } from 'three';

export default class Player extends Entity {
  constructor() {
    super();

    this.addComponent(new Health(10));

    const motion = new Motion(new Vector3(0, 150, 0), 30);
    motion.setPath([
      new Vector3(150, 150, 150),
      new Vector3(0, 150, 150),
      new Vector3(150, 150, 0),
      new Vector3(0, 150, 0),
    ]);

    this.addComponent(motion);

    const geometry = new CylinderGeometry(5, 5, 20, 32);
    const material = new MeshBasicMaterial({ color: 0xffff00 });
    const mesh = new Mesh(geometry, material);
    mesh.position.copy(motion.position);

    this.addComponent(mesh);
  }
}
