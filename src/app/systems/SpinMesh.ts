import Mesh from '@/components/Mesh';
import { Entity } from '@/entities';
import { System } from '@/systems';

export default class SpinMesh implements System {
  name: string = 'SpinMesh';

  update(entities: Entity[], time: number): void {
    entities.forEach((entity) => {
      if (entity.hasComponent(Mesh.name)) {
        const mesh = entity.getComponent<Mesh>(Mesh.name);

        mesh.position.set(
          Math.sin(time / 1000) * 100,
          150,
          Math.cos(time / 1000) * 100
        );
      }
    });
  }
}
