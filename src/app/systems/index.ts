import { Entity } from '@/entities';

export abstract class System {
  name: string;

  abstract update(entities: Entity[], time: number, deltaTime: number): void;
}
