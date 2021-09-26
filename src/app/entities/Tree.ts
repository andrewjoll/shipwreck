import InstancedMesh from '@/components/InstancedMesh';
import { Entity } from '@/entities';
import * as THREE from 'three';

export default class Tree extends Entity {
  constructor(index: number, mesh: THREE.InstancedMesh) {
    super();

    this.addComponent(new InstancedMesh(index, mesh));
  }
}
