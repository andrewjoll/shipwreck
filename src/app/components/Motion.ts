import { Entity } from '@/entities';
import { PositionProvider } from '@/components';
import { Vector3 } from 'three';

export default class Motion implements PositionProvider {
  entity: Entity;
  name: string = 'Motion';
  position: Vector3;
  velocity: Vector3;
  target: Vector3;
  targetEntity: Entity;
  speed: number;

  path: Vector3[];
  onPath: boolean = false;
  isDirty: boolean = false;
  stickToGround: boolean;

  constructor(position: Vector3, speed: number, stickToGround: boolean) {
    this.velocity = new Vector3(0, 0, 0);
    this.position = position;
    this.speed = speed;
    this.stickToGround = stickToGround;
  }

  getPosition(): Vector3 {
    return this.position;
  }

  setPath(path: Vector3[]): void {
    this.path = path;

    if (this.path.length) {
      this.onPath = true;
    }
  }

  setTarget(entity: Entity): void {
    this.targetEntity = entity;
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
