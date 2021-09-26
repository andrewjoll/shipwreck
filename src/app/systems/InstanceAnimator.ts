import InstancedMesh from '@/components/InstancedMesh';
import Config from '@/Config';
import { Entity } from '@/entities';
import { Euler, Matrix4, Object3D, Quaternion, Vector3 } from 'three';
import { System } from '.';

export default class InstanceAnimator extends System {
  init(): void {}

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

        instance.mesh.setMatrixAt(instance.index, matrix);

        for (let i = 0; i < instance.mesh.children.length; i++) {
          (instance.mesh.children[i] as THREE.InstancedMesh).setMatrixAt(
            instance.index,
            matrix
          );

          (
            instance.mesh.children[i] as THREE.InstancedMesh
          ).instanceMatrix.needsUpdate = true;
        }

        instance.mesh.instanceMatrix.needsUpdate = true;
      }
    });
  }
}

/*

  const matrix = new Matrix4();
  const rotation = new Euler();
  const quaternion = new Quaternion();
  const scale = new Vector3(1, 1, 1);

  for (let i = 0; i < positions.length; i++) {
    rotation.y = Math.random() * 2 * Math.PI;
    quaternion.setFromEuler(rotation);

    matrix.compose(positions[i], quaternion, scale);

    */
