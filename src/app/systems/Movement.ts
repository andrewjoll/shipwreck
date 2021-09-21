import Mesh from '@/components/Mesh';
import Motion from '@/components/Motion';
import { Entity } from '@/entities';
import { System } from '@/systems';
import { Vector3 } from 'three';
import worldManager from '@managers/WorldManager';

export default class Movement implements System {
  name: string = 'Movement';

  update(entities: Entity[], time: number, deltaTime: number): void {
    entities.forEach((entity) => {
      if (entity.hasComponent(Motion.name)) {
        const motion = entity.getComponent<Motion>(Motion.name);

        this.moveToGoal(motion, deltaTime);

        // this.snapToGround(motion);

        this.updateMesh(entity, motion);
      }
    });
  }

  moveToGoal(motion: Motion, deltaTime: number): void {
    if (motion.onPath && motion.path.length) {
      const nextGoal = motion.path[0];

      const distanceToGoal = nextGoal.distanceTo(motion.position);

      if (distanceToGoal > 1) {
        const step = new Vector3()
          .copy(nextGoal)
          .sub(motion.position)
          .normalize()
          .multiplyScalar(motion.velocity * deltaTime);

        motion.position.add(step);
        motion.isDirty = true;
      } else {
        console.debug('Movement::moveToGoal', 'Reached goal', nextGoal);
        motion.shiftPath();

        if (!motion.path.length) {
          console.debug('Movement::moveToGoal', 'end of path');
        }
      }
    }
  }

  updateMesh(entity: Entity, motion: Motion) {
    if (!motion.isDirty) {
      return;
    }

    if (entity.hasComponent(Mesh.name)) {
      const mesh = entity.getComponent<Mesh>(Mesh.name);

      mesh.position.set(
        motion.position.x,
        worldManager.getHeight(motion.position) + 10,
        motion.position.z
      );
    }
  }

  snapToGround(motion: Motion): void {
    motion.position.setY(worldManager.getHeight(motion.position));
  }
}
