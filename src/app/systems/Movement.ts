import Mesh from '@/components/Mesh';
import Motion from '@/components/Motion';
import { Entity } from '@/entities';
import { System } from '@/systems';
import { Vector3 } from 'three';
import worldManager from '@managers/WorldManager';
import entityManager from '@managers/EntityManager';
import Event from '@helpers/Event';
import InstancedMesh from '@/components/InstancedMesh';

type MoveEvent = {
  position: Vector3;
};

type EntityEvent = {
  entity: Entity;
};

export default class Movement implements System {
  name: string = 'Movement';

  init(): void {
    Event.on('entity:click', (event: EntityEvent) => {
      const { entity } = event;

      // todo: determine if we want to move toward this entity
      const player = entityManager.getPlayer();

      const motion = player.getComponent<Motion>(Motion.name);
      motion.setTarget(event.entity);

      console.debug(entity.getPosition());

      // todo: handle other position types
      const path = worldManager.getPath(
        motion.position.clone(),
        entity.getPosition()
      );

      if (path.length) {
        motion.setPath(path);
      } else {
        motion.clearPath();
      }
    });

    Event.on('player:moveTo', (event: MoveEvent) => {
      const player = entityManager.getPlayer();

      const motion = player.getComponent<Motion>(Motion.name);
      const path = worldManager.getPath(
        motion.position.clone(),
        event.position.clone()
      );

      if (path.length) {
        motion.setPath(path);
      } else {
        motion.clearPath();
      }
    });
  }

  update(entities: Entity[], time: number, deltaTime: number): void {
    entities.forEach((entity) => {
      if (entity.hasComponent(Motion.name)) {
        const motion = entity.getComponent<Motion>(Motion.name);

        this.moveToGoal(motion, deltaTime);

        this.stickToGround(motion);

        this.updateMesh(entity, motion);
      }
    });
  }

  moveToGoal(motion: Motion, deltaTime: number): void {
    const startPosition = motion.position.clone();

    if (motion.onPath && motion.path.length) {
      const nextGoal = motion.path[0];

      const distanceToGoal = nextGoal.distanceTo(motion.position);

      if (distanceToGoal > 1) {
        const step = new Vector3()
          .copy(nextGoal)
          .sub(motion.position)
          .normalize()
          .multiplyScalar(motion.speed * deltaTime);

        motion.position.add(step);
        motion.velocity.subVectors(startPosition, nextGoal).normalize();

        motion.isDirty = true;
      } else {
        console.debug('Movement::moveToGoal', 'Reached goal', nextGoal);
        motion.shiftPath();

        if (!motion.path.length) {
          console.debug('Movement::moveToGoal', 'end of path');

          if (motion.targetEntity) {
            const distanceToTarget = motion.position.distanceTo(
              motion.targetEntity.getPosition()
            );

            if (distanceToTarget < 1) {
              console.debug('Movement::moveToGoal', 'target reached');

              Event.emit('player:targetReached', {
                target: motion.targetEntity,
              });
            }
          }
        }
      }
    }
  }

  stickToGround(motion: Motion) {
    if (motion.stickToGround && motion.isDirty) {
      motion.position.setY(worldManager.getHeight(motion.position));
    }
  }

  updateMesh(entity: Entity, motion: Motion) {
    if (!motion.isDirty) {
      return;
    }

    if (entity.hasComponent(Mesh.name)) {
      const mesh = entity.getComponent<Mesh>(Mesh.name);

      mesh.position.copy(motion.position);
    }
  }
}
