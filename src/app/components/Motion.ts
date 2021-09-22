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
  stickToGround: boolean;

  constructor(position: Vector3, velocity: number, stickToGround: boolean) {
    this.position = position;
    this.velocity = velocity;
    this.stickToGround = stickToGround;
  }

  setPath(path: Vector3[]): void {
    this.path = path;

    if (this.path.length) {
      this.onPath = true;
    }
  }

  clearPath(): void {
    this.path = [];
    this.onPath = false;
  }

  shiftPath() {
    this.path.shift();

    if (!this.path.length) {
      this.onPath = false;
    }
  }
}
