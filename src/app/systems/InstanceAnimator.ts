import InstancedMesh from '@/components/InstancedMesh';
import { Entity } from '@/entities';
import { Euler, Matrix4, Object3D, Quaternion, Vector3 } from 'three';
import { System } from '.';
import Event from '@helpers/Event';
import gsap, { Bounce } from 'gsap';
import worldManager from '@managers/WorldManager';

type EntityClickEvent = {
  entity: Entity;
};

type TargetReachedEvent = {
  target: Entity;
};

export default class InstanceAnimator extends System {
  init(): void {
    Event.on('player:targetReached', (event: TargetReachedEvent) => {
      const { target } = event;

      if (target.hasComponent(InstancedMesh.name)) {
        const instance = target.getComponent<InstancedMesh>(InstancedMesh.name);

        let matrix = new Matrix4();

        let translation = new Vector3();

        let scale = new Vector3();
        let rotation = new Quaternion();

        instance.mesh.getMatrixAt(instance.index, matrix);

        matrix.decompose(translation, rotation, scale);

        const terrainNormal = worldManager.getNormal(translation);
        terrainNormal.applyAxisAngle(new Vector3(0, 0, 1), Math.PI * 0.5);

        const startRotation = rotation.clone();
        const targetRotation = new Quaternion();

        // const euler = new Euler().setFromVector3(terrainNormal);

        // rotation.setFromEuler(euler);

        this.setDirection(terrainNormal, targetRotation);

        const dummy = { value: 0 };

        // matrix.compose(translation, targetRotation, scale);

        this.applyMatrix(instance, matrix);

        gsap.to(dummy, {
          duration: 2,
          value: 1,
          ease: Bounce.easeOut,
          onUpdate: () => {
            rotation.slerpQuaternions(
              startRotation,
              targetRotation,
              dummy.value
            );

            matrix.compose(translation, rotation, scale);

            this.applyMatrix(instance, matrix);
          },
        });
      }
    });

    /*
    Event.on('entity:click', (event: EntityClickEvent) => {
      const { entity } = event;

      
      }
    });*/
  }

  setDirection(normal: Vector3, quaternion: Quaternion) {
    const axis = new Vector3();

    // vector is assumed to be normalized
    if (normal.y > 0.99999) {
      quaternion.set(0, 0, 0, 1);
    } else if (normal.y < -0.99999) {
      quaternion.set(1, 0, 0, 0);
    } else {
      axis.set(normal.z, 0, -normal.x).normalize();
      const radians = Math.acos(normal.y);
      quaternion.setFromAxisAngle(axis, radians);
    }
  }

  update(entities: Entity[], time: number, deltaTime: number): void {
    return;

    const dummy = new Object3D();
    let matrix = new Matrix4();
    const eulerRotation = new Euler();

    entities.forEach((entity) => {
      if (entity.hasComponent(InstancedMesh.name)) {
        const instance = entity.getComponent<InstancedMesh>(InstancedMesh.name);

        instance.mesh.getMatrixAt(instance.index, matrix);

        let translation = new Vector3();
        let scale = new Vector3();
        let rotation = new Quaternion();

        matrix.decompose(translation, rotation, scale);

        rotation.setFromAxisAngle(
          new Vector3(0, 0, 1),
          Math.sin(time / 1000) * (Math.PI * 0.5) + instance.index
        );

        matrix.compose(translation, rotation, scale);

        this.applyMatrix(instance, matrix);
      }
    });
  }

  applyMatrix(instance: InstancedMesh, matrix: Matrix4) {
    instance.mesh.setMatrixAt(instance.index, matrix);
    instance.mesh.instanceMatrix.needsUpdate = true;

    for (let i = 0; i < instance.mesh.children.length; i++) {
      (instance.mesh.children[i] as THREE.InstancedMesh).setMatrixAt(
        instance.index,
        matrix
      );

      (
        instance.mesh.children[i] as THREE.InstancedMesh
      ).instanceMatrix.needsUpdate = true;
    }
  }
}
