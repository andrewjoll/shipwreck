import Health from '@/components/Health';
import Mesh from '@/components/Mesh';
import Motion from '@/components/Motion';
import { Entity } from '@/entities';
import { CylinderGeometry, MeshBasicMaterial, Vector3 } from 'three';
import Debug from '@helpers/Debug';

export default class Player extends Entity {
  constructor(startLocation: Vector3) {
    super();

    this.addComponent(new Health(10));

    const motion = new Motion(startLocation, 30, true);
    this.addComponent(motion);
    this.setPositionProvider(Motion.name);

    const folder = Debug.addFolder('Player');
    folder.addMonitor(motion.position, 'x');
    folder.addMonitor(motion.position, 'y');
    folder.addMonitor(motion.position, 'z');

    const geometry = new CylinderGeometry(5, 5, 20, 8);
    geometry.translate(0, 10, 0);

    const material = new MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.5,
    });
    const mesh = new Mesh(geometry, material);
    mesh.position.copy(motion.position);

    this.addComponent(mesh);
  }
}
