import { Entity } from '@/entities';
import { Object3D } from 'three';

export default {
  getEntityFromObject(
    object: Object3D,
    instanceId: number | undefined = undefined
  ): Entity | null {
    if (instanceId !== undefined) {
      return object.userData.entities[instanceId];
    }

    return object.userData.entity;
  },

  setObjectEntity(
    object: Object3D,
    entity: Entity,
    instanceId: number | undefined = undefined
  ): void {
    if (instanceId !== undefined) {
      if (!Array.isArray(object.userData.entities)) {
        object.userData.entities = [];
      }

      object.userData.entities[instanceId] = entity;
    } else {
      object.userData.entity = entity;
    }
  },
};
