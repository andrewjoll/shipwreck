import { Entity } from '@/entities';
import { Component } from '@/components';

export default class InstancedMesh implements Component {
  entity: Entity;
  name: string = 'InstancedMesh';
  index: number;
  mesh: THREE.InstancedMesh;

  constructor(index: number, mesh: THREE.InstancedMesh) {
    this.index = index;
    this.mesh = mesh;
  }
}
