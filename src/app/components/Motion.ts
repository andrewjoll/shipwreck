import { Entity } from '@/entities';
import { Component } from '@/components';
import { Vector3 } from 'three';

export default class Motion implements Component {
  entity: Entity;
  name: string = 'Motion';
  position: Vector3;
  target: Vector3;
  velocity: number;

  path: Vector3[];
  onPath: boolean = false;
  isDirty: boolean = false;

  constructor(position: Vector3, velocity: number) {
    this.position = position;
    this.velocity = velocity;
  }

  setPath(path: Vector3[]): void {
    this.path = path;

    if (this.path.length) {
      this.onPath = true;
    }
  }

  shiftPath() {
    this.path.shift();

    if (!this.path.length) {
      this.onPath = false;
    }
  }
}
