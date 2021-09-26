import { Entity } from '@/entities';
import { Component, PositionProvider } from '@/components';
import { Matrix4, Quaternion, Vector3 } from 'three';

export default class InstancedMesh implements Component, PositionProvider {
  entity: Entity;
  name: string = 'InstancedMesh';
  index: number;
  mesh: THREE.InstancedMesh;

  constructor(index: number, mesh: THREE.InstancedMesh) {
    this.index = index;
    this.mesh = mesh;
  }

  getPosition(): Vector3 {
    const matrix = new Matrix4();
    this.mesh.getMatrixAt(this.index, matrix);

    return new Vector3().setFromMatrixPosition(matrix);
  }
}
